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
import timber.log.Timber
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
    @Volatile
    private var isShowingAd = false
    private fun effectiveCooldownMs(value: Long): Long = if (BuildConfig.DEBUG) 0L else value

    fun isShowingAdNow(): Boolean = isShowingAd

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.APP_OPEN_DEFAULT,
    ) {
        Timber.d(
            "AppOpen load requested placement=%s adUnit=%s canRequestAds=%s",
            placement.analyticsValue,
            adUnitId,
            AdsConsentRuntimeState.canRequestAds.value,
        )
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
        if (!AdLoadBackoffPolicy.canLoad(now, loadBackoffState)) {
            Timber.d(
                "AppOpen load throttled placement=%s nextAllowedAt=%d",
                placement.analyticsValue,
                loadBackoffState.nextLoadAllowedAtMillis,
            )
            return
        }
        if (isLoadingAd || isAdAvailable()) {
            Timber.d(
                "AppOpen load skipped placement=%s loading=%s available=%s",
                placement.analyticsValue,
                isLoadingAd,
                isAdAvailable(),
            )
            return
        }

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
                    Timber.d(
                        "AppOpen loaded placement=%s adUnit=%s responseId=%s",
                        currentPlacement.analyticsValue,
                        ad.adUnitId,
                        ad.responseInfo.responseId,
                    )
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
                    Timber.d(
                        "AppOpen failedToLoad placement=%s adUnit=%s code=%d msg=%s",
                        currentPlacement.analyticsValue,
                        adUnitId,
                        loadAdError.code,
                        loadAdError.message,
                    )
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
        if (isShowingAd) {
            Timber.d("AppOpen show skipped: ad already showing route=%s", route)
            onShowComplete()
            return
        }
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            Timber.d("AppOpen show blocked: no consent route=%s", route)
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
            Timber.d(
                "AppOpen show blocked: placement disabled placement=%s route=%s",
                currentPlacement.analyticsValue,
                route,
            )
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
            Timber.d(
                "AppOpen show blocked: premiumOrRewardedFree reason=%s route=%s",
                reason.analyticsValue,
                route,
            )
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

        val cooldownMs = effectiveCooldownMs(policy.appOpenCooldownMs)
        if (now - prefs.lastAppOpenAdShown < cooldownMs) {
            Timber.d(
                "AppOpen show blocked: cooldown remainingMs=%d route=%s",
                cooldownMs - (now - prefs.lastAppOpenAdShown),
                route,
            )
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
            Timber.d(
                "AppOpen show blocked: not loaded adNull=%s available=%s route=%s",
                ad == null,
                isAdAvailable(),
                route,
            )
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
        isShowingAd = true
        Timber.d(
            "AppOpen show starting placement=%s route=%s adUnit=%s",
            currentPlacement.analyticsValue,
            route,
            ad.adUnitId,
        )
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Timber.d(
                    "AppOpen dismissed placement=%s route=%s adUnit=%s",
                    currentPlacement.analyticsValue,
                    route,
                    ad.adUnitId,
                )
                adRevenueLogger.logDismissed(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                appOpenAd = null
                isShowingAd = false
                onShowComplete()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Timber.d(
                    "AppOpen failedToShow placement=%s route=%s code=%d msg=%s",
                    currentPlacement.analyticsValue,
                    route,
                    adError.code,
                    adError.message,
                )
                adRevenueLogger.logFailedToShow(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    errorCode = adError.code,
                    errorMessage = adError.message,
                    route = route,
                )
                appOpenAd = null
                isShowingAd = false
                onShowComplete()
            }

            override fun onAdImpression() {
                Timber.d(
                    "AppOpen impression placement=%s route=%s adUnit=%s",
                    currentPlacement.analyticsValue,
                    route,
                    ad.adUnitId,
                )
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
                Timber.d(
                    "AppOpen clicked placement=%s route=%s adUnit=%s",
                    currentPlacement.analyticsValue,
                    route,
                    ad.adUnitId,
                )
                adRevenueLogger.logClick(
                    adFormat = AdFormat.APP_OPEN,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
            }

            override fun onAdShowedFullScreenContent() {
                Timber.d(
                    "AppOpen showedFullScreen placement=%s route=%s adUnit=%s",
                    currentPlacement.analyticsValue,
                    route,
                    ad.adUnitId,
                )
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
        Timber.d(
            "AppOpen clearAd placement=%s hasAd=%s loading=%s showing=%s",
            currentPlacement.analyticsValue,
            appOpenAd != null,
            isLoadingAd,
            isShowingAd,
        )
        appOpenAd = null
        isLoadingAd = false
        loadTime = 0L
        isShowingAd = false
    }

    private fun isAdAvailable(): Boolean = appOpenAd != null && wasLoadTimeLessThanNHoursAgo(4)

    private fun wasLoadTimeLessThanNHoursAgo(numHours: Long): Boolean {
        val dateDifference = Date().time - loadTime
        val numMilliSecondsPerHour: Long = 3_600_000
        return dateDifference < numMilliSecondsPerHour * numHours
    }
}
