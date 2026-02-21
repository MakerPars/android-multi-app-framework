package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RewardedAdManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var rewardedAd: RewardedAd? = null
    private val _isAdReady = MutableStateFlow(false)
    val isAdReady: StateFlow<Boolean> = _isAdReady.asStateFlow()

    fun isAdReadyNow(): Boolean = _isAdReady.value

    fun loadAd(adUnitId: String) {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(
            context,
            adUnitId,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    rewardedAd = null
                    _isAdReady.value = false
                }

                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    _isAdReady.value = true
                }
            }
        )
    }

    fun showAd(activity: Activity, onUserEarnedReward: () -> Unit, onAdDismissed: () -> Unit) {
        if (rewardedAd != null) {
            rewardedAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    rewardedAd = null
                    _isAdReady.value = false
                    onAdDismissed()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    rewardedAd = null
                    _isAdReady.value = false
                    onAdDismissed()
                }

                override fun onAdShowedFullScreenContent() {
                }
            }
            rewardedAd?.show(activity) { rewardItem ->
                // Handle the reward.
                onUserEarnedReward()
            }
        } else {
            _isAdReady.value = false
            onAdDismissed()
        }
    }
}
