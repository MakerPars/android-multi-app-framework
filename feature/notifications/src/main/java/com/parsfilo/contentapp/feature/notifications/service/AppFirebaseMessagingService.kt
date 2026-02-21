package com.parsfilo.contentapp.feature.notifications.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.parsfilo.contentapp.core.common.NotificationIntentKeys
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.database.model.NotificationEntity
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.logPushReceived
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationManager
import com.parsfilo.contentapp.feature.notifications.R
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@AndroidEntryPoint
class AppFirebaseMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var notificationDao: NotificationDao

    @Inject
    lateinit var analytics: AppAnalytics

    @Inject
    lateinit var pushRegistrationManager: PushRegistrationManager

    @Inject
    lateinit var preferencesDataSource: PreferencesDataSource

    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    companion object {
        private const val CHANNEL_ID = "app_notifications"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val notificationId = remoteMessage.messageId ?: System.currentTimeMillis().toString()
        val title = remoteMessage.notification?.title ?: remoteMessage.data["title"] ?: ""
        val body = remoteMessage.notification?.body ?: remoteMessage.data["body"] ?: ""
        val imageUrl = remoteMessage.notification?.imageUrl?.toString() ?: remoteMessage.data["image"]
        val type = remoteMessage.data["type"]
        val timestamp = remoteMessage.sentTime

        val entity = NotificationEntity(
            notificationId = notificationId,
            title = title,
            body = body,
            imageUrl = imageUrl,
            type = type,
            isRead = false,
            timestamp = if (timestamp > 0) timestamp else System.currentTimeMillis(),
            dataPayloadJson = remoteMessage.data.toString()
        )

        scope.launch {
            notificationDao.insertNotification(entity)
        }

        // Analytics: push_received
        analytics.logPushReceived(type)

        scope.launch {
            if (shouldShowSystemNotification()) {
                showNotification(title, body, notificationId.hashCode())
            } else {
                Timber.d("Skipping system notification (permission/settings disabled).")
            }
        }
    }

    private suspend fun shouldShowSystemNotification(): Boolean {
        val notificationsEnabled = preferencesDataSource.userData.first().notificationsEnabled
        if (!notificationsEnabled) return false
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return true
        return ContextCompat.checkSelfPermission(
            this,
            android.Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun showNotification(title: String, body: String, id: Int) {
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager

        // Create notification channel for Android O+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.notifications_title),
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = getString(R.string.notifications_empty_hint)
            }
            notificationManager.createNotificationChannel(channel)
        }

        // Create intent to open app
        val intent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            action = NotificationIntentKeys.ACTION_OPEN_NOTIFICATIONS
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(NotificationIntentKeys.EXTRA_OPEN_NOTIFICATIONS, true)
        }
        val pendingIntent = intent?.let {
            PendingIntent.getActivity(
                this, 0, it,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )
        }

        // IMPORTANT: Notification small icon must be a solid, monochrome icon.
        // Using the launcher icon may show a warning/exclamation on some OEM skins.
        val smallIconRes = R.drawable.ic_stat_notification

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(smallIconRes)
            .setContentTitle(title.ifBlank { getString(R.string.notifications_title) })
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .apply { pendingIntent?.let { setContentIntent(it) } }
            .build()

        notificationManager.notify(id, notification)
    }

    override fun onNewToken(token: String) {
        scope.launch {
            pushRegistrationManager.syncRegistration(
                reason = "token_refresh",
                tokenOverride = token
            )
        }
    }

    override fun onDestroy() {
        job.cancel()
        super.onDestroy()
    }
}
