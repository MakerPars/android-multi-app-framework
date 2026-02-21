package com.parsfilo.contentapp.feature.otherapps.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.parsfilo.contentapp.feature.otherapps.data.OtherAppsRepository
import com.parsfilo.contentapp.feature.otherapps.model.OtherApp
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OtherAppsViewModel @Inject constructor(
    private val repository: OtherAppsRepository
) : ViewModel() {

    val apps: StateFlow<List<OtherApp>> = repository.apps
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = emptyList()
        )

    init {
        viewModelScope.launch {
            repository.refreshIfNeeded()
        }
    }
}
