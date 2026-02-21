package com.parsfilo.contentapp.core.firebase.push

import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import org.json.JSONObject
import timber.log.Timber
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Named
import javax.inject.Singleton

@Singleton
class HttpPushRegistrationSender @Inject constructor(
    @Named(PUSH_REGISTRATION_URL) private val pushRegistrationUrl: String,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) : PushRegistrationSender {

    override suspend fun send(payload: PushRegistrationPayload): Boolean = withContext(ioDispatcher) {
        if (pushRegistrationUrl.isBlank()) {
            Timber.d("Push registration URL is empty, skipping sync.")
            return@withContext false
        }

        runCatching {
            val connection = (URL(pushRegistrationUrl).openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 10_000
                readTimeout = 10_000
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
                setRequestProperty("Accept", "application/json")
            }

            connection.useConnection {
                val body = payload.toJson().toString()
                it.outputStream.bufferedWriter(Charsets.UTF_8).use { writer ->
                    writer.write(body)
                }

                val code = it.responseCode
                if (code in 200..299) {
                    true
                } else {
                    Timber.w("Push registration failed: HTTP %s", code)
                    false
                }
            }
        }.getOrElse { throwable ->
            Timber.w(throwable, "Push registration request failed.")
            false
        }
    }
}

const val PUSH_REGISTRATION_URL = "push_registration_url"

private fun PushRegistrationPayload.toJson(): JSONObject = JSONObject().apply {
    put("installationId", installationId)
    put("fcmToken", fcmToken)
    put("packageName", packageName)
    put("locale", locale)
    put("timezone", timezone)
    put("notificationsEnabled", notificationsEnabled)
    put("appVersion", appVersion)
    put("deviceModel", deviceModel)
    put("reason", reason)
    put("syncedAtEpochMs", syncedAtEpochMs)
}

private inline fun <T : HttpURLConnection, R> T.useConnection(block: (T) -> R): R {
    return try {
        block(this)
    } finally {
        disconnect()
    }
}
