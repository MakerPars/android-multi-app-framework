package com.parsfilo.contentapp.feature.ads

import android.content.Context
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdLoader
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.nativead.NativeAd
import com.google.android.gms.ads.nativead.NativeAdOptions
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import timber.log.Timber
import java.util.concurrent.atomic.AtomicInteger
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Native reklam havuzu yöneticisi.
 *
 * Google'ın en iyi uygulamalarına uygun:
 * - Önceden yükleme (precaching) — ekranda görünür olan kadar
 * - Thread-safe havuz yönetimi
 * - Kullanılmayan reklamların destroy edilmesi
 * - loadAd() ile tek tek yükleme (mediation uyumlu)
 * - NativeAdOptions ile video desteği
 *
 * @see <a href="https://developers.google.com/admob/android/native#best_practices">Best Practices</a>
 */
@Singleton
class NativeAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val nativeAds = mutableListOf<NativeAd>()
    @Volatile
    private var isLoading = false
    private var currentAdUnitId: String = ""

    private val _adLoadedFlow = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val adLoadedFlow: SharedFlow<Unit> = _adLoadedFlow.asSharedFlow()

    companion object;

    /**
     * Belirtilen sayıda native reklam yükler.
     * Google belgeleri: mediation kullanılıyorsa loadAds() yerine loadAd() kullanılmalıdır.
     * Bu nedenle her reklam ayrı ayrı yüklenir.
     */
    fun loadAds(adUnitId: String, count: Int) {
        if (isLoading) {
            Timber.d("Already loading, ignoring request")
            return
        }
        currentAdUnitId = adUnitId
        isLoading = true

        val loadedCount = AtomicInteger(0)
        val targetCount = count.coerceIn(1, 5)

        for (i in 0 until targetCount) {
            val adLoader = AdLoader.Builder(context, adUnitId)
                .forNativeAd { ad: NativeAd ->
                    synchronized(nativeAds) {
                        nativeAds.add(ad)
                    }
                    Timber.d("Native ad loaded (${nativeAds.size} in pool)")
                }
                .withAdListener(object : AdListener() {
                    override fun onAdFailedToLoad(error: LoadAdError) {
                        if (error.code == 3) {
                            Timber.i("Native ad no-fill: ${error.message} (code=${error.code})")
                        } else {
                            Timber.w("Native ad load warning: ${error.message} (code=${error.code})")
                        }
                        if (loadedCount.incrementAndGet() >= targetCount) {
                            isLoading = false
                        }
                    }

                    override fun onAdLoaded() {
                        val current = loadedCount.incrementAndGet()
                        Timber.d("Native ad impression ready ($current/$targetCount)")
                        _adLoadedFlow.tryEmit(Unit)
                        if (current >= targetCount) {
                            isLoading = false
                        }
                    }

                    override fun onAdClicked() {
                        Timber.d("Native ad clicked")
                    }

                    override fun onAdImpression() {
                        Timber.d("Native ad impression recorded")
                    }
                })
                .withNativeAdOptions(
                    NativeAdOptions.Builder()
                        .setVideoOptions(
                            com.google.android.gms.ads.VideoOptions.Builder()
                                .setStartMuted(true)
                                .build()
                        )
                        .setRequestMultipleImages(false)
                        .build()
                )
                .build()

            adLoader.loadAd(AdRequest.Builder().build())
        }
    }

    /**
     * Havuzdan bir native reklam alır.
     * Reklam tüketildikten sonra havuzdan kaldırılır.
     * Havuz azaldığında yeni reklamlar otomatik yüklenir.
     */
    fun getNativeAd(): NativeAd? {
        val ad = synchronized(nativeAds) {
            if (nativeAds.isNotEmpty()) nativeAds.removeAt(0) else null
        }

        // Havuz azaldığında arka planda daha fazla yükle
        val currentSize = synchronized(nativeAds) { nativeAds.size }
        if (currentSize <= 1 && currentAdUnitId.isNotEmpty() && !isLoading) {
            Timber.d("Pool low ($currentSize), loading more ads")
            loadAds(currentAdUnitId, 2)
        }

        return ad
    }

    /** Tüm reklamları destroy eder ve havuzu temizler */
    fun destroyAds() {
        synchronized(nativeAds) {
            nativeAds.forEach { it.destroy() }
            nativeAds.clear()
        }
        isLoading = false
        Timber.d("All native ads destroyed")
    }
}
