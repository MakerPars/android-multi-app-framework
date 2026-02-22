package com.parsfilo.contentapp.feature.quran.data

import android.content.Context
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import com.parsfilo.contentapp.core.common.result.Result
import com.parsfilo.contentapp.core.database.dao.quran.QuranDao
import com.parsfilo.contentapp.core.database.model.quran.QuranAudioCacheEntity
import com.parsfilo.contentapp.core.database.model.quran.QuranAyahEntity
import com.parsfilo.contentapp.core.database.model.quran.QuranBookmarkEntity
import com.parsfilo.contentapp.core.database.model.quran.QuranLastReadEntity
import com.parsfilo.contentapp.core.database.model.quran.QuranSuraEntity
import com.parsfilo.contentapp.core.model.QuranAyah
import com.parsfilo.contentapp.core.model.QuranBookmark
import com.parsfilo.contentapp.core.model.QuranSura
import com.parsfilo.contentapp.core.model.RevelationType
import com.parsfilo.contentapp.feature.quran.config.QuranApiConfig
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import org.json.JSONObject
import timber.log.Timber
import java.io.BufferedInputStream
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class QuranRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val quranDao: QuranDao,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) {

    fun observeSuras(): Flow<List<QuranSura>> =
        quranDao.observeAllSuras().map { entities -> entities.map { it.toModel() } }

    fun observeSura(suraNumber: Int): Flow<QuranSura?> =
        quranDao.observeSura(suraNumber).map { entity -> entity?.toModel() }

    fun observeAyahsForSura(suraNumber: Int): Flow<List<QuranAyah>> =
        quranDao.observeAyahsForSura(suraNumber).map { entities -> entities.map { it.toModel() } }

    suspend fun syncSurasIfNeeded(force: Boolean = false): Result<Unit> = withContext(ioDispatcher) {
        if (!force && quranDao.getSuraCount() >= 114) return@withContext Result.Success(Unit)

        return@withContext runCatching {
            val json = fetchJson(QuranApiConfig.SURA_LIST_URL)
            val chapters = json.optJSONArray("chapters") ?: error("chapters missing")
            val entities = buildList {
                for (i in 0 until chapters.length()) {
                    val chapter = chapters.getJSONObject(i)
                    val number = chapter.optInt("chapter", i + 1)
                    val versesCount = chapter.optJSONArray("verses")?.length()
                        ?: chapter.optInt("verses_count", 0)
                    add(
                        QuranSuraEntity(
                            number = number,
                            nameArabic = chapter.optString("arabicname"),
                            nameLatin = chapter.optString("name"),
                            nameTurkish = chapter.optString("name"),
                            nameEnglish = chapter.optString("englishname"),
                            revelationType = chapter.optString("revelation").toRevelationTypeName(),
                            ayahCount = versesCount,
                        )
                    )
                }
            }
            quranDao.insertSuras(entities)
            Unit
        }.fold(
            onSuccess = { Result.Success(Unit) },
            onFailure = { throwable ->
                Timber.e(throwable, "Failed to sync sura metadata")
                Result.Error(throwable)
            },
        )
    }

    suspend fun syncSuraContentIfNeeded(suraNumber: Int, force: Boolean = false): Result<Unit> =
        withContext(ioDispatcher) {
            if (!force && quranDao.getAyahCountForSura(suraNumber) > 0) {
                return@withContext Result.Success(Unit)
            }

            return@withContext runCatching {
                coroutineScope {
                    val arabicDeferred = async { fetchEditionMap(QuranApiConfig.ARABIC_EDITION, suraNumber) }
                    val latinDeferred = async { fetchEditionMap(QuranApiConfig.LATIN_EDITION, suraNumber) }
                    val turkishDeferred = async { fetchEditionMap(QuranApiConfig.TURKISH_EDITION, suraNumber) }
                    val englishDeferred = async { fetchEditionMap(QuranApiConfig.ENGLISH_EDITION, suraNumber) }
                    val germanDeferred = async { fetchEditionMap(QuranApiConfig.GERMAN_EDITION, suraNumber) }

                    val arabic = arabicDeferred.await()
                    val latin = latinDeferred.await()
                    val turkish = turkishDeferred.await()
                    val english = englishDeferred.await()
                    val german = germanDeferred.await()

                    val allAyahNumbers = (arabic.keys + latin.keys + turkish.keys + english.keys + german.keys)
                        .toSortedSet()

                    if (allAyahNumbers.isEmpty()) {
                        error("No ayah payload for sura=$suraNumber")
                    }

                    val entities = allAyahNumbers.map { ayahNo ->
                        QuranAyahEntity(
                            suraNumber = suraNumber,
                            ayahNumber = ayahNo,
                            arabic = arabic[ayahNo].orEmpty(),
                            latin = latin[ayahNo].orEmpty(),
                            turkish = turkish[ayahNo].orEmpty(),
                            english = english[ayahNo].orEmpty(),
                            german = german[ayahNo].orEmpty(),
                        )
                    }

                    entities.chunked(500).forEach { chunk ->
                        quranDao.insertAyahs(chunk)
                    }
                }
                Unit
            }.fold(
                onSuccess = { Result.Success(Unit) },
                onFailure = { throwable ->
                    Timber.e(throwable, "Failed to sync sura content for sura=$suraNumber")
                    Result.Error(throwable)
                },
            )
        }

    suspend fun getAyahAudioPath(
        reciterId: String,
        reciterFolder: String,
        suraNumber: Int,
        ayahNumber: Int,
    ): String = withContext(ioDispatcher) {
        val cached = quranDao.getCachedAudio(reciterId, suraNumber, ayahNumber)
        if (cached != null && File(cached.filePath).exists()) {
            return@withContext "file://${cached.filePath}"
        }

        QuranApiConfig.ayahAudioUrl(reciterFolder, suraNumber, ayahNumber)
    }

    suspend fun downloadAyahAudio(
        reciterId: String,
        reciterFolder: String,
        suraNumber: Int,
        ayahNumber: Int,
        onProgress: (Float) -> Unit = {},
    ): Result<String> = withContext(ioDispatcher) {
        runCatching {
            val cacheDir = File(context.filesDir, QuranApiConfig.AUDIO_CACHE_DIR).also { it.mkdirs() }
            val fileName = QuranApiConfig.cachedAudioFileName(reciterId, suraNumber, ayahNumber)
            val output = File(cacheDir, fileName)
            if (output.exists() && output.length() > 0L) {
                quranDao.insertCachedAudio(
                    QuranAudioCacheEntity(
                        reciterId = reciterId,
                        suraNumber = suraNumber,
                        ayahNumber = ayahNumber,
                        filePath = output.absolutePath,
                        fileSize = output.length(),
                    )
                )
                return@runCatching output.absolutePath
            }

            val primary = QuranApiConfig.ayahAudioUrl(reciterFolder, suraNumber, ayahNumber)
            val mirror = QuranApiConfig.ayahAudioMirrorUrl(reciterFolder, suraNumber, ayahNumber)

            val downloadResult = runCatching { downloadFile(primary, output, onProgress) }
                .recoverCatching {
                    Timber.w(it, "Primary ayah audio download failed. Falling back to mirror.")
                    downloadFile(mirror, output, onProgress)
                }

            downloadResult.getOrThrow()

            quranDao.insertCachedAudio(
                QuranAudioCacheEntity(
                    reciterId = reciterId,
                    suraNumber = suraNumber,
                    ayahNumber = ayahNumber,
                    filePath = output.absolutePath,
                    fileSize = output.length(),
                )
            )
            onProgress(1f)
            output.absolutePath
        }.fold(
            onSuccess = { path -> Result.Success(path) },
            onFailure = { throwable ->
                Timber.e(throwable, "Failed to download ayah audio for sura=$suraNumber ayah=$ayahNumber")
                Result.Error(throwable)
            },
        )
    }

    suspend fun isAyahDownloaded(reciterId: String, suraNumber: Int, ayahNumber: Int): Boolean =
        withContext(ioDispatcher) {
            val cached = quranDao.getCachedAudio(reciterId, suraNumber, ayahNumber)
            cached != null && File(cached.filePath).exists()
        }

    suspend fun getDownloadedAyahNumbers(reciterId: String, suraNumber: Int): Set<Int> =
        withContext(ioDispatcher) {
            quranDao.getCachedAudiosForSura(reciterId, suraNumber)
                .filter { File(it.filePath).exists() }
                .map { it.ayahNumber }
                .toSet()
        }

    suspend fun deleteCachedAudio(reciterId: String, suraNumber: Int, ayahNumber: Int) =
        withContext(ioDispatcher) {
            val cached = quranDao.getCachedAudio(reciterId, suraNumber, ayahNumber) ?: return@withContext
            File(cached.filePath).delete()
            quranDao.deleteCachedAudio(reciterId, suraNumber, ayahNumber)
        }

    fun observeBookmarks(): Flow<List<QuranBookmark>> =
        quranDao.observeBookmarks().map { entities ->
            entities.map { entity ->
                QuranBookmark(
                    suraNumber = entity.suraNumber,
                    ayahNumber = entity.ayahNumber,
                    savedAt = entity.savedAt,
                    note = entity.note,
                )
            }
        }

    suspend fun toggleBookmark(suraNumber: Int, ayahNumber: Int, note: String = "") = withContext(ioDispatcher) {
        val alreadyBookmarked = quranDao.isBookmarked(suraNumber, ayahNumber) > 0
        if (alreadyBookmarked) {
            quranDao.deleteBookmark(suraNumber, ayahNumber)
        } else {
            quranDao.insertBookmark(
                QuranBookmarkEntity(
                    suraNumber = suraNumber,
                    ayahNumber = ayahNumber,
                    note = note,
                )
            )
        }
    }

    suspend fun isBookmarked(suraNumber: Int, ayahNumber: Int): Boolean = withContext(ioDispatcher) {
        quranDao.isBookmarked(suraNumber, ayahNumber) > 0
    }

    fun observeLastRead(): Flow<QuranLastReadEntity?> = quranDao.observeLastRead()

    suspend fun saveLastRead(suraNumber: Int, ayahNumber: Int) = withContext(ioDispatcher) {
        quranDao.saveLastRead(
            QuranLastReadEntity(
                suraNumber = suraNumber,
                ayahNumber = ayahNumber,
            )
        )
    }

    private fun fetchJson(urlString: String): JSONObject {
        val conn = (URL(urlString).openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 15_000
            requestMethod = "GET"
            setRequestProperty("Accept", "application/json")
        }
        return try {
            val code = conn.responseCode
            if (code !in 200..299) error("HTTP $code for $urlString")
            JSONObject(conn.inputStream.bufferedReader().use { it.readText() })
        } finally {
            conn.disconnect()
        }
    }

    private fun fetchEditionMap(edition: String, suraNumber: Int): Map<Int, String> {
        val url = QuranApiConfig.suraEditionUrl(edition, suraNumber)
        val conn = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 15_000
            requestMethod = "GET"
            setRequestProperty("Accept", "application/json")
        }
        return try {
            val code = conn.responseCode
            if (code !in 200..299) {
                Timber.w("Edition fetch failed for $edition sura=$suraNumber code=$code")
                return emptyMap()
            }

            val json = JSONObject(conn.inputStream.bufferedReader().use { it.readText() })
            val chapter = json.optJSONArray("chapter") ?: return emptyMap()
            buildMap {
                for (i in 0 until chapter.length()) {
                    val ayah = chapter.optJSONObject(i) ?: continue
                    val verseNo = ayah.optInt("verse", i + 1)
                    val text = ayah.optString("text")
                    put(verseNo, text)
                }
            }
        } finally {
            conn.disconnect()
        }
    }

    private fun downloadFile(urlString: String, destination: File, onProgress: (Float) -> Unit) {
        val connection = (URL(urlString).openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 30_000
            requestMethod = "GET"
        }

        val tempFile = File(destination.parentFile, "${destination.name}.tmp")
        try {
            val code = connection.responseCode
            if (code !in 200..299) error("HTTP $code for $urlString")

            val total = connection.contentLengthLong
            var downloaded = 0L
            BufferedInputStream(connection.inputStream).use { input ->
                FileOutputStream(tempFile).use { output ->
                    val buffer = ByteArray(8 * 1024)
                    while (true) {
                        val read = input.read(buffer)
                        if (read <= 0) break
                        output.write(buffer, 0, read)
                        downloaded += read
                        if (total > 0) {
                            onProgress((downloaded.toFloat() / total).coerceIn(0f, 1f))
                        }
                    }
                }
            }

            if (destination.exists()) {
                destination.delete()
            }
            if (!tempFile.renameTo(destination)) {
                tempFile.copyTo(destination, overwrite = true)
                tempFile.delete()
            }
        } finally {
            connection.disconnect()
            if (tempFile.exists() && !destination.exists()) {
                tempFile.delete()
            }
        }
    }
}

private fun QuranSuraEntity.toModel(): QuranSura = QuranSura(
    number = number,
    nameArabic = nameArabic,
    nameLatin = nameLatin,
    nameTurkish = nameTurkish,
    nameEnglish = nameEnglish,
    revelationType = if (revelationType == RevelationType.MECCAN.name) {
        RevelationType.MECCAN
    } else {
        RevelationType.MEDINAN
    },
    ayahCount = ayahCount,
)

private fun QuranAyahEntity.toModel(): QuranAyah = QuranAyah(
    suraNumber = suraNumber,
    ayahNumber = ayahNumber,
    arabic = arabic,
    latin = latin,
    turkish = turkish,
    english = english,
    german = german,
)

private fun String.toRevelationTypeName(): String {
    return when (trim().lowercase()) {
        "mecca", "meccan" -> RevelationType.MECCAN.name
        else -> RevelationType.MEDINAN.name
    }
}

