package com.parsfilo.contentapp.feature.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class InterstitialAdManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferencesDataSource: PreferencesDataSource
) {
    private var interstitialAd: InterstitialAd? = null
    private var currentAdUnitId: String? = null

    companion object {
        /** İki geçiş reklamı arası minimum süre — 3 dakika */
        private const val FREQUENCY_CAP_MS = 3 * 60 * 1000L
    }

    fun loadAd(adUnitId: String) {
        currentAdUnitId = adUnitId
        val adRequest = AdRequest.Builder().build()

        InterstitialAd.load(
            context,
            adUnitId,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    interstitialAd = null
                }

                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                }
            }
        )
    }

    /**
     * Frequency capping ile geçiş reklamı gösterir.
     * Son gösterimden beri [FREQUENCY_CAP_MS] geçmediyse göstermez.
     */
    suspend fun showAd(activity: Activity, onAdDismissed: () -> Unit) {
        val prefs = preferencesDataSource.userData.first()
        val now = System.currentTimeMillis()

        // Premium veya ödül süresi aktifse reklam gösterme.
        if (prefs.isPremium || prefs.rewardedAdFreeUntil > now) {
            onAdDismissed()
            return
        }

        // Frequency cap kontrolü
        if (now - prefs.lastInterstitialShown < FREQUENCY_CAP_MS) {
            onAdDismissed()
            return
        }

        if (interstitialAd != null) {
            interstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    interstitialAd = null
                    onAdDismissed()
                    maybeReload()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    interstitialAd = null
                    onAdDismissed()
                    maybeReload()
                }

                override fun onAdShowedFullScreenContent() {
                    interstitialAd = null
                }
            }
            preferencesDataSource.setLastInterstitialShown(now)
            interstitialAd?.show(activity)
        } else {
            onAdDismissed()
            maybeReload()
        }
    }

    private fun maybeReload() {
        val adUnitId = currentAdUnitId ?: return
        if (interstitialAd == null) {
            loadAd(adUnitId)
        }
    }
}

