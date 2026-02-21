package com.parsfilo.contentapp.core.firebase

import android.os.Bundle
import com.google.firebase.analytics.FirebaseAnalytics
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Merkezi analytics event loglama yardımcısı (Core).
 *
 * Domain spesifik eventler extension dosyalarına ayrılmıştır:
 * - AnalyticsContent.kt
 * - AnalyticsAudio.kt
 * - AnalyticsAds.kt
 * - AnalyticsBilling.kt
 * - AnalyticsSharing.kt
 * - AnalyticsUser.kt
 * - AnalyticsScreen.kt
 * - AnalyticsLegacy.kt
 */
@Singleton
class AppAnalytics @Inject constructor(
    internal val analytics: FirebaseAnalytics
) {
    /**
     * Extension fonksiyonlar tarafından kullanılan generic loglama metodu.
     */
    fun logEvent(name: String, params: Bundle? = null) {
        analytics.logEvent(name, params)
    }

    fun setUserId(userId: String?) {
        analytics.setUserId(userId)
    }

    fun setUserProperty(name: String, value: String?) {
        analytics.setUserProperty(name, value)
    }

    fun setAnalyticsCollectionEnabled(enabled: Boolean) {
        analytics.setAnalyticsCollectionEnabled(enabled)
    }

    fun setDefaultEventParameters(params: Bundle) {
        analytics.setDefaultEventParameters(params)
    }
}
