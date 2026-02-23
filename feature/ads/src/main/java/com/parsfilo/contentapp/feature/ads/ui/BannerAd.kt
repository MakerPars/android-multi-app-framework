package com.parsfilo.contentapp.feature.ads.ui

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.parsfilo.contentapp.feature.ads.AdFormat
import com.parsfilo.contentapp.feature.ads.AdPaidEventContext
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.AdsConsentRuntimeState
import com.parsfilo.contentapp.feature.ads.AdsUiEntryPoint
import dagger.hilt.android.EntryPointAccessors
import kotlin.math.max

@SuppressLint("MissingPermission")
@Composable
fun BannerAd(
    adUnitId: String,
    placement: AdPlacement = AdPlacement.BANNER_DEFAULT,
    route: String? = null,
    modifier: Modifier = Modifier,
) {
    val canRequestAds by AdsConsentRuntimeState.canRequestAds.collectAsState()
    if (!canRequestAds) return

    val context = LocalContext.current
    val appContext = context.applicationContext
    val revenueLogger = remember(appContext) {
        EntryPointAccessors.fromApplication(appContext, AdsUiEntryPoint::class.java).adRevenueLogger()
    }
    val adRequest = remember { AdRequest.Builder().build() }

    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val adWidthDp = max(1, maxWidth.value.toInt())
        val adSize = remember(adWidthDp, context) {
            AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(context, adWidthDp)
        }
        val adView = remember(adUnitId, adWidthDp) {
            AdView(context).apply {
                this.adUnitId = adUnitId
                setAdSize(adSize)
                adListener = object : AdListener() {
                    override fun onAdImpression() {
                        revenueLogger.logImpression(
                            adFormat = AdFormat.BANNER,
                            placement = placement,
                            adUnitId = adUnitId,
                            route = route,
                        )
                    }

                    override fun onAdClicked() {
                        revenueLogger.logClick(
                            adFormat = AdFormat.BANNER,
                            placement = placement,
                            adUnitId = adUnitId,
                            route = route,
                        )
                    }
                }
                onPaidEventListener = { adValue ->
                    revenueLogger.logPaidEvent(
                        AdPaidEventContext(
                            adUnitId = adUnitId,
                            adFormat = AdFormat.BANNER,
                            placement = placement,
                            route = route,
                            adValue = adValue,
                            responseMeta = revenueLogger.extractResponseMeta(responseInfo),
                        ),
                    )
                }
                loadAd(adRequest)
            }
        }

        DisposableEffect(adView) {
            onDispose { adView.destroy() }
        }

        AndroidView(
            modifier = Modifier.fillMaxWidth(),
            factory = { adView },
            update = { view ->
                if (view.adUnitId != adUnitId) {
                    view.adUnitId = adUnitId
                    view.setAdSize(adSize)
                    view.loadAd(adRequest)
                }
            },
        )
    }
}
