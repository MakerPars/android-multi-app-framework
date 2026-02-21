package com.parsfilo.contentapp.feature.prayertimes.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.parsfilo.contentapp.feature.prayertimes.ui.PrayerTimesDesignTokens
import com.parsfilo.contentapp.feature.prayertimes.ui.prayerBodyFontFamily
import com.parsfilo.contentapp.feature.prayertimes.ui.prayerHeadlineFontFamily

@Composable
internal fun ImsakiyeTimeCard(
    modifier: Modifier = Modifier,
    title: String,
    timeHm: String,
    countdown: String,
    isIftar: Boolean,
    compact: Boolean = false,
) {
    val showCountdown = countdown.isNotBlank() && countdown != "--:--:--"
    val gradient = if (isIftar) {
        Brush.verticalGradient(
            listOf(
                PrayerTimesDesignTokens.IftarGradientStart,
                PrayerTimesDesignTokens.IftarGradientEnd,
            )
        )
    } else {
        Brush.verticalGradient(
            listOf(
                PrayerTimesDesignTokens.ImsakGradientStart,
                PrayerTimesDesignTokens.ImsakGradientEnd,
            )
        )
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .height(if (compact) 132.dp else 160.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(gradient)
            .padding(16.dp)
            .semantics {
                contentDescription = "$title vakti $timeHm"
            },
        verticalArrangement = if (showCountdown) {
            Arrangement.SpaceBetween
        } else {
            Arrangement.spacedBy(8.dp)
        },
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium.copy(fontFamily = prayerBodyFontFamily()),
            color = PrayerTimesDesignTokens.HeaderText,
            fontWeight = FontWeight.Bold,
        )
        Text(
            text = timeHm,
            fontFamily = prayerHeadlineFontFamily(),
            fontSize = 40.sp,
            fontWeight = FontWeight.Bold,
            color = PrayerTimesDesignTokens.HeaderText,
        )
        if (showCountdown) {
            Text(
                text = countdown,
                style = MaterialTheme.typography.bodyMedium.copy(fontFamily = prayerBodyFontFamily()),
                color = PrayerTimesDesignTokens.DimText,
            )
        }
    }
}
