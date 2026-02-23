package com.parsfilo.contentapp.feature.counter.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.text.KeyboardOptions
import com.parsfilo.contentapp.core.designsystem.component.AppCard
import com.parsfilo.contentapp.core.designsystem.component.AppTopBar
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import com.parsfilo.contentapp.feature.counter.R
import com.parsfilo.contentapp.feature.counter.model.ZikirItem

@Composable
fun ZikirSelectorPage(
    zikirList: List<ZikirItem>,
    selectedKey: String?,
    onSelect: (ZikirItem) -> Unit,
    onDismiss: () -> Unit,
    onAddCustomZikir: (arabicText: String, latinText: String, turkishMeaning: String, defaultTarget: Int) -> Unit,
) {
    val d = LocalDimens.current
    var showAddDialog by rememberSaveable { mutableStateOf(false) }

    Scaffold(
        topBar = {
            AppTopBar(
                title = stringResource(R.string.counter_selector_title),
                navigationIcon = Icons.AutoMirrored.Filled.ArrowBack,
                navigationIconContentDescription = stringResource(R.string.counter_continue),
                actionIcon = Icons.Filled.Add,
                actionIconContentDescription = stringResource(R.string.counter_add_zikir),
                onActionClick = { showAddDialog = true },
                onNavigationClick = onDismiss,
            )
        },
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = d.space16),
            contentPadding = PaddingValues(vertical = d.space12),
            verticalArrangement = Arrangement.spacedBy(d.space10),
        ) {
            items(zikirList, key = { it.key }) { item ->
                val selected = item.key == selectedKey
                AppCard(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(d.radiusMedium),
                    colors = CardDefaults.cardColors(
                        containerColor = if (selected) {
                            MaterialTheme.colorScheme.secondaryContainer
                        } else {
                            MaterialTheme.colorScheme.surface
                        },
                    ),
                    onClick = { onSelect(item) },
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(d.space12),
                        verticalArrangement = Arrangement.spacedBy(d.space4),
                    ) {
                        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                            Text(
                                text = item.arabicText,
                                fontSize = 24.sp,
                                color = MaterialTheme.colorScheme.onSurface,
                            )
                        }
                        Text(text = item.latinText, fontWeight = FontWeight.SemiBold)
                        Text(
                            text = item.turkishMeaning,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 14.sp,
                        )
                        Text(
                            text = androidx.compose.ui.res.stringResource(
                                R.string.counter_recommended_target,
                                item.defaultTarget,
                            ),
                            color = MaterialTheme.colorScheme.secondary,
                            fontSize = 13.sp,
                        )
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddZikirDialog(
            onDismiss = { showAddDialog = false },
            onSave = { arabicText, latinText, turkishMeaning, defaultTarget ->
                onAddCustomZikir(arabicText, latinText, turkishMeaning, defaultTarget)
                showAddDialog = false
            },
        )
    }
}

@Composable
private fun AddZikirDialog(
    onDismiss: () -> Unit,
    onSave: (arabicText: String, latinText: String, turkishMeaning: String, defaultTarget: Int) -> Unit,
) {
    var arabicText by rememberSaveable { mutableStateOf("") }
    var latinText by rememberSaveable { mutableStateOf("") }
    var turkishMeaning by rememberSaveable { mutableStateOf("") }
    var targetText by rememberSaveable { mutableStateOf("33") }
    val canSave = arabicText.isNotBlank() || latinText.isNotBlank()

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(text = stringResource(R.string.counter_add_zikir_title)) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(LocalDimens.current.space8)) {
                OutlinedTextField(
                    value = arabicText,
                    onValueChange = { arabicText = it },
                    label = { Text(stringResource(R.string.counter_add_zikir_arabic)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                OutlinedTextField(
                    value = latinText,
                    onValueChange = { latinText = it },
                    label = { Text(stringResource(R.string.counter_add_zikir_latin)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                OutlinedTextField(
                    value = turkishMeaning,
                    onValueChange = { turkishMeaning = it },
                    label = { Text(stringResource(R.string.counter_add_zikir_meaning)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                OutlinedTextField(
                    value = targetText,
                    onValueChange = { input -> targetText = input.filter(Char::isDigit) },
                    label = { Text(stringResource(R.string.counter_add_zikir_target)) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        },
        confirmButton = {
            TextButton(
                enabled = canSave,
                onClick = {
                    onSave(
                        arabicText,
                        latinText,
                        turkishMeaning,
                        targetText.toIntOrNull() ?: 33,
                    )
                },
            ) {
                Text(text = stringResource(R.string.counter_save))
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = stringResource(R.string.counter_cancel))
            }
        },
    )
}
