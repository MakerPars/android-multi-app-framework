package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.MobileAds
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Consent durumunu temsil eden sealed interface.
 */
sealed interface ConsentStatus {
    data object Unknown : ConsentStatus
    data object Required : ConsentStatus
    data object Obtained : ConsentStatus
    data object NotRequired : ConsentStatus
    data class Error(val message: String) : ConsentStatus
}

/**
 * AdMob SDK başlatıcı + UMP (User Messaging Platform) onay yöneticisi.
 *
 * Flow:
 * 1. Activity.onCreate → [initialize]
 * 2. UMP consent kontrolü → [consentStatus] StateFlow güncellenir
 * 3. Consent OK → MobileAds.initialize
 * 4. SDK hazır → [onAdsInitialized] callback'i çağrılır
 */
@Singleton
class AdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) {
    companion object;

    private val isMobileAdsInitializeCalled = AtomicBoolean(false)
    @Volatile
    private var onAdsInitialized: (() -> Unit)? = null

    private val _consentStatus = MutableStateFlow<ConsentStatus>(ConsentStatus.Unknown)
    val consentStatus: StateFlow<ConsentStatus> = _consentStatus.asStateFlow()

    private val _isSdkReady = MutableStateFlow(false)
    val isSdkReady: StateFlow<Boolean> = _isSdkReady.asStateFlow()

    /**
     * AdMob SDK + UMP consent akışını başlatır.
     * @param activity Mevcut Activity
     * @param onReady SDK hazır olduğunda çağrılır (reklamları yüklemek için)
     */
    fun initialize(activity: Activity, onReady: () -> Unit = {}) {
        onAdsInitialized = onReady

        val params = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(false)
            .build()

        val consentInformation = UserMessagingPlatform.getConsentInformation(context)

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { loadAndShowError ->
                    if (loadAndShowError != null) {
                        Timber.w("Consent form error: ${loadAndShowError.message}")
                        _consentStatus.value = ConsentStatus.Error(
                            loadAndShowError.message ?: "Unknown consent error"
                        )
                    }
                    if (consentInformation.canRequestAds()) {
                        _consentStatus.value = ConsentStatus.Obtained
                        initializeMobileAdsSdk()
                    } else {
                        _consentStatus.value = ConsentStatus.Required
                    }
                }
            },
            { requestConsentError ->
                Timber.w("Consent info update error: ${requestConsentError.message}")
                _consentStatus.value = ConsentStatus.Error(
                    requestConsentError.message ?: "Consent info update failed"
                )
            },
        )

        // Pre-consent reklam yükleme (consent zaten verilmişse)
        if (consentInformation.canRequestAds()) {
            _consentStatus.value = ConsentStatus.NotRequired
            initializeMobileAdsSdk()
        }
    }

    private fun initializeMobileAdsSdk() {
        if (isMobileAdsInitializeCalled.getAndSet(true)) {
            return
        }

        // Main thread blocking issues fixed by moving to IO dispatcher
        CoroutineScope(ioDispatcher).launch {
            MobileAds.initialize(context) { initStatus ->
                Timber.d("MobileAds initialized: ${initStatus.adapterStatusMap}")
                _isSdkReady.value = true
                // Invoke and immediately null out to prevent Activity leak
                onAdsInitialized?.invoke()
                onAdsInitialized = null
            }
        }
    }
}
