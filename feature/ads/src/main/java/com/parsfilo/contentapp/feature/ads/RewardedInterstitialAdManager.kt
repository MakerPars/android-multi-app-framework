package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAdLoadCallback
import dagger.hilt.android.qualifiers.ApplicationContext
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Ödüllü Geçiş Reklamı (Rewarded Interstitial) yöneticisi.
 *
 * Kullanıcı doğal geçiş noktalarında ödüllü geçiş reklamı gösterir.
 * Reklam izlendikten sonra ödül verilir.
 */
@Singleton
class RewardedInterstitialAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val adRevenueLogger: AdRevenueLogger,
) {
    private var rewardedInterstitialAd: RewardedInterstitialAd? = null
    private var isLoading = false
    private var currentPlacement: AdPlacement = AdPlacement.REWARDED_INTERSTITIAL_DEFAULT
    private var currentRoute: String? = null
    private var loadBackoffState = AdLoadBackoffState()

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
        route: String? = null,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            return
        }
        if (!AdLoadBackoffPolicy.canLoad(SystemTimeProvider.nowMillis(), loadBackoffState)) return
        if (isLoading || rewardedInterstitialAd != null) return
        currentPlacement = placement
        currentRoute = route

        isLoading = true
        val adRequest = AdRequest.Builder().build()

        RewardedInterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : RewardedInterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedInterstitialAd) {
                    Timber.d("Ad loaded: $adUnitId")
                    loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                    ad.onPaidEventListener = { value ->
                        adRevenueLogger.logPaidEvent(
                            AdPaidEventContext(
                                adUnitId = ad.adUnitId,
                                adFormat = AdFormat.REWARDED_INTERSTITIAL,
                                placement = currentPlacement,
                                route = currentRoute,
                                adValue = value,
                                responseMeta = adRevenueLogger.extractResponseMeta(ad.responseInfo),
                            ),
                        )
                    }
                    val responseInfo = ad.responseInfo
                    Timber.d(
                        "RewardedInterstitial response (%s): responseId=%s adapter=%s",
                        adUnitId,
                        responseInfo.responseId,
                        responseInfo.mediationAdapterClassName,
                    )
                    rewardedInterstitialAd = ad
                    isLoading = false
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    Timber.w("Failed to load: ${error.message}")
                    rewardedInterstitialAd = null
                    isLoading = false
                    loadBackoffState = AdLoadBackoffPolicy.onLoadFailure(
                        nowMillis = SystemTimeProvider.nowMillis(),
                        current = loadBackoffState,
                        errorCode = error.code,
                    )
                }
            },
        )
    }

    fun showAd(
        activity: Activity,
        onAdImpression: () -> Unit = {},
        onUserEarnedReward: (type: String, amount: Int) -> Unit,
        onAdDismissed: () -> Unit,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            onAdDismissed()
            return
        }
        val ad = rewardedInterstitialAd
        if (ad == null) {
            Timber.d("Ad not ready, calling onAdDismissed")
            onAdDismissed()
            return
        }

        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Timber.d("Ad dismissed")
                rewardedInterstitialAd = null
                onAdDismissed()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Timber.w("Failed to show: ${adError.message}")
                rewardedInterstitialAd = null
                onAdDismissed()
            }

            override fun onAdShowedFullScreenContent() {
                Timber.d("Ad shown")
            }

            override fun onAdImpression() {
                Timber.d("RewardedInterstitial impression recorded")
                onAdImpression()
                adRevenueLogger.logImpression(
                    adFormat = AdFormat.REWARDED_INTERSTITIAL,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = currentRoute,
                )
            }

            override fun onAdClicked() {
                adRevenueLogger.logClick(
                    adFormat = AdFormat.REWARDED_INTERSTITIAL,
                    placement = currentPlacement,
                    adUnitId = ad.adUnitId,
                    route = currentRoute,
                )
            }
        }

        ad.show(activity) { rewardItem ->
            Timber.d("Reward earned: ${rewardItem.type} x${rewardItem.amount}")
            onUserEarnedReward(rewardItem.type, rewardItem.amount)
        }
    }

    fun isAdReady(): Boolean = rewardedInterstitialAd != null

    fun clearAd() {
        rewardedInterstitialAd = null
        isLoading = false
    }
}
