package com.parsfilo.contentapp.monetization

import android.app.Activity
import android.content.Context
import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.ads.AdEligibility
import com.parsfilo.contentapp.feature.ads.AdFormat
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.AdManager
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.AdRequestContext
import com.parsfilo.contentapp.feature.ads.AdRevenueLogger
import com.parsfilo.contentapp.feature.ads.AdSuppressReason
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.AdsPlacementPolicyEvaluator
import com.parsfilo.contentapp.feature.ads.AdsPolicyProvider
import com.parsfilo.contentapp.feature.ads.AppOpenAdManager
import com.parsfilo.contentapp.feature.ads.AppOpenEligibilityTracker
import com.parsfilo.contentapp.feature.ads.InterstitialAdManager
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import com.parsfilo.contentapp.feature.ads.RewardedAdManager
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialAdManager
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialCoordinator
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialIntroSpec
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialLaunchToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers.Main
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import timber.log.Timber
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
    private val placementPolicyEvaluator: AdsPlacementPolicyEvaluator,
    private val rewardedInterstitialCoordinator: RewardedInterstitialCoordinator,
    private val appOpenEligibilityTracker: AppOpenEligibilityTracker,
    private val adsConfigValidator: AdsConfigValidator,
) {

    private val orchestratorScope = CoroutineScope(SupervisorJob() + Main.immediate)
    private var rewardedInterstitialShownThisSession: Int = 0
    private var interstitialShownThisSession: Int = 0
    @Volatile
    private var adSessionContext: AdSessionContext = AdSessionContext()
    @Volatile
    private var adGateObserverStarted: Boolean = false

    fun initialize(activity: Activity, scope: CoroutineScope) {
        Timber.d("AdOrchestrator initialize package=%s testAds=%s", activity.packageName, BuildConfig.USE_TEST_ADS)
        adsConfigValidator.validateOrThrow(activity, BuildConfig.USE_TEST_ADS)
        startAdGateObserver(activity.applicationContext)
        adManager.initialize(activity) {
            scope.launch(Main.immediate) {
                if (!adGateChecker.shouldShowAds.first()) {
                    Timber.d("AdOrchestrator initialize: ad gate closed, preload skipped")
                    return@launch
                }
                Timber.d("AdOrchestrator initialize: preloading ads")
                preloadAds(activity.applicationContext)
            }
        }
    }

    fun destroy() {
        Timber.d("AdOrchestrator destroy")
        nativeAdManager.destroyAds()
    }

    fun onAppPaused() {
        Timber.d("AdOrchestrator onAppPaused")
        appOpenEligibilityTracker.onPause()
    }

    fun isAppOpenAdShowing(): Boolean = appOpenAdManager.isShowingAdNow()

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
        Timber.d(
            "Ad session updated route=%s contentType=%s verseReadCount=%d audioPlayed=%s",
            adSessionContext.activeRoute,
            adSessionContext.contentType,
            adSessionContext.verseReadCount,
            adSessionContext.audioPlayedThisSession,
        )
    }

    fun buildRewardedInterstitialIntro(placement: AdPlacement): RewardedInterstitialIntroSpec =
        rewardedInterstitialCoordinator.buildIntroSpec(placement)

    fun onRewardedInterstitialIntroShown(
        placement: AdPlacement,
        route: String?,
        adUnitId: String,
    ) {
        rewardedInterstitialCoordinator.onIntroShown(placement, adUnitId, route)
    }

    fun onRewardedInterstitialIntroSkipped(
        placement: AdPlacement,
        route: String?,
        adUnitId: String,
    ) {
        rewardedInterstitialCoordinator.onIntroSkipped(placement, adUnitId, route)
        adRevenueLogger.logSuppressed(
            adFormat = AdFormat.REWARDED_INTERSTITIAL,
            placement = placement,
            adUnitId = adUnitId,
            suppressReason = AdSuppressReason.INTRO_SKIPPED,
            route = route,
        )
    }

    fun confirmRewardedInterstitialIntro(
        placement: AdPlacement,
        route: String?,
        adUnitId: String,
    ): RewardedInterstitialLaunchToken =
        rewardedInterstitialCoordinator.confirmIntro(placement, adUnitId, route)

    suspend fun showInterstitialIfEligible(
        activity: Activity,
        placement: AdPlacement = AdPlacement.INTERSTITIAL_DEFAULT,
        route: String? = null,
        onAdDismissed: () -> Unit = {},
    ) {
        Timber.d(
            "Interstitial show requested placement=%s route=%s sessionCount=%d",
            placement.analyticsValue,
            route ?: adSessionContext.activeRoute,
            interstitialShownThisSession,
        )
        val prefs = preferencesDataSource.userData.first()
        val contextRoute = route ?: adSessionContext.activeRoute
        when (
            val eligibility = placementPolicyEvaluator.evaluateInterstitial(
                AdRequestContext(
                    format = AdFormat.INTERSTITIAL,
                    placement = placement,
                    route = contextRoute,
                    privacyState = AdsConsentRuntimeState.state.value,
                    isPremium = prefs.isPremium,
                    isRewardedAdFree = prefs.rewardedAdFreeUntil > System.currentTimeMillis(),
                    sessionCount = interstitialShownThisSession,
                    lastShownAtMs = prefs.lastInterstitialShown,
                    resumeGapMs = null,
                    contentInProgress = isContentInProgress(contextRoute),
                ),
            )
        ) {
            is AdEligibility.Blocked -> {
                Timber.d(
                    "Interstitial blocked placement=%s route=%s reason=%s",
                    placement.analyticsValue,
                    contextRoute,
                    eligibility.reason.analyticsValue,
                )
                adRevenueLogger.logSuppressed(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = AppAdUnitIds.resolvePlacement(activity, placement, BuildConfig.USE_TEST_ADS),
                    suppressReason = eligibility.reason,
                    route = contextRoute,
                )
                onAdDismissed()
                return
            }
            AdEligibility.Allowed -> Unit
        }
        Timber.d("Interstitial allowed placement=%s route=%s", placement.analyticsValue, contextRoute)
        interstitialAdManager.showAd(
            activity = activity,
            placement = placement,
            route = contextRoute,
            onAdImpression = { adUnitId ->
                interstitialShownThisSession += 1
                Timber.d(
                    "Interstitial impression placement=%s route=%s sessionCount=%d adUnit=%s",
                    placement.analyticsValue,
                    contextRoute,
                    interstitialShownThisSession,
                    adUnitId,
                )
                logAdAfterEngagement(
                    adFormat = AdFormat.INTERSTITIAL,
                    placement = placement,
                    adUnitId = adUnitId,
                    route = contextRoute,
                )
            },
        ) {
            onAdDismissed()
        }
    }

    suspend fun showAppOpenAdIfEligible(activity: Activity) {
        Timber.d("AppOpen show requested route=%s", adSessionContext.activeRoute)
        val prefs = preferencesDataSource.userData.first()
        val resumeSnapshot = appOpenEligibilityTracker.onResume()
        val route = adSessionContext.activeRoute
        when (
            val eligibility = placementPolicyEvaluator.evaluateAppOpen(
                AdRequestContext(
                    format = AdFormat.APP_OPEN,
                    placement = AdPlacement.APP_OPEN_RESUME,
                    route = route,
                    privacyState = AdsConsentRuntimeState.state.value,
                    isPremium = prefs.isPremium,
                    isRewardedAdFree = prefs.rewardedAdFreeUntil > System.currentTimeMillis(),
                    sessionCount = resumeSnapshot.sessionCount,
                    lastShownAtMs = prefs.lastAppOpenAdShown,
                    resumeGapMs = if (resumeSnapshot.isColdStart) Long.MAX_VALUE else resumeSnapshot.resumeGapMs,
                    contentInProgress = isContentInProgress(route),
                ),
            )
        ) {
            is AdEligibility.Blocked -> {
                Timber.d(
                    "AppOpen blocked route=%s reason=%s",
                    route,
                    eligibility.reason.analyticsValue,
                )
                adRevenueLogger.logSuppressed(
                    adFormat = AdFormat.APP_OPEN,
                    placement = AdPlacement.APP_OPEN_RESUME,
                    adUnitId = AppAdUnitIds.resolvePlacement(activity, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
                    suppressReason = eligibility.reason,
                    route = route,
                )
                return
            }
            AdEligibility.Allowed -> Unit
        }
        Timber.d(
            "AppOpen allowed route=%s coldStart=%s sessionCount=%d",
            route,
            resumeSnapshot.isColdStart,
            resumeSnapshot.sessionCount,
        )
        appOpenAdManager.showAdIfAvailable(
            activity = activity,
            route = route,
            onAdImpression = { adUnitId ->
                appOpenEligibilityTracker.onShown()
                Timber.d("AppOpen impression route=%s adUnit=%s", route, adUnitId)
                logAdAfterEngagement(
                    adFormat = AdFormat.APP_OPEN,
                    placement = AdPlacement.APP_OPEN_RESUME,
                    adUnitId = adUnitId,
                    route = route,
                )
            },
        ) {
            Timber.d("AppOpen show completed; requesting reload")
            appOpenAdManager.loadAd(
                AppAdUnitIds.resolvePlacement(activity, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
                AdPlacement.APP_OPEN_RESUME,
            )
        }
    }

    suspend fun showRewardedInterstitialIfEligible(
        activity: Activity,
        launchToken: RewardedInterstitialLaunchToken,
        placement: AdPlacement = AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
        route: String? = null,
        onUserEarnedReward: () -> Unit = {},
        onAdDismissed: () -> Unit = {},
    ) {
        Timber.d(
            "RewardedInterstitial show requested placement=%s route=%s sessionCount=%d",
            placement.analyticsValue,
            route ?: adSessionContext.activeRoute,
            rewardedInterstitialShownThisSession,
        )
        val prefs = preferencesDataSource.userData.first()
        val contextRoute = route ?: adSessionContext.activeRoute
        when (
            val eligibility = placementPolicyEvaluator.evaluateRewardedInterstitial(
                AdRequestContext(
                    format = AdFormat.REWARDED_INTERSTITIAL,
                    placement = placement,
                    route = contextRoute,
                    privacyState = AdsConsentRuntimeState.state.value,
                    isPremium = prefs.isPremium,
                    isRewardedAdFree = prefs.rewardedAdFreeUntil > System.currentTimeMillis(),
                    sessionCount = rewardedInterstitialShownThisSession,
                    lastShownAtMs = prefs.lastRewardedInterstitialShown,
                    resumeGapMs = null,
                    contentInProgress = false,
                ),
            )
        ) {
            is AdEligibility.Blocked -> {
                Timber.d(
                    "RewardedInterstitial blocked placement=%s route=%s reason=%s",
                    placement.analyticsValue,
                    contextRoute,
                    eligibility.reason.analyticsValue,
                )
                adRevenueLogger.logSuppressed(
                    adFormat = AdFormat.REWARDED_INTERSTITIAL,
                    placement = placement,
                    adUnitId = AppAdUnitIds.resolvePlacement(activity, placement, BuildConfig.USE_TEST_ADS),
                    suppressReason = eligibility.reason,
                    route = contextRoute,
                )
                onAdDismissed()
                return
            }
            AdEligibility.Allowed -> Unit
        }
        Timber.d("RewardedInterstitial allowed placement=%s route=%s", placement.analyticsValue, contextRoute)
        rewardedInterstitialAdManager.showAfterConfirmedIntro(
            launchToken = launchToken,
            activity = activity,
            placement = placement,
            route = contextRoute,
            onAdImpression = { adUnitId ->
                orchestratorScope.launch {
                    rewardedInterstitialShownThisSession += 1
                    preferencesDataSource.setLastRewardedInterstitialShown(System.currentTimeMillis())
                }
                Timber.d(
                    "RewardedInterstitial impression placement=%s route=%s sessionCount=%d adUnit=%s",
                    placement.analyticsValue,
                    contextRoute,
                    rewardedInterstitialShownThisSession,
                    adUnitId,
                )
                logAdAfterEngagement(
                    adFormat = AdFormat.REWARDED_INTERSTITIAL,
                    placement = placement,
                    adUnitId = adUnitId,
                    route = contextRoute,
                )
            },
            onUserEarnedReward = { _, _ ->
                orchestratorScope.launch {
                    Timber.d("RewardedInterstitial reward earned placement=%s route=%s", placement.analyticsValue, contextRoute)
                    adGateChecker.onRewardEarned()
                    onUserEarnedReward()
                }
            },
            onAdDismissed = {
                Timber.d("RewardedInterstitial dismissed; requesting reload placement=%s route=%s", placement.analyticsValue, contextRoute)
                val ids = AppAdUnitIds.resolve(activity, BuildConfig.USE_TEST_ADS)
                rewardedInterstitialAdManager.loadAd(ids.rewardedInterstitial, placement, contextRoute)
                onAdDismissed()
            },
        )
    }

    private fun startAdGateObserver(context: Context) {
        if (adGateObserverStarted) return
        adGateObserverStarted = true
        Timber.d("AdOrchestrator startAdGateObserver")
        orchestratorScope.launch {
            combine(
                AdsConsentRuntimeState.canRequestAds,
                adGateChecker.shouldShowAds,
            ) { consentGranted, adsAllowedByGate ->
                consentGranted && adsAllowedByGate
            }
                .distinctUntilChanged()
                .collect { canPreload ->
                    Timber.d("Ad gate observer changed canPreload=%s", canPreload)
                    if (canPreload) {
                        preloadAds(context)
                    } else {
                        clearPreloadedAds()
                    }
                }
        }
    }

    fun refreshConsent(activity: Activity, scope: CoroutineScope) {
        Timber.d("AdOrchestrator refreshConsent requested")
        adManager.refreshConsent(activity) { canRequestAds ->
            scope.launch(Main.immediate) {
                Timber.d("AdOrchestrator refreshConsent result canRequestAds=%s", canRequestAds)
                if (!canRequestAds) {
                    clearPreloadedAds()
                    return@launch
                }
                if (!adGateChecker.shouldShowAds.first()) {
                    Timber.d("AdOrchestrator refreshConsent: ad gate closed, clear preloads")
                    clearPreloadedAds()
                    return@launch
                }
                Timber.d("AdOrchestrator refreshConsent: preloading ads")
                preloadAds(activity.applicationContext)
            }
        }
    }

    private fun preloadAds(context: Context) {
        val policy = adsPolicyProvider.getPolicy()
        Timber.d(
            "Preload ads route=%s nativePoolMax=%d",
            adSessionContext.activeRoute,
            policy.nativePoolMax,
        )
        appOpenAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(context, AdPlacement.APP_OPEN_RESUME, BuildConfig.USE_TEST_ADS),
            AdPlacement.APP_OPEN_RESUME,
        )
        interstitialAdManager.loadAd(
            context,
            AppAdUnitIds.resolvePlacement(
                context,
                AdPlacement.INTERSTITIAL_NAV_BREAK,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.INTERSTITIAL_NAV_BREAK,
        )
        nativeAdManager.loadAds(
            context,
            AppAdUnitIds.resolvePlacement(context, AdPlacement.NATIVE_FEED_HOME, BuildConfig.USE_TEST_ADS),
            AdPlacement.NATIVE_FEED_HOME,
            policy.nativePoolMax,
        )
        rewardedInterstitialAdManager.loadAd(
            AppAdUnitIds.resolvePlacement(
                context,
                AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
                BuildConfig.USE_TEST_ADS,
            ),
            AdPlacement.REWARDED_INTERSTITIAL_DEFAULT,
        )
        Timber.d(
            "Rewarded startup preload skipped: rewarded loads on-demand from Rewards screen",
        )
    }

    private fun clearPreloadedAds() {
        Timber.d("Clear preloaded ads")
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

    private fun isContentInProgress(route: String?): Boolean {
        val normalizedRoute = route?.lowercase().orEmpty()
        return adSessionContext.audioPlayedThisSession && (
            normalizedRoute.startsWith("content") ||
                normalizedRoute.startsWith("quran_sura_detail") ||
                normalizedRoute.startsWith("prayer_detail")
            )
    }
}
