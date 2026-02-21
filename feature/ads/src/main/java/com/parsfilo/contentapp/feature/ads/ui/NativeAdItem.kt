package com.parsfilo.contentapp.feature.ads.ui

import android.widget.ImageView
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.drawable.toBitmap
import com.google.android.gms.ads.nativead.NativeAd
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import java.util.Locale

private const val MAX_STARS = 5
private val NATIVE_MEDIUM_MIN_HEIGHT = 250.dp
private val NATIVE_MEDIA_HEIGHT = 132.dp

@Composable
fun NativeAdItem(
    nativeAd: NativeAd,
    modifier: Modifier = Modifier,
) {
    val dimens = LocalDimens.current
    val colorScheme = MaterialTheme.colorScheme

    // Flavor temasından gelen renkler
    val cardBg = colorScheme.surface
    val accentColor = colorScheme.secondary
    val textPrimary = colorScheme.onSurface
    val textSecondary = colorScheme.onSurfaceVariant
    val borderColor = colorScheme.outline.copy(alpha = 0.35f)
    val adLabelBg = colorScheme.secondaryContainer
    val adLabelText = colorScheme.onSecondaryContainer
    val ctaBg = colorScheme.primary
    val ctaText = colorScheme.onPrimary

    DisposableEffect(nativeAd) {
        onDispose { /* Ad lifecycle managed by NativeAdManager */ }
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = dimens.space12, vertical = dimens.space8),
        contentAlignment = Alignment.Center
    ) {
        NativeAdViewCompose(
            nativeAd = nativeAd,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 0.dp),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = NATIVE_MEDIUM_MIN_HEIGHT)
                    .clip(RoundedCornerShape(dimens.radiusLarge))
                    .background(cardBg, RoundedCornerShape(dimens.radiusLarge))
                    .border(dimens.stroke, borderColor, RoundedCornerShape(dimens.radiusLarge))
                    .padding(dimens.space12),
            ) {
                // ── Üst: Reklam etiketi + AdChoices ──
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    NativeAdAttribution(
                        text = "Reklam",
                        containerColor = adLabelBg,
                        contentColor = adLabelText,
                    )
                    NativeAdChoicesView(modifier = Modifier.size(dimens.iconMd))
                }

                Spacer(modifier = Modifier.height(dimens.space4))

                // ── Icon + Headline + Star Rating ──
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    nativeAd.icon?.let { icon ->
                        NativeAdIconView(
                            modifier = Modifier
                                .size(dimens.iconXl)
                                .clip(CircleShape),
                        ) {
                            icon.drawable?.toBitmap()?.let { bitmap ->
                                Image(
                                    bitmap = bitmap.asImageBitmap(),
                                    contentDescription = "Ad Icon",
                                    modifier = Modifier.size(dimens.iconXl),
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(dimens.space10))
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        nativeAd.headline?.let { headline ->
                            NativeAdHeadlineView {
                                Text(
                                    text = headline,
                                    color = textPrimary,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                        }

                        nativeAd.starRating?.let { rating ->
                            NativeAdStarRatingView {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    val fullStars = rating.toInt()
                                    val emptyStars = (MAX_STARS - fullStars).coerceAtLeast(0)
                                    Text(
                                        text = "★".repeat(fullStars) + "☆".repeat(emptyStars),
                                        color = accentColor,
                                        fontSize = 14.sp,
                                    )
                                    Spacer(modifier = Modifier.width(dimens.space4))
                                    Text(
                                        text = String.format(Locale.US, "%.1f", rating),
                                        color = textSecondary,
                                        fontSize = 12.sp,
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(dimens.space6))

                NativeAdMediaView(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(NATIVE_MEDIA_HEIGHT)
                        .clip(RoundedCornerShape(dimens.radiusMedium)),
                    scaleType = ImageView.ScaleType.CENTER_CROP,
                )

                Spacer(modifier = Modifier.height(dimens.space6))

                nativeAd.body?.let { body ->
                    NativeAdBodyView(modifier = Modifier.padding(bottom = dimens.space8)) {
                        Text(
                            text = body,
                            color = textSecondary,
                            fontSize = 13.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }

                nativeAd.advertiser?.let { advertiser ->
                    NativeAdAdvertiserView(modifier = Modifier.padding(bottom = dimens.space8)) {
                        Text(
                            text = advertiser,
                            color = textSecondary,
                            fontSize = 12.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }

                // ── Alt: Store / Price / CTA ──
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        nativeAd.store?.let { store ->
                            NativeAdStoreView {
                                Text(text = store, color = textSecondary, fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.width(dimens.space8))
                        }
                        nativeAd.price?.let { price ->
                            NativeAdPriceView {
                                Text(
                                    text = price,
                                    color = accentColor,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                )
                            }
                        }
                    }

                    nativeAd.callToAction?.let { cta ->
                        NativeAdCallToActionView {
                            NativeAdButton(
                                text = cta,
                                containerColor = ctaBg,
                                contentColor = ctaText,
                            )
                        }
                    }
                }
            }
        }
    }
}
