package com.parsfilo.contentapp.feature.prayertimes.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import com.parsfilo.contentapp.core.designsystem.theme.ArabicFontFamily

internal object PrayerTimesDesignTokens {
    val AccentSecondary = Color(0xFF7B5EA7)
    val ActionPrimarySoft = Color(0xFF6B85F8)

    const val GlassAlpha = 0.82f

    val DarkBackgroundStart = Color(0xFF0D1B2A)
    val DarkBackgroundEnd = Color(0xFF1B2E3C)

    val HeaderGradientEnd = Color(0xFF34495E)
    val ImsakGradientEnd = Color(0xFF2B3DB8)
    val IftarGradientEnd = Color(0xFFE74C3C)

    val ListItemPast = Color(0x73FFFFFF)
    val GoldText = Color(0xFFBFCFFF)

    val AccentPrimary: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.Accent

    val ActionPrimary: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.Accent

    val GlassSurface: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.Surface

    val LightBackgroundStart: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.Background

    val LightBackgroundEnd: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.AccentSoft

    val HeaderGradientStart: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.NextPrayerCardBg

    val ImsakGradientStart: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.ImsakCardBg

    val IftarGradientStart: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.IftarCardBg

    val HeaderText: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.CardText

    val DimText: Color
        @Composable
        @ReadOnlyComposable
        get() = PrayerTimesColors.CardTextSecondary
}

@Composable
internal fun prayerTimesBackgroundBrush(isDark: Boolean): Brush {
    return Brush.verticalGradient(
        colors = if (isDark) {
            listOf(
                PrayerTimesDesignTokens.DarkBackgroundStart,
                PrayerTimesDesignTokens.DarkBackgroundEnd,
            )
        } else {
            listOf(
                PrayerTimesDesignTokens.LightBackgroundStart,
                PrayerTimesDesignTokens.LightBackgroundEnd,
            )
        }
    )
}

internal fun prayerHeadlineFontFamily(): FontFamily {
    return ArabicFontFamily
}

internal fun prayerBodyFontFamily(): FontFamily {
    // Falls back to sans serif until custom font resources are added.
    return FontFamily.SansSerif
}

@Composable
internal fun isPrayerTimesDarkMode(): Boolean = isSystemInDarkTheme()
