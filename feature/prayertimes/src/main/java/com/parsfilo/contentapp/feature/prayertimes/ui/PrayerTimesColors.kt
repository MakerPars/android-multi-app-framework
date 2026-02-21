package com.parsfilo.contentapp.feature.prayertimes.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color

internal object PrayerTimesColors {
    val Background: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.background
    val Surface: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.surface
    val Accent: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.primary
    val AccentSoft: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.surfaceVariant
    val NeutralButton: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.surfaceVariant
    val NeutralText: Color
        @Composable
        @ReadOnlyComposable
        get() = MaterialTheme.colorScheme.onSurfaceVariant

    // İmsakiye büyük kartları için sabit renkler (flavor'dan bağımsız kalır)
    val ImsakCardBg = Color(0xFF1E2B6F)
    val IftarCardBg = Color(0xFFC0392B)
    val NextPrayerCardBg = Color(0xFF2C3E50)
    val CardText = Color(0xFFFFFFFF)
    val CardTextSecondary = Color(0xFFBDC3E0)
}
