package com.parsfilo.contentapp.feature.ads

import com.parsfilo.contentapp.core.firebase.config.RemoteConfigManager
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdsPolicyProvider @Inject constructor(
    private val remoteConfigManager: RemoteConfigManager,
) {
    init {
        remoteConfigManager.setDefaults(DEFAULTS)
    }

    fun getPolicy(): AdsPolicyConfig {
        val interstitialFrequencyCapMs = sanitizeLong(
            remoteConfigManager.getLong(KEY_INTERSTITIAL_FREQUENCY_CAP_MS),
            min = 60_000L,
            max = 60 * 60 * 1000L,
            fallback = DEFAULT_INTERSTITIAL_FREQUENCY_CAP_MS,
        )
        val appOpenCooldownMs = sanitizeLong(
            remoteConfigManager.getLong(KEY_APP_OPEN_COOLDOWN_MS),
            min = 60_000L,
            max = 60 * 60 * 1000L,
            fallback = DEFAULT_APP_OPEN_COOLDOWN_MS,
        )
        val interstitialRelaxedFrequencyCapMs = sanitizeLong(
            remoteConfigManager.getLong(KEY_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS),
            min = 60_000L,
            max = 60 * 60 * 1000L,
            fallback = DEFAULT_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS,
        )
        val rewardedInterstitialMinIntervalMs = sanitizeLong(
            remoteConfigManager.getLong(KEY_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS),
            min = 0L,
            max = 24 * 60 * 60 * 1000L,
            fallback = DEFAULT_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS,
        )
        val rewardedInterstitialMaxPerSession = sanitizeInt(
            remoteConfigManager.getLong(KEY_REWARDED_INTERSTITIAL_MAX_PER_SESSION).toInt(),
            min = 0,
            max = 10,
            fallback = DEFAULT_REWARDED_INTERSTITIAL_MAX_PER_SESSION,
        )
        val bannerEnabled = parseBoolean(
            remoteConfigManager.getString(KEY_BANNER_ENABLED),
            DEFAULT_BANNER_ENABLED,
        )
        val nativeEnabled = parseBoolean(
            remoteConfigManager.getString(KEY_NATIVE_ENABLED),
            DEFAULT_NATIVE_ENABLED,
        )
        val nativePoolMax = sanitizeInt(
            remoteConfigManager.getLong(KEY_NATIVE_POOL_MAX).toInt(),
            min = 1,
            max = 4,
            fallback = DEFAULT_NATIVE_POOL_MAX,
        )
        val nativeTtlMs = sanitizeLong(
            remoteConfigManager.getLong(KEY_NATIVE_TTL_MS),
            min = 5 * 60 * 1000L,
            max = 6 * 60 * 60 * 1000L,
            fallback = DEFAULT_NATIVE_TTL_MS,
        )

        val bannerPlacementsDisabled = parsePlacementCsv(
            remoteConfigManager.getString(KEY_BANNER_PLACEMENTS_DISABLED_CSV),
            format = AdFormat.BANNER,
        )
        val nativePlacementsDisabled = parsePlacementCsv(
            remoteConfigManager.getString(KEY_NATIVE_PLACEMENTS_DISABLED_CSV),
            format = AdFormat.NATIVE,
        )
        val interstitialRelaxedPackages = parsePackageCsv(
            remoteConfigManager.getString(KEY_INTERSTITIAL_RELAXED_PACKAGES_CSV),
        )

        return AdsPolicyConfig(
            interstitialFrequencyCapMs = interstitialFrequencyCapMs,
            interstitialRelaxedFrequencyCapMs = interstitialRelaxedFrequencyCapMs,
            interstitialRelaxedPackages = interstitialRelaxedPackages,
            appOpenCooldownMs = appOpenCooldownMs,
            rewardedInterstitialMinIntervalMs = rewardedInterstitialMinIntervalMs,
            rewardedInterstitialMaxPerSession = rewardedInterstitialMaxPerSession,
            bannerEnabled = bannerEnabled,
            nativeEnabled = nativeEnabled,
            bannerPlacementsDisabled = bannerPlacementsDisabled,
            nativePlacementsDisabled = nativePlacementsDisabled,
            nativePoolMax = nativePoolMax,
            nativeTtlMs = nativeTtlMs,
        )
    }

    private fun parsePlacementCsv(value: String, format: AdFormat): Set<String> {
        if (value.isBlank()) return emptySet()
        val disabled = linkedSetOf<String>()
        value.split(',')
            .asSequence()
            .map { it.trim() }
            .filter { it.isNotBlank() }
            .forEach { raw ->
                val normalized = raw.lowercase()
                val placement = AdPlacement.entries.firstOrNull { candidate ->
                    candidate.format == format && (
                        candidate.analyticsValue.equals(normalized, ignoreCase = true) ||
                            candidate.name.equals(raw, ignoreCase = true) ||
                            candidate.resourceName.equals(raw, ignoreCase = true)
                        )
                }
                if (placement != null) {
                    disabled += placement.analyticsValue
                } else {
                    Timber.w("Unknown %s placement in RC CSV: %s", format.analyticsValue, raw)
                }
            }
        return disabled
    }

    private fun parseBoolean(value: String?, default: Boolean): Boolean =
        when (value?.trim()?.lowercase()) {
            "1", "true", "yes", "on" -> true
            "0", "false", "no", "off" -> false
            null, "" -> default
            else -> {
                Timber.w("Invalid RC boolean value=%s, fallback=%s", value, default)
                default
            }
        }

    private fun parsePackageCsv(value: String): Set<String> {
        if (value.isBlank()) return emptySet()
        return value.split(',')
            .asSequence()
            .map { it.trim() }
            .filter { it.isNotBlank() }
            .toSet()
    }

    private fun sanitizeLong(value: Long, min: Long, max: Long, fallback: Long): Long =
        value.takeIf { it in min..max } ?: fallback

    private fun sanitizeInt(value: Int, min: Int, max: Int, fallback: Int): Int =
        value.takeIf { it in min..max } ?: fallback

    companion object {
        const val KEY_BANNER_ENABLED = "ads_banner_enabled"
        const val KEY_NATIVE_ENABLED = "ads_native_enabled"
        const val KEY_INTERSTITIAL_FREQUENCY_CAP_MS = "ads_interstitial_frequency_cap_ms"
        const val KEY_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS =
            "ads_interstitial_relaxed_frequency_cap_ms"
        const val KEY_INTERSTITIAL_RELAXED_PACKAGES_CSV =
            "ads_interstitial_relaxed_packages_csv"
        const val KEY_APP_OPEN_COOLDOWN_MS = "ads_app_open_cooldown_ms"
        const val KEY_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS =
            "ads_rewarded_interstitial_min_interval_ms"
        const val KEY_REWARDED_INTERSTITIAL_MAX_PER_SESSION =
            "ads_rewarded_interstitial_max_per_session"
        const val KEY_NATIVE_POOL_MAX = "ads_native_pool_max"
        const val KEY_NATIVE_TTL_MS = "ads_native_ttl_ms"
        const val KEY_BANNER_PLACEMENTS_DISABLED_CSV = "ads_banner_placements_disabled_csv"
        const val KEY_NATIVE_PLACEMENTS_DISABLED_CSV = "ads_native_placements_disabled_csv"

        const val DEFAULT_BANNER_ENABLED = true
        const val DEFAULT_NATIVE_ENABLED = true
        const val DEFAULT_INTERSTITIAL_FREQUENCY_CAP_MS = 150_000L
        const val DEFAULT_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS = 240_000L
        const val DEFAULT_APP_OPEN_COOLDOWN_MS = 240_000L
        const val DEFAULT_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS = 900_000L
        const val DEFAULT_REWARDED_INTERSTITIAL_MAX_PER_SESSION = 2
        const val DEFAULT_NATIVE_POOL_MAX = 2
        const val DEFAULT_NATIVE_TTL_MS = 1_800_000L

        private val DEFAULTS = mapOf<String, Any>(
            KEY_BANNER_ENABLED to DEFAULT_BANNER_ENABLED,
            KEY_NATIVE_ENABLED to DEFAULT_NATIVE_ENABLED,
            KEY_INTERSTITIAL_FREQUENCY_CAP_MS to DEFAULT_INTERSTITIAL_FREQUENCY_CAP_MS,
            KEY_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS to DEFAULT_INTERSTITIAL_RELAXED_FREQUENCY_CAP_MS,
            KEY_INTERSTITIAL_RELAXED_PACKAGES_CSV to "",
            KEY_APP_OPEN_COOLDOWN_MS to DEFAULT_APP_OPEN_COOLDOWN_MS,
            KEY_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS to DEFAULT_REWARDED_INTERSTITIAL_MIN_INTERVAL_MS,
            KEY_REWARDED_INTERSTITIAL_MAX_PER_SESSION to DEFAULT_REWARDED_INTERSTITIAL_MAX_PER_SESSION.toLong(),
            KEY_NATIVE_POOL_MAX to DEFAULT_NATIVE_POOL_MAX.toLong(),
            KEY_NATIVE_TTL_MS to DEFAULT_NATIVE_TTL_MS,
            KEY_BANNER_PLACEMENTS_DISABLED_CSV to "",
            KEY_NATIVE_PLACEMENTS_DISABLED_CSV to "",
        )
    }
}
