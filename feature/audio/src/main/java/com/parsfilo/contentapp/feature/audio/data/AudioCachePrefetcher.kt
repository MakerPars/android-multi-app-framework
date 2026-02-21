package com.parsfilo.contentapp.feature.audio.data

import android.content.Context
import android.net.Uri
import dagger.hilt.android.qualifiers.ApplicationContext
import com.parsfilo.contentapp.feature.audio.BuildConfig
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import timber.log.Timber
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

private const val AUDIO_CACHE_DIR = "audio_cache"
private const val MANIFEST_TIMEOUT_MS = 5_000
private const val AUDIO_TIMEOUT_MS = 15_000
private const val AUDIO_BUFFER_SIZE = 8 * 1024
private const val NAMAZ_SURELERI_PACKAGE = "com.parsfilo.namazsurelerivedualarsesli"
private const val PREFS_NAME = "audio_prefetch"
private const val PREFETCH_VERSION = 1

private data class RemoteAudioManifest(
    val packageAudio: Map<String, String>,
    val availableKeys: Set<String>,
)

private data class RemoteAudioSource(
    val key: String,
    val url: String,
)

@Singleton
class AudioCachePrefetcher @Inject constructor(
    @ApplicationContext private val context: Context,
) {

    fun prefetchIfNeeded(
        packageName: String,
        fallbackAudioFileName: String,
        prefetchAllAudioOnFirstLaunch: Boolean = false,
    ) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val completionKey = "prefetch_complete_${packageName}_v$PREFETCH_VERSION"
        val fullPrefetchEnabled = prefetchAllAudioOnFirstLaunch && packageName == NAMAZ_SURELERI_PACKAGE
        if (fullPrefetchEnabled && prefs.getBoolean(completionKey, false)) {
            Timber.d("Audio prefetch skipped: full prefetch already completed for $packageName")
            return
        }

        val manifest = fetchManifest() ?: run {
            Timber.d("Audio prefetch skipped: manifest unavailable for package=$packageName")
            return
        }

        val remoteSources = if (fullPrefetchEnabled) {
            resolveFullNamazSureleriSources(manifest, packageName, fallbackAudioFileName)
        } else {
            resolveRemoteAudioSource(manifest, packageName, fallbackAudioFileName)?.let(::listOf).orEmpty()
        }

        if (remoteSources.isEmpty()) {
            Timber.d("Audio prefetch skipped: no remote sources for package=$packageName")
            return
        }

        var downloadedOrCachedCount = 0
        remoteSources.forEach { remote ->
            val target = cachedAudioFile(remote.key)
            if (target.exists() && target.length() > 0L) {
                downloadedOrCachedCount += 1
                return@forEach
            }
            if (downloadToCache(remote, target)) {
                downloadedOrCachedCount += 1
            }
        }

        if (fullPrefetchEnabled && downloadedOrCachedCount == remoteSources.size) {
            prefs.edit().putBoolean(completionKey, true).apply()
            Timber.i("Audio prefetch full-complete: $downloadedOrCachedCount/${remoteSources.size} files")
        } else {
            Timber.i("Audio prefetch result: $downloadedOrCachedCount/${remoteSources.size} files")
        }
    }

    private fun resolveRemoteAudioSource(
        manifest: RemoteAudioManifest,
        packageName: String,
        fallbackAudioFileName: String,
    ): RemoteAudioSource? {
        val keyFromPackage = manifest.packageAudio[packageName]?.trim().orEmpty()
        val normalizedPackageKey = normalizeAudioKey(keyFromPackage)
        if (normalizedPackageKey != null && manifest.availableKeys.contains(normalizedPackageKey)) {
            return RemoteAudioSource(
                key = normalizedPackageKey,
                url = "${BuildConfig.AUDIO_BASE_URL}/${Uri.encode(normalizedPackageKey)}",
            )
        }

        val fallback = normalizeAudioKey(fallbackAudioFileName)
        if (fallback != null && manifest.availableKeys.contains(fallback)) {
            return RemoteAudioSource(
                key = fallback,
                url = "${BuildConfig.AUDIO_BASE_URL}/${Uri.encode(fallback)}",
            )
        }
        return null
    }

    private fun resolveFullNamazSureleriSources(
        manifest: RemoteAudioManifest,
        packageName: String,
        fallbackAudioFileName: String,
    ): List<RemoteAudioSource> {
        val orderedKeys = linkedSetOf<String>()
        resolveRemoteAudioSource(manifest, packageName, fallbackAudioFileName)?.let { orderedKeys.add(it.key) }

        loadAudioKeysFromNamazSureleriData()
            .mapNotNull(::normalizeAudioKey)
            .filter { manifest.availableKeys.contains(it) }
            .forEach(orderedKeys::add)

        return orderedKeys.map { key ->
            RemoteAudioSource(
                key = key,
                url = "${BuildConfig.AUDIO_BASE_URL}/${Uri.encode(key)}",
            )
        }
    }

    private fun loadAudioKeysFromNamazSureleriData(): List<String> {
        return runCatching {
            val raw = context.assets.open("data.json").bufferedReader().use { it.readText() }
            val array = JSONArray(raw)
            buildList {
                for (i in 0 until array.length()) {
                    val item = array.optJSONObject(i) ?: continue
                    val key = item.optString("sureMedya").trim()
                    if (key.isNotEmpty()) add(key)
                }
            }
        }.onFailure {
            Timber.w(it, "Could not read data.json for full audio prefetch")
        }.getOrDefault(emptyList())
    }

    private fun normalizeAudioKey(raw: String?): String? {
        val key = raw?.trim()?.lowercase().orEmpty()
        if (key.isEmpty()) return null
        return if (key.endsWith(".mp3")) key else "$key.mp3"
    }

    private fun fetchManifest(): RemoteAudioManifest? {
        var connection: HttpURLConnection? = null
        return try {
            connection = (URL(BuildConfig.AUDIO_MANIFEST_URL).openConnection() as HttpURLConnection).apply {
                connectTimeout = MANIFEST_TIMEOUT_MS
                readTimeout = MANIFEST_TIMEOUT_MS
                requestMethod = "GET"
                setRequestProperty("Accept", "application/json")
            }

            if (connection.responseCode !in 200..299) {
                return null
            }

            val body = connection.inputStream.bufferedReader().use { it.readText() }
            val json = JSONObject(body)
            val packageAudio = mutableMapOf<String, String>()
            json.optJSONObject("packageAudio")?.let { obj ->
                val iter = obj.keys()
                while (iter.hasNext()) {
                    val key = iter.next()
                    val value = obj.optString(key).trim()
                    if (value.isNotEmpty()) packageAudio[key] = value
                }
            }

            val availableKeys = mutableSetOf<String>()
            json.optJSONArray("files")?.let { files ->
                for (i in 0 until files.length()) {
                    val key = files.optJSONObject(i)?.optString("key").orEmpty().trim()
                    if (key.isNotEmpty()) availableKeys.add(key)
                }
            }

            if (availableKeys.isEmpty()) null else RemoteAudioManifest(packageAudio, availableKeys)
        } catch (e: IOException) {
            Timber.w(e, "Audio manifest fetch failed")
            null
        } catch (e: JSONException) {
            Timber.w(e, "Audio manifest parse failed")
            null
        } catch (e: SecurityException) {
            Timber.w(e, "Audio manifest fetch failed")
            null
        } finally {
            connection?.disconnect()
        }
    }

    private fun downloadToCache(source: RemoteAudioSource, target: File): Boolean {
        var connection: HttpURLConnection? = null
        val temp = File(target.parentFile ?: context.filesDir, "${target.name}.tmp")
        return try {
            target.parentFile?.mkdirs()
            connection = (URL(source.url).openConnection() as HttpURLConnection).apply {
                connectTimeout = AUDIO_TIMEOUT_MS
                readTimeout = AUDIO_TIMEOUT_MS
                requestMethod = "GET"
            }
            if (connection.responseCode !in 200..299) {
                return false
            }

            BufferedInputStream(connection.inputStream).use { input ->
                BufferedOutputStream(temp.outputStream()).use { output ->
                    val buffer = ByteArray(AUDIO_BUFFER_SIZE)
                    while (true) {
                        val read = input.read(buffer)
                        if (read <= 0) break
                        output.write(buffer, 0, read)
                    }
                    output.flush()
                }
            }

            if (!temp.exists() || temp.length() == 0L) {
                temp.delete()
                return false
            }

            if (target.exists()) target.delete()
            if (!temp.renameTo(target)) {
                temp.copyTo(target, overwrite = true)
                temp.delete()
            }
            true
        } catch (e: IOException) {
            Timber.w(e, "Audio download failed for key=${source.key}")
            temp.delete()
            false
        } catch (e: SecurityException) {
            Timber.w(e, "Audio download failed for key=${source.key}")
            temp.delete()
            false
        } finally {
            connection?.disconnect()
        }
    }

    private fun cachedAudioFile(fileName: String): File {
        val safeName = fileName.replace(Regex("[^a-zA-Z0-9._-]"), "_")
        return File(File(context.filesDir, AUDIO_CACHE_DIR), safeName)
    }
}
