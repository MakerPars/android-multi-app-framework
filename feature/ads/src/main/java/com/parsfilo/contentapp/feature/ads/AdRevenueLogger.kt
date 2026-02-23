package com.parsfilo.contentapp.feature.ads

import android.os.Bundle
import com.google.android.gms.ads.AdValue
import com.google.android.gms.ads.ResponseInfo
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
    fun logPaidEvent(context: AdPaidEventContext) {
        val adValue = context.adValue
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
            "ad_paid_event",
            Bundle().apply {
                putString("ad_format", context.adFormat.analyticsValue)
                putString("placement", context.placement.analyticsValue)
                putString("ad_unit_id", context.adUnitId)
                putLong("value_micros", adValue.valueMicros)
                putString("currency", adValue.currencyCode)
                putLong("precision", adValue.precisionType.toLong())
                putString("response_id", context.responseMeta.responseId)
                putString("mediation_adapter", context.responseMeta.mediationAdapterClassName)
                putString("loaded_adapter_name", context.responseMeta.loadedAdapterName)
                putString("network", context.responseMeta.networkName)
                putString("route", context.route ?: "unknown")
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
            "ad_impression",
            Bundle().apply {
                putString("ad_format", adFormat.analyticsValue)
                putString("placement", placement.analyticsValue)
                putString("ad_unit_id", adUnitId)
                putString("route", route ?: "unknown")
            },
        )
    }

    fun logClick(
        adFormat: AdFormat,
        placement: AdPlacement,
        adUnitId: String,
        route: String? = null,
    ) {
        appAnalytics.logEvent(
            "ad_click",
            Bundle().apply {
                putString("ad_format", adFormat.analyticsValue)
                putString("placement", placement.analyticsValue)
                putString("ad_unit_id", adUnitId)
                putString("route", route ?: "unknown")
            },
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
}
