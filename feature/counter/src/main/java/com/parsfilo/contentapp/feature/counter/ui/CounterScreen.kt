package com.parsfilo.contentapp.feature.counter.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.parsfilo.contentapp.core.designsystem.component.AppButton
import com.parsfilo.contentapp.core.designsystem.component.AppCard
import com.parsfilo.contentapp.core.designsystem.component.AppTopBar
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import com.parsfilo.contentapp.feature.counter.R
import com.parsfilo.contentapp.feature.counter.model.CounterUiState
import com.parsfilo.contentapp.feature.counter.model.ReminderSettings
import com.parsfilo.contentapp.feature.counter.model.ZikirItem
import com.parsfilo.contentapp.feature.counter.ui.components.CounterFab
import com.parsfilo.contentapp.feature.counter.ui.components.DailyProgressSection
import com.parsfilo.contentapp.feature.counter.ui.components.ReminderSettingsSheet
import com.parsfilo.contentapp.feature.counter.ui.components.SessionCompleteDialog
import com.parsfilo.contentapp.feature.counter.ui.components.SessionHistorySheet
import com.parsfilo.contentapp.feature.counter.ui.components.SharePreviewCard
import com.parsfilo.contentapp.feature.counter.ui.components.StreakBadge
import com.parsfilo.contentapp.feature.counter.ui.components.ZikirSelectorSheet
import com.parsfilo.contentapp.feature.counter.ui.components.ZikirTextCard
import kotlinx.coroutines.launch

@Composable
fun CounterScreen(
    uiState: CounterUiState,
    onSettingsClick: () -> Unit,
    onRewardsClick: () -> Unit,
    onCounterTapped: () -> Unit,
    onResetCurrentCount: () -> Unit,
    onShareSession: () -> Unit,
    onZikirSelectorToggle: () -> Unit,
    onZikirSelected: (ZikirItem) -> Unit,
    onDismissSessionComplete: () -> Unit,
    onShareConfirmed: () -> Unit,
    onShareDismissed: () -> Unit,
    onShareTextCopied: () -> Unit,
    onReminderSettingsToggle: () -> Unit,
    onReminderSaved: (ReminderSettings) -> Unit,
    onSessionHistoryToggle: () -> Unit,
    onSessionHistoryDismiss: () -> Unit,
    onUnlockHistoryWithAd: () -> Unit,
    onToggleHaptic: () -> Unit,
    onToggleSound: () -> Unit,
    onTargetChanged: (Int) -> Unit,
    onFirstSessionReminderAction: () -> Unit,
    onFirstSessionReminderConsumed: () -> Unit,
    bannerAdContent: (@Composable () -> Unit)? = null,
    nativeAdContent: (@Composable () -> Unit)? = null,
) {
    val d = LocalDimens.current
    val scrollState = rememberScrollState()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val clipboard = LocalClipboardManager.current
    val reminderSavedMessage = stringResource(R.string.counter_reminder_saved)
    val copiedMessage = stringResource(R.string.counter_copied)
    val firstSessionReminderPrompt = stringResource(R.string.counter_first_session_reminder_prompt)
    val firstSessionReminderAction = stringResource(R.string.counter_first_session_reminder_action)

    LaunchedEffect(uiState.showFirstSessionReminderHint) {
        if (!uiState.showFirstSessionReminderHint) return@LaunchedEffect
        val result = snackbarHostState.showSnackbar(
            message = firstSessionReminderPrompt,
            actionLabel = firstSessionReminderAction,
        )
        if (result == SnackbarResult.ActionPerformed) {
            onFirstSessionReminderAction()
        } else {
            onFirstSessionReminderConsumed()
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            CounterTopBar(
                onReminderClick = onReminderSettingsToggle,
                onHistoryClick = onSessionHistoryToggle,
                onSettingsClick = onSettingsClick,
                onRewardsClick = onRewardsClick,
                isHapticEnabled = uiState.isHapticEnabled,
                isSoundEnabled = uiState.isSoundEnabled,
                onToggleHaptic = onToggleHaptic,
                onToggleSound = onToggleSound,
            )
        },
        bottomBar = {
            if (!uiState.isPremium) {
                bannerAdContent?.invoke()
            }
        },
    ) { innerPadding ->
        if (uiState.isLoading) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.secondary)
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(scrollState)
                    .padding(horizontal = d.space16, vertical = d.space12),
                verticalArrangement = Arrangement.spacedBy(d.space12),
            ) {
                StreakBadge(
                    streak = uiState.currentStreak,
                    todayTotal = uiState.todayTotalCount,
                    modifier = Modifier.fillMaxWidth(),
                )

                DailyProgressSection(
                    todayTotal = uiState.todayTotalCount,
                    dailyGoal = uiState.dailyGoal,
                    progress = uiState.dailyGoalProgress,
                    modifier = Modifier.fillMaxWidth(),
                )

                val selectedZikir = uiState.selectedZikir
                if (selectedZikir != null) {
                    ZikirTextCard(
                        zikir = selectedZikir,
                        onChangeClick = onZikirSelectorToggle,
                    )
                }

                TargetSelectorRow(
                    targetCount = uiState.targetCount,
                    onTargetChanged = onTargetChanged,
                )

                CurrentCountSection(
                    currentCount = uiState.currentCount,
                    targetCount = uiState.targetCount,
                    modifier = Modifier.fillMaxWidth(),
                )

                CounterFab(
                    arabicText = selectedZikir?.arabicText.orEmpty(),
                    latinText = selectedZikir?.latinText.orEmpty(),
                    currentCount = uiState.currentCount,
                    onTap = onCounterTapped,
                    modifier = Modifier.align(Alignment.CenterHorizontally),
                    contentDescription = stringResource(
                        R.string.counter_content_description_fab,
                        uiState.currentCount,
                    ),
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(d.space10),
                ) {
                    AppButton(
                        text = stringResource(R.string.counter_reset),
                        onClick = onResetCurrentCount,
                        modifier = Modifier.weight(1f),
                    )
                    AppButton(
                        text = stringResource(R.string.counter_share),
                        onClick = onShareSession,
                        modifier = Modifier.weight(1f),
                    )
                }

                Spacer(modifier = Modifier.height(d.space8))
            }
        }
    }

    if (uiState.showZikirSelector) {
        ZikirSelectorSheet(
            zikirList = uiState.zikirList,
            selectedKey = uiState.selectedZikir?.key,
            onSelect = onZikirSelected,
            onDismiss = onZikirSelectorToggle,
        )
    }

    if (uiState.showReminderSettings) {
        ReminderSettingsSheet(
            initialSettings = uiState.reminderSettings,
            onSave = { settings ->
                onReminderSaved(settings)
                scope.launch {
                    snackbarHostState.showSnackbar(reminderSavedMessage)
                }
            },
            onDismiss = onReminderSettingsToggle,
        )
    }

    if (uiState.showSessionHistory) {
        SessionHistorySheet(
            sessions = uiState.recentSessions,
            isPremium = uiState.isPremium,
            historyUnlockedForSession = uiState.historyUnlockedForSession,
            nativeAdContent = if (uiState.isPremium) null else nativeAdContent,
            onUnlockWithAd = onUnlockHistoryWithAd,
            onDismiss = onSessionHistoryDismiss,
        )
    }

    val completedSession = uiState.lastCompletedSession
    if (uiState.showSessionComplete && completedSession != null) {
        SessionCompleteDialog(
            session = completedSession,
            currentStreak = uiState.currentStreak,
            todayTotalCount = uiState.todayTotalCount,
            onShareClick = onShareSession,
            onDismiss = onDismissSessionComplete,
        )
    }

    if (uiState.showSharePreview && uiState.shareText.isNotBlank()) {
        SharePreviewCard(
            text = uiState.shareText,
            onShare = {
                onShareConfirmed()
                onShareDismissed()
            },
            onCopy = {
                clipboard.setText(AnnotatedString(uiState.shareText))
                onShareTextCopied()
                scope.launch {
                    snackbarHostState.showSnackbar(copiedMessage)
                }
            },
            onDismiss = onShareDismissed,
        )
    }
}

@Composable
private fun CounterTopBar(
    onReminderClick: () -> Unit,
    onHistoryClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onRewardsClick: () -> Unit,
    isHapticEnabled: Boolean,
    isSoundEnabled: Boolean,
    onToggleHaptic: () -> Unit,
    onToggleSound: () -> Unit,
) {
    var expanded by remember { mutableStateOf(false) }

    AppTopBar(
        title = stringResource(R.string.counter_title),
        actions = {
            IconButton(onClick = onReminderClick) {
                Icon(
                    imageVector = Icons.Filled.Notifications,
                    contentDescription = stringResource(R.string.counter_reminder_title),
                )
            }
            IconButton(onClick = onHistoryClick) {
                Icon(
                    imageVector = Icons.Filled.BarChart,
                    contentDescription = stringResource(R.string.counter_history_title),
                )
            }
            IconButton(onClick = { expanded = true }) {
                Icon(
                    imageVector = Icons.Filled.MoreVert,
                    contentDescription = null,
                )
            }
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
            ) {
                DropdownMenuItem(
                    text = {
                        Text(
                            if (isHapticEnabled) {
                                stringResource(R.string.counter_settings_haptic) + " ✓"
                            } else {
                                stringResource(R.string.counter_settings_haptic)
                            }
                        )
                    },
                    onClick = {
                        expanded = false
                        onToggleHaptic()
                    },
                )
                DropdownMenuItem(
                    text = {
                        Text(
                            if (isSoundEnabled) {
                                stringResource(R.string.counter_settings_sound) + " ✓"
                            } else {
                                stringResource(R.string.counter_settings_sound)
                            }
                        )
                    },
                    onClick = {
                        expanded = false
                        onToggleSound()
                    },
                )
                HorizontalDivider()
                DropdownMenuItem(
                    text = { Text(stringResource(R.string.counter_menu_settings)) },
                    leadingIcon = { Icon(Icons.Filled.Settings, contentDescription = null) },
                    onClick = {
                        expanded = false
                        onSettingsClick()
                    },
                )
                DropdownMenuItem(
                    text = { Text(stringResource(R.string.counter_menu_rewards)) },
                    leadingIcon = { Icon(Icons.Filled.CardGiftcard, contentDescription = null) },
                    onClick = {
                        expanded = false
                        onRewardsClick()
                    },
                )
            }
        },
    )
}

@Composable
private fun CurrentCountSection(
    currentCount: Int,
    targetCount: Int,
    modifier: Modifier = Modifier,
) {
    val d = LocalDimens.current
    val progress = if (targetCount > 0) {
        (currentCount.toFloat() / targetCount.toFloat()).coerceIn(0f, 1f)
    } else {
        0f
    }

    AppCard(modifier = modifier) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(d.space16),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(d.space8),
        ) {
            Text(
                text = currentCount.toString(),
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold,
                fontSize = 48.sp,
            )
            Text(
                text = stringResource(R.string.counter_target_format, targetCount),
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.secondary,
            )
        }
    }
}

@Composable
private fun TargetSelectorRow(
    targetCount: Int,
    onTargetChanged: (Int) -> Unit,
) {
    val d = LocalDimens.current
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(d.space8),
    ) {
        TargetButton(
            text = stringResource(R.string.counter_target_33),
            selected = targetCount == 33,
            onClick = { onTargetChanged(33) },
            modifier = Modifier.weight(1f),
        )
        TargetButton(
            text = stringResource(R.string.counter_target_99),
            selected = targetCount == 99,
            onClick = { onTargetChanged(99) },
            modifier = Modifier.weight(1f),
        )
        TargetButton(
            text = stringResource(R.string.counter_target_100),
            selected = targetCount == 100,
            onClick = { onTargetChanged(100) },
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun TargetButton(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    AppButton(
        text = text,
        onClick = onClick,
        modifier = modifier,
        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
            containerColor = if (selected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceVariant,
            contentColor = if (selected) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurfaceVariant,
        ),
    )
}
