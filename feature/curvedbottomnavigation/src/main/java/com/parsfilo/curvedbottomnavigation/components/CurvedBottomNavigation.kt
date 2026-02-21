package com.parsfilo.curvedbottomnavigation.components

import android.graphics.Paint
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.asAndroidPath
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.sp
import com.parsfilo.contentapp.core.designsystem.theme.app_curved_fab_default
import com.parsfilo.contentapp.core.designsystem.theme.app_neutral_black
import com.parsfilo.contentapp.core.designsystem.theme.app_neutral_gray
import com.parsfilo.contentapp.core.designsystem.theme.app_neutral_red
import com.parsfilo.contentapp.core.designsystem.theme.app_neutral_white
import com.parsfilo.contentapp.core.designsystem.theme.app_shadow_soft
import com.parsfilo.contentapp.core.designsystem.theme.app_shadow_strong
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import kotlinx.coroutines.launch
import kotlin.math.abs

/**
 * Curved Bottom Navigation Item Model
 */
data class CurvedBottomNavigationItem(
    val id: String,
    val title: String,
    val icon: Int,
    val badge: String? = null
)

@Composable
fun CurvedBottomNavigation(
    items: List<CurvedBottomNavigationItem>,
    selectedItemId: String,
    onItemSelected: (String) -> Unit,
    modifier: Modifier = Modifier,
    backgroundColor: Color = app_neutral_black,
    iconColor: Color = app_neutral_white,
    selectedIconColor: Color = app_neutral_white,
    titleColor: Color = app_neutral_white,
    fabColor: Color = app_curved_fab_default,
    badgeTextColor: Color = app_neutral_white,
    badgeBackgroundColor: Color = app_neutral_red,
    rippleColor: Color = app_neutral_gray,
    titleTextSize: Int = 12,
    iconSize: Dp? = null,
    selectedIconSize: Dp? = null,
    curveRadius: Dp? = null,
    height: Dp? = null,
    hasAnimation: Boolean = true,
    titleFontFamily: FontFamily? = null,
    badgeFontFamily: FontFamily? = null,
) {
    // Guard: boş liste kontrolü
    if (items.isEmpty()) return

    val density = LocalDensity.current
    val dimens = LocalDimens.current
    val resolvedIconSize = iconSize ?: dimens.iconMd
    val resolvedSelectedIconSize = selectedIconSize ?: dimens.iconXl
    val resolvedCurveRadius = curveRadius ?: dimens.radiusXLarge
    val resolvedHeight = height ?: dimens.bottomBarHeight

    // Başlangıç index'ini bul
    val initialIndex = remember(items, selectedItemId) {
        items.indexOfFirst { it.id == selectedItemId }.let {
            if (it >= 0 && it < items.size) it else 0
        }
    }

    var selectedIndex by remember { mutableIntStateOf(initialIndex) }

    // Curve pozisyonu animasyonu
    val curveX = remember { Animatable(initialIndex.toFloat()) }
    // Geçiş animasyonu (0 = inner curve, 1 = outer curve)
    val transitionT = remember { Animatable(0f) }

    // Px değerlerini hesapla
    val heightPx = with(density) { resolvedHeight.toPx() }
    val selectedIconSizePx = with(density) { resolvedSelectedIconSize.toPx() }
    val shadowHeight = with(density) { dimens.space4.toPx() }
    val shadowBlurPx = with(density) { dimens.elevationMedium.toPx() }

    // Shadow paint'i optimize edilmiş şekilde oluştur
    val shadowPaint = remember(backgroundColor, shadowBlurPx) {
        Paint().apply {
            isAntiAlias = true
            color = backgroundColor.toArgb()
            setShadowLayer(
                shadowBlurPx,
                0f,
                -shadowBlurPx / 2f,
                app_shadow_strong.toArgb()
            )
        }
    }

    // Seçili item değiştiğinde animasyonu çalıştır
    LaunchedEffect(selectedItemId, items) {
        val newIndex = items.indexOfFirst { it.id == selectedItemId }.let {
            if (it >= 0 && it < items.size) it else 0
        }

        if (newIndex != selectedIndex) {
            val oldIndex = selectedIndex
            selectedIndex = newIndex

            if (hasAnimation) {
                // Önceki animasyonları iptal et
                curveX.stop()
                transitionT.stop()

                val indexDifference = abs(newIndex - oldIndex)
                val animationDuration = (indexDifference * 100 + 150).coerceAtMost(500)

                // Paralel animasyonlar
                launch {
                    curveX.animateTo(
                        targetValue = newIndex.toFloat(),
                        animationSpec = tween(
                            durationMillis = animationDuration,
                            easing = FastOutSlowInEasing
                        )
                    )
                }

                launch {
                    transitionT.snapTo(0f)
                    transitionT.animateTo(
                        targetValue = 1f,
                        animationSpec = tween(
                            durationMillis = 125,
                            easing = FastOutSlowInEasing
                        )
                    )
                    transitionT.animateTo(
                        targetValue = 0f,
                        animationSpec = tween(
                            durationMillis = 125,
                            easing = FastOutSlowInEasing
                        )
                    )
                }
            } else {
                curveX.snapTo(newIndex.toFloat())
                transitionT.snapTo(0f)
            }
        }
    }

    Box(modifier = modifier.height(resolvedHeight)) {
        // Eğri şekilli arka plan
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(resolvedHeight)
        ) {
            val width = size.width
            val itemWidth = width / items.size.toFloat()
            val currentCurveCenterX = curveX.value * itemWidth + itemWidth / 2f

            drawCurvedBackground(
                width = width,
                height = heightPx,
                curveCenterX = currentCurveCenterX,
                selectedIconSizePx = selectedIconSizePx,
                shadowHeight = shadowHeight,
                shadowBlurPx = shadowBlurPx,
                backgroundColor = backgroundColor,
                transitionProgress = transitionT.value,
                transitionMarginPx = with(density) { dimens.space16.toPx() },
                outerCurveDepthPx = with(density) { dimens.space10.toPx() },
                curveRadiusPx = with(density) { resolvedCurveRadius.toPx() },
                shadowPaint = shadowPaint,
                density = density
            )
        }

        // Navigasyon öğeleri
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(resolvedHeight),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEachIndexed { _, item ->
                val isSelected = item.id == selectedItemId

                CurvedBottomNavigationItemView(
                    item = item,
                    isSelected = isSelected,
                    onClick = { onItemSelected(item.id) },
                    iconColor = iconColor,
                    selectedIconColor = selectedIconColor,
                    titleColor = titleColor,
                    fabColor = fabColor,
                    badgeTextColor = badgeTextColor,
                    badgeBackgroundColor = badgeBackgroundColor,
                    rippleColor = rippleColor,
                    titleTextSize = titleTextSize,
                    iconSize = resolvedIconSize,
                    selectedIconSize = resolvedSelectedIconSize,
                    itemVerticalPadding = dimens.space6,
                    itemHorizontalPadding = dimens.space2,
                    iconBottomPadding = dimens.space2,
                    selectedItemOffsetY = dimens.space2,
                    badgeOffsetX = dimens.space4,
                    badgeOffsetY = -dimens.space4,
                    badgeSize = dimens.iconXs,
                    fabShadowElevation = dimens.elevationMedium,
                    fabTonalElevation = dimens.elevationNone,
                    hasAnimation = hasAnimation,
                    titleFontFamily = titleFontFamily,
                    badgeFontFamily = badgeFontFamily,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

/**
 * Eğri arka plan şeklini çizer - GERÇEK CURVED NOTCH ile
 * transitionProgress: 0 = inner curve (FAB için oyuk), 1 = outer curve (transition bump)
 */
private fun DrawScope.drawCurvedBackground(
    width: Float,
    height: Float,
    curveCenterX: Float,
    selectedIconSizePx: Float,
    shadowHeight: Float,
    shadowBlurPx: Float,
    backgroundColor: Color,
    transitionProgress: Float,
    transitionMarginPx: Float,
    outerCurveDepthPx: Float,
    curveRadiusPx: Float,
    shadowPaint: Paint,
    density: androidx.compose.ui.unit.Density
) {
    val path = Path()

    // FAB boyutu ve curve parametreleri
    val fabRadius = selectedIconSizePx / 2f

    // İçe oyuk (FAB aktif) - POZİTİF değerler (aşağı yön için)
    val innerCurveWidth = fabRadius * 1.50f
    val innerCurveDepth = fabRadius * 1.75f

    // Dışa bump (transition)
    val outerCurveWidth = fabRadius * 2.0f
    val outerCurveDepth = outerCurveDepthPx

    // İnterpolasyon
    val t = transitionProgress.coerceIn(0f, 1f)
    val curveWidth = lerp(innerCurveWidth, outerCurveWidth, t)
    val curveDepth = lerp(innerCurveDepth, outerCurveDepth, t)

    // Bar'ın üst çizgisi
    val barTopY = shadowHeight

    // PATH ÇİZİMİ - CURVED NOTCH
    path.moveTo(0f, barTopY)

    // Sol düz çizgi - FAB başlangıcına kadar
    val transitionMargin = transitionMarginPx
    val curveStartX = curveCenterX - curveWidth - transitionMargin
    path.lineTo(curveStartX, barTopY)

    // SOL GEÇİŞ CURVE (yumuşak geçiş)
    val leftTransitionControlY = barTopY + (curveRadiusPx * 0.15f)
    val leftTransitionEndY = barTopY + curveDepth * 0.35f
    path.cubicTo(
        curveCenterX - curveWidth - transitionMargin / 2f, barTopY,
        curveCenterX - curveWidth, leftTransitionControlY,
        curveCenterX - curveWidth * 0.75f, leftTransitionEndY
    )

    // FAB SOL CURVE (derinleşiyor)
    path.cubicTo(
        curveCenterX - curveWidth * 0.5f, barTopY + curveDepth * 0.75f,  // Control 1
        curveCenterX - curveWidth * 0.25f, barTopY + curveDepth * 0.95f, // Control 2
        curveCenterX, barTopY + curveDepth  // End (merkez, en derin nokta)
    )

    // FAB SAĞ CURVE (yukarıdan dönüş)
    path.cubicTo(
        curveCenterX + curveWidth * 0.25f, barTopY + curveDepth * 0.95f,  // Control 1
        curveCenterX + curveWidth * 0.5f, barTopY + curveDepth * 0.75f,   // Control 2
        curveCenterX + curveWidth * 0.75f, barTopY + curveDepth * 0.35f   // End
    )

    // SAĞ GEÇİŞ CURVE
    path.cubicTo(
        curveCenterX + curveWidth, leftTransitionControlY,
        curveCenterX + curveWidth + transitionMargin / 2f, barTopY,
        curveCenterX + curveWidth + transitionMargin, barTopY
    )

    // Sağ düz çizgi
    path.lineTo(width, barTopY)
    path.lineTo(width, height)
    path.lineTo(0f, height)
    path.close()

    // Shadow çizimi
    drawIntoCanvas { canvas ->
        canvas.nativeCanvas.drawPath(path.asAndroidPath(), shadowPaint)
    }

    // Ana arka plan
    drawPath(path = path, color = backgroundColor, style = Fill)
}

/**
 * Float değerler arasında linear interpolasyon
 */
private fun lerp(start: Float, stop: Float, fraction: Float): Float {
    return start + (stop - start) * fraction.coerceIn(0f, 1f)
}

/**
 * Tek bir navigasyon öğesi
 */
@Composable
private fun CurvedBottomNavigationItemView(
    item: CurvedBottomNavigationItem,
    isSelected: Boolean,
    onClick: () -> Unit,
    iconColor: Color,
    selectedIconColor: Color,
    titleColor: Color,
    fabColor: Color,
    badgeTextColor: Color,
    badgeBackgroundColor: Color,
    rippleColor: Color,
    titleTextSize: Int,
    iconSize: Dp,
    selectedIconSize: Dp,
    itemVerticalPadding: Dp,
    itemHorizontalPadding: Dp,
    iconBottomPadding: Dp,
    selectedItemOffsetY: Dp,
    badgeOffsetX: Dp,
    badgeOffsetY: Dp,
    badgeSize: Dp,
    fabShadowElevation: Dp,
    fabTonalElevation: Dp,
    hasAnimation: Boolean,
    titleFontFamily: FontFamily?,
    badgeFontFamily: FontFamily?,
    modifier: Modifier = Modifier
) {
    // Animasyon progress'i
    val animatedProgress = remember { Animatable(if (isSelected) 1f else 0f) }

    LaunchedEffect(isSelected) {
        animatedProgress.stop()
        if (hasAnimation) {
            val targetValue = if (isSelected) 1f else 0f
            val duration = if (isSelected) 350 else 250
            val delay = if (isSelected) 80 else 0

            animatedProgress.animateTo(
                targetValue = targetValue,
                animationSpec = tween(
                    durationMillis = duration,
                    delayMillis = delay,
                    easing = FastOutSlowInEasing
                )
            )
        } else {
            animatedProgress.snapTo(if (isSelected) 1f else 0f)
        }
    }

    val progress = animatedProgress.value.coerceIn(0f, 1f)
    val selectedIconScale = 1f + (progress * 0.1f)
    val normalIconScale = 1.0f
    val iconTint = lerp(iconColor, selectedIconColor, progress)
    val titleAlpha = if (isSelected) 1f else 0.76f

    Box(
        modifier = modifier
            .fillMaxHeight()
            .semantics {
                role = Role.Tab
                contentDescription = item.title
            }
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple(
                    color = rippleColor,
                    bounded = false
                ),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        if (isSelected) {
            // Seçili item için FAB circle
            Surface(
                modifier = Modifier
                    .size(selectedIconSize)
                    .offset(y = selectedItemOffsetY * progress)
                    .graphicsLayer {
                        ambientShadowColor = app_shadow_soft
                        spotShadowColor = app_shadow_soft
                    },
                shape = MaterialTheme.shapes.extraLarge,
                color = fabColor,
                shadowElevation = fabShadowElevation,
                tonalElevation = fabTonalElevation
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.fillMaxSize()
                ) {
                    Icon(
                        painter = painterResource(id = item.icon),
                        contentDescription = item.title,
                        modifier = Modifier
                            .size(iconSize)
                            .scale(selectedIconScale),
                        tint = iconTint
                    )
                }
            }
        } else {
            // Normal item layout
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = itemVerticalPadding, horizontal = itemHorizontalPadding),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    contentAlignment = Alignment.TopEnd,
                    modifier = Modifier.padding(bottom = iconBottomPadding)
                ) {
                    Icon(
                        painter = painterResource(id = item.icon),
                        contentDescription = item.title,
                        modifier = Modifier
                            .size(iconSize)
                            .scale(normalIconScale),
                        tint = iconTint
                    )

                    // Badge gösterimi
                    if (!item.badge.isNullOrEmpty()) {
                        Surface(
                            modifier = Modifier
                                .offset(x = badgeOffsetX, y = badgeOffsetY)
                                .size(badgeSize),
                            shape = MaterialTheme.shapes.extraLarge,
                            color = badgeBackgroundColor
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier.fillMaxSize()
                            ) {
                                Text(
                                    text = when {
                                        item.badge.length > 2 -> "${item.badge.take(2)}.."
                                        else -> item.badge
                                    },
                                    style = TextStyle(
                                        color = badgeTextColor,
                                        fontSize = 8.sp,
                                        fontFamily = badgeFontFamily
                                    )
                                )
                            }
                        }
                    }
                }

                // Başlık
                Text(
                    text = item.title,
                    style = TextStyle(
                        color = if (isSelected) selectedIconColor else titleColor,
                        fontSize = titleTextSize.sp,
                        fontFamily = titleFontFamily
                    ),
                    modifier = Modifier.alpha(titleAlpha),
                    maxLines = 1
                )
            }
        }
    }
}
