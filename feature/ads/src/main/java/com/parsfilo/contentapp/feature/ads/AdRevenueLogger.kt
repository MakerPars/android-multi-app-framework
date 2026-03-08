package com.parsfilo.contentapp.feature.ads

import android.os.Bundle
import com.google.android.gms.ads.AdValue
import com.google.android.gms.ads.ResponseInfo
import com.parsfilo.contentapp.core.firebase.AnalyticsEventName
import com.parsfilo.contentapp.core.firebase.AnalyticsParamKey
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

data class AdResponseMeta(
    val responseId: String?,
    val mediationAdapterClassName: String?,
    val loadedAdapterName: String?,
    val networkName: String?,
)

data class AdPaidEventContext(
    val adUnitId: String,
    val adFormat: AdFormat,
    val placement: AdPlacement,
    val route: String?,
    val adValue: AdValue,
    val responseMeta: AdResponseMeta,
)

@Singleton
class AdRevenueLogger @Inject constructor(
    private val appAnalytics: AppAnalytics,
) {
    fun logRequest(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        ConsentFunnelDebugDashboard.onAdRequestSent(
            adFormat = adFormat,
            placement = placement,
            canRequestAds = AdsConsentRuntimeState.canRequestAds.value,
        )
        appAnalytics.logEvent(
            AnalyticsEventName.AD_REQUEST_SENT,
            adEventBundle(adFormat, placement, adUnitId, route),
        )
    }

    fun logLoaded(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
        fillLatencyMs: Long? = null,
        adapterName: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_LOADED,
            adEventBundle(adFormat, placement, adUnitId, route).apply {
                if (fillLatencyMs != null) putLong(AnalyticsParamKey.FILL_LATENCY_MS, fillLatencyMs)
                if (!adapterName.isNullOrBlank()) putString(AnalyticsParamKey.ADAPTER_NAME, adapterName)
            },
        )
    }

    fun logFailedToLoad(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        errorCode: Int,
        errorMessage: String?,
        route: String? = null,
        backoffAttempt: Int? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_FAILED_TO_LOAD,
            adEventBundle(adFormat, placement, adUnitId, route).apply {
                putLong(AnalyticsParamKey.ERROR_CODE, errorCode.toLong())
                if (!errorMessage.isNullOrBlank()) putString(AnalyticsParamKey.ERROR_MESSAGE, errorMessage)
                if (backoffAttempt != null) putLong(AnalyticsParamKey.BACKOFF_ATTEMPT, backoffAttempt.toLong())
            },
        )
    }

    fun logSuppressed(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        suppressReason: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_SUPPRESSED,
            adEventBundle(adFormat, placement, adUnitId, route).apply {
                putString(AnalyticsParamKey.SUPPRESS_REASON, suppressReason)
            },
        )
    }

    fun logSuppressed(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        suppressReason: AdSuppressReason,
        route: String? = null,
    ) = logSuppressed(
        adFormat = adFormat,
        placement = placement,
        adUnitId = adUnitId,
        suppressReason = suppressReason.analyticsValue,
        route = route,
    )

    fun logFailedToShow(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        errorCode: Int? = null,
        errorMessage: String? = null,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_FAILED_TO_SHOW,
            adEventBundle(adFormat, placement, adUnitId, route).apply {
                if (errorCode != null) putLong(AnalyticsParamKey.ERROR_CODE, errorCode.toLong())
                if (!errorMessage.isNullOrBlank()) putString(AnalyticsParamKey.ERROR_MESSAGE, errorMessage)
            },
        )
    }

    fun logDismissed(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_DISMISSED,
            adEventBundle(adFormat, placement, adUnitId, route),
        )
    }

    fun logRewardedInterstitialIntroShown(
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.REWARDED_INTRO_SHOWN,
            adEventBundle(AdFormat.REWARDED_INTERSTITIAL, placement, adUnitId, route),
        )
    }

    fun logRewardedInterstitialIntroSkipped(
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.REWARDED_INTRO_SKIPPED,
            adEventBundle(AdFormat.REWARDED_INTERSTITIAL, placement, adUnitId, route),
        )
    }

    fun logRewardedInterstitialIntroConfirmed(
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.REWARDED_INTRO_CONFIRMED,
            adEventBundle(AdFormat.REWARDED_INTERSTITIAL, placement, adUnitId, route),
        )
    }

    fun logAdAfterEngagement(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
        sessionDurationSeconds: Long,
        verseCountBeforeAd: Int,
        sessionAudioPlayed: Boolean,
        sessionContentType: String?,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_AFTER_ENGAGEMENT,
            adEventBundle(adFormat, placement, adUnitId, route).apply {
                putLong(AnalyticsParamKey.SESSION_DURATION_S, sessionDurationSeconds)
                putLong(AnalyticsParamKey.VERSE_COUNT_BEFORE_AD, verseCountBeforeAd.toLong())
                putLong(AnalyticsParamKey.SESSION_AUDIO_PLAYED, if (sessionAudioPlayed) 1L else 0L)
                if (!sessionContentType.isNullOrBlank()) {
                    putString(AnalyticsParamKey.SESSION_CONTENT_TYPE, sessionContentType)
                }
            },
        )
    }

    fun logPaidEvent(context: AdPaidEventContext) {
        val adValue = context.adValue
        if (adValue.valueMicros == 0L) {
            Timber.d(
                "Ad paid event micros=0 (common for test ads / some networks) format=%s placement=%s",
                context.adFormat.analyticsValue,
                context.placement.analyticsValue,
            )
        }
        Timber.i(
            "Ad paid event format=%s placement=%s micros=%d currency=%s precision=%d responseId=%s adapter=%s",
            context.adFormat.analyticsValue,
            context.placement.analyticsValue,
            adValue.valueMicros,
            adValue.currencyCode,
            adValue.precisionType,
            context.responseMeta.responseId,
            context.responseMeta.mediationAdapterClassName,
        )

        appAnalytics.logEvent(
            AnalyticsEventName.AD_PAID_EVENT,
            Bundle().apply {
                putString(AnalyticsParamKey.AD_FORMAT, context.adFormat.analyticsValue)
                putString(AnalyticsParamKey.PLACEMENT, context.placement.analyticsValue)
                putString(AnalyticsParamKey.AD_UNIT_ID, context.adUnitId)
                putLong("value_micros", adValue.valueMicros)
                putString("currency", adValue.currencyCode)
                putLong("precision", adValue.precisionType.toLong())
                putString("response_id", context.responseMeta.responseId)
                putString("mediation_adapter", context.responseMeta.mediationAdapterClassName)
                putString("loaded_adapter_name", context.responseMeta.loadedAdapterName)
                putString("network", context.responseMeta.networkName)
                putString(AnalyticsParamKey.ROUTE, context.route ?: "unknown")
            },
        )
    }

    fun logImpression(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_IMPRESSION,
            adEventBundle(adFormat, placement, adUnitId, route),
        )
    }

    fun logClick(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_CLICK,
            adEventBundle(adFormat, placement, adUnitId, route),
        )
    }

    fun logServed(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            AnalyticsEventName.AD_SERVED,
            adEventBundle(adFormat, placement, adUnitId, route),
        )
    }

    fun extractResponseMeta(responseInfo: ResponseInfo?): AdResponseMeta {
        val adapterInfo = responseInfo?.loadedAdapterResponseInfo
        return AdResponseMeta(
            responseId = responseInfo?.responseId,
            mediationAdapterClassName = responseInfo?.mediationAdapterClassName,
            loadedAdapterName = adapterInfo?.adSourceName,
            networkName = adapterInfo?.adSourceName,
        )
    }

    private fun adEventBundle(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String?,
    ): Bundle =
        Bundle().apply {
            putString(AnalyticsParamKey.AD_FORMAT, adFormat.analyticsValue)
            putString(AnalyticsParamKey.PLACEMENT, placement.analyticsValue)
            putString(AnalyticsParamKey.AD_UNIT_ID, adUnitId)
            putString(AnalyticsParamKey.ROUTE, route ?: "unknown")
        }
}
