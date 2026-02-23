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
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RewardedAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val adRevenueLogger: AdRevenueLogger,
) {
    private var rewardedAd: RewardedAd? = null
    private var currentPlacement: AdPlacement = AdPlacement.REWARDED_DEFAULT
    private var currentRoute: String? = null
    private var loadBackoffState = AdLoadBackoffState()
    private val _isAdReady = MutableStateFlow(false)
    val isAdReady: StateFlow<Boolean> = _isAdReady.asStateFlow()

    fun isAdReadyNow(): Boolean = _isAdReady.value

    fun loadAd(
        adUnitId: String,
        placement: AdPlacement = AdPlacement.REWARDED_DEFAULT,
        route: String? = null,
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            return
        }
        val now = SystemTimeProvider.nowMillis()
        if (!AdLoadBackoffPolicy.canLoad(now, loadBackoffState)) return
        currentPlacement = placement
        currentRoute = route
        val adRequest = AdRequest.Builder().build()
        Timber.d("Rewarded load requested: %s", adUnitId)
        RewardedAd.load(
            context,
            adUnitId,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    rewardedAd = null
                    _isAdReady.value = false
                    loadBackoffState = AdLoadBackoffPolicy.onLoadFailure(
                        nowMillis = SystemTimeProvider.nowMillis(),
                        current = loadBackoffState,
                        errorCode = adError.code,
                    )
                    Timber.w("Rewarded failed to load (%s): %s", adUnitId, adError.message)
                }

                override fun onAdLoaded(ad: RewardedAd) {
                    loadBackoffState = AdLoadBackoffPolicy.onLoadSuccess()
                    ad.onPaidEventListener = { value ->
                        adRevenueLogger.logPaidEvent(
                            AdPaidEventContext(
                                adUnitId = ad.adUnitId,
                                adFormat = AdFormat.REWARDED,
                                placement = currentPlacement,
                                route = currentRoute,
                                adValue = value,
                                responseMeta = adRevenueLogger.extractResponseMeta(ad.responseInfo),
                            ),
                        )
                    }
                    val responseInfo = ad.responseInfo
                    Timber.d(
                        "Rewarded loaded (%s): responseId=%s adapter=%s",
                        adUnitId,
                        responseInfo.responseId,
                        responseInfo.mediationAdapterClassName,
                    )
                    rewardedAd = ad
                    _isAdReady.value = true
                }
            }
        )
    }

    fun showAd(activity: Activity, onUserEarnedReward: () -> Unit, onAdDismissed: () -> Unit) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            clearAd()
            onAdDismissed()
            return
        }
        val loadedAd = rewardedAd
        if (loadedAd != null) {
            loadedAd.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    rewardedAd = null
                    _isAdReady.value = false
                    Timber.d("Rewarded dismissed")
                    onAdDismissed()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    rewardedAd = null
                    _isAdReady.value = false
                    Timber.w("Rewarded failed to show: %s", adError.message)
                    onAdDismissed()
                }

                override fun onAdShowedFullScreenContent() {
                    Timber.d("Rewarded showed full screen content")
                }

                override fun onAdImpression() {
                    Timber.d("Rewarded impression recorded")
                    adRevenueLogger.logImpression(
                        adFormat = AdFormat.REWARDED,
                        placement = currentPlacement,
                        adUnitId = loadedAd.adUnitId,
                        route = currentRoute,
                    )
                }

                override fun onAdClicked() {
                    adRevenueLogger.logClick(
                        adFormat = AdFormat.REWARDED,
                        placement = currentPlacement,
                        adUnitId = loadedAd.adUnitId,
                        route = currentRoute,
                    )
                }
            }
            loadedAd.show(activity) { rewardItem ->
                // Handle the reward.
                Timber.d("Rewarded reward earned: %s x%d", rewardItem.type, rewardItem.amount)
                onUserEarnedReward()
            }
        } else {
            _isAdReady.value = false
            Timber.d("Rewarded show skipped: ad not ready")
            onAdDismissed()
        }
    }

    fun clearAd() {
        rewardedAd = null
        _isAdReady.value = false
    }
}
