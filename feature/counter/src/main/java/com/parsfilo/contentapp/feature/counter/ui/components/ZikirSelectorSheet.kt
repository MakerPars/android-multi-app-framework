package com.parsfilo.contentapp.feature.counter.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.sp
import com.parsfilo.contentapp.core.designsystem.component.AppCard
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import com.parsfilo.contentapp.feature.counter.R
import com.parsfilo.contentapp.feature.counter.model.ZikirItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ZikirSelectorSheet(
    zikirList: List<ZikirItem>,
    selectedKey: String?,
    onSelect: (ZikirItem) -> Unit,
    onDismiss: () -> Unit,
) {
    val d = LocalDimens.current

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Text(
            text = androidx.compose.ui.res.stringResource(R.string.counter_selector_title),
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = d.space16),
        )

        LazyColumn(
            contentPadding = PaddingValues(d.space16),
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
}