package com.parsfilo.contentapp.core.firebase.push

import android.content.Context
import android.os.Build
import androidx.core.content.pm.PackageInfoCompat
import com.google.firebase.messaging.FirebaseMessaging
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import timber.log.Timber
import java.util.Locale
import java.util.TimeZone
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

@Singleton
class PushRegistrationManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val firebaseMessaging: FirebaseMessaging,
    private val preferencesDataSource: PreferencesDataSource,
    private val pushRegistrationSender: PushRegistrationSender,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) {
    suspend fun subscribeToTopics(topics: List<String>) = withContext(ioDispatcher) {
        topics.distinct().forEach { topic ->
            if (topic.isBlank()) return@forEach
            runCatching {
                firebaseMessaging.subscribeToTopicSuspend(topic)
            }.onSuccess {
                Timber.i("FCM topic subscribed: %s", topic)
            }.onFailure { throwable ->
                Timber.w(throwable, "FCM topic subscribe failed: %s", topic)
            }
        }
    }

    suspend fun syncRegistration(reason: String, tokenOverride: String? = null): Boolean =
        withContext(ioDispatcher) {
            runCatching {
                val installationId = preferencesDataSource.getOrCreateInstallationId()
                val preferences = preferencesDataSource.userData.first()
                val fcmToken = tokenOverride ?: fetchFcmToken() ?: return@runCatching false
                val payload = PushRegistrationPayload(
                    installationId = installationId,
                    fcmToken = fcmToken,
                    packageName = context.packageName,
                    locale = Locale.getDefault().toLanguageTag(),
                    timezone = TimeZone.getDefault().id,
                    notificationsEnabled = preferences.notificationsEnabled,
                    appVersion = readAppVersion(context),
                    deviceModel = "${Build.MANUFACTURER} ${Build.MODEL}".trim(),
                    reason = reason,
                    syncedAtEpochMs = System.currentTimeMillis(),
                )
                val sent = pushRegistrationSender.send(payload)
                if (sent) {
                    preferencesDataSource.setPushSyncMeta(
                        token = fcmToken,
                        timestamp = payload.syncedAtEpochMs,
                    )
                }
                sent
            }.getOrElse { throwable ->
                Timber.w(throwable, "Push registration sync failed.")
                false
            }
        }

    private suspend fun fetchFcmToken(): String? {
        return runCatching { firebaseMessaging.fetchTokenSuspend() }.onFailure {
            Timber.w(
                it, "Unable to fetch FCM token for push registration."
            )
        }.getOrNull()
    }
}

private fun readAppVersion(context: Context): String {
    return runCatching {
        val pi = context.packageManager.getPackageInfo(context.packageName, 0)
        pi.versionName ?: PackageInfoCompat.getLongVersionCode(pi).toString()
    }.getOrElse { "unknown" }
}

private suspend fun FirebaseMessaging.fetchTokenSuspend(): String =
    suspendCancellableCoroutine { continuation ->
        token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                continuation.resume(task.result)
            } else {
                continuation.resumeWithException(
                    task.exception ?: IllegalStateException("FCM token request failed")
                )
            }
        }
    }

private suspend fun FirebaseMessaging.subscribeToTopicSuspend(topic: String): Unit =
    suspendCancellableCoroutine { continuation ->
        subscribeToTopic(topic).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                continuation.resume(Unit)
            } else {
                continuation.resumeWithException(
                    task.exception ?: IllegalStateException("FCM topic subscribe failed: $topic")
                )
            }
        }
    }
