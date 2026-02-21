package com.parsfilo.contentapp.feature.content.ui.miracles

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.parsfilo.contentapp.core.model.MiraclesPrayer
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.content.data.MiraclesPrayerRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface MiraclesDetailUiState {
    data object Loading : MiraclesDetailUiState
    data class Success(
        val prayer: MiraclesPrayer,
        val shouldShowAds: Boolean
    ) : MiraclesDetailUiState
    data class Error(val throwable: Throwable) : MiraclesDetailUiState
}

@HiltViewModel
class MiraclesDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val prayerRepository: MiraclesPrayerRepository,
    private val adGateChecker: AdGateChecker
) : ViewModel() {

    private val prayerIndex: Int = checkNotNull(savedStateHandle["prayerIndex"])

    private val _uiState = MutableStateFlow<MiraclesDetailUiState>(MiraclesDetailUiState.Loading)
    val uiState: StateFlow<MiraclesDetailUiState> = _uiState.asStateFlow()

    init {
        loadPrayerDetail()
    }

    private fun loadPrayerDetail() {
        viewModelScope.launch {
            try {
                val prayer = prayerRepository.getPrayerByIndex(prayerIndex)
                if (prayer == null) {
                    _uiState.value = MiraclesDetailUiState.Error(Exception("Dua bulunamadı"))
                    return@launch
                }

                adGateChecker.shouldShowAds.collect { shouldShowAds ->
                    _uiState.value = MiraclesDetailUiState.Success(
                        prayer = prayer,
                        shouldShowAds = shouldShowAds
                    )
                }
            } catch (e: Exception) {
                _uiState.value = MiraclesDetailUiState.Error(e)
            }
        }
    }
}
