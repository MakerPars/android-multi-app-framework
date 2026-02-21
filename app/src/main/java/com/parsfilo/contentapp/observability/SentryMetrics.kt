package com.parsfilo.contentapp.observability

import io.sentry.Breadcrumb
import io.sentry.Sentry
import io.sentry.SentryLevel
import timber.log.Timber

/**
 * Thin wrapper to keep metric emission safe and centralized.
 * All calls are no-op when Sentry is not initialized.
 */
object SentryMetrics {
    fun count(key: String, value: Double = 1.0, unit: String? = null) {
        runCatching {
            if (unit.isNullOrBlank()) {
                Sentry.metrics().count(key, value)
            } else {
                Sentry.metrics().count(key, value, unit)
            }
        }.onFailure { throwable ->
            Timber.v(throwable, "Sentry metric(count) failed: %s", key)
        }
    }

    fun gauge(key: String, value: Double, unit: String? = null) {
        runCatching {
            if (unit.isNullOrBlank()) {
                Sentry.metrics().gauge(key, value)
            } else {
                Sentry.metrics().gauge(key, value, unit)
            }
        }.onFailure { throwable ->
            Timber.v(throwable, "Sentry metric(gauge) failed: %s", key)
        }
    }

    fun distribution(key: String, value: Double, unit: String? = null) {
        runCatching {
            if (unit.isNullOrBlank()) {
                Sentry.metrics().distribution(key, value)
            } else {
                Sentry.metrics().distribution(key, value, unit)
            }
        }.onFailure { throwable ->
            Timber.v(throwable, "Sentry metric(distribution) failed: %s", key)
        }
    }

    fun breadcrumb(
        category: String,
        message: String,
        level: SentryLevel = SentryLevel.INFO,
    ) {
        runCatching {
            val crumb = Breadcrumb().apply {
                setCategory(category)
                setMessage(message)
                setLevel(level)
                setData("source", "android-multi-app-framework")
            }
            Sentry.addBreadcrumb(crumb)
        }.onFailure { throwable ->
            Timber.v(throwable, "Sentry breadcrumb failed: %s", category)
        }
    }
}
