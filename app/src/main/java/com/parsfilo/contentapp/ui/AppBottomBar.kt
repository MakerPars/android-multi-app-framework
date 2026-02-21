package com.parsfilo.contentapp.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination
import androidx.navigation.NavDestination.Companion.hierarchy
import com.parsfilo.contentapp.R
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import com.parsfilo.contentapp.navigation.AppRoute
import com.parsfilo.curvedbottomnavigation.components.CurvedBottomNavigation
import com.parsfilo.curvedbottomnavigation.components.CurvedBottomNavigationItem

@Composable
fun AppBottomBarWithFab(
    currentDestination: NavDestination?,
    onNavigateToDestination: (AppRoute) -> Unit,
    unreadNotificationCount: Int,
    unreadMessageCount: Int,
    newOtherAppsCount: Int,
    shouldShowSubscriptionBadge: Boolean,
) {
    val dimens = LocalDimens.current
    val colorScheme = MaterialTheme.colorScheme
    val isLightTheme = colorScheme.background.luminance() > 0.5f
    val barColor = if (isLightTheme) {
        colorScheme.primaryContainer.copy(alpha = 0.94f)
    } else {
        colorScheme.surfaceVariant.copy(alpha = 0.94f)
    }
    val fabColor = if (isLightTheme) {
        colorScheme.secondary.copy(alpha = 0.96f)
    } else {
        colorScheme.secondary.copy(alpha = 0.88f)
    }
    val iconColor = if (isLightTheme) {
        colorScheme.onPrimaryContainer.copy(alpha = 0.86f)
    } else {
        colorScheme.onSurfaceVariant.copy(alpha = 0.72f)
    }
    val selectedIconColor = if (isLightTheme) colorScheme.onSecondary else Color.White
    val titleColor = if (isLightTheme) {
        colorScheme.onPrimaryContainer.copy(alpha = 0.92f)
    } else {
        colorScheme.onSurfaceVariant.copy(alpha = 0.78f)
    }
    val badgeColor = colorScheme.error
    val badgeTextColor = colorScheme.onError

    // ÖNEMLİ NOT: CurvedBottomNavigationItem icon parametresi Drawable Resource ID (Int) bekler
    // Aşağıdaki ImageVector kullanımı DERLEME HATASI verecek
    // Çözüm: res/drawable/ klasörüne icon'ları ekleyin ve R.drawable.icon_name kullanın

    val destinations = listOf(
        BottomDestination("subscription", AppRoute.Subscription, stringResource(R.string.nav_premium), R.drawable.ic_star),  // ImageVector yerine R.drawable kullanın
        BottomDestination("other_apps", AppRoute.OtherApps, stringResource(R.string.nav_apps), R.drawable.ic_apps),
        BottomDestination("home_graph", AppRoute.HomeGraph, stringResource(R.string.nav_home), R.drawable.ic_home),
        BottomDestination("messages_graph", AppRoute.MessagesGraph, stringResource(R.string.nav_messages), R.drawable.ic_email),
        BottomDestination("notifications_graph", AppRoute.NotificationsGraph, stringResource(R.string.nav_alerts), R.drawable.ic_notifications)
    )

    val selectedId = destinations.firstOrNull { destination ->
        currentDestination?.hierarchy?.any { it.route == destination.route.route } == true
    }?.id ?: destinations[2].id

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding(),
        contentAlignment = androidx.compose.ui.Alignment.BottomCenter
    ) {
        CurvedBottomNavigation(
            items = destinations.map { destination ->
            CurvedBottomNavigationItem(
                id = destination.id,
                title = destination.title,
                icon = destination.icon,
                badge = when (destination.route) {
                    AppRoute.NotificationsGraph -> if (BadgeFeatureFlags.SHOW_NOTIFICATIONS_BADGE) {
                        unreadNotificationCount.toBadgeText()
                    } else {
                        null
                    }
                    AppRoute.OtherApps -> if (BadgeFeatureFlags.SHOW_OTHER_APPS_BADGE) {
                        newOtherAppsCount.toBadgeText()
                    } else {
                        null
                    }
                    AppRoute.MessagesGraph -> if (BadgeFeatureFlags.SHOW_MESSAGES_BADGE) {
                        unreadMessageCount.toBadgeText()
                    } else {
                        null
                    }
                    AppRoute.Subscription -> if (
                        BadgeFeatureFlags.SHOW_SUBSCRIPTION_BADGE && shouldShowSubscriptionBadge
                    ) {
                        "!"
                    } else {
                        null
                    }
                    else -> null
                }
            )
        },
            selectedItemId = selectedId,
            onItemSelected = { selected ->
                destinations.firstOrNull { it.id == selected }?.let { onNavigateToDestination(it.route) }
            },
            backgroundColor = barColor,
            iconColor = iconColor,
            selectedIconColor = selectedIconColor,
            titleColor = titleColor,
            fabColor = fabColor,
            badgeBackgroundColor = badgeColor,
            badgeTextColor = badgeTextColor,
            titleTextSize = 10,
            iconSize = dimens.iconSm,
            selectedIconSize = dimens.iconXl + dimens.space2,
            curveRadius = dimens.space32 + dimens.space4,
            height = dimens.bottomBarHeight,
            hasAnimation = true
        )
    }
}

private data class BottomDestination(
    val id: String,
    val route: AppRoute,
    val title: String,
    val icon: Int  // ImageVector yerine Int (Drawable Resource ID)
)

private fun Int.toBadgeText(): String? {
    return when {
        this <= 0 -> null
        this > 9 -> "9+"
        else -> toString()
    }
}
