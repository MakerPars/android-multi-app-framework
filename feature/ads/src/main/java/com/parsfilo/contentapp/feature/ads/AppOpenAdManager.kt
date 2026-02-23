package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.appopen.AppOpenAd
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppOpenAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferencesDataSource: PreferencesDataSource
) {
    private var appOpenAd: AppOpenAd? = null
    private var isLoadingAd = false
    private var loadTime: Long = 0

    companion object {
        /** App open reklam gösterim arası minimum süre (ms) — 5 dakika */
        private const val COOLDOWN_MS = 5 * 60 * 1000L
    }

    fun loadAd(adUnitId: String) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            return
        }
        if (isLoadingAd || isAdAvailable()) {
            return
        }

        isLoadingAd = true
        val request = AdRequest.Builder().build()
        AppOpenAd.load(
            context,
            adUnitId,
            request,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpenAd = ad
                    isLoadingAd = false
                    loadTime = Date().time
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    isLoadingAd = false
                }
            }
        )
    }

    /**
     * Cooldown kontrolü ile reklam gösterir.
     * Son gösterimden beri [COOLDOWN_MS] geçmediyse göstermez.
     */
    suspend fun showAdIfAvailable(activity: Activity, onShowComplete: () -> Unit) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            onShowComplete()
            return
        }
        val prefs = preferencesDataSource.userData.first()
        val now = System.currentTimeMillis()

        // Premium veya ödül süresi aktifse reklam gösterme.
        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            onShowComplete()
            return
        }

        // Cooldown kontrolü
        if (now - prefs.lastAppOpenAdShown < COOLDOWN_MS) {
            onShowComplete()
            return
        }

        if (!isAdAvailable()) {
            onShowComplete()
            return
        }

        appOpenAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdShowedFullScreenContent() {
            }
        }

        // Cooldown stamp kaydet
        preferencesDataSource.setLastAppOpenAdShown(now)
        appOpenAd?.show(activity)
    }

    fun clearAd() {
        appOpenAd = null
        isLoadingAd = false
        loadTime = 0L
    }

    private fun isAdAvailable(): Boolean {
        return appOpenAd != null && wasLoadTimeLessThanNHoursAgo(4)
    }

    private fun wasLoadTimeLessThanNHoursAgo(numHours: Long): Boolean {
        val dateDifference = Date().time - loadTime
        val numMilliSecondsPerHour: Long = 3600000
        return dateDifference < numMilliSecondsPerHour * numHours
    }
}

