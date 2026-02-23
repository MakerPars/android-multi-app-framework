package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.OnPaidEventListener
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
) {
    companion object;

    private var rewardedInterstitialAd: RewardedInterstitialAd? = null
    private var isLoading = false

    fun loadAd(adUnitId: String) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            return
        }
        if (isLoading || rewardedInterstitialAd != null) return

        isLoading = true
        val adRequest = AdRequest.Builder().build()

        RewardedInterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : RewardedInterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedInterstitialAd) {
                    Timber.d("Ad loaded: $adUnitId")
                    ad.onPaidEventListener = OnPaidEventListener { value ->
                        Timber.i(
                            "RewardedInterstitial paid event (%s): micros=%d currency=%s precision=%d",
                            adUnitId,
                            value.valueMicros,
                            value.currencyCode,
                            value.precisionType,
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
                }
            },
        )
    }

    fun showAd(
        activity: Activity,
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
