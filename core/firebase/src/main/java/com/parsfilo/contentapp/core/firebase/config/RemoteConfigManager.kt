package com.parsfilo.contentapp.core.firebase.config

import android.content.Context
import android.content.pm.ApplicationInfo
import com.google.firebase.remoteconfig.FirebaseRemoteConfig
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.suspendCancellableCoroutine
import timber.log.Timber
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

@Singleton
class RemoteConfigManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val remoteConfig: FirebaseRemoteConfig,
) {
    private val settingsApplied = AtomicBoolean(false)

    fun applyClientSettingsIfNeeded() {
        if (settingsApplied.getAndSet(true)) return

        val minimumFetchIntervalSeconds =
            if (isDebugBuild()) DEBUG_MIN_FETCH_INTERVAL_SECONDS else RELEASE_MIN_FETCH_INTERVAL_SECONDS

        remoteConfig.setConfigSettingsAsync(
            FirebaseRemoteConfigSettings.Builder()
                .setMinimumFetchIntervalInSeconds(minimumFetchIntervalSeconds)
                .build(),
        )
        Timber.d(
            "Remote Config settings applied (minFetchIntervalSeconds=%s)",
            minimumFetchIntervalSeconds,
        )
    }

    fun setDefaults(defaults: Map<String, Any>) {
        applyClientSettingsIfNeeded()
        remoteConfig.setDefaultsAsync(defaults)
    }

    suspend fun fetchAndActivate(): Boolean =
        suspendCancellableCoroutine { continuation ->
            applyClientSettingsIfNeeded()
            remoteConfig.fetchAndActivate()
                .addOnSuccessListener { activated ->
                    if (continuation.isActive) {
                        continuation.resume(activated)
                    }
                }
                .addOnFailureListener { throwable ->
                    if (continuation.isActive) {
                        continuation.resumeWithException(throwable)
                    }
                }
        }

    fun fetchAndActivateAsync(
        onSuccess: (Boolean) -> Unit = {},
        onFailure: (Throwable) -> Unit = {},
    ) {
        applyClientSettingsIfNeeded()
        remoteConfig.fetchAndActivate()
            .addOnSuccessListener { activated -> onSuccess(activated) }
            .addOnFailureListener { throwable -> onFailure(throwable) }
    }

    fun getLong(key: String): Long = remoteConfig.getLong(key)

    fun getString(key: String): String = remoteConfig.getString(key)

    fun getAll(keys: List<String>): Map<String, String> =
        keys.associateWith { key -> remoteConfig.getString(key) }

    private fun isDebugBuild(): Boolean =
        (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0

    private companion object {
        private const val DEBUG_MIN_FETCH_INTERVAL_SECONDS = 60L
        private const val RELEASE_MIN_FETCH_INTERVAL_SECONDS = 21_600L
    }
}
