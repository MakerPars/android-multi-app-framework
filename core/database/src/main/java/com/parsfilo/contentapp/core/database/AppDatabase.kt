package com.parsfilo.contentapp.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.database.dao.prayer.PrayerTimesDao
import com.parsfilo.contentapp.core.database.model.NotificationEntity
import com.parsfilo.contentapp.core.database.model.prayer.PrayerCityEntity
import com.parsfilo.contentapp.core.database.model.prayer.PrayerCountryEntity
import com.parsfilo.contentapp.core.database.model.prayer.PrayerDistrictEntity
import com.parsfilo.contentapp.core.database.model.prayer.PrayerSyncStateEntity
import com.parsfilo.contentapp.core.database.model.prayer.PrayerTimeEntity

@Database(
    entities = [
        NotificationEntity::class,
        PrayerCountryEntity::class,
        PrayerCityEntity::class,
        PrayerDistrictEntity::class,
        PrayerTimeEntity::class,
        PrayerSyncStateEntity::class,
    ],
    version = 2,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao
    abstract fun prayerTimesDao(): PrayerTimesDao

    companion object {
        const val DATABASE_NAME = "app-database"

        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `prayer_country` (" +
                        "`country_id` INTEGER NOT NULL, " +
                        "`name_tr` TEXT NOT NULL, " +
                        "`name_en` TEXT NOT NULL, " +
                        "`fetched_at` INTEGER NOT NULL, " +
                        "PRIMARY KEY(`country_id`))"
                )
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `prayer_city` (" +
                        "`city_id` INTEGER NOT NULL, " +
                        "`country_id` INTEGER NOT NULL, " +
                        "`name_tr` TEXT NOT NULL, " +
                        "`name_en` TEXT NOT NULL, " +
                        "`fetched_at` INTEGER NOT NULL, " +
                        "PRIMARY KEY(`city_id`))"
                )
                db.execSQL(
                    "CREATE INDEX IF NOT EXISTS `index_prayer_city_country_id` " +
                        "ON `prayer_city` (`country_id`)"
                )
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `prayer_district` (" +
                        "`district_id` INTEGER NOT NULL, " +
                        "`city_id` INTEGER NOT NULL, " +
                        "`name_tr` TEXT NOT NULL, " +
                        "`name_en` TEXT NOT NULL, " +
                        "`fetched_at` INTEGER NOT NULL, " +
                        "PRIMARY KEY(`district_id`))"
                )
                db.execSQL(
                    "CREATE INDEX IF NOT EXISTS `index_prayer_district_city_id` " +
                        "ON `prayer_district` (`city_id`)"
                )
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `prayer_times` (" +
                        "`district_id` INTEGER NOT NULL, " +
                        "`local_date` TEXT NOT NULL, " +
                        "`imsak` TEXT NOT NULL, " +
                        "`gunes` TEXT NOT NULL, " +
                        "`ogle` TEXT NOT NULL, " +
                        "`ikindi` TEXT NOT NULL, " +
                        "`aksam` TEXT NOT NULL, " +
                        "`yatsi` TEXT NOT NULL, " +
                        "`fetched_at` INTEGER NOT NULL, " +
                        "PRIMARY KEY(`district_id`, `local_date`))"
                )
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `prayer_sync_state` (" +
                        "`district_id` INTEGER NOT NULL, " +
                        "`last_sync_at` INTEGER NOT NULL, " +
                        "`coverage_start` TEXT NOT NULL, " +
                        "`coverage_end` TEXT NOT NULL, " +
                        "`last_access_at` INTEGER NOT NULL, " +
                        "PRIMARY KEY(`district_id`))"
                )
            }
        }
    }
}
