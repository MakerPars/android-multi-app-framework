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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppOpenAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferencesDataSource: PreferencesDataSource,
    private val adRevenueLogger: AdRevenueLogger,
) {
    private var appOpenAd: AppOpenAd? = null
    private var isLoadingAd = false
    private var loadTime: Long = 0
    private var currentAdUnitId: String? = null
    private var currentPlacement: AdPlacement = AdPlacement.APP_OPEN_DEFAULT
    private var loadBackoffState = AdLoadBackoffState()
    private val callbackScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    companion object {
        private const val COOLDOWN_MS = 5 * 60 * 1000L
    }

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.APP_OPEN_DEFAULT,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            return
        }
        val now = SystemTimeProvider.nowMillis()
        if (!AdLoadBackoffPolicy.canLoad(now, loadBackoffState)) return
        if (isLoadingAd || isAdAvailable()) return

        currentAdUnitId = adUnitId
        currentPlacement = placement
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
                    loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                    ad.onPaidEventListener = { adValue ->
                        adRevenueLogger.logPaidEvent(
                            AdPaidEventContext(
                                adUnitId = ad.adUnitId,
                                adFormat = AdFormat.APP_OPEN,
                                placement = currentPlacement,
                                route = null,
                                adValue = adValue,
                                responseMeta = adRevenueLogger.extractResponseMeta(ad.responseInfo),
                            ),
                        )
                    }
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    isLoadingAd = false
                    loadBackoffState = AdLoadBackoffPolicy.onLoadFailure(
                        nowMillis = SystemTimeProvider.nowMillis(),
                        current = loadBackoffState,
                        errorCode = loadAdError.code,
                    )
                }
            },
        )
    }

    suspend fun showAdIfAvailable(activity: Activity, onShowComplete: () -> Unit) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            onShowComplete()
            return
        }
        val prefs = preferencesDataSource.userData.first()
        val now = SystemTimeProvider.nowMillis()

        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            onShowComplete()
            return
        }

        if (now - prefs.lastAppOpenAdShown < COOLDOWN_MS) {
            onShowComplete()
            return
        }

        val ad = appOpenAd
        if (ad == null || !isAdAvailable()) {
            onShowComplete()
            return
        }

        var impressionStampRecorded = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdImpression() {
                adRevenueLogger.logImpression(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = null,
                )
                if (shouldRecordImpressionStamp(impressionStampRecorded)) {
                    impressionStampRecorded = true
                    callbackScope.launch {
                        preferencesDataSource.setLastAppOpenAdShown(SystemTimeProvider.nowMillis())
                    }
                }
            }

            override fun onAdClicked() {
                adRevenueLogger.logClick(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = null,
                )
            }
        }

        ad.show(activity)
    }

    fun clearAd() {
        appOpenAd = null
        isLoadingAd = false
        loadTime = 0L
    }

    private fun isAdAvailable(): Boolean = appOpenAd != null && wasLoadTimeLessThanNHoursAgo(4)

    private fun wasLoadTimeLessThanNHoursAgo(numHours: Long): Boolean {
        val dateDifference = Date().time - loadTime
        val numMilliSecondsPerHour: Long = 3_600_000
        return dateDifference < numMilliSecondsPerHour * numHours
    }
}
