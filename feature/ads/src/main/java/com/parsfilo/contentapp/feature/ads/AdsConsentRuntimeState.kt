package com.parsfilo.contentapp.feature.ads

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Process-level ad serving gate.
 *
 * Default is false to avoid sending ad requests before UMP completes.
 */
object AdsConsentRuntimeState {
    private val _canRequestAds = MutableStateFlow(false)
    val canRequestAds: StateFlow<Boolean> = _canRequestAds.asStateFlow()

    fun update(canRequestAds: Boolean) {
        _canRequestAds.value = canRequestAds
    }
}

