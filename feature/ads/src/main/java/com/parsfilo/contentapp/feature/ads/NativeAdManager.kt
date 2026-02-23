package com.parsfilo.contentapp.feature.ads

import android.content.Context
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdLoader
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdValue
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.VideoOptions
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

private data class PooledNativeAd(
    val ad: NativeAd,
    val loadedAtMillis: Long,
    val placement: AdPlacement,
    val adUnitId: String,
)

@Singleton
class NativeAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val adRevenueLogger: AdRevenueLogger,
) {
    private val nativeAds = mutableListOf<PooledNativeAd>()
    @Volatile
    private var isLoading = false
    private var currentAdUnitId: String = ""
    private var currentPlacement: AdPlacement = AdPlacement.NATIVE_DEFAULT
    private var loadBackoffState = AdLoadBackoffState()

    private val _adLoadedFlow = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val adLoadedFlow: SharedFlow<Unit> = _adLoadedFlow.asSharedFlow()

    companion object {
        private const val POOL_MAX = 2
        private const val NATIVE_TTL_MS = 30 * 60 * 1000L
    }

    fun loadAds(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.NATIVE_DEFAULT,
        count: Int,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            destroyAds()
            return
        }
        pruneExpiredAds()
        if (!AdLoadBackoffPolicy.canLoad(SystemTimeProvider.nowMillis(), loadBackoffState)) {
            Timber.d("Native load throttled until=%d", loadBackoffState.nextLoadAllowedAtMillis)
            return
        }
        if (isLoading) {
            Timber.d("Already loading, ignoring native load request")
            return
        }
        synchronized(nativeAds) {
            if (nativeAds.size >= POOL_MAX) {
                Timber.d("Native pool already full (%d)", nativeAds.size)
                return
            }
        }

        currentAdUnitId = adUnitId
        currentPlacement = placement
        isLoading = true

        val loadedCount = AtomicInteger(0)
        val targetCount = count.coerceIn(1, POOL_MAX)

        repeat(targetCount) {
            val adLoader = AdLoader.Builder(context, adUnitId)
                .forNativeAd { ad: NativeAd ->
                    ad.setOnPaidEventListener { adValue: AdValue ->
                        adRevenueLogger.logPaidEvent(
                            AdPaidEventContext(
                                adUnitId = adUnitId,
                                adFormat = AdFormat.NATIVE,
                                placement = placement,
                                route = null,
                                adValue = adValue,
                                responseMeta = adRevenueLogger.extractResponseMeta(ad.responseInfo),
                            ),
                        )
                    }
                    synchronized(nativeAds) {
                        if (nativeAds.size >= POOL_MAX) {
                            ad.destroy()
                        } else {
                            nativeAds.add(
                                PooledNativeAd(
                                    ad = ad,
                                    loadedAtMillis = SystemTimeProvider.nowMillis(),
                                    placement = placement,
                                    adUnitId = adUnitId,
                                ),
                            )
                        }
                    }
                    Timber.d("Native ad loaded (pool=%d)", synchronized(nativeAds) { nativeAds.size })
                }
                .withAdListener(object : AdListener() {
                    override fun onAdFailedToLoad(error: LoadAdError) {
                        if (error.code == 3) {
                            Timber.i("Native no-fill code=%d msg=%s", error.code, error.message)
                        } else {
                            Timber.w("Native load warning code=%d msg=%s", error.code, error.message)
                        }
                        loadBackoffState = AdLoadBackoffPolicy.onLoadFailure(
                            nowMillis = SystemTimeProvider.nowMillis(),
                            current = loadBackoffState,
                            errorCode = error.code,
                        )
                        if (loadedCount.incrementAndGet() >= targetCount) {
                            isLoading = false
                        }
                    }

                    override fun onAdLoaded() {
                        loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                        val current = loadedCount.incrementAndGet()
                        _adLoadedFlow.tryEmit(Unit)
                        if (current >= targetCount) {
                            isLoading = false
                        }
                    }

                    override fun onAdClicked() {
                        val pooled = synchronized(nativeAds) { nativeAds.firstOrNull() }
                        if (pooled != null) {
                            adRevenueLogger.logClick(
                                adFormat = AdFormat.NATIVE,
                                placement = pooled.placement,
                                adUnitId = pooled.adUnitId,
                            )
                        }
                    }

                    override fun onAdImpression() {
                        val pooled = synchronized(nativeAds) { nativeAds.firstOrNull() }
                        if (pooled != null) {
                            adRevenueLogger.logImpression(
                                adFormat = AdFormat.NATIVE,
                                placement = pooled.placement,
                                adUnitId = pooled.adUnitId,
                            )
                        }
                    }
                })
                .withNativeAdOptions(
                    NativeAdOptions.Builder()
                        .setVideoOptions(
                            VideoOptions.Builder()
                                .setStartMuted(true)
                                .build(),
                        )
                        .setRequestMultipleImages(false)
                        .build(),
                )
                .build()

            adLoader.loadAd(AdRequest.Builder().build())
        }
    }

    fun getNativeAd(placement: AdPlacement = AdPlacement.NATIVE_DEFAULT): NativeAd? {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            destroyAds()
            return null
        }
        pruneExpiredAds()

        val pooled = synchronized(nativeAds) {
            val idx = nativeAds.indexOfFirst { it.placement == placement }
                .takeIf { it >= 0 } ?: nativeAds.indices.firstOrNull()
            if (idx == null) null else nativeAds.removeAt(idx)
        }

        val currentSize = synchronized(nativeAds) { nativeAds.size }
        if (currentSize <= 0 && currentAdUnitId.isNotEmpty() && !isLoading) {
            loadAds(currentAdUnitId, currentPlacement, 1)
        }

        return pooled?.ad
    }

    fun destroyAds() {
        synchronized(nativeAds) {
            nativeAds.forEach { it.ad.destroy() }
            nativeAds.clear()
        }
        isLoading = false
        Timber.d("All native ads destroyed")
    }

    private fun pruneExpiredAds() {
        val now = SystemTimeProvider.nowMillis()
        synchronized(nativeAds) {
            val iterator = nativeAds.iterator()
            while (iterator.hasNext()) {
                val pooled = iterator.next()
                if (now - pooled.loadedAtMillis > NATIVE_TTL_MS) {
                    pooled.ad.destroy()
                    iterator.remove()
                }
            }
        }
    }
}
