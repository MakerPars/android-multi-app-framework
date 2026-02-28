package com.parsfilo.contentapp.feature.ads

data class AdsPolicyConfig(
    val interstitialFrequencyCapMs: Long,
    val interstitialRelaxedFrequencyCapMs: Long,
    val interstitialRelaxedPackages: Set<String>,
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
    fun interstitialFrequencyCapForPackage(packageName: String): Long =
        if (packageName in interstitialRelaxedPackages) {
            interstitialRelaxedFrequencyCapMs
        } else {
            interstitialFrequencyCapMs
        }

    fun isBannerPlacementEnabled(placement: AdPlacement): Boolean =
        bannerEnabled && placement.analyticsValue !in bannerPlacementsDisabled

    fun isNativePlacementEnabled(placement: AdPlacement): Boolean =
        nativeEnabled && placement.analyticsValue !in nativePlacementsDisabled
}
