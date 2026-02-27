package com.parsfilo.contentapp.core.firebase.push

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.TimeUnit
import timber.log.Timber

class PushRegistrationSyncWorker(
    appContext: Context,
    params: WorkerParameters,
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        val deps = EntryPointAccessors.fromApplication(
            applicationContext,
            PushRegistrationSyncWorkerEntryPoint::class.java,
        )

        return runCatching {
            val synced = deps.pushRegistrationManager().syncRegistration("periodic_worker")
            if (synced) {
                Result.success()
            } else {
                Timber.w("Periodic push registration sync did not succeed.")
                Result.retry()
            }
        }.getOrElse { throwable ->
            Timber.w(throwable, "Periodic push registration sync failed.")
            Result.retry()
        }
    }

    companion object {
        private const val WORK_NAME = "push_registration_daily_sync"
        private const val REPEAT_INTERVAL_HOURS = 24L
        private const val FLEX_INTERVAL_HOURS = 6L

        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = PeriodicWorkRequestBuilder<PushRegistrationSyncWorker>(
                REPEAT_INTERVAL_HOURS,
                TimeUnit.HOURS,
                FLEX_INTERVAL_HOURS,
                TimeUnit.HOURS,
            )
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.UPDATE,
                request,
            )
        }
    }
}

@EntryPoint
@InstallIn(SingletonComponent::class)
interface PushRegistrationSyncWorkerEntryPoint {
    fun pushRegistrationManager(): PushRegistrationManager
}
