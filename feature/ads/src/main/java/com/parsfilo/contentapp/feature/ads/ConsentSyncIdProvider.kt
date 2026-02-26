package com.parsfilo.contentapp.feature.ads

import android.content.Context
import com.google.android.gms.appset.AppSet
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.tasks.await
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ConsentSyncIdProvider @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val mutex = Mutex()

    @Volatile
    private var cachedSyncId: String? = null

    @Volatile
    private var fetchAttempted = false

    suspend fun getConsentSyncIdOrNull(): String? {
        cachedSyncId?.let { return it }
        if (fetchAttempted) return null

        return mutex.withLock {
            cachedSyncId?.let { return it }
            if (fetchAttempted) return null

            fetchAttempted = true
            runCatching {
                val info = AppSet.getClient(context).appSetIdInfo.await()
                info.id.trim()
            }
                .onSuccess { id ->
                    if (id.isNotBlank()) {
                        cachedSyncId = id
                        Timber.d("Consent sync ID available via App Set ID")
                    } else {
                        Timber.w("App Set ID returned blank consent sync id")
                    }
                }
                .onFailure { error ->
                    Timber.w(error, "Failed to fetch App Set ID for consent sync")
                }

            cachedSyncId
        }
    }
}

