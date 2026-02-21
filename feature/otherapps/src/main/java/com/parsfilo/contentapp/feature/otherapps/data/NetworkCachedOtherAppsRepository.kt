package com.parsfilo.contentapp.feature.otherapps.data

import android.content.Context
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import com.parsfilo.contentapp.feature.otherapps.model.OtherApp
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONException
import timber.log.Timber
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NetworkCachedOtherAppsRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) : OtherAppsRepository {

    private val _apps = MutableStateFlow<List<OtherApp>>(emptyList())
    override val apps: StateFlow<List<OtherApp>> = _apps.asStateFlow()

    private val cacheFile by lazy { File(context.filesDir, CACHE_FILE_NAME) }
    private val currentPackageName by lazy { context.packageName }
    private val refreshMutex = Mutex()

    override suspend fun refreshIfNeeded(force: Boolean): Unit = withContext(ioDispatcher) {
        refreshMutex.withLock {
            if (!force) {
                val freshCache = readCache(requireFresh = true)
                if (freshCache != null) {
                    _apps.value = filterCurrentApp(parseApps(freshCache))
                    return@withLock
                }
            }

            val remoteJson = fetchRemoteJson()
            if (!remoteJson.isNullOrBlank()) {
                val parsed = parseApps(remoteJson)
                if (parsed.isNotEmpty()) {
                    writeCache(remoteJson)
                    _apps.value = filterCurrentApp(parsed)
                    return@withLock
                }
            }

            val staleCache = readCache(requireFresh = false)
            if (staleCache != null) {
                _apps.value = filterCurrentApp(parseApps(staleCache))
            } else {
                Timber.w("Other apps list could not be loaded from remote or cache")
            }
        }
    }

    private fun parseApps(jsonString: String): List<OtherApp> {
        return try {
            val jsonArray = JSONArray(jsonString)
            buildList {
                for (i in 0 until jsonArray.length()) {
                    val obj = jsonArray.getJSONObject(i)
                    val appName = obj.optString("appName")
                    val packageName = obj.optString("packageName")
                    val appIconUrl = obj.optString("appIcon")
                    val isNew = obj.optBoolean("isNew", false)
                    if (appName.isNotBlank() && packageName.isNotBlank() && appIconUrl.isNotBlank()) {
                        add(
                            OtherApp(
                                appName = appName,
                                packageName = packageName,
                                appIconUrl = appIconUrl,
                                isNew = isNew,
                            ),
                        )
                    }
                }
            }.sortedWith(compareByDescending<OtherApp> { it.isNew }.thenBy { it.appName.lowercase() })
        } catch (e: JSONException) {
            Timber.e(e, "other_apps json parse error")
            emptyList()
        }
    }

    private fun filterCurrentApp(apps: List<OtherApp>): List<OtherApp> {
        return apps.filterNot { it.packageName.equals(currentPackageName, ignoreCase = true) }
    }

    private fun readCache(requireFresh: Boolean): String? {
        return try {
            if (!cacheFile.exists()) return null
            if (requireFresh) {
                val age = System.currentTimeMillis() - cacheFile.lastModified()
                if (age > CACHE_TTL_MILLIS) return null
            }
            cacheFile.readText()
        } catch (e: Exception) {
            Timber.w(e, "Failed to read other apps cache")
            null
        }
    }

    private fun writeCache(json: String) {
        try {
            cacheFile.writeText(json)
        } catch (e: Exception) {
            Timber.w(e, "Failed to write other apps cache")
        }
    }

    private fun fetchRemoteJson(): String? {
        return fetchJsonFrom(REMOTE_URL) ?: fetchJsonFrom(FALLBACK_REMOTE_URL)
    }

    private fun fetchJsonFrom(url: String): String? {
        return try {
            val connection = (URL(url).openConnection() as HttpURLConnection).apply {
                connectTimeout = CONNECT_TIMEOUT_MS
                readTimeout = READ_TIMEOUT_MS
                requestMethod = "GET"
                setRequestProperty("Accept", "application/json")
            }

            connection.useConnection { conn ->
                if (conn.responseCode !in 200..299) {
                    Timber.w("Other apps fetch failed for $url with HTTP ${conn.responseCode}")
                    null
                } else {
                    conn.inputStream.bufferedReader().use { it.readText() }
                }
            }
        } catch (e: Exception) {
            Timber.w(e, "Other apps remote fetch failed for $url")
            null
        }
    }

    private companion object {
        private const val REMOTE_URL = "https://contentapp-content-api.oaslananka.workers.dev/api/other-apps"
        private const val FALLBACK_REMOTE_URL = "https://mobildev.site/other_apps.json"
        private const val CACHE_FILE_NAME = "other_apps_cache.json"
        private const val CACHE_TTL_MILLIS = 24 * 60 * 60 * 1000L
        private const val CONNECT_TIMEOUT_MS = 10_000
        private const val READ_TIMEOUT_MS = 10_000
    }
}

private inline fun <T : HttpURLConnection, R> T.useConnection(block: (T) -> R): R {
    return try {
        block(this)
    } finally {
        disconnect()
    }
}

