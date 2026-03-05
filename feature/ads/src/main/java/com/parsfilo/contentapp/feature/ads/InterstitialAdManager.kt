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
    @ApplicationContext private val context: Context,
    private val preferencesDataSource: PreferencesDataSource,
    private val adRevenueLogger: AdRevenueLogger,
    private val adsPolicyProvider: AdsPolicyProvider,
) {
    private var interstitialAd: InterstitialAd? = null
    private var currentAdUnitId: String? = null
    private var currentPlacement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT
    private var currentRoute: String? = null
    private var loadBackoffState = AdLoadBackoffState()
    private var lastLoadStartedAtMillis: Long = 0L
    private val callbackScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = adUnitId,
                suppressReason = "no_consent",
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

        currentAdUnitId = adUnitId
        currentPlacement = placement
        currentRoute = route
        lastLoadStartedAtMillis = now
        adRevenueLogger.logRequest(
            adFormat = AdFormat.INTERSTITIAL,
            placement = placement,
            adUnitId = adUnitId,
            route = route,
        )
        val adRequest = AdRequest.Builder().build()

        InterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    interstitialAd = null
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
                    loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                    val fillLatencyMs = (SystemTimeProvider.nowMillis() - lastLoadStartedAtMillis).coerceAtLeast(0L)
                    adRevenueLogger.logLoaded(
                        adFormat = AdFormat.INTERSTITIAL,
                        placement = currentPlacement,
                        adUnitId = adUnitId,
                        route = currentRoute,
                        fillLatencyMs = fillLatencyMs,
                        adapterName = ad.responseInfo?.mediationAdapterClassName,
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
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = "no_consent",
                route = route,
            )
            clearAd()
            onAdDismissed()
            return
        }

        val prefs = preferencesDataSource.userData.first()
        val now = SystemTimeProvider.nowMillis()

        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            val reason = if (prefs.isPremium) "premium" else "rewarded_free"
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
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = "placement_disabled",
                route = route,
            )
            onAdDismissed()
            return
        }
        val frequencyCapMs = policy.interstitialFrequencyCapForPackage(context.packageName)
        if (frequencyCapMs != policy.interstitialFrequencyCapMs) {
            Timber.d(
                "Interstitial frequency cap relaxed for package=%s capMs=%d",
                context.packageName,
                frequencyCapMs,
            )
        }
        if (now - prefs.lastInterstitialShown < frequencyCapMs) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = "cooldown",
                route = route,
            )
            onAdDismissed()
            return
        }

        val ad = interstitialAd
        if (ad == null) {
            adRevenueLogger.logSuppressed(
                adFormat = AdFormat.INTERSTITIAL,
                placement = placement,
                adUnitId = currentAdUnitId ?: "unknown",
                suppressReason = "not_loaded",
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
                adRevenueLogger.logServed(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
                interstitialAd = null
            }

            override fun onAdImpression() {
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
            loadAd(adUnitId, currentPlacement, currentRoute)
        }
    }

    fun clearAd() {
        interstitialAd = null
    }
}
