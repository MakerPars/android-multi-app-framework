package com.parsfilo.contentapp.feature.prayertimes.data

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.Geocoder
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import timber.log.Timber
import java.io.IOException
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PrayerLocationResolver @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    fun hasLocationPermission(): Boolean {
        val fineGranted = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION,
        ) == PackageManager.PERMISSION_GRANTED

        val coarseGranted = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION,
        ) == PackageManager.PERMISSION_GRANTED

        return fineGranted || coarseGranted
    }

    @SuppressLint("MissingPermission")
    suspend fun resolveAddressCandidate(): PrayerAddressCandidate? {
        if (!hasLocationPermission()) return null

        val location = withTimeoutOrNull(LOCATION_TIMEOUT_MS) {
            val fused = LocationServices.getFusedLocationProviderClient(context)
            fused.lastLocation.await()
        } ?: return null

        if (!Geocoder.isPresent()) {
            Timber.w("Geocoder service is not present on this device")
            return null
        }

        // Geocoder.getFromLocation() is a blocking network call —
        // must run on IO dispatcher to avoid ANR and to ensure IOException
        // is properly caught within the coroutine context.
        return withContext(Dispatchers.IO) {
            geocodeWithRetry(location.latitude, location.longitude)
        }
    }

    private fun geocodeWithRetry(
        latitude: Double,
        longitude: Double,
    ): PrayerAddressCandidate? {
        val geocoder = Geocoder(context, Locale.getDefault())
        var lastException: IOException? = null

        repeat(GEOCODER_MAX_RETRIES) { attempt ->
            try {
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(
                    latitude,
                    longitude,
                    MAX_GEOCODER_RESULTS,
                )
                val first = addresses?.firstOrNull() ?: return null
                return PrayerAddressCandidate(
                    country = first.countryName.orEmpty(),
                    city = first.adminArea.orEmpty().ifBlank { first.locality.orEmpty() },
                    district = first.subAdminArea.orEmpty().ifBlank { first.subLocality.orEmpty() },
                )
            } catch (io: IOException) {
                // Common on some devices/networks: "service not available / UNAVAILABLE"
                lastException = io
                Timber.w(io, "Geocoder attempt ${attempt + 1}/$GEOCODER_MAX_RETRIES failed")
                if (attempt < GEOCODER_MAX_RETRIES - 1) {
                    try {
                        Thread.sleep(GEOCODER_RETRY_DELAY_MS)
                    } catch (ie: InterruptedException) {
                        Thread.currentThread().interrupt()
                        Timber.w(ie, "Geocoder retry sleep interrupted")
                        return null
                    }
                }
            } catch (se: SecurityException) {
                Timber.w(se, "Location permission was revoked while resolving geocoder")
                return null
            } catch (e: IllegalStateException) {
                Timber.w(e, "Unexpected geocoder failure")
                return null
            } catch (e: IllegalArgumentException) {
                Timber.w(e, "Unexpected geocoder failure")
                return null
            }
        }

        Timber.w(lastException, "Geocoder exhausted $GEOCODER_MAX_RETRIES retries")
        return null
    }
}

data class PrayerAddressCandidate(
    val country: String,
    val city: String,
    val district: String,
)

private const val MAX_GEOCODER_RESULTS = 1
private const val LOCATION_TIMEOUT_MS = 8_000L
private const val GEOCODER_MAX_RETRIES = 2
private const val GEOCODER_RETRY_DELAY_MS = 500L
