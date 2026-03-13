package com.parsfilo.contentapp

import android.app.Activity
import android.app.Application
import android.os.Bundle
import android.util.Log
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.lifecycle.lifecycleScope
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.parsfilo.contentapp.core.firebase.AnalyticsUserPropertyKey
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.appcheck.FirebaseAppCheckInstaller
import com.parsfilo.contentapp.core.firebase.config.EndpointsProvider
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationManager
import com.parsfilo.contentapp.core.firebase.push.PushRegistrationSyncWorker
import com.parsfilo.contentapp.core.model.SubscriptionState
import com.parsfilo.contentapp.feature.audio.data.AudioCachePrefetcher
import com.parsfilo.contentapp.feature.billing.BillingManager
import com.parsfilo.contentapp.feature.counter.alarm.ZikirReminderScheduler
import com.parsfilo.contentapp.feature.prayertimes.alarm.PrayerAlarmScheduler
import com.parsfilo.contentapp.feature.prayertimes.widget.PrayerTimesWidgetReceiver
import com.parsfilo.contentapp.feature.prayertimes.worker.PrayerTimesRefreshWorker
import com.parsfilo.contentapp.monetization.AppOpenLifecycleCoordinator
import dagger.hilt.android.HiltAndroidApp
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
    lateinit var zikirReminderScheduler: ZikirReminderScheduler

    @Inject
    lateinit var pushRegistrationManager: PushRegistrationManager

    @Inject
    lateinit var audioCachePrefetcher: AudioCachePrefetcher

    @Inject
    lateinit var endpointsProvider: EndpointsProvider

    @Inject
    lateinit var appOpenLifecycleCoordinator: AppOpenLifecycleCoordinator

    override fun onCreate() {
        super.onCreate()

        // Timber must be initialized as early as possible to capture startup logs.
        if (BuildConfig.DEBUG) {
            Timber.plant(FixedTagDebugTree())
        } else {
            Timber.plant(CrashlyticsTree())
        }
        installGlobalExceptionLogging()
        registerDebugActivityLifecycleLogging()
        Timber.i(
            "App onCreate started flavor=%s buildType=%s package=%s debug=%s",
            BuildConfig.FLAVOR_NAME,
            BuildConfig.BUILD_TYPE,
            packageName,
            BuildConfig.DEBUG,
        )

        // Start with analytics collection disabled until UMP consent result is finalized.
        // Crashlytics remains independent and continues collecting crashes.
        appAnalytics.setAnalyticsCollectionEnabled(false)

        FirebaseCrashlytics.getInstance().apply {
            isCrashlyticsCollectionEnabled = !BuildConfig.DEBUG
            setCustomKey("flavor", BuildConfig.FLAVOR_NAME)
            setCustomKey("build_type", BuildConfig.BUILD_TYPE)
        }

        // App Check must be installed early to protect Firebase endpoints (Firestore, Functions, etc.)
        appCheckInstaller.install()
        endpointsProvider.prefetchAsync()
        ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
            runCatching {
                pushRegistrationManager.subscribeToTopics(DEFAULT_FCM_TOPICS)
            }.onFailure { error ->
                Timber.w(error, "Failed to subscribe to default FCM topics")
            }
        }
        PushRegistrationSyncWorker.schedule(this)

        // Audio flavors: download once after first launch and keep local for offline playback.
        if (shouldPrefetchFlavorAudio(BuildConfig.AUDIO_FILE_NAME)) {
            ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
                runCatching {
                    audioCachePrefetcher.prefetchIfNeeded(
                        packageName = packageName,
                        fallbackAudioFileName = BuildConfig.AUDIO_FILE_NAME,
                        prefetchAllAudioOnFirstLaunch =
                            shouldPrefetchAllAudioOnFirstLaunch(
                                packageName,
                            ),
                    )
                }.onFailure { error ->
                    Timber.w(error, "Audio prefetch failed at startup")
                }
            }
        }

        // Analytics defaults (consent-aware): collection starts disabled on cold start and is
        // re-enabled by AdManager only after consent is granted. User properties/default params
        // are still set here so runtime enablement starts with stable metadata.
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.FLAVOR, BuildConfig.FLAVOR_NAME)
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.BUILD_TYPE, BuildConfig.BUILD_TYPE)
        appAnalytics.setUserProperty(
            AnalyticsUserPropertyKey.APP_LANG,
            Locale.getDefault().toLanguageTag(),
        )
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.TZ, TimeZone.getDefault().id)
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.CONSENT_STATUS, "unknown")
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.AGE_GATE_STATUS, "unknown")
        appAnalytics.setUserProperty(AnalyticsUserPropertyKey.IS_PREMIUM, "false")
        appAnalytics.setDefaultEventParameters(
            Bundle().apply {
                putString(AnalyticsUserPropertyKey.FLAVOR, BuildConfig.FLAVOR_NAME)
                putString(AnalyticsUserPropertyKey.BUILD_TYPE, BuildConfig.BUILD_TYPE)
            },
        )
        ProcessLifecycleOwner.get().lifecycleScope.launch {
            billingManager.subscriptionState.collect { subscriptionState ->
                val premium = subscriptionState is SubscriptionState.Active
                appAnalytics.setUserProperty(
                    AnalyticsUserPropertyKey.IS_PREMIUM,
                    if (premium) "true" else "false",
                )
            }
        }

        appOpenLifecycleCoordinator.register(this)

        // BillingManager lifecycle yönetimi:
        // Uygulama arka plana geçince dinleyiciyi bırak, öne gelince yeniden bağlan.
        ProcessLifecycleOwner.get().lifecycle.addObserver(
            object : DefaultLifecycleObserver {
                override fun onStop(owner: LifecycleOwner) {
                    billingManager.endConnection()
                }

                override fun onStart(owner: LifecycleOwner) {
                    billingManager.startConnection()
                }
            },
        )

        if (isPrayerTimesFlavor(packageName)) {
            PrayerTimesRefreshWorker.schedule(this)
            ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
                prayerAlarmScheduler.scheduleNextForCurrentFlavor()
                runCatching { PrayerTimesWidgetReceiver.refreshAll(this@App) }
                    .onFailure { error ->
                        Timber.w(error, "Prayer widget refresh failed at startup")
                    }
            }
        }

        if (isZikirmatikFlavor(packageName)) {
            ProcessLifecycleOwner.get().lifecycleScope.launch(Dispatchers.IO) {
                runCatching {
                    zikirReminderScheduler.scheduleOrCancelFromPreferences()
                    zikirReminderScheduler.scheduleStreakCheckWorker()
                }.onFailure { error ->
                    Timber.w(error, "Failed to sync zikirmatik reminder schedule at startup")
                }
            }
        }
        Timber.i("App onCreate completed flavor=%s", BuildConfig.FLAVOR_NAME)
    }

    private fun installGlobalExceptionLogging() {
        val previousHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            Timber.e(
                throwable,
                "Uncaught exception thread=%s",
                thread.name,
            )
            previousHandler?.uncaughtException(thread, throwable)
        }
    }

    private fun registerDebugActivityLifecycleLogging() {
        if (!BuildConfig.DEBUG) return
        registerActivityLifecycleCallbacks(
            object : ActivityLifecycleCallbacks {
                override fun onActivityCreated(
                    activity: Activity,
                    savedInstanceState: Bundle?,
                ) {
                    Timber.d(
                        "Lifecycle created activity=%s savedState=%s",
                        activity::class.java.simpleName,
                        savedInstanceState != null,
                    )
                }

                override fun onActivityStarted(activity: Activity) {
                    Timber.d("Lifecycle started activity=%s", activity::class.java.simpleName)
                }

                override fun onActivityResumed(activity: Activity) {
                    Timber.d("Lifecycle resumed activity=%s", activity::class.java.simpleName)
                }

                override fun onActivityPaused(activity: Activity) {
                    Timber.d("Lifecycle paused activity=%s", activity::class.java.simpleName)
                }

                override fun onActivityStopped(activity: Activity) {
                    Timber.d("Lifecycle stopped activity=%s", activity::class.java.simpleName)
                }

                override fun onActivitySaveInstanceState(
                    activity: Activity,
                    outState: Bundle,
                ) {
                    Timber.d("Lifecycle saveState activity=%s", activity::class.java.simpleName)
                }

                override fun onActivityDestroyed(activity: Activity) {
                    Timber.d("Lifecycle destroyed activity=%s", activity::class.java.simpleName)
                }
            },
        )
    }

    private companion object {
        private const val DEFAULT_CONTENT_AUDIO_FILE_NAME = "content_audio.mp3"
        private const val PACKAGE_NAMAZ_SURELERI = "com.parsfilo.namazsurelerivedualarsesli"
        private const val PACKAGE_ZIKIRMATIK = "com.parsfilo.zikirmatik"
        private val PRAYER_TIMES_PACKAGES =
            setOf(
                "com.parsfilo.imsakiye",
                "com.parsfilo.namazvakitleri",
            )

        private val DEFAULT_FCM_TOPICS =
            listOf(
                "dini-bildirim",
                "talep",
            )
    }

    private fun shouldPrefetchFlavorAudio(audioFileName: String): Boolean =
        audioFileName.trim().lowercase() != DEFAULT_CONTENT_AUDIO_FILE_NAME

    private fun shouldPrefetchAllAudioOnFirstLaunch(packageName: String): Boolean =
        packageName == PACKAGE_NAMAZ_SURELERI

    private fun isPrayerTimesFlavor(packageName: String): Boolean = packageName in PRAYER_TIMES_PACKAGES

    private fun isZikirmatikFlavor(packageName: String): Boolean = packageName == PACKAGE_ZIKIRMATIK
}

private const val DEBUG_TIMBER_TAG = "timber_log"

/**
 * Forces all Timber logs to a single Logcat tag so filtering is easier during development.
 */
class FixedTagDebugTree : Timber.DebugTree() {
    override fun log(
        priority: Int,
        tag: String?,
        message: String,
        t: Throwable?,
    ) {
        if (!isLoggable(tag, priority)) return
        val payload =
            buildString {
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
    override fun log(
        priority: Int,
        tag: String?,
        message: String,
        t: Throwable?,
    ) {
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
