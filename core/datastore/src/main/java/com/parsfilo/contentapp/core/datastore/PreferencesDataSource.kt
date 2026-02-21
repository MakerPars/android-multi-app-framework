package com.parsfilo.contentapp.core.datastore

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.util.UUID
import javax.inject.Inject

class PreferencesDataSource @Inject constructor(
    private val userPreferences: DataStore<Preferences>
) {
    val otherAppsBadgeSeenSignature: Flow<String> = userPreferences.data.map { preferences ->
        preferences[PreferencesKeys.OTHER_APPS_BADGE_SEEN_SIGNATURE] ?: ""
    }

    val userData: Flow<UserPreferencesData> = userPreferences.data.map { preferences ->
        UserPreferencesData(
            darkMode = preferences[PreferencesKeys.DARK_MODE] ?: false,
            displayMode = preferences[PreferencesKeys.DISPLAY_MODE] ?: "ARABIC",
            fontSize = preferences[PreferencesKeys.FONT_SIZE] ?: 20,
            isPremium = preferences[PreferencesKeys.IS_PREMIUM] ?: false,
            lastAppOpenAdShown = preferences[PreferencesKeys.LAST_APP_OPEN_AD] ?: 0L,
            rewardedAdFreeUntil = preferences[PreferencesKeys.REWARDED_AD_FREE_UNTIL] ?: 0L,
            rewardWatchCount = preferences[PreferencesKeys.REWARD_WATCH_COUNT] ?: 0,
            lastInterstitialShown = preferences[PreferencesKeys.LAST_INTERSTITIAL_SHOWN] ?: 0L,
            notificationsEnabled = preferences[PreferencesKeys.NOTIFICATIONS_ENABLED] ?: true,
            notificationPermissionPrompted = preferences[PreferencesKeys.NOTIFICATION_PERMISSION_PROMPTED] ?: false,
            installationId = preferences[PreferencesKeys.INSTALLATION_ID] ?: "",
            lastPushSyncAt = preferences[PreferencesKeys.LAST_PUSH_SYNC_AT] ?: 0L,
            lastPushToken = preferences[PreferencesKeys.LAST_PUSH_TOKEN] ?: ""
        )
    }

    suspend fun setDarkMode(darkMode: Boolean) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.DARK_MODE] = darkMode
        }
    }

    suspend fun setDisplayMode(mode: String) {
        userPreferences.edit { preferences ->
            // Validate the mode string matches an enum value
            val validMode = try {
                com.parsfilo.contentapp.core.model.DisplayMode.valueOf(mode)
                mode
            } catch (e: IllegalArgumentException) {
                "ARABIC"
            }
            preferences[PreferencesKeys.DISPLAY_MODE] = validMode
        }
    }

    suspend fun setFontSize(size: Int) {
         userPreferences.edit { preferences ->
            preferences[PreferencesKeys.FONT_SIZE] = size
        }
    }

    suspend fun setPremium(isPremium: Boolean) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.IS_PREMIUM] = isPremium
        }
    }

    suspend fun setLastAppOpenAdShown(timestamp: Long) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.LAST_APP_OPEN_AD] = timestamp
        }
    }

    suspend fun setRewardedAdFreeUntil(timestamp: Long) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.REWARDED_AD_FREE_UNTIL] = timestamp
        }
    }

    suspend fun setRewardWatchCount(count: Int) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.REWARD_WATCH_COUNT] = count
        }
    }

    suspend fun setLastInterstitialShown(timestamp: Long) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.LAST_INTERSTITIAL_SHOWN] = timestamp
        }
    }

    suspend fun setNotificationsEnabled(enabled: Boolean) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.NOTIFICATIONS_ENABLED] = enabled
        }
    }

    suspend fun setNotificationPermissionPrompted(prompted: Boolean) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.NOTIFICATION_PERMISSION_PROMPTED] = prompted
        }
    }

    suspend fun getOrCreateInstallationId(): String {
        var installationId = ""
        userPreferences.edit { preferences ->
            val existing = preferences[PreferencesKeys.INSTALLATION_ID]
            installationId = if (existing.isNullOrBlank()) {
                UUID.randomUUID().toString().also { generated ->
                    preferences[PreferencesKeys.INSTALLATION_ID] = generated
                }
            } else {
                existing
            }
        }
        return installationId
    }

    suspend fun setPushSyncMeta(token: String, timestamp: Long = System.currentTimeMillis()) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.LAST_PUSH_TOKEN] = token
            preferences[PreferencesKeys.LAST_PUSH_SYNC_AT] = timestamp
        }
    }

    suspend fun setOtherAppsBadgeSeenSignature(signature: String) {
        userPreferences.edit { preferences ->
            preferences[PreferencesKeys.OTHER_APPS_BADGE_SEEN_SIGNATURE] = signature
        }
    }

    private object PreferencesKeys {
        val DARK_MODE = booleanPreferencesKey("dark_mode")
        val DISPLAY_MODE = stringPreferencesKey("display_mode")
        val FONT_SIZE = intPreferencesKey("font_size")
        val IS_PREMIUM = booleanPreferencesKey("is_premium")
        val LAST_APP_OPEN_AD = longPreferencesKey("last_app_open_ad")
        val REWARDED_AD_FREE_UNTIL = longPreferencesKey("rewarded_ad_free_until")
        val REWARD_WATCH_COUNT = intPreferencesKey("reward_watch_count")
        val LAST_INTERSTITIAL_SHOWN = longPreferencesKey("last_interstitial_shown")
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
        val NOTIFICATION_PERMISSION_PROMPTED = booleanPreferencesKey("notification_permission_prompted")
        val INSTALLATION_ID = stringPreferencesKey("installation_id")
        val LAST_PUSH_SYNC_AT = longPreferencesKey("last_push_sync_at")
        val LAST_PUSH_TOKEN = stringPreferencesKey("last_push_token")
        val OTHER_APPS_BADGE_SEEN_SIGNATURE = stringPreferencesKey("other_apps_badge_seen_signature")
    }
}

data class UserPreferencesData(
    val darkMode: Boolean,
    val displayMode: String,
    val fontSize: Int,
    val isPremium: Boolean,
    val lastAppOpenAdShown: Long,
    val rewardedAdFreeUntil: Long,
    val rewardWatchCount: Int,
    val lastInterstitialShown: Long,
    val notificationsEnabled: Boolean,
    val notificationPermissionPrompted: Boolean = false,
    val installationId: String = "",
    val lastPushSyncAt: Long = 0L,
    val lastPushToken: String = ""
)
