package com.parsfilo.contentapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.ComposeView
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.parsfilo.contentapp.core.common.NotificationIntentKeys
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.database.model.NotificationEntity
import com.parsfilo.contentapp.core.datastore.PrayerPreferencesDataSource
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.designsystem.theme.app_transparent
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationManager
import com.parsfilo.contentapp.monetization.AdOrchestrator
import com.parsfilo.contentapp.ui.ContentApp
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject
    lateinit var adOrchestrator: AdOrchestrator

    @Inject
    lateinit var preferencesDataSource: PreferencesDataSource

    @Inject
    lateinit var pushRegistrationManager: PushRegistrationManager

    @Inject
    lateinit var notificationDao: NotificationDao

    @Inject
    lateinit var appAnalytics: AppAnalytics

    @Inject
    lateinit var prayerPreferencesDataSource: PrayerPreferencesDataSource

    private val openNotificationsEvents = MutableSharedFlow<Unit>(extraBufferCapacity = 1)

    private val notificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            lifecycleScope.launch {
                preferencesDataSource.setNotificationPermissionPrompted(true)
                if (!granted) {
                    preferencesDataSource.setNotificationsEnabled(false)
                }
                pushRegistrationManager.syncRegistration("permission_result")
            }
        }

    private val prayerLocationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { _ ->
            lifecycleScope.launch {
                prayerPreferencesDataSource.setLocationPermissionPrompted(true)
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleNotificationIntent(intent)

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                preferencesDataSource.userData.map { it.darkMode }.distinctUntilChanged()
                    .collect { isDarkMode ->
                        applyEdgeToEdgeSafely(isDarkMode)
                    }
            }
        }

        setComposeContentSafely()

        requestNotificationPermissionIfNeeded()
        requestPrayerLocationPermissionIfNeeded()

        lifecycleScope.launch {
            pushRegistrationManager.syncRegistration("app_start")
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                preferencesDataSource.userData.map { it.notificationsEnabled }
                    .distinctUntilChanged().collect {
                        pushRegistrationManager.syncRegistration("notification_setting_changed")
                    }
            }
        }

        // Initialize Ads & Billing (off main thread logic handled in orchestrator)
        window.decorView.post {
            adOrchestrator.initialize(this, lifecycleScope)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleNotificationIntent(intent)
    }

    private fun handleNotificationIntent(sourceIntent: Intent?) {
        if (sourceIntent == null) return

        val shouldOpenNotifications = sourceIntent.getBooleanExtra(
            NotificationIntentKeys.EXTRA_OPEN_NOTIFICATIONS, false
        ) || sourceIntent.action == NotificationIntentKeys.ACTION_OPEN_NOTIFICATIONS || isPotentialFcmIntent(
            sourceIntent
        )

        lifecycleScope.launch {
            if (shouldOpenNotifications) {
                persistNotificationFromIntentIfPossible(sourceIntent)
            }
        }

        if (shouldOpenNotifications) {
            openNotificationsEvents.tryEmit(Unit)
        }
    }

    private fun isPotentialFcmIntent(sourceIntent: Intent): Boolean {
        val extras = sourceIntent.extras ?: return false
        val keys = extras.keySet()
        return keys.any { key ->
            key.startsWith("google.") || key.startsWith("gcm.") || key in setOf(
                "from", "collapse_key", "message_id", "title", "body", "image", "type"
            )
        }
    }

    private suspend fun persistNotificationFromIntentIfPossible(sourceIntent: Intent) {
        val extras = sourceIntent.extras ?: return

        val hasFcmMarkers = extras.keySet().any { key ->
            key.startsWith("google.") || key.startsWith("gcm.") || key == "from"
        }

        val title = extras.getString("gcm.notification.title") ?: extras.getString("gcm.n.title")
        ?: extras.getString("title") ?: extras.getString("google.c.a.c_l")
        ?: getString(R.string.notifications_title)

        val body = extras.getString("gcm.notification.body") ?: extras.getString("gcm.n.body")
        ?: extras.getString("body") ?: ""

        val type = extras.getString("type")
        val imageUrl = extras.getString("gcm.notification.image") ?: extras.getString("image")

        if (!hasFcmMarkers && title == getString(R.string.notifications_title) && body.isBlank()) {
            return
        }

        val notificationId =
            extras.getString("google.message_id") ?: extras.getString("gcm.message_id")
            ?: extras.getString("message_id") ?: run {
                val signature = extras.keySet().sorted()
                    .joinToString("|") { key -> "$key=${extras.getValueAsString(key)}" }
                "tap_${signature.hashCode()}"
            }

        val payloadJson = JSONObject().apply {
            extras.keySet().sorted().forEach { key ->
                put(key, extras.getValueAsString(key) ?: JSONObject.NULL)
            }
        }.toString()

        notificationDao.insertNotification(
            NotificationEntity(
                notificationId = notificationId,
                title = title,
                body = body,
                imageUrl = imageUrl,
                type = type,
                isRead = false,
                timestamp = System.currentTimeMillis(),
                dataPayloadJson = payloadJson
            )
        )
    }

    private fun setComposeContentSafely() {
        try {
            setContent {
                ContentApp(
                    openNotificationsEvents = openNotificationsEvents,
                    appAnalytics = appAnalytics,
                    onPrivacyOptionsUpdated = {
                        adOrchestrator.refreshConsent(
                            activity = this@MainActivity,
                            scope = lifecycleScope,
                        )
                    },
                )
            }
        } catch (_: NullPointerException) {
            // OEM-specific Window/content initialization bug fallback.
            val composeView = ComposeView(this).apply {
                setContent {
                    ContentApp(
                        openNotificationsEvents = openNotificationsEvents,
                        appAnalytics = appAnalytics,
                        onPrivacyOptionsUpdated = {
                            adOrchestrator.refreshConsent(
                                activity = this@MainActivity,
                                scope = lifecycleScope,
                            )
                        },
                    )
                }
            }
            setContentView(composeView)
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return

        lifecycleScope.launch {
            val permissionGranted = ContextCompat.checkSelfPermission(
                this@MainActivity, Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED

            val wasPrompted = preferencesDataSource.userData.first().notificationPermissionPrompted

            if (!permissionGranted && !wasPrompted) {
                preferencesDataSource.setNotificationPermissionPrompted(true)
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    private fun requestPrayerLocationPermissionIfNeeded() {
        if (!isPrayerTimesFlavor()) return

        lifecycleScope.launch {
            val fineGranted = ContextCompat.checkSelfPermission(
                this@MainActivity,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
            val coarseGranted = ContextCompat.checkSelfPermission(
                this@MainActivity,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val alreadyGranted = fineGranted || coarseGranted
            val wasPrompted = prayerPreferencesDataSource.preferences.first().locationPermissionPrompted

            if (alreadyGranted) {
                return@launch
            }

            if (!wasPrompted) {
                prayerPreferencesDataSource.setLocationPermissionPrompted(true)
                prayerLocationPermissionLauncher.launch(
                    arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION,
                    )
                )
            }
        }
    }

    private fun isPrayerTimesFlavor(): Boolean {
        return BuildConfig.IS_PRAYER_TIMES_FLAVOR
    }

    override fun onResume() {
        super.onResume()
        lifecycleScope.launch {
            adOrchestrator.showAppOpenAdIfEligible(this@MainActivity)
        }
    }

    override fun onDestroy() {
        adOrchestrator.destroy()
        super.onDestroy()
    }

    private fun applyEdgeToEdgeSafely(isDarkMode: Boolean) {
        val transparent = app_transparent.toArgb()
        try {
            enableEdgeToEdge(
                statusBarStyle = if (isDarkMode) {
                    SystemBarStyle.dark(scrim = transparent)
                } else {
                    SystemBarStyle.light(
                        scrim = transparent,
                        darkScrim = transparent,
                    )
                },
                navigationBarStyle = if (isDarkMode) {
                    SystemBarStyle.dark(scrim = transparent)
                } else {
                    SystemBarStyle.light(
                        scrim = transparent,
                        darkScrim = transparent,
                    )
                },
            )
        } catch (_: UnsupportedOperationException) {
            fallbackEdgeToEdge(isDarkMode)
        } catch (_: IllegalArgumentException) {
            fallbackEdgeToEdge(isDarkMode)
        }
    }

    private fun fallbackEdgeToEdge(isDarkMode: Boolean) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowCompat.getInsetsController(window, window.decorView).let { controller ->
            controller.isAppearanceLightStatusBars = !isDarkMode
            controller.isAppearanceLightNavigationBars = !isDarkMode
        }
    }
}

/**
 * Bundle.get(String) / extras.get(key) deprecated uyarısını tamamen kaldırmak için
 * değerleri tip denemeleriyle (try/catch yerine runCatching) okuyoruz.
 */
private fun Bundle.getValueAsString(key: String): String? {
    if (!containsKey(key)) return null

    var resolved: String? = null

    // En yaygın: String / CharSequence
    resolved = resolved ?: runCatching { getString(key) }.getOrNull()
    resolved = resolved ?: runCatching { getCharSequence(key) }.getOrNull()?.toString()

    // Primitive'ler
    resolved = resolved ?: runCatching { getInt(key) }.getOrNull()?.toString()
    resolved = resolved ?: runCatching { getLong(key) }.getOrNull()?.toString()
    resolved = resolved ?: runCatching { getBoolean(key) }.getOrNull()?.toString()
    resolved = resolved ?: runCatching { getDouble(key) }.getOrNull()?.toString()
    resolved = resolved ?: runCatching { getFloat(key) }.getOrNull()?.toString()

    // Array/StringArray
    resolved = resolved ?: runCatching {
        getStringArray(key)?.joinToString(prefix = "[", postfix = "]")
    }.getOrNull()
    resolved = resolved ?: runCatching {
        getIntArray(key)?.joinToString(prefix = "[", postfix = "]")
    }.getOrNull()
    resolved = resolved ?: runCatching {
        getLongArray(key)?.joinToString(prefix = "[", postfix = "]")
    }.getOrNull()

    return resolved
}



