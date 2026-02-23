package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration
import com.google.android.ump.ConsentDebugSettings
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import com.parsfilo.contentapp.core.common.network.AppDispatchers
import com.parsfilo.contentapp.core.common.network.Dispatcher
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import timber.log.Timber
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject
import javax.inject.Singleton

sealed interface ConsentStatus {
    data object Unknown : ConsentStatus
    data object Required : ConsentStatus
    data object Obtained : ConsentStatus
    data object NotRequired : ConsentStatus
    data class Error(val message: String) : ConsentStatus
}

enum class UmpDebugGeography(val umpValue: Int) {
    NONE(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_DISABLED),
    EEA(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_EEA),
    US_STATES(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_REGULATED_US_STATE),
}

@Singleton
class AdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferencesDataSource: PreferencesDataSource,
    private val appAnalytics: AppAnalytics,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) {
    private val isMobileAdsInitializeCalled = AtomicBoolean(false)
    @Volatile
    private var onAdsInitialized: (() -> Unit)? = null

    private val initScope = CoroutineScope(SupervisorJob() + ioDispatcher)

    private val _consentStatus = MutableStateFlow<ConsentStatus>(ConsentStatus.Unknown)
    val consentStatus: StateFlow<ConsentStatus> = _consentStatus.asStateFlow()

    private val _isSdkReady = MutableStateFlow(false)
    val isSdkReady: StateFlow<Boolean> = _isSdkReady.asStateFlow()

    private val _privacyOptionsRequired = MutableStateFlow(false)
    val privacyOptionsRequired: StateFlow<Boolean> = _privacyOptionsRequired.asStateFlow()

    private val _debugGeography = MutableStateFlow(UmpDebugGeography.NONE)
    val debugGeography: StateFlow<UmpDebugGeography> = _debugGeography.asStateFlow()
    private var lastFirebaseConsentGranted: Boolean? = null

    fun initialize(activity: Activity, onReady: () -> Unit = {}) {
        onAdsInitialized = onReady
        AdsConsentRuntimeState.update(false)

        val consentInformation = UserMessagingPlatform.getConsentInformation(context)
        val ageGateStatus = currentAgeGateStatus()
        val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                updatePrivacyOptionsState(consentInformation)
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { loadAndShowError ->
                    if (loadAndShowError != null) {
                        Timber.w("Consent form error: %s", loadAndShowError.message)
                        _consentStatus.value = ConsentStatus.Error(
                            loadAndShowError.message ?: "Unknown consent error",
                        )
                    }
                    applyConsentOutcome(consentInformation, ageGateStatus)
                }
            },
            { requestConsentError ->
                Timber.w("Consent info update error: %s", requestConsentError.message)
                _consentStatus.value = ConsentStatus.Error(
                    requestConsentError.message ?: "Consent info update failed",
                )
                updatePrivacyOptionsState(consentInformation)
                applyConsentRuntimeState(consentInformation.canRequestAds())
            },
        )

        if (consentInformation.canRequestAds()) {
            updatePrivacyOptionsState(consentInformation)
            applyConsentRuntimeState(true)
            _consentStatus.value = ConsentStatus.NotRequired
            initializeMobileAdsSdk(ageGateStatus)
        } else {
            AdsConsentRuntimeState.update(false)
            applyFirebaseConsent(false)
        }
    }

    fun refreshConsent(activity: Activity, onUpdated: (Boolean) -> Unit = {}) {
        val consentInformation = UserMessagingPlatform.getConsentInformation(context)
        val ageGateStatus = currentAgeGateStatus()
        val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                updatePrivacyOptionsState(consentInformation)
                val canRequestAds = consentInformation.canRequestAds()
                applyConsentRuntimeState(canRequestAds)
                if (canRequestAds) {
                    initializeMobileAdsSdk(ageGateStatus)
                } else {
                    applyGlobalRequestConfiguration(ageGateStatus)
                }
                onUpdated(canRequestAds)
            },
            { requestConsentError ->
                Timber.w("Consent refresh error: %s", requestConsentError.message)
                updatePrivacyOptionsState(consentInformation)
                val canRequestAds = consentInformation.canRequestAds()
                applyConsentRuntimeState(canRequestAds)
                if (canRequestAds) {
                    initializeMobileAdsSdk(ageGateStatus)
                } else {
                    applyGlobalRequestConfiguration(ageGateStatus)
                }
                onUpdated(canRequestAds)
            },
        )
    }

    fun showPrivacyOptions(activity: Activity, onCompleted: (Boolean) -> Unit = {}) {
        val consentInformation = UserMessagingPlatform.getConsentInformation(context)
        updatePrivacyOptionsState(consentInformation)
        val isRequired =
            consentInformation.privacyOptionsRequirementStatus ==
                ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
        if (!isRequired) {
            Timber.d("Privacy options not required in this region/session")
            onCompleted(false)
            return
        }

        UserMessagingPlatform.showPrivacyOptionsForm(activity) { formError ->
            if (formError != null) {
                Timber.w("Privacy options form error: %s", formError.message)
                refreshConsent(activity) {
                    onCompleted(false)
                }
            } else {
                refreshConsent(activity) {
                    onCompleted(true)
                }
            }
        }
    }

    fun showConsentFormIfRequired(activity: Activity, onCompleted: (Boolean) -> Unit = {}) {
        val ageGateStatus = currentAgeGateStatus()
        val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)
        val consentInformation = UserMessagingPlatform.getConsentInformation(context)
        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                updatePrivacyOptionsState(consentInformation)
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { formError ->
                    if (formError != null) {
                        Timber.w("Debug consent form error: %s", formError.message)
                        refreshConsent(activity) { onCompleted(false) }
                    } else {
                        refreshConsent(activity) { onCompleted(true) }
                    }
                }
            },
            { requestError ->
                Timber.w("Debug consent request update error: %s", requestError.message)
                refreshConsent(activity) { onCompleted(false) }
            },
        )
    }

    fun resetConsent() {
        UserMessagingPlatform.getConsentInformation(context).reset()
        AdsConsentRuntimeState.update(false)
        applyFirebaseConsent(false)
        _consentStatus.value = ConsentStatus.Unknown
        _privacyOptionsRequired.value = false
    }

    fun setConsentDebugGeography(geography: UmpDebugGeography) {
        _debugGeography.value = geography
        Timber.d("UMP debug geography set to %s", geography)
    }

    fun openAdInspector(activity: Activity, onResult: (String?) -> Unit = {}) {
        MobileAds.openAdInspector(activity) { error ->
            if (error != null) {
                Timber.w("Ad Inspector error: %s", error.message)
                onResult(error.message)
            } else {
                onResult(null)
            }
        }
    }

    fun onAdsConfigChanged(activity: Activity, onUpdated: (Boolean) -> Unit = {}) {
        refreshConsent(activity, onUpdated)
    }

    private fun applyConsentOutcome(
        consentInformation: ConsentInformation,
        ageGateStatus: AdAgeGateStatus,
    ) {
        if (consentInformation.canRequestAds()) {
            applyConsentRuntimeState(true)
            _consentStatus.value = ConsentStatus.Obtained
            initializeMobileAdsSdk(ageGateStatus)
        } else {
            applyConsentRuntimeState(false)
            _consentStatus.value = ConsentStatus.Required
            applyGlobalRequestConfiguration(ageGateStatus)
        }
    }

    private fun initializeMobileAdsSdk(ageGateStatus: AdAgeGateStatus) {
        applyGlobalRequestConfiguration(ageGateStatus)

        if (isMobileAdsInitializeCalled.getAndSet(true)) return

        initScope.launch {
            MobileAds.initialize(context) { initStatus ->
                Timber.d("MobileAds initialized: %s", initStatus.adapterStatusMap)
                _isSdkReady.value = true
                onAdsInitialized?.invoke()
                onAdsInitialized = null
                initScope.cancel()
            }
        }
    }

    private fun applyGlobalRequestConfiguration(ageGateStatus: AdAgeGateStatus) {
        val isUnderAge = ageGateStatus != AdAgeGateStatus.AGE_16_OR_OVER
        val builder = MobileAds.getRequestConfiguration().toBuilder()
            .setTagForChildDirectedTreatment(
                RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_UNSPECIFIED,
            )
            .setTagForUnderAgeOfConsent(
                if (isUnderAge) {
                    RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE
                } else {
                    RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_FALSE
                },
            )
        if (isUnderAge) {
            builder.setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_T)
        }
        MobileAds.setRequestConfiguration(builder.build())
    }

    private fun buildConsentRequestParameters(
        ageGateStatus: AdAgeGateStatus,
        debugGeography: UmpDebugGeography,
    ): ConsentRequestParameters {
        val builder = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(ageGateStatus != AdAgeGateStatus.AGE_16_OR_OVER)

        if (isDebugBuild() && debugGeography != UmpDebugGeography.NONE) {
            val debugSettings = ConsentDebugSettings.Builder(context)
                .setDebugGeography(debugGeography.umpValue)
                .build()
            builder.setConsentDebugSettings(debugSettings)
        }

        return builder.build()
    }

    private fun updatePrivacyOptionsState(consentInformation: ConsentInformation) {
        _privacyOptionsRequired.value =
            consentInformation.privacyOptionsRequirementStatus ==
                ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
    }

    private fun applyConsentRuntimeState(canRequestAds: Boolean) {
        AdsConsentRuntimeState.update(canRequestAds)
        applyFirebaseConsent(canRequestAds)
        _consentStatus.value = if (canRequestAds) {
            ConsentStatus.Obtained
        } else {
            ConsentStatus.Required
        }
    }

    private fun applyFirebaseConsent(consentGranted: Boolean) {
        if (lastFirebaseConsentGranted == consentGranted) return
        try {
            val (adStorageGranted, analyticsStorageGranted) =
                mapToFirebaseConsentGrantedFlags(consentGranted)
            appAnalytics.setConsent(
                adStorageGranted = adStorageGranted,
                analyticsStorageGranted = analyticsStorageGranted,
            )
            appAnalytics.setAnalyticsCollectionEnabled(consentGranted)
            Timber.d("Firebase consent updated: granted=%s", consentGranted)
            lastFirebaseConsentGranted = consentGranted
        } catch (t: Throwable) {
            Timber.w(t, "Failed to update Firebase consent mapping")
        }
    }

    private fun currentAgeGateStatus(): AdAgeGateStatus =
        runBlocking(ioDispatcher) {
            AdAgeGateStatus.fromStorage(preferencesDataSource.userData.first().adsAgeGateStatus)
        }

    private fun isDebugBuild(): Boolean =
        (context.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
}

internal fun mapToFirebaseConsentGrantedFlags(granted: Boolean): Pair<Boolean, Boolean> =
    granted to granted
