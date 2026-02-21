package com.parsfilo.contentapp.core.database.di

import android.content.Context
import androidx.room.Room
import com.parsfilo.contentapp.core.database.AppDatabase
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.database.dao.prayer.PrayerTimesDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides
    @Singleton
    fun providesAppDatabase(
        @ApplicationContext context: Context,
    ): AppDatabase = Room.databaseBuilder(
        context,
        AppDatabase::class.java,
        AppDatabase.DATABASE_NAME
    )
    .addMigrations(AppDatabase.MIGRATION_1_2)
    // NOT: fallbackToDestructiveMigration kaldırıldı — production'da veri kaybını önlemek için
    // schema değişikliğinde proper migration yazılmalıdır.
    .build()

    @Provides
    fun providesNotificationDao(
        database: AppDatabase,
    ): NotificationDao = database.notificationDao()

    @Provides
    fun providesPrayerTimesDao(
        database: AppDatabase,
    ): PrayerTimesDao = database.prayerTimesDao()
}
