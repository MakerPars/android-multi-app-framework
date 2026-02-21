package com.parsfilo.contentapp.feature.prayertimes.data

import org.json.JSONArray
import timber.log.Timber
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

private const val BASE_URL = "https://ezanvakti.emushaf.net"

class EzanVaktiHttpException(
    val statusCode: Int,
    val endpoint: String,
) : IOException("EzanVakti API HTTP $statusCode for $endpoint")

@Singleton
class EzanVaktiApiClient @Inject constructor() {
    fun getCountries(): List<ApiCountry> =
        fetchArray("/ulkeler").map { obj ->
            ApiCountry(
                id = obj.optString("UlkeID").toIntOrNull() ?: 0,
                nameTr = obj.optString("UlkeAdi"),
                nameEn = obj.optString("UlkeAdiEn"),
            )
        }.filter { it.id > 0 && it.nameTr.isNotBlank() }

    fun getCities(countryId: Int): List<ApiCity> =
        fetchArray("/sehirler/$countryId").map { obj ->
            ApiCity(
                id = obj.optString("SehirID").toIntOrNull() ?: 0,
                nameTr = obj.optString("SehirAdi"),
                nameEn = obj.optString("SehirAdiEn"),
            )
        }.filter { it.id > 0 && it.nameTr.isNotBlank() }

    fun getDistricts(cityId: Int): List<ApiDistrict> =
        fetchArray("/ilceler/$cityId").map { obj ->
            ApiDistrict(
                id = obj.optString("IlceID").toIntOrNull() ?: 0,
                nameTr = obj.optString("IlceAdi"),
                nameEn = obj.optString("IlceAdiEn"),
            )
        }.filter { it.id > 0 && it.nameTr.isNotBlank() }

    fun getPrayerTimes(districtId: Int): List<ApiPrayerTime> =
        fetchArray("/vakitler/$districtId").map { obj ->
            ApiPrayerTime(
                miladiDateShort = obj.optString("MiladiTarihKisa"),
                imsak = obj.optString("Imsak"),
                gunes = obj.optString("Gunes"),
                ogle = obj.optString("Ogle"),
                ikindi = obj.optString("Ikindi"),
                aksam = obj.optString("Aksam"),
                yatsi = obj.optString("Yatsi"),
            )
        }.filter {
            it.miladiDateShort.isNotBlank() &&
                it.imsak.isNotBlank() &&
                it.gunes.isNotBlank() &&
                it.ogle.isNotBlank() &&
                it.ikindi.isNotBlank() &&
                it.aksam.isNotBlank() &&
                it.yatsi.isNotBlank()
        }

    private fun fetchArray(path: String): List<org.json.JSONObject> {
        val connection = (URL("$BASE_URL$path").openConnection() as HttpURLConnection).apply {
            connectTimeout = CONNECT_TIMEOUT_MS
            readTimeout = READ_TIMEOUT_MS
            requestMethod = "GET"
            setRequestProperty("Accept", "application/json")
        }

        return connection.useConnection { conn ->
            val responseCode = conn.responseCode
            if (responseCode !in HTTP_SUCCESS_CODE_MIN..HTTP_SUCCESS_CODE_MAX) {
                throw EzanVaktiHttpException(statusCode = responseCode, endpoint = path)
            }

            val payload = conn.inputStream.bufferedReader().use { it.readText() }
            val arr = JSONArray(payload)
            buildList(arr.length()) {
                repeat(arr.length()) { index ->
                    add(arr.getJSONObject(index))
                }
            }
        }
    }

    private companion object {
        private const val HTTP_SUCCESS_CODE_MIN = 200
        private const val HTTP_SUCCESS_CODE_MAX = 299
        private const val CONNECT_TIMEOUT_MS = 10_000
        private const val READ_TIMEOUT_MS = 10_000
    }
}

data class ApiCountry(
    val id: Int,
    val nameTr: String,
    val nameEn: String,
)

data class ApiCity(
    val id: Int,
    val nameTr: String,
    val nameEn: String,
)

data class ApiDistrict(
    val id: Int,
    val nameTr: String,
    val nameEn: String,
)

data class ApiPrayerTime(
    val miladiDateShort: String,
    val imsak: String,
    val gunes: String,
    val ogle: String,
    val ikindi: String,
    val aksam: String,
    val yatsi: String,
)

internal inline fun <T : HttpURLConnection, R> T.useConnection(block: (T) -> R): R {
    return try {
        runCatching { block(this) }
            .onFailure { Timber.w(it, "EzanVaktiApiClient connection error") }
            .getOrThrow()
    } finally {
        disconnect()
    }
}
