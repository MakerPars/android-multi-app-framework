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
        Timber.d("Force update check requested (normal)")
        fetchPolicy(forceFetch = false)
    }

    fun retryCheck() {
        Timber.d("Force update check requested (retry/force)")
        fetchPolicy(forceFetch = true)
    }

    fun dismissSoftPromptForSession() {
        Timber.d("Force update soft prompt dismissed for current session")
        _softPromptDismissedThisSession.value = true
        recomputeActivePolicy()
    }

    fun resetSoftPromptForSession() {
        Timber.d("Force update soft prompt session dismissal reset")
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
                Timber.d("Force update debug fetch resolved policy=%s", snapshot.resolvedPolicy::class.simpleName)
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
        Timber.d("Force update debug simulation set: Soft")
        _debugOverridePolicy.value = UpdatePolicy.Soft(
            title = "Güncelleme önerisi (Debug)",
            message = "Bu bir debug simülasyonudur.",
            updateButton = "Güncelle",
            laterButton = "Daha sonra",
        )
        recomputeActivePolicy()
    }

    fun simulateHardBlock() {
        Timber.d("Force update debug simulation set: Hard")
        _debugOverridePolicy.value = UpdatePolicy.Hard(
            title = "Zorunlu güncelleme (Debug)",
            message = "Bu bir debug simülasyonudur.",
            updateButton = "Güncelle",
        )
        recomputeActivePolicy()
    }

    fun clearSimulation() {
        Timber.d("Force update debug simulation cleared")
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
                Timber.d("Force update resolved policy=%s", snapshot.resolvedPolicy::class.simpleName)
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
        Timber.d(
            "Force update active policy=%s (base=%s, override=%s, softDismissed=%s)",
            _activePolicy.value::class.simpleName,
            resolved::class.simpleName,
            override?.let { it::class.simpleName } ?: "null",
            _softPromptDismissedThisSession.value,
        )
    }
}
