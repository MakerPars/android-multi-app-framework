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
    private val adsPolicyProvider: AdsPolicyProvider,
) {
    private var appOpenAd: AppOpenAd? = null
    private var isLoadingAd = false
    private var loadTime: Long = 0
    private var currentAdUnitId: String? = null
    private var currentPlacement: AdPlacement = AdPlacement.APP_OPEN_DEFAULT
    private var loadBackoffState = AdLoadBackoffState()
    private var lastLoadStartedAtMillis: Long = 0L
    private val callbackScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.APP_OPEN_DEFAULT,
    ) {
        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isAppOpenPlacementEnabled(placement)) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = placement,
                adUnitId = adUnitId,
                suppressReason = AdSuppressReason.PLACEMENT_DISABLED,
                route = null,
            )
            clearAd()
            return
        }
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = placement,
                adUnitId = adUnitId,
                suppressReason = AdSuppressReason.NO_CONSENT,
                route = null,
            )
            clearAd()
            return
        }
        val now = SystemTimeProvider.nowMillis()
        if (!AdLoadBackoffPolicy.canLoad(now, loadBackoffState)) return
        if (isLoadingAd || isAdAvailable()) return

        currentAdUnitId = adUnitId
        currentPlacement = placement
        lastLoadStartedAtMillis = now
        adRevenueLogger.logRequest(
            adFormat = AdFormat.APP_OPEN,
            placement = placement,
            adUnitId = adUnitId,
            route = null,
        )
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
                    val fillLatencyMs = (SystemTimeProvider.nowMillis() - lastLoadStartedAtMillis).coerceAtLeast(0L)
                    adRevenueLogger.logLoaded(
                        adFormat = AdFormat.APP_OPEN,
                        placement = currentPlacement,
                        adUnitId = ad.adUnitId,
                        route = null,
                        fillLatencyMs = fillLatencyMs,
                        adapterName = ad.responseInfo.mediationAdapterClassName,
                    )
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
                    adRevenueLogger.logFailedToLoad(
                        adFormat = AdFormat.APP_OPEN,
                        placement = currentPlacement,
                        adUnitId = adUnitId,
                        errorCode = loadAdError.code,
                        errorMessage = loadAdError.message,
                        route = null,
                        backoffAttempt = loadBackoffState.failureStreak,
                    )
                }
            },
        )
    }

    suspend fun showAdIfAvailable(
        activity: Activity,
        route: String? = null,
        onAdImpression: (String) -> Unit = {},
        onShowComplete: () -> Unit,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = currentPlacement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.NO_CONSENT,
                route = route,
            )
            clearAd()
            onShowComplete()
            return
        }
        val prefs = preferencesDataSource.userData.first()
        val now = SystemTimeProvider.nowMillis()
        val policy = adsPolicyProvider.getPolicy()

        if (!policy.isAppOpenPlacementEnabled(currentPlacement)) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = currentPlacement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.PLACEMENT_DISABLED,
                route = route,
            )
            onShowComplete()
            return
        }

        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            val reason = if (prefs.isPremium) AdSuppressReason.PREMIUM else AdSuppressReason.REWARDED_FREE
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = currentPlacement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = reason,
                route = route,
            )
            onShowComplete()
            return
        }

        val cooldownMs = policy.appOpenCooldownMs
        if (now - prefs.lastAppOpenAdShown < cooldownMs) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = currentPlacement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.COOLDOWN,
                route = route,
            )
            onShowComplete()
            return
        }

        val ad = appOpenAd
        if (ad == null || !isAdAvailable()) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.APP_OPEN,
                placement = currentPlacement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.NOT_LOADED,
                route = route,
            )
            onShowComplete()
            return
        }

        var impressionStampRecorded = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                adRevenueLogger.logDismissed(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                adRevenueLogger.logFailedToShow(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    errorCode = adError.code,
                    errorMessage = adError.message,
                    route = route,
                )
                appOpenAd = null
                onShowComplete()
            }

            override fun onAdImpression() {
                adRevenueLogger.logImpression(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                onAdImpression(ad.adUnitId)
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
                    route = route,
                )
            }

            override fun onAdShowedFullScreenContent() {
                adRevenueLogger.logServed(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = route,
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
