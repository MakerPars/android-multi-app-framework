package com.parsfilo.contentapp.feature.ads.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.ads.nativead.NativeAd
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NativeAdViewModel @Inject constructor(
    private val nativeAdManager: NativeAdManager,
    private val adGateChecker: AdGateChecker,
) : ViewModel() {
    private val currentPlacement = MutableStateFlow(AdPlacement.NATIVE_DEFAULT)

    private val _nativeAdState = MutableStateFlow<NativeAd?>(null)
    val nativeAdState: StateFlow<NativeAd?> = _nativeAdState.asStateFlow()

    init {
        // Try to load immediately
        refreshAdIfAvailable()

        // Listen for new ads being loaded into the pool
        viewModelScope.launch {
            nativeAdManager.adLoadedFlow.collect {
                refreshAdIfAvailable()
            }
        }

        viewModelScope.launch {
            combine(
                AdsConsentRuntimeState.canRequestAds,
                adGateChecker.shouldShowAds,
            ) { canRequestAds, shouldShowAds ->
                canRequestAds && shouldShowAds
            }.collect { eligible ->
                if (!eligible) {
                    clearCurrentNativeAd()
                }
            }
        }
    }

    private fun refreshAdIfAvailable() {
        val nextAd = nativeAdManager.getNativeAd(currentPlacement.value) ?: return
        val previousAd = _nativeAdState.value

        if (previousAd === nextAd) return

        _nativeAdState.value = nextAd
        previousAd?.destroy()
    }

    private fun clearCurrentNativeAd() {
        val previous = _nativeAdState.value ?: return
        _nativeAdState.value = null
        previous.destroy()
    }

    fun setPlacement(placement: AdPlacement) {
        if (currentPlacement.value == placement) return
        currentPlacement.value = placement
        refreshAdIfAvailable()
    }

    override fun onCleared() {
        super.onCleared()
        // Start destroying the ad when ViewModel is cleared/screen destroyed
        clearCurrentNativeAd()
    }
}
