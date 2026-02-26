package com.parsfilo.contentapp.feature.ads

data class AdsPolicyConfig(
    val interstitialFrequencyCapMs: Long,
    val appOpenCooldownMs: Long,
    val rewardedInterstitialMinIntervalMs: Long,
    val rewardedInterstitialMaxPerSession: Int,
    val bannerEnabled: Boolean,
    val nativeEnabled: Boolean,
    val bannerPlacementsDisabled: Set<String>,
    val nativePlacementsDisabled: Set<String>,
    val nativePoolMax: Int,
    val nativeTtlMs: Long,
) {
    fun isBannerPlacementEnabled(placement: AdPlacement): Boolean =
        bannerEnabled && placement.analyticsValue !in bannerPlacementsDisabled

    fun isNativePlacementEnabled(placement: AdPlacement): Boolean =
        nativeEnabled && placement.analyticsValue !in nativePlacementsDisabled
}

