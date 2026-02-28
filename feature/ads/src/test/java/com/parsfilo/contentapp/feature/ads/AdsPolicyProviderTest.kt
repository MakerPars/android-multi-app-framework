package com.parsfilo.contentapp.feature.ads

import com.google.common.truth.Truth.assertThat
import com.parsfilo.contentapp.core.firebase.config.RemoteConfigManager
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.runs
import org.junit.Test

class AdsPolicyProviderTest {

    @Test
    fun `getPolicy sanitizes invalid values and parses placement CSV`() {
        val remoteConfigManager = mockRemoteConfig(
            longs = mapOf(
                AdsPolicyProvider.KEY_INTERSTITIAL_FREQUENCY_CAP_MS to 1L, // invalid -> fallback
                AdsPolicyProvider.KEY_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS to 10L, // invalid -> fallback
                AdsPolicyProvider.KEY_APP_OPEN_COOLDOWN_MS to 999_999_999L, // invalid -> fallback
                AdsPolicyProvider.KEY_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS to -1L, // invalid -> fallback
                AdsPolicyProvider.KEY_REWARDED_INTERSTITIAL_MAX_PER_SESSION to 99L, // invalid -> fallback
                AdsPolicyProvider.KEY_NATIVE_POOL_MAX to 0L, // invalid -> fallback
                AdsPolicyProvider.KEY_NATIVE_TTL_MS to 1L, // invalid -> fallback
            ),
            strings = mapOf(
                AdsPolicyProvider.KEY_BANNER_ENABLED to "true",
                AdsPolicyProvider.KEY_NATIVE_ENABLED to "false",
                AdsPolicyProvider.KEY_BANNER_PLACEMENTS_DISABLED_CSV to
                    "banner_home, BANNER_QIBLA, unknown_placement",
                AdsPolicyProvider.KEY_NATIVE_PLACEMENTS_DISABLED_CSV to "NATIVE_FEED_HOME",
                AdsPolicyProvider.KEY_INTERSTITIAL_RELAXED_PACKAGES_CSV to
                    "com.parsfilo.yasinsuresi, com.parsfilo.mucizedualar",
            ),
        )

        val policy = AdsPolicyProvider(remoteConfigManager).getPolicy()

        assertThat(policy.interstitialFrequencyCapMs)
            .isEqualTo(AdsPolicyProvider.DEFAULT_INTERSTITIAL_FREQUENCY_CAP_MS)
        assertThat(policy.interstitialRelaxedFrequencyCapMs)
            .isEqualTo(AdsPolicyProvider.DEFAULT_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS)
        assertThat(policy.appOpenCooldownMs)
            .isEqualTo(AdsPolicyProvider.DEFAULT_APP_OPEN_COOLDOWN_MS)
        assertThat(policy.rewardedInterstitialMinIntervalMs)
            .isEqualTo(AdsPolicyProvider.DEFAULT_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS)
        assertThat(policy.rewardedInterstitialMaxPerSession)
            .isEqualTo(AdsPolicyProvider.DEFAULT_REWARDED_INTERSTITIAL_MAX_PER_SESSION)
        assertThat(policy.nativePoolMax).isEqualTo(AdsPolicyProvider.DEFAULT_NATIVE_POOL_MAX)
        assertThat(policy.nativeTtlMs).isEqualTo(AdsPolicyProvider.DEFAULT_NATIVE_TTL_MS)

        assertThat(policy.bannerEnabled).isTrue()
        assertThat(policy.nativeEnabled).isFalse()
        assertThat(policy.bannerPlacementsDisabled)
            .containsExactly(
                AdPlacement.BANNER_HOME.analyticsValue,
                AdPlacement.BANNER_QIBLA.analyticsValue,
            )
        assertThat(policy.nativePlacementsDisabled)
            .containsExactly(AdPlacement.NATIVE_FEED_HOME.analyticsValue)
        assertThat(policy.interstitialRelaxedPackages)
            .containsExactly("com.parsfilo.yasinsuresi", "com.parsfilo.mucizedualar")
    }

    @Test
    fun `getPolicy keeps valid values in range`() {
        val remoteConfigManager = mockRemoteConfig(
            longs = mapOf(
                AdsPolicyProvider.KEY_INTERSTITIAL_FREQUENCY_CAP_MS to 180_000L,
                AdsPolicyProvider.KEY_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS to 360_000L,
                AdsPolicyProvider.KEY_APP_OPEN_COOLDOWN_MS to 300_000L,
                AdsPolicyProvider.KEY_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS to 1_200_000L,
                AdsPolicyProvider.KEY_REWARDED_INTERSTITIAL_MAX_PER_SESSION to 3L,
                AdsPolicyProvider.KEY_NATIVE_POOL_MAX to 3L,
                AdsPolicyProvider.KEY_NATIVE_TTL_MS to 2_400_000L,
            ),
            strings = mapOf(
                AdsPolicyProvider.KEY_BANNER_ENABLED to "false",
                AdsPolicyProvider.KEY_NATIVE_ENABLED to "true",
                AdsPolicyProvider.KEY_BANNER_PLACEMENTS_DISABLED_CSV to "",
                AdsPolicyProvider.KEY_NATIVE_PLACEMENTS_DISABLED_CSV to "native_feed_zikir",
                AdsPolicyProvider.KEY_INTERSTITIAL_RELAXED_PACKAGES_CSV to "com.parsfilo.zikirmatik",
            ),
        )

        val policy = AdsPolicyProvider(remoteConfigManager).getPolicy()

        assertThat(policy.interstitialFrequencyCapMs).isEqualTo(180_000L)
        assertThat(policy.interstitialRelaxedFrequencyCapMs).isEqualTo(360_000L)
        assertThat(policy.appOpenCooldownMs).isEqualTo(300_000L)
        assertThat(policy.rewardedInterstitialMinIntervalMs).isEqualTo(1_200_000L)
        assertThat(policy.rewardedInterstitialMaxPerSession).isEqualTo(3)
        assertThat(policy.nativePoolMax).isEqualTo(3)
        assertThat(policy.nativeTtlMs).isEqualTo(2_400_000L)
        assertThat(policy.bannerEnabled).isFalse()
        assertThat(policy.nativeEnabled).isTrue()
        assertThat(policy.nativePlacementsDisabled)
            .containsExactly(AdPlacement.NATIVE_FEED_ZIKIR.analyticsValue)
        assertThat(policy.interstitialFrequencyCapForPackage("com.parsfilo.zikirmatik"))
            .isEqualTo(360_000L)
        assertThat(policy.interstitialFrequencyCapForPackage("com.parsfilo.kible"))
            .isEqualTo(180_000L)
    }

    private fun mockRemoteConfig(
        longs: Map<String, Long>,
        strings: Map<String, String>,
    ): RemoteConfigManager {
        val remoteConfigManager = mockk<RemoteConfigManager>()
        every { remoteConfigManager.setDefaults(any()) } just runs
        every { remoteConfigManager.getLong(any()) } answers { longs[firstArg()] ?: 0L }
        every { remoteConfigManager.getString(any()) } answers { strings[firstArg()] ?: "" }
        return remoteConfigManager
    }
}
