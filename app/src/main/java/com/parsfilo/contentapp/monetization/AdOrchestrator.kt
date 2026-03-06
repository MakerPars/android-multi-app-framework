package com.parsfilo.contentapp.monetization

import android.app.Activity
import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.ads.AdFormat
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.AdManager
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.AdRevenueLogger
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.AdsPolicyProvider
import com.parsfilo.contentapp.feature.ads.AppOpenAdManager
import com.parsfilo.contentapp.feature.ads.InterstitialAdManager
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import com.parsfilo.contentapp.feature.ads.RewardedAdManager
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialAdManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers.Main
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

data class AdSessionContext(
    val activeRoute: String? = null,
    val contentType: String? = null,
    val verseReadCount: Int = 0,
    val audioPlayedThisSession: Boolean = false,
    val sessionStartedAtMs: Long = System.currentTimeMillis(),
)

@Singleton
class AdOrchestrator @Inject constructor(
    private val adManager: AdManager,
    private val appOpenAdManager: AppOpenAdManager,
    private val interstitialAdManager: InterstitialAdManager,
    val nativeAdManager: NativeAdManager,
    private val rewardedAdManager: RewardedAdManager,
    internal val rewardedInterstitialAdManager: RewardedInterstitialAdManager,
    private val adRevenueLogger: AdRevenueLogger,
    private val adGateChecker: AdGateChecker,
    private val adsPolicyProvider: AdsPolicyProvider,
    private val preferencesDataSource: PreferencesDataSource,
) {

    // Shared main-thread scope for ad callbacks to avoid creating unbounded scopes repeatedly.
    private val orchestratorScope = CoroutineScope(SupervisorJob() + Main.immediate)
    private var rewardedInterstitialShownThisSession: Int = 0
    @Volatile
    private var adSessionContext: AdSessionContext = AdSessionContext()

    fun initialize(activity: Activity, scope: CoroutineScope) {
        // UMP + MobileAds callbacks are UI-coupled; keep init on main thread.
        scope.launch(Main.immediate) {
            adManager.initialize(activity) {
                scope.launch(Main.immediate) {
                    // Respect premium/reward gate before preloading ads.
                    if (!adGateChecker.shouldShowAds.first()) {
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

    fun updateSessionContext(
        activeRoute: String? = null,
        contentType: String? = null,
        verseReadIncrement: Int = 0,
        audioPlayed: Boolean? = null,
    ) {
        val previous = adSessionContext
        adSessionContext = previous.copy(
            activeRoute = activeRoute ?: previous.activeRoute,
            contentType = contentType ?: previous.contentType,
            verseReadCount = (previous.verseReadCount + verseReadIncrement).coerceAtLeast(0),
            audioPlayedThisSession = audioPlayed ?: previous.audioPlayedThisSession,
        )
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
        interstitialAdManager.showAd(
            activity = activity,
            placement = placement,
            route = route,
            onAdImpression = { adUnitId ->
                logAdAfterEngagement(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = adUnitId,
                    route = route,
                )
            },
        ) {
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
        if (!adGateChecker.shouldShowAds.first()) {
            return
        }
        appOpenAdManager.showAdIfAvailable(
            activity = activity,
            onAdImpression = { adUnitId ->
                logAdAfterEngagement(
                    adFormat = AdFormat.APP_OPEN,
                    placement = AdPlacement.APP_OPEN_RESUME,
                    adUnitId = adUnitId,
                    route = adSessionContext.activeRoute,
                )
            },
        ) {
            // Reklam bitti veya gösterilemedi — yeni reklam yükle
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
        if (!adGateChecker.shouldShowAds.first()) {
            onAdDismissed()
            return
        }
        val policy = adsPolicyProvider.getPolicy()
        val now = System.currentTimeMillis()
        val prefs = preferencesDataSource.userData.first()
        if (policy.rewardedInterstitialMaxPerSession <= 0) {
            onAdDismissed()
            return
        }
        if (rewardedInterstitialShownThisSession >= policy.rewardedInterstitialMaxPerSession) {
            onAdDismissed()
            return
        }
        if (now - prefs.lastRewardedInterstitialShown < policy.rewardedInterstitialMinIntervalMs) {
            onAdDismissed()
            return
        }
        rewardedInterstitialAdManager.showAd(
            activity = activity,
            onAdImpression = { adUnitId ->
                orchestratorScope.launch {
                    rewardedInterstitialShownThisSession += 1
                    preferencesDataSource.setLastRewardedInterstitialShown(System.currentTimeMillis())
                }
                logAdAfterEngagement(
                    adFormat = AdFormat.REWARDED_INTERSTITIAL,
                    placement = placement,
                    adUnitId = adUnitId,
                    route = route,
                )
            },
            onUserEarnedReward = { _, _ ->
                orchestratorScope.launch {
                    adGateChecker.onRewardEarned()
                    onUserEarnedReward()
                }
            },
            onAdDismissed = {
                // Sonraki gösterim için yeniden yükle
                val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
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
        appOpenAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(activity, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
            AdPlacement.APP_OPEN_RESUME,
        )

        interstitialAdManager.loadAd(
            activity,
            AppAdUnitIds.resolvePlacement(
                activity,
                AdPlacement.INTERSTITIAL_NAV_BREAK,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.INTERSTITIAL_NAV_BREAK,
        )

        nativeAdManager.loadAds(
            activity,
            AppAdUnitIds.resolvePlacement(activity, AdPlacement.NATIVE_FEED_HOME, BuildConfig.USE_TEST_ADS),
            AdPlacement.NATIVE_FEED_HOME,
            policy.nativePoolMax,
        )

        // Rewarded ads are loaded on-demand from Rewards screen to avoid
        // high background request volume when user never opens rewards flow.

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

    private fun logAdAfterEngagement(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
    ) {
        val context = adSessionContext
        val now = System.currentTimeMillis()
        val sessionDurationSeconds = ((now - context.sessionStartedAtMs).coerceAtLeast(0L) / 1000L)
        adRevenueLogger.logAdAfterEngagement(
            adFormat = adFormat,
            placement = placement,
            adUnitId = adUnitId,
            route = route ?: context.activeRoute,
            sessionDurationSeconds = sessionDurationSeconds,
            verseCountBeforeAd = context.verseReadCount,
            sessionAudioPlayed = context.audioPlayedThisSession,
            sessionContentType = context.contentType,
        )
    }
}
