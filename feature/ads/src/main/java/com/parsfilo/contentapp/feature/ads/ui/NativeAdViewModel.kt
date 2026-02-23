package com.parsfilo.contentapp.feature.ads.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.ads.nativead.NativeAd
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.NativeAdManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NativeAdViewModel @Inject constructor(
    private val nativeAdManager: NativeAdManager
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
    }

    private fun refreshAdIfAvailable() {
        val nextAd = nativeAdManager.getNativeAd(currentPlacement.value) ?: return
        val previousAd = _nativeAdState.value

        if (previousAd === nextAd) return

        _nativeAdState.value = nextAd
        previousAd?.destroy()
    }

    fun setPlacement(placement: AdPlacement) {
        if (currentPlacement.value == placement) return
        currentPlacement.value = placement
        refreshAdIfAvailable()
    }

    override fun onCleared() {
        super.onCleared()
        // Start destroying the ad when ViewModel is cleared/screen destroyed
        _nativeAdState.value?.destroy()
        _nativeAdState.value = null
    }
}
