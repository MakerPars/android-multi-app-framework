package com.parsfilo.contentapp.feature.counter.alarm

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.counter.data.ZikirRepository
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first

class ZikirStreakCheckWorker(
    appContext: Context,
    params: WorkerParameters,
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        val deps = EntryPointAccessors.fromApplication(
            applicationContext,
            ZikirStreakWorkerEntryPoint::class.java,
        )

        val prefs = deps.preferencesDataSource()
        val streakReminderEnabled = prefs.zikirStreakReminderEnabled.first()
        if (!streakReminderEnabled) return Result.success()

        val dailyGoal = prefs.zikirDailyGoal.first()
        val todayTotal = deps.zikirRepository().getTodayTotalCount().first()
        if (todayTotal >= dailyGoal) return Result.success()

        val streak = deps.zikirRepository().getOrCreateStreak()
        if (streak.currentStreak <= 0) return Result.success()

        deps.zikirReminderNotifier().showStreakReminder(streak.currentStreak)
        return Result.success()
    }
}

@EntryPoint
@InstallIn(SingletonComponent::class)
interface ZikirStreakWorkerEntryPoint {
    fun zikirRepository(): ZikirRepository
    fun preferencesDataSource(): PreferencesDataSource
    fun zikirReminderNotifier(): ZikirReminderNotifier
}