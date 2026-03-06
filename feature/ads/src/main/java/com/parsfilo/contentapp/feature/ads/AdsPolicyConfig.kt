package com.parsfilo.contentapp.feature.ads

data class AdsPolicyConfig(
    val interstitialFrequencyCapMs: Long,
    val interstitialRelaxedFrequencyCapMs: Long,
    val interstitialRelaxedPackages: Set<String>,
    val appOpenCooldownMs: Long,
    val appOpenResumeGapMs: Long,
    val appOpenMaxPerSession: Int,
    val interstitialMaxPerSession: Int,
    val rewardedInterstitialMinIntervalMs: Long,
    val rewardedInterstitialMaxPerSession: Int,
    val rewardedInterstitialIntroRequired: Boolean,
    val appOpenEnabled: Boolean,
    val interstitialEnabled: Boolean,
    val bannerEnabled: Boolean,
    val nativeEnabled: Boolean,
    val rewardedEnabled: Boolean,
    val rewardedInterstitialEnabled: Boolean,
    val appOpenPlacementsDisabled: Set<String>,
    val interstitialPlacementsDisabled: Set<String>,
    val bannerPlacementsDisabled: Set<String>,
    val nativePlacementsDisabled: Set<String>,
    val rewardedPlacementsDisabled: Set<String>,
    val rewardedInterstitialPlacementsDisabled: Set<String>,
    val appOpenRouteBlocklist: Set<String>,
    val interstitialRouteBlocklist: Set<String>,
    val nativePoolMax: Int,
    val nativeTtlMs: Long,
) {
    fun interstitialFrequencyCapForPackage(packageName: String): Long =
        if (packageName in interstitialRelaxedPackages) {
            interstitialRelaxedFrequencyCapMs
        } else {
            interstitialFrequencyCapMs
        }

    fun isBannerPlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isInterstitialPlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isNativePlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isAppOpenPlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isRewardedPlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isRewardedInterstitialPlacementEnabled(placement: AdPlacement): Boolean =
        isPlacementEnabled(placement)

    fun isPlacementEnabled(placement: AdPlacement): Boolean {
        val disabledSet = when (placement.format) {
            AdFormat.APP_OPEN -> appOpenPlacementsDisabled
            AdFormat.INTERSTITIAL -> interstitialPlacementsDisabled
            AdFormat.BANNER -> bannerPlacementsDisabled
            AdFormat.NATIVE -> nativePlacementsDisabled
            AdFormat.REWARDED -> rewardedPlacementsDisabled
            AdFormat.REWARDED_INTERSTITIAL -> rewardedInterstitialPlacementsDisabled
        }
        if (placement.analyticsValue in disabledSet) return false
        return when (placement.format) {
            AdFormat.APP_OPEN -> appOpenEnabled
            AdFormat.INTERSTITIAL -> interstitialEnabled
            AdFormat.BANNER -> bannerEnabled
            AdFormat.NATIVE -> nativeEnabled
            AdFormat.REWARDED -> rewardedEnabled
            AdFormat.REWARDED_INTERSTITIAL -> rewardedInterstitialEnabled
        }
    }
}
