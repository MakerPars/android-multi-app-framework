package com.parsfilo.contentapp.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.parsfilo.contentapp.core.auth.AuthManager
import com.parsfilo.contentapp.core.database.dao.NotificationDao
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.feature.messages.data.MessageRepository
import com.parsfilo.contentapp.feature.otherapps.data.OtherAppsRepository
import com.parsfilo.contentapp.navigation.AppRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val notificationDao: NotificationDao,
    messageRepository: MessageRepository,
    otherAppsRepository: OtherAppsRepository,
    private val authManager: AuthManager,
    private val preferencesDataSource: PreferencesDataSource,
) : ViewModel() {

    val unreadNotificationCount: StateFlow<Int> = notificationDao.getUnreadCount()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = 0
        )

    val isUserSignedIn: StateFlow<Boolean> = authManager.authState
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = authManager.isUserSignedIn()
        )

    val darkModeEnabled: StateFlow<Boolean> = preferencesDataSource.userData
        .map { it.darkMode }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = false,
        )

    val unreadMessageCount: StateFlow<Int> = messageRepository.getMessages()
        .map { messages -> messages.count { it.hasReply && !it.isRead } }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = 0
        )

    private val latestOtherAppsBadgeSignature = MutableStateFlow("")

    val newOtherAppsCount: StateFlow<Int> = combine(
        otherAppsRepository.apps,
        preferencesDataSource.otherAppsBadgeSeenSignature
    ) { apps, seenSignature ->
        val newApps = apps.filter { it.isNew }
        val signature = buildOtherAppsSignature(newApps.map { it.packageName })
        latestOtherAppsBadgeSignature.value = signature
        if (signature.isBlank() || signature == seenSignature) 0 else newApps.size
    }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = 0
        )

    val shouldShowSubscriptionBadge: StateFlow<Boolean> = preferencesDataSource.userData
        .map { prefs -> !prefs.isPremium }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = true
        )

    init {
        viewModelScope.launch {
            otherAppsRepository.refreshIfNeeded()
        }
    }

    fun onTopLevelRouteVisited(route: AppRoute) {
        when (route) {
            AppRoute.OtherApps -> markOtherAppsBadgeAsSeen()
            else -> Unit
        }
    }

    private fun markOtherAppsBadgeAsSeen() {
        viewModelScope.launch {
            preferencesDataSource.setOtherAppsBadgeSeenSignature(latestOtherAppsBadgeSignature.value)
        }
    }

    private fun buildOtherAppsSignature(packageNames: List<String>): String {
        return packageNames
            .map { it.trim().lowercase() }
            .filter { it.isNotBlank() }
            .sorted()
            .joinToString(separator = ",")
    }
}
