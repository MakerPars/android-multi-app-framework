package com.parsfilo.contentapp.feature.prayertimes.alarm

import android.content.Context
import android.content.pm.PackageManager
import com.parsfilo.contentapp.feature.prayertimes.model.PrayerAppVariant

internal object PrayerVariantResolver {
    const val META_PRAYER_VARIANT = "com.parsfilo.contentapp.PRAYER_VARIANT"
    private const val VARIANT_IMSAKIYE = "imsakiye"
    private const val VARIANT_NAMAZ = "namazvakitleri"

    fun resolve(context: Context): PrayerAppVariant {
        val metaVariant = runCatching {
            val appInfo = context.packageManager.getApplicationInfo(
                context.packageName,
                PackageManager.GET_META_DATA,
            )
            appInfo.metaData?.getString(META_PRAYER_VARIANT)?.trim()?.lowercase()
        }.getOrNull()

        return when (metaVariant) {
            VARIANT_IMSAKIYE -> PrayerAppVariant.IMSAKIYE
            VARIANT_NAMAZ -> PrayerAppVariant.NAMAZ_VAKITLERI
            else -> fallbackFromPackageName(context.packageName)
        }
    }

    private fun fallbackFromPackageName(packageName: String): PrayerAppVariant {
        return if (packageName.contains(VARIANT_IMSAKIYE, ignoreCase = true)) {
            PrayerAppVariant.IMSAKIYE
        } else {
            PrayerAppVariant.NAMAZ_VAKITLERI
        }
    }
}

