package com.parsfilo.contentapp.feature.prayertimes.data

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Address
import android.os.Build
import android.location.Geocoder
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import timber.log.Timber
import java.io.IOException
import java.lang.ReflectiveOperationException
import java.util.Locale
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
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
        return withContext(Dispatchers.IO) { geocodeWithRetry(location.latitude, location.longitude) }
    }

    private suspend fun geocodeWithRetry(
        latitude: Double,
        longitude: Double,
    ): PrayerAddressCandidate? {
        val geocoder = Geocoder(context, Locale.getDefault())
        var lastException: Throwable? = null

        repeat(GEOCODER_MAX_RETRIES) { attempt ->
            try {
                val addresses = reverseGeocode(geocoder, latitude, longitude)
                val first = addresses.firstOrNull() ?: return null
                return PrayerAddressCandidate(
                    country = first.countryName.orEmpty(),
                    city = first.adminArea.orEmpty().ifBlank { first.locality.orEmpty() },
                    district = first.subAdminArea.orEmpty().ifBlank { first.subLocality.orEmpty() },
                )
            } catch (error: CancellationException) {
                throw error
            } catch (error: IOException) {
                // Common on some devices/networks: "service not available / UNAVAILABLE"
                lastException = error
                Timber.w(error, "Geocoder attempt ${attempt + 1}/$GEOCODER_MAX_RETRIES failed")
                if (attempt < GEOCODER_MAX_RETRIES - 1) {
                    delay(GEOCODER_RETRY_DELAY_MS)
                }
            } catch (error: IllegalArgumentException) {
                // Invalid lat/lon values should not happen, but if they do retry once.
                lastException = error
                Timber.w(error, "Geocoder attempt ${attempt + 1}/$GEOCODER_MAX_RETRIES failed")
                if (attempt < GEOCODER_MAX_RETRIES - 1) {
                    delay(GEOCODER_RETRY_DELAY_MS)
                }
            } catch (error: ReflectiveOperationException) {
                // Legacy reflection path may fail on OEM implementations.
                lastException = error
                Timber.w(error, "Geocoder attempt ${attempt + 1}/$GEOCODER_MAX_RETRIES failed")
                if (attempt < GEOCODER_MAX_RETRIES - 1) {
                    delay(GEOCODER_RETRY_DELAY_MS)
                }
            } catch (error: SecurityException) {
                // Common on some devices/networks: "service not available / UNAVAILABLE"
                lastException = error
                Timber.w(error, "Geocoder attempt ${attempt + 1}/$GEOCODER_MAX_RETRIES failed")
                if (attempt < GEOCODER_MAX_RETRIES - 1) {
                    delay(GEOCODER_RETRY_DELAY_MS)
                }
            }
        }

        Timber.w(lastException, "Geocoder exhausted $GEOCODER_MAX_RETRIES retries")
        return null
    }

    private suspend fun reverseGeocode(
        geocoder: Geocoder,
        latitude: Double,
        longitude: Double,
    ): List<Address> {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return geocodeAsync(
                geocoder = geocoder,
                latitude = latitude,
                longitude = longitude,
                maxResults = MAX_GEOCODER_RESULTS,
            )
        }

        return geocodeLegacyReflective(
            geocoder = geocoder,
            latitude = latitude,
            longitude = longitude,
            maxResults = MAX_GEOCODER_RESULTS,
        )
    }

    private suspend fun geocodeAsync(
        geocoder: Geocoder,
        latitude: Double,
        longitude: Double,
        maxResults: Int,
    ): List<Address> =
        suspendCancellableCoroutine { continuation ->
            geocoder.getFromLocation(
                latitude,
                longitude,
                maxResults,
                object : Geocoder.GeocodeListener {
                    override fun onGeocode(addresses: List<Address>) {
                        if (continuation.isActive) {
                            continuation.resume(addresses)
                        }
                    }

                    override fun onError(errorMessage: String?) {
                        if (continuation.isActive) {
                            continuation.resumeWithException(
                                IOException(
                                    errorMessage ?: "Geocoder asynchronous call returned an unknown error.",
                                ),
                            )
                        }
                    }
                },
            )
        }

    private fun geocodeLegacyReflective(
        geocoder: Geocoder,
        latitude: Double,
        longitude: Double,
        maxResults: Int,
    ): List<Address> {
        val result = Geocoder::class.java
            .getMethod(
                "getFromLocation",
                Double::class.javaPrimitiveType,
                Double::class.javaPrimitiveType,
                Int::class.javaPrimitiveType,
            )
            .invoke(geocoder, latitude, longitude, maxResults)

        if (result !is List<*>) {
            return emptyList()
        }

        return result.mapNotNull { it as? Address }
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
