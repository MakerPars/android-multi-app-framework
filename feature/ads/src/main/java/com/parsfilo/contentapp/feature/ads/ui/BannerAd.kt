package com.parsfilo.contentapp.feature.ads.ui

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import kotlin.math.max

@SuppressLint("MissingPermission")
@Composable
fun BannerAd(
    adUnitId: String,
    modifier: Modifier = Modifier,
) {
    val windowInfo = LocalWindowInfo.current
    val density = LocalDensity.current
    val adWidthDp: Int = with(density) {
        max(1, windowInfo.containerSize.width.toDp().value.toInt())
    }

    val adRequest = remember { AdRequest.Builder().build() }
    var adViewRef by remember { mutableStateOf<AdView?>(null) }

    DisposableEffect(Unit) {
        onDispose {
            adViewRef?.destroy()
            adViewRef = null
        }
    }

    key(adUnitId, adWidthDp) {
        AndroidView(
            modifier = modifier.fillMaxWidth(),
            factory = { ctx ->
                AdView(ctx).apply {
                    adViewRef = this
                    this.adUnitId = adUnitId
                    // Google-recommended adaptive banner sizing (inline, compact max height).
                    setAdSize(AdSize.getInlineAdaptiveBannerAdSize(adWidthDp, 50))
                    loadAd(adRequest)
                }
            },
        )
    }
}
