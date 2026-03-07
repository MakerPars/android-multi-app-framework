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
import com.parsfilo.contentapp.core.firebase.logAgeGateCompleted
import com.parsfilo.contentapp.core.firebase.logConsentDenied
import com.parsfilo.contentapp.core.firebase.logConsentError
import com.parsfilo.contentapp.core.firebase.logConsentFlowStarted
import com.parsfilo.contentapp.core.firebase.logConsentGranted
import com.parsfilo.contentapp.core.firebase.logConsentNotRequired
import com.parsfilo.contentapp.core.firebase.logConsentRefreshed
import com.parsfilo.contentapp.core.firebase.logPrivacyOptionsOpened
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
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
    private val consentSyncIdProvider: ConsentSyncIdProvider,
    @Dispatcher(AppDispatchers.IO) private val ioDispatcher: CoroutineDispatcher,
) {
    private val isMobileAdsInitializeCalled = AtomicBoolean(false)
    @Volatile
    private var onAdsInitialized: (() -> Unit)? = null

    private val initScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val uiScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private val _consentStatus = MutableStateFlow<ConsentStatus>(ConsentStatus.Unknown)
    val consentStatus: StateFlow<ConsentStatus> = _consentStatus.asStateFlow()

    private val _isSdkReady = MutableStateFlow(false)
    val isSdkReady: StateFlow<Boolean> = _isSdkReady.asStateFlow()

    private val _privacyOptionsRequired = MutableStateFlow(false)
    val privacyOptionsRequired: StateFlow<Boolean> = _privacyOptionsRequired.asStateFlow()

    private val _debugGeography = MutableStateFlow(UmpDebugGeography.NONE)
    val debugGeography: StateFlow<UmpDebugGeography> = _debugGeography.asStateFlow()
    private val _lastRequestDebugGeography = MutableStateFlow(UmpDebugGeography.NONE)
    val lastRequestDebugGeography: StateFlow<UmpDebugGeography> = _lastRequestDebugGeography.asStateFlow()
    private var lastFirebaseConsentGranted: Boolean? = null

    fun initialize(activity: Activity, onReady: () -> Unit = {}) {
        onAdsInitialized = onReady
        launchWithResolvedAgeGateStatus("initialize") { ageGateStatus ->
            AdsConsentRuntimeState.update(AdsPrivacyState.Gathering(ageGateStatus))
            appAnalytics.logConsentFlowStarted(trigger = "cold_start")
            val consentInformation = UserMessagingPlatform.getConsentInformation(context)
            val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)
            val expectedFormShown = !consentInformation.canRequestAds()

            consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                {
                    updatePrivacyOptionsState(consentInformation)
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { loadAndShowError ->
                        if (loadAndShowError != null) {
                            Timber.w("Consent form error: %s", loadAndShowError.message)
                            val errorStatus = ConsentStatus.Error(
                                loadAndShowError.message ?: "Unknown consent error",
                            )
                            _consentStatus.value = errorStatus
                            appAnalytics.logConsentError(
                                trigger = "cold_start",
                                message = loadAndShowError.message ?: "Unknown consent error",
                                ageGateResult = ageGateStatus.analyticsValue(),
                            )
                        }
                        applyConsentOutcome(
                            consentInformation = consentInformation,
                            ageGateStatus = ageGateStatus,
                            trigger = "cold_start",
                            umpFormShown = expectedFormShown,
                        )
                    }
                },
                { requestConsentError ->
                    Timber.w("Consent info update error: %s", requestConsentError.message)
                    val errorStatus = ConsentStatus.Error(
                        requestConsentError.message ?: "Consent info update failed",
                    )
                    _consentStatus.value = errorStatus
                    appAnalytics.logConsentError(
                        trigger = "cold_start",
                        message = requestConsentError.message ?: "Consent info update failed",
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    updatePrivacyOptionsState(consentInformation)
                    applyConsentRuntimeState(
                        consentStatus = errorStatus,
                        ageGateStatus = ageGateStatus,
                        privacyOptionsRequired = _privacyOptionsRequired.value,
                        canRequestAds = consentInformation.canRequestAds(),
                    )
                    if (consentInformation.canRequestAds()) {
                        initializeMobileAdsSdk(ageGateStatus)
                    } else {
                        applyGlobalRequestConfiguration(ageGateStatus)
                    }
                },
            )

            if (consentInformation.canRequestAds()) {
                updatePrivacyOptionsState(consentInformation)
                _consentStatus.value = ConsentStatus.NotRequired
                applyConsentRuntimeState(
                    consentStatus = ConsentStatus.NotRequired,
                    ageGateStatus = ageGateStatus,
                    privacyOptionsRequired = _privacyOptionsRequired.value,
                    canRequestAds = true,
                )
                appAnalytics.logConsentNotRequired(
                    trigger = "cold_start",
                    ageGateResult = ageGateStatus.analyticsValue(),
                )
                initializeMobileAdsSdk(ageGateStatus)
            } else {
                AdsConsentRuntimeState.update(
                    AdsPrivacyState.DeniedOrLimited(
                        consentStatus = ConsentStatus.Unknown,
                        privacyOptionsRequired = _privacyOptionsRequired.value,
                        ageGateStatus = ageGateStatus,
                    ),
                )
                applyFirebaseConsent(false)
            }
        }
    }

    fun refreshConsent(activity: Activity, onUpdated: (Boolean) -> Unit = {}) {
        launchWithResolvedAgeGateStatus("refreshConsent") { ageGateStatus ->
            val consentInformation = UserMessagingPlatform.getConsentInformation(context)
            val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)

            consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                {
                    updatePrivacyOptionsState(consentInformation)
                    val canRequestAds = consentInformation.canRequestAds()
                    applyConsentRuntimeState(
                        consentStatus = if (canRequestAds) ConsentStatus.Obtained else ConsentStatus.Required,
                        ageGateStatus = ageGateStatus,
                        privacyOptionsRequired = _privacyOptionsRequired.value,
                        canRequestAds = canRequestAds,
                    )
                    appAnalytics.logConsentRefreshed(
                        trigger = "runtime",
                        consentStatus = canRequestAds.analyticsConsentStatus(),
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    if (canRequestAds) {
                        initializeMobileAdsSdk(ageGateStatus)
                    } else {
                        applyGlobalRequestConfiguration(ageGateStatus)
                    }
                    onUpdated(canRequestAds)
                },
                { requestConsentError ->
                    Timber.w("Consent refresh error: %s", requestConsentError.message)
                    appAnalytics.logConsentError(
                        trigger = "runtime",
                        message = requestConsentError.message ?: "Consent refresh failed",
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    updatePrivacyOptionsState(consentInformation)
                    val canRequestAds = consentInformation.canRequestAds()
                    applyConsentRuntimeState(
                        consentStatus = if (canRequestAds) ConsentStatus.Obtained else ConsentStatus.Required,
                        ageGateStatus = ageGateStatus,
                        privacyOptionsRequired = _privacyOptionsRequired.value,
                        canRequestAds = canRequestAds,
                    )
                    appAnalytics.logConsentRefreshed(
                        trigger = "runtime_error_recover",
                        consentStatus = canRequestAds.analyticsConsentStatus(),
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    if (canRequestAds) {
                        initializeMobileAdsSdk(ageGateStatus)
                    } else {
                        applyGlobalRequestConfiguration(ageGateStatus)
                    }
                    onUpdated(canRequestAds)
                },
            )
        }
    }

    fun showPrivacyOptions(activity: Activity, onCompleted: (Boolean) -> Unit = {}) {
        val consentInformation = UserMessagingPlatform.getConsentInformation(context)
        updatePrivacyOptionsState(consentInformation)
        val isRequired =
            consentInformation.privacyOptionsRequirementStatus ==
                ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
        appAnalytics.logPrivacyOptionsOpened(required = isRequired)
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
        launchWithResolvedAgeGateStatus("showConsentFormIfRequired") { ageGateStatus ->
            AdsConsentRuntimeState.update(AdsPrivacyState.Gathering(ageGateStatus))
            appAnalytics.logConsentFlowStarted(trigger = "debug_menu")
            val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)
            val consentInformation = UserMessagingPlatform.getConsentInformation(context)
            consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                {
                    updatePrivacyOptionsState(consentInformation)
                    val expectedFormShown = !consentInformation.canRequestAds()
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { formError ->
                        if (formError != null) {
                            Timber.w("Debug consent form error: %s", formError.message)
                            appAnalytics.logConsentError(
                                trigger = "debug_menu",
                                message = formError.message ?: "Debug consent form error",
                                ageGateResult = ageGateStatus.analyticsValue(),
                            )
                            refreshConsent(activity) { onCompleted(false) }
                        } else {
                            applyConsentOutcome(
                                consentInformation = consentInformation,
                                ageGateStatus = ageGateStatus,
                                trigger = "debug_menu",
                                umpFormShown = expectedFormShown,
                            )
                            refreshConsent(activity) { onCompleted(true) }
                        }
                    }
                },
                { requestError ->
                    Timber.w("Debug consent request update error: %s", requestError.message)
                    appAnalytics.logConsentError(
                        trigger = "debug_menu",
                        message = requestError.message ?: "Debug consent request update error",
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    refreshConsent(activity) { onCompleted(false) }
                },
            )
        }
    }

    fun resetConsent() {
        UserMessagingPlatform.getConsentInformation(context).reset()
        AdsConsentRuntimeState.update(AdsPrivacyState.Unknown)
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
        trigger: String,
        umpFormShown: Boolean,
    ) {
        if (consentInformation.canRequestAds()) {
            _consentStatus.value = ConsentStatus.Obtained
            applyConsentRuntimeState(
                consentStatus = ConsentStatus.Obtained,
                ageGateStatus = ageGateStatus,
                privacyOptionsRequired = _privacyOptionsRequired.value,
                canRequestAds = true,
            )
            appAnalytics.logConsentGranted(
                trigger = trigger,
                umpFormShown = umpFormShown,
                ageGateResult = ageGateStatus.analyticsValue(),
            )
            initializeMobileAdsSdk(ageGateStatus)
        } else {
            _consentStatus.value = ConsentStatus.Required
            applyConsentRuntimeState(
                consentStatus = ConsentStatus.Required,
                ageGateStatus = ageGateStatus,
                privacyOptionsRequired = _privacyOptionsRequired.value,
                canRequestAds = false,
            )
            appAnalytics.logConsentDenied(
                trigger = trigger,
                umpFormShown = umpFormShown,
                ageGateResult = ageGateStatus.analyticsValue(),
            )
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
        val builder = MobileAds.getRequestConfiguration().toBuilder()
            .setTagForChildDirectedTreatment(ageGateStatus.childDirectedTreatmentTag())
            .setTagForUnderAgeOfConsent(ageGateStatus.underAgeOfConsentTag())
            .setMaxAdContentRating(ageGateStatus.maxAdContentRating())
        MobileAds.setRequestConfiguration(builder.build())
    }

    private suspend fun buildConsentRequestParameters(
        ageGateStatus: AdAgeGateStatus,
        debugGeography: UmpDebugGeography,
    ): ConsentRequestParameters {
        val builder = ConsentRequestParameters.Builder()
            .setTagForUnderAgeOfConsent(ageGateStatus.requiresTfua())
        val consentSyncId = consentSyncIdProvider.getConsentSyncIdOrNull()
        if (!consentSyncId.isNullOrBlank()) {
            builder.setConsentSyncId(consentSyncId)
        } else {
            Timber.d("Consent sync id unavailable; continuing without cross-app sync id")
        }

        val effectiveDebugGeography =
            if (isDebugBuild() && debugGeography != UmpDebugGeography.NONE) {
                debugGeography
            } else {
                UmpDebugGeography.NONE
            }
        _lastRequestDebugGeography.value = effectiveDebugGeography

        if (effectiveDebugGeography != UmpDebugGeography.NONE) {
            val debugSettings = ConsentDebugSettings.Builder(context)
                .setDebugGeography(effectiveDebugGeography.umpValue)
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

    private fun applyConsentRuntimeState(
        consentStatus: ConsentStatus,
        ageGateStatus: AdAgeGateStatus,
        privacyOptionsRequired: Boolean,
        canRequestAds: Boolean,
    ) {
        AdsConsentRuntimeState.update(
            if (canRequestAds) {
                AdsPrivacyState.CanRequestAds(
                    consentStatus = consentStatus,
                    privacyOptionsRequired = privacyOptionsRequired,
                    ageGateStatus = ageGateStatus,
                )
            } else {
                AdsPrivacyState.DeniedOrLimited(
                    consentStatus = consentStatus,
                    privacyOptionsRequired = privacyOptionsRequired,
                    ageGateStatus = ageGateStatus,
                )
            },
        )
        applyFirebaseConsent(canRequestAds)
        _consentStatus.value = consentStatus
    }

    private fun applyFirebaseConsent(consentGranted: Boolean) {
        if (lastFirebaseConsentGranted == consentGranted) return
        try {
            val consentFlags = mapToFirebaseConsentGrantedFlags(consentGranted)
            appAnalytics.setConsent(
                adStorageGranted = consentFlags.adStorageGranted,
                analyticsStorageGranted = consentFlags.analyticsStorageGranted,
                adUserDataGranted = consentFlags.adUserDataGranted,
                adPersonalizationGranted = consentFlags.adPersonalizationGranted,
            )
            appAnalytics.setAnalyticsCollectionEnabled(consentGranted)
            Timber.d("Firebase consent updated: granted=%s", consentGranted)
            lastFirebaseConsentGranted = consentGranted
        } catch (t: Throwable) {
            Timber.w(t, "Failed to update Firebase consent mapping")
        }
    }

    private suspend fun resolveAgeGateStatus(): AdAgeGateStatus =
        withContext(ioDispatcher) {
            AdAgeGateStatus.fromStorage(preferencesDataSource.userData.first().adsAgeGateStatus)
        }

    private fun launchWithResolvedAgeGateStatus(
        operation: String,
        block: suspend (AdAgeGateStatus) -> Unit,
    ) {
        uiScope.launch {
            val ageGateStatus =
                runCatching { resolveAgeGateStatus() }
                    .onFailure { Timber.w(it, "Failed to resolve age gate status for %s", operation) }
                    .getOrDefault(AdAgeGateStatus.UNKNOWN)
            appAnalytics.logAgeGateCompleted(ageGateStatus.analyticsValue())
            block(ageGateStatus)
        }
    }

    private fun isDebugBuild(): Boolean =
        (context.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
}

internal data class FirebaseConsentGrantedFlags(
    val adStorageGranted: Boolean,
    val analyticsStorageGranted: Boolean,
    val adUserDataGranted: Boolean,
    val adPersonalizationGranted: Boolean,
)

internal fun mapToFirebaseConsentGrantedFlags(granted: Boolean): FirebaseConsentGrantedFlags =
    FirebaseConsentGrantedFlags(
        adStorageGranted = granted,
        analyticsStorageGranted = granted,
        adUserDataGranted = granted,
        adPersonalizationGranted = granted,
    )

private fun Boolean.analyticsConsentStatus(): String = if (this) "granted" else "denied"

private fun AdAgeGateStatus.analyticsValue(): String =
    when (this) {
        AdAgeGateStatus.UNKNOWN -> "unknown"
        AdAgeGateStatus.UNDER_13 -> "under_13"
        AdAgeGateStatus.AGE_13_TO_15 -> "age_13_to_15"
        AdAgeGateStatus.AGE_16_OR_OVER -> "age_16_or_over"
    }

private fun AdAgeGateStatus.requiresTfua(): Boolean =
    this == AdAgeGateStatus.UNDER_13 || this == AdAgeGateStatus.AGE_13_TO_15

private fun AdAgeGateStatus.childDirectedTreatmentTag(): Int =
    when (this) {
        AdAgeGateStatus.UNDER_13 -> RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE
        AdAgeGateStatus.UNKNOWN,
        AdAgeGateStatus.AGE_13_TO_15,
        AdAgeGateStatus.AGE_16_OR_OVER,
        -> RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_UNSPECIFIED
    }

private fun AdAgeGateStatus.underAgeOfConsentTag(): Int =
    if (requiresTfua()) {
        RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE
    } else {
        RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_FALSE
    }

private fun AdAgeGateStatus.maxAdContentRating(): String? =
    when (this) {
        AdAgeGateStatus.UNDER_13 -> RequestConfiguration.MAX_AD_CONTENT_RATING_G
        AdAgeGateStatus.AGE_13_TO_15 -> RequestConfiguration.MAX_AD_CONTENT_RATING_T
        AdAgeGateStatus.UNKNOWN,
        AdAgeGateStatus.AGE_16_OR_OVER,
        -> null
    }
