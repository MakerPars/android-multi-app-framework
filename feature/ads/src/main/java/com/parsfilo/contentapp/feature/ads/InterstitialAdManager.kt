package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class InterstitialAdManager @Inject constructor(
    @ApplicationContext private val appContext: Context,
    private val preferencesDataSource: PreferencesDataSource,
    private val adRevenueLogger: AdRevenueLogger,
    private val adsPolicyProvider: AdsPolicyProvider,
) {
    private var interstitialAd: InterstitialAd? = null
    private var isLoading = false
    private var currentAdUnitId: String? = null
    private var currentPlacement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT
    private var currentRoute: String? = null
    private var currentLoadContext: Context? = null
    private var loadBackoffState = AdLoadBackoffState()
    private var lastLoadStartedAtMillis: Long = 0L
    private val callbackScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private fun effectiveCooldownMs(value: Long): Long = if (BuildConfig.DEBUG) 0L else value

    fun loadAd(
        loadContext: Context,
        adUnitId: String,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
    ) {
        Timber.d(
            "Interstitial load requested placement=%s route=%s adUnit=%s canRequestAds=%s",
            placement.analyticsValue,
            route,
            adUnitId,
            AdsConsentRuntimeState.canRequestAds.value,
        )
        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isInterstitialPlacementEnabled(placement)) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = adUnitId,
                suppressReason = AdSuppressReason.PLACEMENT_DISABLED,
                route = route,
            )
            clearAd()
            return
        }
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = adUnitId,
                suppressReason = AdSuppressReason.NO_CONSENT,
                route = route,
            )
            clearAd()
            return
        }
        val now = SystemTimeProvider.nowMillis()
        if (!AdLoadBackoffPolicy.canLoad(now, loadBackoffState)) {
            Timber.d(
                "Interstitial load throttled until=%d placement=%s",
                loadBackoffState.nextLoadAllowedAtMillis,
                placement.analyticsValue,
            )
            return
        }

        if (isLoading && currentAdUnitId == adUnitId) {
            Timber.d("Interstitial load skipped; already loading adUnit=%s", adUnitId)
            return
        }
        if (interstitialAd != null && currentAdUnitId == adUnitId) {
            Timber.d("Interstitial load skipped; ad already ready adUnit=%s", adUnitId)
            return
        }

        currentAdUnitId = adUnitId
        currentPlacement = placement
        currentRoute = route
        currentLoadContext = loadContext.findActivity() ?: loadContext
        lastLoadStartedAtMillis = now
        isLoading = true
        adRevenueLogger.logRequest(
            adFormat = AdFormat.INTERSTITIAL,
            placement = placement,
            adUnitId = adUnitId,
            route = route,
        )
        val adRequest = AdRequest.Builder().build()

        InterstitialAd.load(
            currentLoadContext ?: appContext,
            adUnitId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    interstitialAd = null
                    isLoading = false
                    loadBackoffState = AdLoadBackoffPolicy.onLoadFailure(
                        nowMillis = SystemTimeProvider.nowMillis(),
                        current = loadBackoffState,
                        errorCode = adError.code,
                    )
                    adRevenueLogger.logFailedToLoad(
                        adFormat = AdFormat.INTERSTITIAL,
                        placement = currentPlacement,
                        adUnitId = adUnitId,
                        errorCode = adError.code,
                        errorMessage = adError.message,
                        route = currentRoute,
                        backoffAttempt = loadBackoffState.failureStreak,
                    )
                    Timber.w(
                        "Interstitial failed load placement=%s code=%d nextRetryAt=%d msg=%s",
                        currentPlacement.analyticsValue,
                        adError.code,
                        loadBackoffState.nextLoadAllowedAtMillis,
                        adError.message,
                    )
                }

                override fun onAdLoaded(ad: InterstitialAd) {
                    Timber.d(
                        "Interstitial loaded placement=%s route=%s adUnit=%s responseId=%s",
                        currentPlacement.analyticsValue,
                        currentRoute,
                        ad.adUnitId,
                        ad.responseInfo.responseId,
                    )
                    isLoading = false
                    loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                    val fillLatencyMs = (SystemTimeProvider.nowMillis() - lastLoadStartedAtMillis).coerceAtLeast(0L)
                    adRevenueLogger.logLoaded(
                        adFormat = AdFormat.INTERSTITIAL,
                        placement = currentPlacement,
                        adUnitId = adUnitId,
                        route = currentRoute,
                        fillLatencyMs = fillLatencyMs,
                        adapterName = ad.responseInfo.mediationAdapterClassName,
                    )
                    ad.onPaidEventListener = { adValue ->
                        adRevenueLogger.logPaidEvent(
                            AdPaidEventContext(
                                adUnitId = ad.adUnitId,
                                adFormat = AdFormat.INTERSTITIAL,
                                placement = currentPlacement,
                                route = currentRoute,
                                adValue = adValue,
                                responseMeta = adRevenueLogger.extractResponseMeta(ad.responseInfo),
                            ),
                        )
                    }
                    interstitialAd = ad
                }
            },
        )
    }

    suspend fun showAd(
        activity: Activity,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
        onAdImpression: (String) -> Unit = {},
        onAdDismissed: () -> Unit,
    ) {
        Timber.d(
            "Interstitial show requested placement=%s route=%s adReady=%s",
            placement.analyticsValue,
            route,
            interstitialAd != null,
        )
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.NO_CONSENT,
                route = route,
            )
            clearAd()
            onAdDismissed()
            return
        }

        val prefs = preferencesDataSource.userData.first()
        val now = SystemTimeProvider.nowMillis()

        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            val reason = if (prefs.isPremium) AdSuppressReason.PREMIUM else AdSuppressReason.REWARDED_FREE
            Timber.d("Interstitial show blocked reason=%s route=%s", reason.analyticsValue, route)
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = reason,
                route = route,
            )
            onAdDismissed()
            return
        }

        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isInterstitialPlacementEnabled(placement)) {
            Timber.d("Interstitial show blocked: placement disabled placement=%s route=%s", placement.analyticsValue, route)
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.PLACEMENT_DISABLED,
                route = route,
            )
            onAdDismissed()
            return
        }
        val frequencyCapMs = effectiveCooldownMs(
            policy.interstitialFrequencyCapForPackage(appContext.packageName),
        )
        val baseFrequencyCapMs = effectiveCooldownMs(policy.interstitialFrequencyCapMs)
        if (frequencyCapMs != baseFrequencyCapMs) {
            Timber.d(
                "Interstitial frequency cap relaxed for package=%s capMs=%d",
                appContext.packageName,
                frequencyCapMs,
            )
        }
        if (now - prefs.lastInterstitialShown < frequencyCapMs) {
            Timber.d(
                "Interstitial show blocked: cooldown remainingMs=%d route=%s",
                frequencyCapMs - (now - prefs.lastInterstitialShown),
                route,
            )
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.COOLDOWN,
                route = route,
            )
            onAdDismissed()
            return
        }

        val ad = interstitialAd
        if (ad == null) {
            Timber.d("Interstitial show blocked: ad not loaded placement=%s route=%s", placement.analyticsValue, route)
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = AdSuppressReason.NOT_LOADED,
                route = route,
            )
            onAdDismissed()
            maybeReload()
            return
        }

        currentPlacement = placement
        currentRoute = route
        var impressionStampRecorded = false

        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Timber.d("Interstitial dismissed placement=%s route=%s adUnit=%s", placement.analyticsValue, route, ad.adUnitId)
                adRevenueLogger.logDismissed(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                interstitialAd = null
                onAdDismissed()
                maybeReload()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Timber.w("Interstitial failed to show placement=%s err=%s", placement.analyticsValue, adError.message)
                adRevenueLogger.logFailedToShow(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    errorCode = adError.code,
                    errorMessage = adError.message,
                    route = route,
                )
                interstitialAd = null
                onAdDismissed()
                maybeReload()
            }

            override fun onAdShowedFullScreenContent() {
                Timber.d("Interstitial showed placement=%s route=%s adUnit=%s", placement.analyticsValue, route, ad.adUnitId)
                adRevenueLogger.logServed(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                interstitialAd = null
            }

            override fun onAdImpression() {
                Timber.d("Interstitial impression placement=%s route=%s adUnit=%s", placement.analyticsValue, route, ad.adUnitId)
                adRevenueLogger.logImpression(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                onAdImpression(ad.adUnitId)
                if (shouldRecordImpressionStamp(impressionStampRecorded)) {
                    impressionStampRecorded = true
                    callbackScope.launch {
                        preferencesDataSource.setLastInterstitialShown(SystemTimeProvider.nowMillis())
                    }
                }
            }

            override fun onAdClicked() {
                Timber.d("Interstitial clicked placement=%s route=%s adUnit=%s", placement.analyticsValue, route, ad.adUnitId)
                adRevenueLogger.logClick(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
            }
        }
        ad.show(activity)
    }

    private fun maybeReload() {
        val adUnitId = currentAdUnitId ?: return
        if (interstitialAd == null && AdsConsentRuntimeState.canRequestAds.value) {
            loadAd(currentLoadContext ?: appContext, adUnitId, currentPlacement, currentRoute)
        }
    }

    fun clearAd() {
        Timber.d(
            "Interstitial clearAd placement=%s hasAd=%s loading=%s",
            currentPlacement.analyticsValue,
            interstitialAd != null,
            isLoading,
        )
        interstitialAd = null
        isLoading = false
    }
}
