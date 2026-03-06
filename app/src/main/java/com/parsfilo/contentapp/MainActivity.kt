package com.parsfilo.contentapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
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
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.activity.viewModels
import com.parsfilo.contentapp.core.common.NotificationIntentKeys
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.database.model.NotificationEntity
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.designsystem.theme.app_transparent
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationManager
import com.parsfilo.contentapp.monetization.AdOrchestrator
import com.parsfilo.contentapp.navigation.NotificationOpenRequest
import com.parsfilo.contentapp.ui.ContentApp
import com.parsfilo.contentapp.ui.MainViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

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

    private val openNotificationsEventsChannel =
        Channel<NotificationOpenRequest>(capacity = Channel.BUFFERED)
    private val openNotificationsEvents = openNotificationsEventsChannel.receiveAsFlow()

    private val notificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            viewModel.onNotificationPermissionResult(granted)
        }

    private val prayerLocationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { _ ->
            viewModel.onLocationPermissionResult()
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyEdgeToEdge(resolveInitialDarkMode())
        handleNotificationIntent(intent)
        setComposeContentSafely()
        observePermissionPrompts()

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                preferencesDataSource.userData.map { it.darkMode }.distinctUntilChanged()
                    .collect { isDarkMode ->
                        applyEdgeToEdge(isDarkMode)
                    }
            }
        }

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

        if (!shouldOpenNotifications) return

        lifecycleScope.launch {
            val openRequest = resolveNotificationOpenRequest(sourceIntent)
            openNotificationsEventsChannel.trySend(openRequest)
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

    private suspend fun resolveNotificationOpenRequest(sourceIntent: Intent): NotificationOpenRequest {
        val explicitRowId = sourceIntent
            .getLongExtra(NotificationIntentKeys.EXTRA_NOTIFICATION_ROW_ID, -1L)
            .takeIf { it > 0L }
        if (explicitRowId != null) {
            return NotificationOpenRequest(
                target = NotificationOpenRequest.Target.DETAIL,
                notificationRowId = explicitRowId,
            )
        }

        val explicitExternalId = sourceIntent
            .getStringExtra(NotificationIntentKeys.EXTRA_NOTIFICATION_EXTERNAL_ID)
            ?.trim()
            .orEmpty()
        if (explicitExternalId.isNotBlank()) {
            val existing = notificationDao.getByNotificationId(explicitExternalId)
            if (existing != null) {
                return NotificationOpenRequest(
                    target = NotificationOpenRequest.Target.DETAIL,
                    notificationRowId = existing.id,
                )
            }
        }

        val persistedRowId = persistNotificationFromIntentIfPossible(sourceIntent)
        return if (persistedRowId != null) {
            NotificationOpenRequest(
                target = NotificationOpenRequest.Target.DETAIL,
                notificationRowId = persistedRowId,
            )
        } else {
            NotificationOpenRequest(target = NotificationOpenRequest.Target.LIST)
        }
    }

    private suspend fun persistNotificationFromIntentIfPossible(sourceIntent: Intent): Long? {
        val extras = sourceIntent.extras ?: return null

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
            return null
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

        val insertedRowId = notificationDao.insertNotification(
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
        if (insertedRowId > 0L) {
            return insertedRowId
        }
        return notificationDao.getByNotificationId(notificationId)?.id
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

    private fun observePermissionPrompts() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                launch {
                    viewModel.shouldRequestNotificationPermission.collect { shouldRequest ->
                        if (!shouldRequest || Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                            return@collect
                        }

                        val permissionGranted = ContextCompat.checkSelfPermission(
                            this@MainActivity,
                            Manifest.permission.POST_NOTIFICATIONS,
                        ) == PackageManager.PERMISSION_GRANTED

                        if (permissionGranted) {
                            viewModel.onNotificationPermissionResult(granted = true)
                        } else {
                            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                        }
                    }
                }

                launch {
                    viewModel.shouldRequestLocationPermission.collect { shouldRequest ->
                        if (!shouldRequest || !isPrayerTimesFlavor()) {
                            return@collect
                        }

                        val fineGranted = ContextCompat.checkSelfPermission(
                            this@MainActivity,
                            Manifest.permission.ACCESS_FINE_LOCATION,
                        ) == PackageManager.PERMISSION_GRANTED
                        val coarseGranted = ContextCompat.checkSelfPermission(
                            this@MainActivity,
                            Manifest.permission.ACCESS_COARSE_LOCATION,
                        ) == PackageManager.PERMISSION_GRANTED

                        if (fineGranted || coarseGranted) {
                            viewModel.onLocationPermissionResult()
                        } else {
                            prayerLocationPermissionLauncher.launch(
                                arrayOf(
                                    Manifest.permission.ACCESS_FINE_LOCATION,
                                    Manifest.permission.ACCESS_COARSE_LOCATION,
                                )
                            )
                        }
                    }
                }
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

    override fun onPause() {
        adOrchestrator.onAppPaused()
        super.onPause()
    }

    override fun onDestroy() {
        adOrchestrator.destroy()
        super.onDestroy()
    }

    private fun applyEdgeToEdge(isDarkMode: Boolean) {
        val transparent = app_transparent.toArgb()
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
    }

    private fun resolveInitialDarkMode(): Boolean {
        return (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
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
