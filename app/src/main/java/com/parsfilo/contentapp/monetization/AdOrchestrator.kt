package com.parsfilo.contentapp.monetization

import android.app.Activity
import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.AdManager
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.AdsPolicyProvider
import com.parsfilo.contentapp.feature.ads.AppOpenAdManager
import com.parsfilo.contentapp.feature.ads.InterstitialAdManager
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import com.parsfilo.contentapp.feature.ads.RewardedAdManager
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialAdManager
import com.parsfilo.contentapp.observability.SentryMetrics
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers.Main
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdOrchestrator @Inject constructor(
    private val adManager: AdManager,
    private val appOpenAdManager: AppOpenAdManager,
    private val interstitialAdManager: InterstitialAdManager,
    val nativeAdManager: NativeAdManager,
    private val rewardedAdManager: RewardedAdManager,
    internal val rewardedInterstitialAdManager: RewardedInterstitialAdManager,
    private val adGateChecker: AdGateChecker,
    private val adsPolicyProvider: AdsPolicyProvider,
    private val preferencesDataSource: PreferencesDataSource,
) {

    // Shared main-thread scope for ad callbacks to avoid creating unbounded scopes repeatedly.
    private val orchestratorScope = CoroutineScope(SupervisorJob() + Main.immediate)
    private var rewardedInterstitialShownThisSession: Int = 0

    fun initialize(activity: Activity, scope: CoroutineScope) {
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
                    preloadAds(activity)
                }
            }
        }
    }

    fun destroy() {
        nativeAdManager.destroyAds()
        // Keep the shared scope alive across Activity recreation (rotation/process UI lifecycle)
        // so rewarded callbacks can still dispatch state updates after MainActivity.onDestroy().
    }

    suspend fun showInterstitialIfEligible(
        activity: Activity,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
        onAdDismissed: () -> Unit = {},
    ) {
        if (!AdsConsentRuntimeState.canRequestAds.value) {
            onAdDismissed()
            return
        }
        SentryMetrics.count("ads.interstitial.show.attempt")
        SentryMetrics.breadcrumb("ads", "Interstitial show attempt")
        interstitialAdManager.showAd(
            activity = activity,
            placement = placement,
            route = route,
        ) {
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
            SentryMetrics.count("ads.load.requested.app_open")
            appOpenAdManager.loadAd(
                AppAdUnitIds.resolvePlacement(activity, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
                AdPlacement.APP_OPEN_RESUME,
            )
        }
    }

    /**
     * RewardedInterstitial gösterir — doğal geçiş noktalarında çağrılır.
     * Reward süresi tek kaynaktan (AdGateChecker) yönetilir.
     */
    suspend fun showRewardedInterstitialIfEligible(
        activity: Activity,
        placement: AdPlacement = AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
        route: String? = null,
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
        val policy = adsPolicyProvider.getPolicy()
        val now = System.currentTimeMillis()
        val prefs = preferencesDataSource.userData.first()
        if (policy.rewardedInterstitialMaxPerSession <= 0) {
            SentryMetrics.count("ads.rewarded_interstitial.show.skipped.policy_disabled")
            onAdDismissed()
            return
        }
        if (rewardedInterstitialShownThisSession >= policy.rewardedInterstitialMaxPerSession) {
            SentryMetrics.count("ads.rewarded_interstitial.show.skipped.session_cap")
            onAdDismissed()
            return
        }
        if (now - prefs.lastRewardedInterstitialShown < policy.rewardedInterstitialMinIntervalMs) {
            SentryMetrics.count("ads.rewarded_interstitial.show.skipped.interval")
            onAdDismissed()
            return
        }
        rewardedInterstitialAdManager.showAd(
            activity = activity,
            onAdImpression = {
                orchestratorScope.launch {
                    rewardedInterstitialShownThisSession += 1
                    preferencesDataSource.setLastRewardedInterstitialShown(System.currentTimeMillis())
                }
            },
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
                rewardedInterstitialAdManager.loadAd(ids.rewardedInterstitial, placement, route)
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
                preloadAds(activity)
            }
        }
    }

    private fun preloadAds(activity: Activity) {
        val policy = adsPolicyProvider.getPolicy()
        SentryMetrics.count("ads.load.requested.app_open")
        appOpenAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(activity, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
            AdPlacement.APP_OPEN_RESUME,
        )

        SentryMetrics.count("ads.load.requested.interstitial")
        interstitialAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(
                activity,
                AdPlacement.INTERSTITIAL_NAV_BREAK,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.INTERSTITIAL_NAV_BREAK,
        )

        SentryMetrics.count("ads.load.requested.native")
        nativeAdManager.loadAds(
            AppAdUnitIds.resolvePlacement(activity, AdPlacement.NATIVE_FEED_HOME, BuildConfig.USE_TEST_ADS),
            AdPlacement.NATIVE_FEED_HOME,
            policy.nativePoolMax,
        )

        SentryMetrics.count("ads.load.requested.rewarded")
        rewardedAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(
                activity,
                AdPlacement.REWARDED_DEFAULT,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.REWARDED_DEFAULT,
        )

        SentryMetrics.count("ads.load.requested.rewarded_interstitial")
        rewardedInterstitialAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(
                activity,
                AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
        )
    }

    private fun clearPreloadedAds() {
        appOpenAdManager.clearAd()
        interstitialAdManager.clearAd()
        rewardedAdManager.clearAd()
        rewardedInterstitialAdManager.clearAd()
        nativeAdManager.destroyAds()
    }
}
