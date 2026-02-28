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
    private val callbackScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
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
        onAdDismissed: () -> Unit,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            onAdDismissed()
            return
        }

        val prefs = preferencesDataSource.userData.first()
        val now = SystemTimeProvider.nowMillis()

        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            onAdDismissed()
            return
        }

        val policy = adsPolicyProvider.getPolicy()
        val frequencyCapMs = policy.interstitialFrequencyCapForPackage(context.packageName)
        if (frequencyCapMs != policy.interstitialFrequencyCapMs) {
            Timber.d(
                "Interstitial frequency cap relaxed for package=%s capMs=%d",
                context.packageName,
                frequencyCapMs,
            )
        }
        if (now - prefs.lastInterstitialShown < frequencyCapMs) {
            onAdDismissed()
            return
        }

        val ad = interstitialAd
        if (ad == null) {
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
                interstitialAd = null
                onAdDismissed()
                maybeReload()
            }

            override fun onAdShowedFullScreenContent() {
                interstitialAd = null
            }

            override fun onAdImpression() {
                adRevenueLogger.logImpression(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = ad.adUnitId,
                    route = route,
                )
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
