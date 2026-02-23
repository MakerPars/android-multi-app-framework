package com.parsfilo.contentapp.update

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class UpdateGateViewModel @Inject constructor(
    private val updateCoordinator: UpdateCoordinator,
) : ViewModel() {
    private val _basePolicy = MutableStateFlow<UpdatePolicy>(UpdatePolicy.None)
    val basePolicy: StateFlow<UpdatePolicy> = _basePolicy.asStateFlow()

    private val _activePolicy = MutableStateFlow<UpdatePolicy>(UpdatePolicy.None)
    val activePolicy: StateFlow<UpdatePolicy> = _activePolicy.asStateFlow()

    private val _isChecking = MutableStateFlow(false)
    val isChecking: StateFlow<Boolean> = _isChecking.asStateFlow()

    private val _softPromptDismissedThisSession = MutableStateFlow(false)
    val softPromptDismissedThisSession: StateFlow<Boolean> =
        _softPromptDismissedThisSession.asStateFlow()

    private val _debugSnapshot = MutableStateFlow<UpdateDebugSnapshot?>(null)
    val debugSnapshot: StateFlow<UpdateDebugSnapshot?> = _debugSnapshot.asStateFlow()

    private val _debugOverridePolicy = MutableStateFlow<UpdatePolicy?>(null)

    fun checkForUpdate() {
        fetchPolicy(forceFetch = false)
    }

    fun retryCheck() {
        fetchPolicy(forceFetch = true)
    }

    fun dismissSoftPromptForSession() {
        _softPromptDismissedThisSession.value = true
        recomputeActivePolicy()
    }

    fun resetSoftPromptForSession() {
        _softPromptDismissedThisSession.value = false
        recomputeActivePolicy()
    }

    fun fetchNowForDebug() {
        viewModelScope.launch {
            _isChecking.value = true
            try {
                val snapshot = updateCoordinator.getDebugSnapshot(forceFetch = true)
                _debugSnapshot.value = snapshot
                _basePolicy.value = snapshot.resolvedPolicy
                _debugOverridePolicy.value = null
                if (snapshot.resolvedPolicy !is UpdatePolicy.Soft) {
                    _softPromptDismissedThisSession.value = false
                }
            } catch (t: Throwable) {
                Timber.w(t, "Force update debug fetch failed.")
            } finally {
                _isChecking.value = false
                recomputeActivePolicy()
            }
        }
    }

    fun simulateSoftPrompt() {
        _debugOverridePolicy.value = UpdatePolicy.Soft(
            title = "Güncelleme önerisi (Debug)",
            message = "Bu bir debug simülasyonudur.",
            updateButton = "Güncelle",
            laterButton = "Daha sonra",
        )
        recomputeActivePolicy()
    }

    fun simulateHardBlock() {
        _debugOverridePolicy.value = UpdatePolicy.Hard(
            title = "Zorunlu güncelleme (Debug)",
            message = "Bu bir debug simülasyonudur.",
            updateButton = "Güncelle",
        )
        recomputeActivePolicy()
    }

    fun clearSimulation() {
        _debugOverridePolicy.value = null
        recomputeActivePolicy()
    }

    private fun fetchPolicy(forceFetch: Boolean) {
        viewModelScope.launch {
            _isChecking.value = true
            try {
                val snapshot = updateCoordinator.getDebugSnapshot(forceFetch = forceFetch)
                _debugSnapshot.value = snapshot
                _basePolicy.value = snapshot.resolvedPolicy
                if (snapshot.resolvedPolicy !is UpdatePolicy.Soft) {
                    _softPromptDismissedThisSession.value = false
                }
                _debugOverridePolicy.value = null
            } catch (t: Throwable) {
                Timber.w(t, "Force update check failed; keeping previous policy.")
            } finally {
                _isChecking.value = false
                recomputeActivePolicy()
            }
        }
    }

    private fun recomputeActivePolicy() {
        val override = _debugOverridePolicy.value
        val resolved = _basePolicy.value
        _activePolicy.value = when {
            override != null -> override
            resolved is UpdatePolicy.Soft && _softPromptDismissedThisSession.value -> UpdatePolicy.None
            else -> resolved
        }
    }
}
