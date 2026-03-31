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
import com.parsfilo.contentapp.core.firebase.logConsentDebugResult
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

sealed interface UmpConsentDebugResult {
    data object Idle : UmpConsentDebugResult
    data object Shown : UmpConsentDebugResult
    data object NotRequired : UmpConsentDebugResult
    data class Error(val message: String) : UmpConsentDebugResult
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
    private val _canRequestAds = MutableStateFlow(false)
    val canRequestAds: StateFlow<Boolean> = _canRequestAds.asStateFlow()

    private val _debugGeography = MutableStateFlow(UmpDebugGeography.NONE)
    val debugGeography: StateFlow<UmpDebugGeography> = _debugGeography.asStateFlow()
    private val _lastRequestDebugGeography = MutableStateFlow(UmpDebugGeography.NONE)
    val lastRequestDebugGeography: StateFlow<UmpDebugGeography> = _lastRequestDebugGeography.asStateFlow()
    private val _lastConsentDebugResult = MutableStateFlow<UmpConsentDebugResult>(UmpConsentDebugResult.Idle)
    val lastConsentDebugResult: StateFlow<UmpConsentDebugResult> = _lastConsentDebugResult.asStateFlow()
    private var lastFirebaseConsentFlags: FirebaseConsentGrantedFlags? = null

    fun initialize(activity: Activity, onReady: () -> Unit = {}) {
        Timber.d("AdManager initialize requested")
        onAdsInitialized = onReady
        launchWithResolvedAgeGateStatus("initialize") { ageGateStatus ->
            Timber.d("AdManager initialize ageGate=%s", ageGateStatus.analyticsValue())
            AdsConsentRuntimeState.update(AdsPrivacyState.Gathering(ageGateStatus))
            ConsentFunnelDebugDashboard.onConsentStarted(trigger = "cold_start")
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
                        ConsentFunnelDebugDashboard.onConsentOutcome(
                            granted = true,
                            trigger = "cold_start_error",
                        )
                        initializeMobileAdsSdk(ageGateStatus)
                    } else {
                        ConsentFunnelDebugDashboard.onConsentOutcome(
                            granted = false,
                            trigger = "cold_start_error",
                        )
                        applyGlobalRequestConfiguration(ageGateStatus)
                    }
                },
            )

            if (consentInformation.canRequestAds()) {
                Timber.d("AdManager initialize: consent already granted from previous session")
                ConsentFunnelDebugDashboard.onConsentOutcome(
                    granted = true,
                    trigger = "cold_start_cached",
                )
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
        Timber.d("AdManager refreshConsent requested")
        launchWithResolvedAgeGateStatus("refreshConsent") { ageGateStatus ->
            val consentInformation = UserMessagingPlatform.getConsentInformation(context)
            val params = buildConsentRequestParameters(ageGateStatus, _debugGeography.value)

            consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                {
                    updatePrivacyOptionsState(consentInformation)
                    val canRequestAds = consentInformation.canRequestAds()
                    Timber.d("AdManager refreshConsent updated canRequestAds=%s", canRequestAds)
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
        Timber.d("AdManager showPrivacyOptions requested")
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

    fun showConsentFormIfRequired(
        activity: Activity,
        onCompleted: (UmpConsentDebugResult) -> Unit = {},
    ) {
        Timber.d("AdManager showConsentFormIfRequired requested")
        launchWithResolvedAgeGateStatus("showConsentFormIfRequired") { ageGateStatus ->
            AdsConsentRuntimeState.update(AdsPrivacyState.Gathering(ageGateStatus))
            ConsentFunnelDebugDashboard.onConsentStarted(trigger = "debug_menu")
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
                            val result = UmpConsentDebugResult.Error(
                                formError.message ?: "Debug consent form error",
                            )
                            updateConsentDebugResult(result, consentInformation)
                            appAnalytics.logConsentError(
                                trigger = "debug_menu",
                                message = formError.message ?: "Debug consent form error",
                                ageGateResult = ageGateStatus.analyticsValue(),
                            )
                            ConsentFunnelDebugDashboard.onConsentOutcome(
                                granted = consentInformation.canRequestAds(),
                                trigger = "debug_menu_error",
                            )
                            refreshConsent(activity) { onCompleted(result) }
                        } else {
                            val result =
                                if (expectedFormShown) {
                                    UmpConsentDebugResult.Shown
                                } else {
                                    UmpConsentDebugResult.NotRequired
                                }
                            applyConsentOutcome(
                                consentInformation = consentInformation,
                                ageGateStatus = ageGateStatus,
                                trigger = "debug_menu",
                                umpFormShown = expectedFormShown,
                            )
                            updateConsentDebugResult(result, consentInformation)
                            refreshConsent(activity) { onCompleted(result) }
                        }
                    }
                },
                { requestError ->
                    Timber.w("Debug consent request update error: %s", requestError.message)
                    val result = UmpConsentDebugResult.Error(
                        requestError.message ?: "Debug consent request update error",
                    )
                    updateConsentDebugResult(result, consentInformation)
                    appAnalytics.logConsentError(
                        trigger = "debug_menu",
                        message = requestError.message ?: "Debug consent request update error",
                        ageGateResult = ageGateStatus.analyticsValue(),
                    )
                    ConsentFunnelDebugDashboard.onConsentOutcome(
                        granted = consentInformation.canRequestAds(),
                        trigger = "debug_menu_request_error",
                    )
                    refreshConsent(activity) { onCompleted(result) }
                },
            )
        }
    }

    fun resetConsent() {
        Timber.d("AdManager resetConsent")
        UserMessagingPlatform.getConsentInformation(context).reset()
        AdsConsentRuntimeState.update(AdsPrivacyState.Unknown)
        applyFirebaseConsent(false)
        _consentStatus.value = ConsentStatus.Unknown
        _privacyOptionsRequired.value = false
        _canRequestAds.value = false
        _lastConsentDebugResult.value = UmpConsentDebugResult.Idle
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
        ConsentFunnelDebugDashboard.onConsentOutcome(
            granted = consentInformation.canRequestAds(),
            trigger = trigger,
        )
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

        if (isMobileAdsInitializeCalled.getAndSet(true)) {
            Timber.d("MobileAds initialize skipped: already initialized")
            return
        }

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
        Timber.d(
            "Applying request configuration ageGate=%s childTag=%d underAgeTag=%d maxRating=%s",
            ageGateStatus.analyticsValue(),
            ageGateStatus.childDirectedTreatmentTag(),
            ageGateStatus.underAgeOfConsentTag(),
            ageGateStatus.maxAdContentRating(),
        )
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
        _canRequestAds.value = canRequestAds
        _consentStatus.value = consentStatus
    }

    private fun updateConsentDebugResult(
        result: UmpConsentDebugResult,
        consentInformation: ConsentInformation,
    ) {
        _lastConsentDebugResult.value = result
        appAnalytics.logConsentDebugResult(
            packageName = context.packageName,
            result = result.analyticsValue(),
            requestGeography = _lastRequestDebugGeography.value.name,
            canRequestAds = consentInformation.canRequestAds(),
            privacyOptionsRequired = _privacyOptionsRequired.value,
        )
    }

    private fun applyFirebaseConsent(consentGranted: Boolean) {
        runCatching {
            val consentSignals = readConsentSignals()
            val consentFlags = mapToFirebaseConsentGrantedFlags(
                canRequestAds = consentGranted,
                signals = consentSignals,
            )
            if (lastFirebaseConsentFlags == consentFlags) return
            appAnalytics.setConsent(
                adStorageGranted = consentFlags.adStorageGranted,
                analyticsStorageGranted = consentFlags.analyticsStorageGranted,
                adUserDataGranted = consentFlags.adUserDataGranted,
                adPersonalizationGranted = consentFlags.adPersonalizationGranted,
            )
            appAnalytics.setAnalyticsCollectionEnabled(consentFlags.analyticsStorageGranted)
            Timber.d(
                "Firebase consent updated canRequestAds=%s flags={adStorage=%s analyticsStorage=%s adUserData=%s adPersonalization=%s} tcfPurposeLen=%d gdprApplies=%s usPrivacy=%s gppPresent=%s",
                consentGranted,
                consentFlags.adStorageGranted,
                consentFlags.analyticsStorageGranted,
                consentFlags.adUserDataGranted,
                consentFlags.adPersonalizationGranted,
                consentSignals.tcfPurposeConsents?.length ?: 0,
                consentSignals.gdprApplies,
                consentSignals.usPrivacyString ?: "none",
                !consentSignals.gppString.isNullOrBlank(),
            )
            lastFirebaseConsentFlags = consentFlags
        }
            .onFailure { throwable ->
                Timber.w(throwable, "Failed to update Firebase consent mapping")
            }
    }

    private fun readConsentSignals(): ConsentSignalSnapshot {
        val prefsCandidates = listOf(
            context.getSharedPreferences("${context.packageName}_preferences", Context.MODE_PRIVATE),
            context.getSharedPreferences("__GOOGLE_FUNDING_CHOICE_SDK_INTERNAL__", Context.MODE_PRIVATE),
            context.getSharedPreferences("__GOOGLE_FUNDING_CHOICE_SDK_STORAGE__", Context.MODE_PRIVATE),
        )

        fun readString(key: String): String? =
            prefsCandidates
                .asSequence()
                .mapNotNull { prefs ->
                    runCatching { prefs.getString(key, null) }.getOrNull()
                }
                .firstOrNull { !it.isNullOrBlank() }
                ?.trim()
                ?.takeIf { it.isNotEmpty() }

        val gdprAppliesRaw = readString("IABTCF_gdprApplies")
        val gdprApplies = parseIabBoolean(gdprAppliesRaw)

        return ConsentSignalSnapshot(
            tcfPurposeConsents = readString("IABTCF_PurposeConsents"),
            tcfVendorConsents = readString("IABTCF_VendorConsents"),
            gdprApplies = gdprApplies,
            usPrivacyString = readString("IABUSPrivacy_String"),
            gppString = readString("IABGPP_HDR_GppString"),
        )
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

internal data class ConsentSignalSnapshot(
    val tcfPurposeConsents: String?,
    val tcfVendorConsents: String?,
    val gdprApplies: Boolean?,
    val usPrivacyString: String?,
    val gppString: String?,
)

internal fun mapToFirebaseConsentGrantedFlags(
    granted: Boolean,
): FirebaseConsentGrantedFlags =
    mapToFirebaseConsentGrantedFlags(
        canRequestAds = granted,
        signals = null,
    )

internal fun mapToFirebaseConsentGrantedFlags(
    canRequestAds: Boolean,
    signals: ConsentSignalSnapshot?,
): FirebaseConsentGrantedFlags {
    if (!canRequestAds) {
        return FirebaseConsentGrantedFlags(
            adStorageGranted = false,
            analyticsStorageGranted = false,
            adUserDataGranted = false,
            adPersonalizationGranted = false,
        )
    }

    var adStorageGranted = true
    var analyticsStorageGranted = true
    var adUserDataGranted = true
    var adPersonalizationGranted = true

    if (signals != null) {
        val tcfApplies = signals.gdprApplies == true || !signals.tcfPurposeConsents.isNullOrBlank()
        if (tcfApplies) {
            val purpose1 = hasConsentBit(signals.tcfPurposeConsents, 1)
            val purpose3 = hasConsentBit(signals.tcfPurposeConsents, 3)
            val purpose4 = hasConsentBit(signals.tcfPurposeConsents, 4)
            val purpose7 = hasConsentBit(signals.tcfPurposeConsents, 7)

            purpose1?.let {
                adStorageGranted = adStorageGranted && it
                analyticsStorageGranted = analyticsStorageGranted && it
            }

            val adUserByTcf =
                when {
                    purpose1 == null && purpose7 == null -> null
                    else -> (purpose1 ?: true) && (purpose7 ?: true)
                }
            adUserByTcf?.let { adUserDataGranted = adUserDataGranted && it }

            val personalizationByTcf =
                when {
                    purpose3 == null && purpose4 == null -> null
                    else -> (purpose3 ?: true) && (purpose4 ?: true)
                }
            personalizationByTcf?.let { adPersonalizationGranted = adPersonalizationGranted && it }
        }

        val usOptOutSale = parseUsPrivacyOptOutSale(signals.usPrivacyString)
        if (usOptOutSale == true) {
            adUserDataGranted = false
            adPersonalizationGranted = false
        }
    }

    return FirebaseConsentGrantedFlags(
        adStorageGranted = adStorageGranted,
        analyticsStorageGranted = analyticsStorageGranted,
        adUserDataGranted = adUserDataGranted,
        adPersonalizationGranted = adPersonalizationGranted,
    )
}

private fun Boolean.analyticsConsentStatus(): String = if (this) "granted" else "denied"

private fun UmpConsentDebugResult.analyticsValue(): String =
    when (this) {
        UmpConsentDebugResult.Idle -> "idle"
        UmpConsentDebugResult.Shown -> "shown"
        UmpConsentDebugResult.NotRequired -> "not_required"
        is UmpConsentDebugResult.Error -> "error"
    }

private fun hasConsentBit(bits: String?, purposeIndex: Int): Boolean? {
    if (bits.isNullOrBlank() || purposeIndex <= 0 || bits.length < purposeIndex) return null
    return bits[purposeIndex - 1] == '1'
}

private fun parseIabBoolean(value: String?): Boolean? =
    when (value?.trim()?.lowercase()) {
        "1", "true", "yes", "on" -> true
        "0", "false", "no", "off" -> false
        else -> null
    }

private fun parseUsPrivacyOptOutSale(value: String?): Boolean? {
    if (value.isNullOrBlank()) return null
    val normalized = value.trim().uppercase()
    if (normalized.length < 3 || normalized[0] != '1') return null
    return when (normalized[2]) {
        'Y' -> true
        'N' -> false
        else -> null
    }
}

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
