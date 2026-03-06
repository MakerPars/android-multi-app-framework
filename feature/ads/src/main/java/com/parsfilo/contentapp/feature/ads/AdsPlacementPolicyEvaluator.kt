package com.parsfilo.contentapp.feature.ads

import javax.inject.Inject
import javax.inject.Singleton

data class AdRequestContext(
    val format: AdFormat,
    val placement: AdPlacement,
    val route: String?,
    val privacyState: AdsPrivacyState,
    val isPremium: Boolean,
    val isRewardedAdFree: Boolean,
    val sessionCount: Int,
    val lastShownAtMs: Long?,
    val resumeGapMs: Long?,
    val contentInProgress: Boolean,
)

sealed interface AdEligibility {
    data object Allowed : AdEligibility
    data class Blocked(val reason: AdSuppressReason) : AdEligibility
}

@Singleton
class AdsPlacementPolicyEvaluator @Inject constructor(
    private val adsPolicyProvider: AdsPolicyProvider,
) {
    fun evaluateInterstitial(context: AdRequestContext): AdEligibility {
        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isInterstitialPlacementEnabled(context.placement)) {
            return AdEligibility.Blocked(AdSuppressReason.PLACEMENT_DISABLED)
        }
        if (context.privacyState !is AdsPrivacyState.CanRequestAds) {
            return AdEligibility.Blocked(
                if (context.privacyState is AdsPrivacyState.DeniedOrLimited) {
                    AdSuppressReason.PRIVACY_LIMITED
                } else {
                    AdSuppressReason.NO_CONSENT
                },
            )
        }
        if (context.isPremium) return AdEligibility.Blocked(AdSuppressReason.PREMIUM)
        if (context.isRewardedAdFree) return AdEligibility.Blocked(AdSuppressReason.REWARDED_FREE)
        if (context.contentInProgress) return AdEligibility.Blocked(AdSuppressReason.CONTENT_IN_PROGRESS)
        if (context.route?.lowercase() in policy.interstitialRouteBlocklist) {
            return AdEligibility.Blocked(AdSuppressReason.ROUTE_BLOCKED)
        }
        val lastShownAtMs = context.lastShownAtMs
        if (lastShownAtMs != null) {
            val cooldownMs = policy.interstitialFrequencyCapMs
            if (SystemTimeProvider.nowMillis() - lastShownAtMs < cooldownMs) {
                return AdEligibility.Blocked(AdSuppressReason.COOLDOWN)
            }
        }
        if (context.sessionCount >= policy.interstitialMaxPerSession) {
            return AdEligibility.Blocked(AdSuppressReason.SESSION_CAP)
        }
        return AdEligibility.Allowed
    }

    fun evaluateAppOpen(context: AdRequestContext): AdEligibility {
        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isAppOpenPlacementEnabled(context.placement)) {
            return AdEligibility.Blocked(AdSuppressReason.PLACEMENT_DISABLED)
        }
        if (context.privacyState !is AdsPrivacyState.CanRequestAds) {
            return AdEligibility.Blocked(
                if (context.privacyState is AdsPrivacyState.DeniedOrLimited) {
                    AdSuppressReason.PRIVACY_LIMITED
                } else {
                    AdSuppressReason.NO_CONSENT
                },
            )
        }
        if (context.isPremium) return AdEligibility.Blocked(AdSuppressReason.PREMIUM)
        if (context.isRewardedAdFree) return AdEligibility.Blocked(AdSuppressReason.REWARDED_FREE)
        if (context.contentInProgress) return AdEligibility.Blocked(AdSuppressReason.CONTENT_IN_PROGRESS)
        if (context.route?.lowercase() in policy.appOpenRouteBlocklist) {
            return AdEligibility.Blocked(AdSuppressReason.ROUTE_BLOCKED)
        }
        if ((context.resumeGapMs ?: Long.MAX_VALUE) < policy.appOpenResumeGapMs) {
            return AdEligibility.Blocked(AdSuppressReason.RESUME_SPAM)
        }
        val lastShownAtMs = context.lastShownAtMs
        if (lastShownAtMs != null && SystemTimeProvider.nowMillis() - lastShownAtMs < policy.appOpenCooldownMs) {
            return AdEligibility.Blocked(AdSuppressReason.COOLDOWN)
        }
        if (context.sessionCount >= policy.appOpenMaxPerSession) {
            return AdEligibility.Blocked(AdSuppressReason.SESSION_CAP)
        }
        return AdEligibility.Allowed
    }

    fun evaluateRewardedInterstitial(context: AdRequestContext): AdEligibility {
        val policy = adsPolicyProvider.getPolicy()
        if (!policy.isRewardedInterstitialPlacementEnabled(context.placement)) {
            return AdEligibility.Blocked(AdSuppressReason.PLACEMENT_DISABLED)
        }
        if (context.privacyState !is AdsPrivacyState.CanRequestAds) {
            return AdEligibility.Blocked(
                if (context.privacyState is AdsPrivacyState.DeniedOrLimited) {
                    AdSuppressReason.PRIVACY_LIMITED
                } else {
                    AdSuppressReason.NO_CONSENT
                },
            )
        }
        if (context.isPremium) return AdEligibility.Blocked(AdSuppressReason.PREMIUM)
        if (context.isRewardedAdFree) return AdEligibility.Blocked(AdSuppressReason.REWARDED_FREE)
        if (context.contentInProgress) return AdEligibility.Blocked(AdSuppressReason.CONTENT_IN_PROGRESS)
        val lastShownAtMs = context.lastShownAtMs
        if (lastShownAtMs != null && SystemTimeProvider.nowMillis() - lastShownAtMs < policy.rewardedInterstitialMinIntervalMs) {
            return AdEligibility.Blocked(AdSuppressReason.COOLDOWN)
        }
        if (context.sessionCount >= policy.rewardedInterstitialMaxPerSession) {
            return AdEligibility.Blocked(AdSuppressReason.SESSION_CAP)
        }
        return AdEligibility.Allowed
    }
}
