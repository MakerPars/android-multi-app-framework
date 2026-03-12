package com.parsfilo.contentapp.monetization

import android.app.Activity
import android.app.Application
import android.os.Bundle
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import timber.log.Timber
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppOpenLifecycleCoordinator @Inject constructor(
    private val adOrchestrator: AdOrchestrator,
) : Application.ActivityLifecycleCallbacks, DefaultLifecycleObserver {

    @Volatile
    private var currentActivity: Activity? = null

    private val isRegistered = AtomicBoolean(false)
    private val pendingForegroundRequest = AtomicBoolean(false)

    fun register(application: Application) {
        if (isRegistered.getAndSet(true)) {
            Timber.d("AppOpenLifecycleCoordinator already registered")
            return
        }
        application.registerActivityLifecycleCallbacks(this)
        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
        Timber.d("AppOpenLifecycleCoordinator registered")
    }

    override fun onStart(owner: LifecycleOwner) {
        val foregroundActivity = currentActivity
        if (foregroundActivity == null) {
            pendingForegroundRequest.set(true)
            Timber.d("Process onStart: activity not ready yet, app-open request queued")
            return
        }
        requestAppOpen(foregroundActivity, source = "process_on_start")
    }

    override fun onStop(owner: LifecycleOwner) {
        Timber.d("Process onStop: notifying app paused")
        adOrchestrator.onAppPaused(currentActivity?.applicationContext)
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) = Unit

    override fun onActivityStarted(activity: Activity) {
        if (!adOrchestrator.isAppOpenAdShowing()) {
            currentActivity = activity
            Timber.d("Activity started for app-open tracking=%s", activity::class.java.simpleName)
            if (pendingForegroundRequest.compareAndSet(true, false)) {
                requestAppOpen(activity, source = "activity_started_after_process_on_start")
            }
        }
    }

    override fun onActivityResumed(activity: Activity) = Unit

    override fun onActivityPaused(activity: Activity) = Unit

    override fun onActivityStopped(activity: Activity) = Unit

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) = Unit

    override fun onActivityDestroyed(activity: Activity) {
        if (currentActivity === activity) {
            Timber.d("Tracked activity destroyed=%s", activity::class.java.simpleName)
            currentActivity = null
        }
    }

    private fun requestAppOpen(activity: Activity, source: String) {
        Timber.d(
            "Requesting app-open source=%s activity=%s",
            source,
            activity::class.java.simpleName,
        )
        ProcessLifecycleOwner.get().lifecycleScope.launch {
            runCatching {
                adOrchestrator.showAppOpenAdIfEligible(activity)
            }.onFailure { error ->
                Timber.w(error, "Failed to show app open ad source=%s", source)
            }
        }
    }
}
