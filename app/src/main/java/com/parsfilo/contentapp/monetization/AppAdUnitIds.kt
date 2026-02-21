package com.parsfilo.contentapp.monetization

import android.content.Context
import com.parsfilo.contentapp.R
import com.parsfilo.contentapp.feature.ads.AdUnitIds

/**
 * Resolves AdMob unit IDs for the current app/flavor.
 *
 * Why this exists:
 * - CI builds (Azure) don't have local.properties, so feature:ads BuildConfig.ADMOB_* can be empty.
 * - The per-flavor production IDs already live in app/src/<flavor>/res/values/ads.xml.
 *
 * AdMob IDs are not secrets; using resources keeps the build reproducible and flavor-correct.
 */
object AppAdUnitIds {

    data class Ids(
        val banner: String,
        val interstitial: String,
        val native: String,
        val rewarded: String,
        val rewardedInterstitial: String,
        val appOpen: String,
    )

    fun resolve(context: Context, useTestAds: Boolean): Ids {
        return if (useTestAds) {
            Ids(
                banner = AdUnitIds.Test.BANNER,
                interstitial = AdUnitIds.Test.INTERSTITIAL,
                native = AdUnitIds.Test.NATIVE,
                rewarded = AdUnitIds.Test.REWARDED,
                rewardedInterstitial = AdUnitIds.Test.REWARDED_INTERSTITIAL,
                appOpen = AdUnitIds.Test.APP_OPEN,
            )
        } else {
            val rewarded = context.getString(R.string.ad_unit_rewarded)
            Ids(
                banner = context.getString(R.string.ad_unit_banner),
                interstitial = context.getString(R.string.ad_unit_interstitial),
                native = context.getString(R.string.ad_unit_native),
                rewarded = rewarded,
                // Falls back to rewarded unit if flavor does not provide dedicated rewarded-interstitial id.
                rewardedInterstitial = stringByNameOrNull(context, "ad_unit_rewarded_interstitial")
                    ?: rewarded,
                appOpen = context.getString(R.string.ad_unit_open_app),
            )
        }
    }

    private fun stringByNameOrNull(context: Context, name: String): String? {
        val resId = context.resources.getIdentifier(name, "string", context.packageName)
        if (resId == 0) return null
        return runCatching { context.getString(resId) }
            .getOrNull()
            ?.takeIf { it.isNotBlank() }
    }
}
