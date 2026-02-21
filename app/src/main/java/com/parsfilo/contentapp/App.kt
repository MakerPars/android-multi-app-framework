package com.parsfilo.contentapp

import android.app.Application
import android.os.SystemClock
import android.util.Log
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.lifecycle.lifecycleScope
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.parsfilo.contentapp.core.firebase.AnalyticsUserPropertyKey
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.appcheck.FirebaseAppCheckInstaller
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationManager
import com.parsfilo.contentapp.feature.audio.data.AudioCachePrefetcher
import com.parsfilo.contentapp.feature.billing.BillingManager
import com.parsfilo.contentapp.feature.prayertimes.alarm.PrayerAlarmScheduler
import com.parsfilo.contentapp.feature.prayertimes.widget.PrayerTimesWidgetReceiver
import com.parsfilo.contentapp.feature.prayertimes.worker.PrayerTimesRefreshWorker
import com.parsfilo.contentapp.observability.SentryMetrics
import dagger.hilt.android.HiltAndroidApp
import io.sentry.Sentry
import io.sentry.SentryLevel
import io.sentry.SentryEvent
import io.sentry.SentryLogEvent
import io.sentry.SentryLogLevel
import io.sentry.android.core.SentryAndroid
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import timber.log.Timber
import java.util.Locale
import java.util.TimeZone
import javax.inject.Inject

@HiltAndroidApp
class App : Application() {

    @Inject
    lateinit var billingManager: BillingManager

    @Inject
    lateinit var appAnalytics: AppAnalytics

    @Inject
    lateinit var appCheckInstaller: FirebaseAppCheckInstaller

    @Inject
    lateinit var prayerAlarmScheduler: PrayerAlarmScheduler

    @Inject
    lateinit var pushRegistrationManager: PushRegistrationManager

    @Inject
    lateinit var audioCachePrefetcher: AudioCachePrefetcher

    override fun onCreate() {
        super.onCreate()
        val appStartUptimeMs = SystemClock.elapsedRealtime()

        if (BuildConfig.SENTRY_DSN.isNotBlank()) {
            SentryAndroid.init(this) { options ->
                options.dsn = BuildConfig.SENTRY_DSN
                options.environment = BuildConfig.FLAVOR_NAME
                options.release = "${BuildConfig.APPLICATION_ID}@${BuildConfig.VERSION_NAME}+${BuildConfig.VERSION_CODE}"
                options.isDebug = BuildConfig.DEBUG
                options.tracesSampleRate = if (BuildConfig.DEBUG) DEBUG_TRACES_SAMPLE_RATE else PROD_TRACES_SAMPLE_RATE
                options.profilesSampleRate = if (BuildConfig.DEBUG) DEBUG_PROFILES_SAMPLE_RATE else PROD_PROFILES_SAMPLE_RATE
                // Keep continuous profiling disabled to preserve quota.
                options.setProfileSessionSampleRate(0.0)

                // Enable Sentry Logs with strict budget controls.
                options.logs.setEnabled(true)
                options.logs.setBeforeSend(
                    io.sentry.SentryOptions.Logs.BeforeSendLogCallback { logEvent ->
                        if (shouldDropSentryLogNoise(logEvent)) null else logEvent
                    }
                )

                options.setDiagnosticLevel(if (BuildConfig.DEBUG) SentryLevel.INFO else SentryLevel.WARNING)
                options.setEnableUserInteractionBreadcrumbs(true)
                options.setEnableAutoSessionTracking(true)
                options.setMaxBreadcrumbs(150)
                options.beforeSend = io.sentry.SentryOptions.BeforeSendCallback { event, _ ->
                    if (shouldDropSentryNoise(event)) null else event
                }
            }
            Sentry.setTag("flavor", BuildConfig.FLAVOR_NAME)
            Sentry.setTag("build_type", BuildConfig.BUILD_TYPE)
            SentryMetrics.count("app.sentry.init.success")
        } else {
            SentryMetrics.count("app.sentry.init.skipped")
        }

        FirebaseCrashlytics.getInstance().apply {
            isCrashlyticsCollectionEnabled = !BuildConfig.DEBUG
            setCustomKey("flavor", BuildConfig.FLAVOR_NAME)
            setCustomKey("build_type", BuildConfig.BUILD_TYPE)
        }

        // App Check must be installed early to protect Firebase endpoints (Firestore, Functions, etc.)
        appCheckInstaller.install()
        SentryMetrics.gauge("push.topics.configured", DEFAULT_FCM_TOPICS.size.toDouble())
        ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
            runCatching {
                pushRegistrationManager.subscribeToTopics(DEFAULT_FCM_TOPICS)
                SentryMetrics.count("push.topics.subscribe.success")
            }.onFailure {
                SentryMetrics.count("push.topics.subscribe.failure")
            }
        }

        // Audio flavors: download once after first launch and keep local for offline playback.
        if (BuildConfig.AUDIO_FILE_NAME != "content_audio.mp3") {
            ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
                runCatching {
                    audioCachePrefetcher.prefetchIfNeeded(
                        packageName = packageName,
                        fallbackAudioFileName = BuildConfig.AUDIO_FILE_NAME,
                        prefetchAllAudioOnFirstLaunch = BuildConfig.FLAVOR_NAME == "namazsurelerivedualarsesli",
                    )
                    SentryMetrics.count("audio.prefetch.success")
                }.onFailure {
                    SentryMetrics.count("audio.prefetch.failure")
                }
            }
        }

        // Analytics defaults: keep collection enabled in debug too, but add stable user properties
        // so debug traffic can be filtered out in reporting if needed.
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.FLAVOR, BuildConfig.FLAVOR_NAME)
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.BUILD_TYPE, BuildConfig.BUILD_TYPE)
        appAnalytics.setUserProperty(
            AnalyticsUserPropertyKey.APP_LANG,
            Locale.getDefault().toLanguageTag(),
        )
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.TZ, TimeZone.getDefault().id)
        appAnalytics.setDefaultEventParameters(
            android.os.Bundle().apply {
                putString(AnalyticsUserPropertyKey.FLAVOR, BuildConfig.FLAVOR_NAME)
                putString(AnalyticsUserPropertyKey.BUILD_TYPE, BuildConfig.BUILD_TYPE)
            }
        )

        // Timber initialization
        if (BuildConfig.DEBUG) {
            Timber.plant(FixedTagDebugTree())
        } else {
            Timber.plant(CrashlyticsTree())
        }

        // BillingManager lifecycle yönetimi:
        // Uygulama arka plana geçince dinleyiciyi bırak, öne gelince yeniden bağlan.
        ProcessLifecycleOwner.get().lifecycle.addObserver(object : DefaultLifecycleObserver {
            override fun onStop(owner: LifecycleOwner) {
                billingManager.endConnection()
            }

            override fun onStart(owner: LifecycleOwner) {
                billingManager.startConnection()
                billingManager.refreshPurchaseState()
            }
        })

        if (BuildConfig.IS_PRAYER_TIMES_FLAVOR) {
            PrayerTimesRefreshWorker.schedule(this)
            ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
                prayerAlarmScheduler.scheduleNextForCurrentFlavor()
                runCatching { PrayerTimesWidgetReceiver.refreshAll(this@App) }
            }
        }

        SentryMetrics.distribution(
            key = "app.on_create.duration",
            value = (SystemClock.elapsedRealtime() - appStartUptimeMs).toDouble(),
            unit = "millisecond",
        )
    }

    private companion object {
        private val DEFAULT_FCM_TOPICS = listOf(
            "dini-bildirim",
            "talep",
        )

        private const val PROD_TRACES_SAMPLE_RATE = 0.08
        private const val PROD_PROFILES_SAMPLE_RATE = 0.02
        private const val DEBUG_TRACES_SAMPLE_RATE = 1.0
        private const val DEBUG_PROFILES_SAMPLE_RATE = 1.0

        private val BENIGN_SENTRY_PATTERNS = listOf(
            "Native ad failed: No fill",
            "Native ad no-fill",
            "Native ad load warning",
            "Billing setup failed: Service connection is disconnected.",
            "Planlar alınamadı: An internal error occurred.",
            "Reauth required (button flow)",
            "Button flow finished with",
            "Button flow CANCELLED",
            "CANCELLED by user/system",
            "Job was cancelled",
            "Account reauth failed.",
        )
    }

    private fun shouldDropSentryNoise(event: SentryEvent): Boolean {
        val logger = event.logger.orEmpty()
        if (!logger.contains("timber", ignoreCase = true)) return false

        val message = buildString {
            event.message?.formatted?.let(::append)
            event.message?.message?.let {
                if (isNotBlank()) append(" | ")
                append(it)
            }
            event.throwable?.message?.let {
                if (isNotBlank()) append(" | ")
                append(it)
            }
        }

        val throwableType = event.throwable?.javaClass?.simpleName.orEmpty()
        if (throwableType == "GetCredentialCancellationException") return true
        if (throwableType == "JobCancellationException") return true

        return BENIGN_SENTRY_PATTERNS.any { pattern ->
            message.contains(pattern, ignoreCase = true)
        }
    }

    private fun shouldDropSentryLogNoise(event: SentryLogEvent): Boolean {
        val level = event.level
        val warnOrAbove = level == SentryLogLevel.WARN || level == SentryLogLevel.ERROR || level == SentryLogLevel.FATAL
        if (!warnOrAbove) return true

        val body = event.body
        return BENIGN_SENTRY_PATTERNS.any { pattern ->
            body.contains(pattern, ignoreCase = true)
        }
    }
}

private const val DEBUG_TIMBER_TAG = "timber_log"

/**
 * Forces all Timber logs to a single Logcat tag so filtering is easier during development.
 */
class FixedTagDebugTree : Timber.DebugTree() {
    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        if (!isLoggable(tag, priority)) return
        val payload = buildString {
            if (!tag.isNullOrBlank()) {
                append('[')
                append(tag)
                append("] ")
            }
            append(message)
            if (t != null) {
                append('\n')
                append(Log.getStackTraceString(t))
            }
        }
        Log.println(priority, DEBUG_TIMBER_TAG, payload)
    }
}

/**
 * Production Timber Tree — warning/error logs go to Crashlytics logs; only ERROR exceptions are recorded as issues.
 * Debug and info logs are suppressed in release builds.
 */
class CrashlyticsTree : Timber.Tree() {
    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        if (priority == Log.VERBOSE || priority == Log.DEBUG) {
            return
        }

        val crashlytics = FirebaseCrashlytics.getInstance()
        crashlytics.log("${tag ?: "App"}: $message")

        // Avoid noisy non-fatal issue floods from expected warning paths
        // (e.g. transient geocoder/network availability).
        if (priority >= Log.ERROR) {
            t?.let { crashlytics.recordException(it) }
        }
    }
}

