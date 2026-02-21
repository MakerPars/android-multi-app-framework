package com.parsfilo.contentapp.feature.settings.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.datastore.UserPreferencesData
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.logAppShared
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val preferencesDataSource: PreferencesDataSource,
    private val appAnalytics: AppAnalytics,
) : ViewModel() {

    init {
        viewModelScope.launch {
            preferencesDataSource.getOrCreateInstallationId()
        }
    }

    val uiState: StateFlow<SettingsUiState> = preferencesDataSource.userData
        .map { SettingsUiState.Success(it) as SettingsUiState }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = SettingsUiState.Loading
        )

    fun setDarkMode(darkMode: Boolean) {
        viewModelScope.launch {
            preferencesDataSource.setDarkMode(darkMode)
        }
    }

    fun setFontSize(size: Int) {
        viewModelScope.launch {
            preferencesDataSource.setFontSize(size)
        }
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        viewModelScope.launch {
            preferencesDataSource.setNotificationsEnabled(enabled)
        }
    }

    fun logShareApp(platform: String) {
        appAnalytics.logAppShared(platform = platform)
    }
}

sealed interface SettingsUiState {
    data object Loading : SettingsUiState
    data class Success(val preferences: UserPreferencesData) : SettingsUiState
}
