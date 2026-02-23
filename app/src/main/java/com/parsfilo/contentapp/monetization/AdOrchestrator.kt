package com.parsfilo.contentapp.monetization

import android.app.Activity
import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.AdManager
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.AppOpenAdManager
import com.parsfilo.contentapp.feature.ads.InterstitialAdManager
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialAdManager
import com.parsfilo.contentapp.observability.SentryMetrics
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers.Main
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdOrchestrator @Inject constructor(
    private val adManager: AdManager,
    private val appOpenAdManager: AppOpenAdManager,
    private val interstitialAdManager: InterstitialAdManager,
    val nativeAdManager: NativeAdManager,
    internal val rewardedInterstitialAdManager: RewardedInterstitialAdManager,
    private val adGateChecker: AdGateChecker,
    private val preferencesDataSource: PreferencesDataSource,
) {

    // Shared main-thread scope for ad callbacks to avoid creating unbounded scopes repeatedly.
    private val orchestratorScope = CoroutineScope(SupervisorJob() + Main.immediate)

    fun initialize(activity: Activity, scope: CoroutineScope) {
        val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
        SentryMetrics.count("ads.initialize.called")

        // UMP + MobileAds callbacks are UI-coupled; keep init on main thread.
        scope.launch(Main.immediate) {
            adManager.initialize(activity) {
                scope.launch(Main.immediate) {
                    // Respect premium/reward gate before preloading ads.
                    if (!adGateChecker.shouldShowAds.first()) {
                        SentryMetrics.count("ads.initialize.skipped.gated")
                        return@launch
                    }
                    preloadAds(ids)
                }
            }
        }
    }

    fun destroy() {
        nativeAdManager.destroyAds()
        orchestratorScope.cancel()
    }

    suspend fun showInterstitialIfEligible(activity: Activity, onAdDismissed: () -> Unit = {}) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            onAdDismissed()
            return
        }
        SentryMetrics.count("ads.interstitial.show.attempt")
        SentryMetrics.breadcrumb("ads", "Interstitial show attempt")
        interstitialAdManager.showAd(activity) {
            SentryMetrics.count("ads.interstitial.dismissed")
            SentryMetrics.breadcrumb("ads", "Interstitial dismissed")
            onAdDismissed()
        }
    }

    /**
     * App Open reklamı gösterir — MainActivity.onResume'dan çağrılır.
     * AppOpenAdManager kendi içinde premium/cooldown kontrolünü yapar.
     */
    suspend fun showAppOpenAdIfEligible(activity: Activity) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            return
        }
        SentryMetrics.count("ads.app_open.show.attempt")
        SentryMetrics.breadcrumb("ads", "AppOpen show attempt")
        if (!adGateChecker.shouldShowAds.first()) {
            SentryMetrics.count("ads.app_open.show.skipped.gated")
            return
        }
        appOpenAdManager.showAdIfAvailable(activity) {
            SentryMetrics.count("ads.app_open.dismissed")
            SentryMetrics.breadcrumb("ads", "AppOpen dismissed")
            // Reklam bitti veya gösterilemedi — yeni reklam yükle
            val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
            SentryMetrics.count("ads.load.requested.app_open")
            appOpenAdManager.loadAd(ids.appOpen)
        }
    }

    /**
     * RewardedInterstitial gösterir — doğal geçiş noktalarında çağrılır.
     * Reward süresi tek kaynaktan (AdGateChecker) yönetilir.
     */
    suspend fun showRewardedInterstitialIfEligible(
        activity: Activity,
        onUserEarnedReward: () -> Unit = {},
        onAdDismissed: () -> Unit = {}
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            onAdDismissed()
            return
        }
        SentryMetrics.count("ads.rewarded_interstitial.show.attempt")
        SentryMetrics.breadcrumb("ads", "RewardedInterstitial show attempt")
        if (!adGateChecker.shouldShowAds.first()) {
            SentryMetrics.count("ads.rewarded_interstitial.show.skipped.gated")
            onAdDismissed()
            return
        }
        rewardedInterstitialAdManager.showAd(
            activity = activity,
            onUserEarnedReward = { _, _ ->
                orchestratorScope.launch {
                    adGateChecker.onRewardEarned()
                    val now = System.currentTimeMillis()
                    val newFreeUntil = preferencesDataSource.userData.first().rewardedAdFreeUntil
                    SentryMetrics.count("ads.rewarded_interstitial.reward_earned")
                    SentryMetrics.breadcrumb("ads", "RewardedInterstitial reward earned")
                    SentryMetrics.gauge(
                        key = "ads.reward_free_window.minutes",
                        value = ((newFreeUntil - now).coerceAtLeast(0) / 60_000.0),
                        unit = "minute",
                    )
                    onUserEarnedReward()
                }
            },
            onAdDismissed = {
                SentryMetrics.count("ads.rewarded_interstitial.dismissed")
                // Sonraki gösterim için yeniden yükle
                val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
                SentryMetrics.count("ads.load.requested.rewarded_interstitial")
                rewardedInterstitialAdManager.loadAd(ids.rewardedInterstitial)
                onAdDismissed()
            }
        )
    }

    fun refreshConsent(activity: Activity, scope: CoroutineScope) {
        adManager.refreshConsent(activity) { canRequestAds ->
            scope.launch(Main.immediate) {
                if (!canRequestAds) {
                    clearPreloadedAds()
                    return@launch
                }
                if (!adGateChecker.shouldShowAds.first()) {
                    clearPreloadedAds()
                    return@launch
                }
                val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
                preloadAds(ids)
            }
        }
    }

    private fun preloadAds(ids: AppAdUnitIds.Ids) {
        SentryMetrics.count("ads.load.requested.app_open")
        appOpenAdManager.loadAd(ids.appOpen)

        SentryMetrics.count("ads.load.requested.interstitial")
        interstitialAdManager.loadAd(ids.interstitial)

        SentryMetrics.count("ads.load.requested.native")
        nativeAdManager.loadAds(ids.native, 3)

        SentryMetrics.count("ads.load.requested.rewarded_interstitial")
        rewardedInterstitialAdManager.loadAd(ids.rewardedInterstitial)
    }

    private fun clearPreloadedAds() {
        appOpenAdManager.clearAd()
        interstitialAdManager.clearAd()
        rewardedInterstitialAdManager.clearAd()
        nativeAdManager.destroyAds()
    }
}

