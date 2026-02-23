package com.parsfilo.contentapp.ui

import android.app.Activity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.model.SubscriptionState
import com.parsfilo.contentapp.feature.ads.AdGateChecker
import com.parsfilo.contentapp.feature.ads.RewardedAdManager
import com.parsfilo.contentapp.feature.billing.BillingManager
import com.parsfilo.contentapp.feature.billing.model.BillingProduct
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull
import javax.inject.Inject

@HiltViewModel
class RewardsViewModel @Inject constructor(
    private val rewardedAdManager: RewardedAdManager,
    private val adGateChecker: AdGateChecker,
    private val billingManager: BillingManager,
    private val preferencesDataSource: PreferencesDataSource
) : ViewModel() {

    private val _isAdLoading = MutableStateFlow(false)
    val isAdLoading: StateFlow<Boolean> = _isAdLoading.asStateFlow()

    val uiState: StateFlow<RewardsUiState> = combine(
        preferencesDataSource.userData,
        billingManager.subscriptionState,
        billingManager.productDetails
    ) { prefs, subState, products ->
        val now = System.currentTimeMillis()
        val remainingMs = (prefs.rewardedAdFreeUntil - now).coerceAtLeast(0L)

        RewardsUiState(
            remainingAdFreeMs = remainingMs,
            watchCount = prefs.rewardWatchCount,
            nextRewardMinutes = AdGateChecker.calculateRewardMinutes(prefs.rewardWatchCount + 1),
            isPremium = prefs.isPremium,
            subscriptionState = subState,
            productDetails = products
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = RewardsUiState()
    )

    // Countdown timer — kalan süreyi her saniye güncelle
    private val _remainingSeconds = MutableStateFlow(0L)
    val remainingSeconds: StateFlow<Long> = _remainingSeconds.asStateFlow()

    init {
        viewModelScope.launch {
            while (isActive) {
                val prefs = preferencesDataSource.userData.first()
                val remaining = (prefs.rewardedAdFreeUntil - System.currentTimeMillis())
                    .coerceAtLeast(0L)
                _remainingSeconds.value = remaining / 1000
                delay(1000L)
            }
        }
    }

    fun watchRewardedAd(activity: Activity, adUnitId: String) {
        if (rewardedAdManager.isAdReadyNow()) {
            _isAdLoading.value = false
            showRewardedAd(activity, adUnitId)
            return
        }

        _isAdLoading.value = true
        rewardedAdManager.loadAd(adUnitId)
        viewModelScope.launch {
            val adReady = withTimeoutOrNull(10_000L) {
                rewardedAdManager.isAdReady
                    .filter { it }
                    .first()
            } != null
            _isAdLoading.value = false

            if (adReady) {
                rewardedAdManager.showAd(
                    activity = activity,
                    onUserEarnedReward = {
                        viewModelScope.launch {
                            adGateChecker.onRewardEarned()
                        }
                    },
                    onAdDismissed = {
                        // Yeni reklam ön yükle
                        rewardedAdManager.loadAd(adUnitId)
                    }
                )
            } else {
                // İlk yükleme başarısızsa sonraki deneme için tekrar tetikleyelim.
                rewardedAdManager.loadAd(adUnitId)
            }
        }
    }

    fun showRewardedAd(activity: Activity, adUnitId: String) {
        rewardedAdManager.showAd(
            activity = activity,
            onUserEarnedReward = {
                viewModelScope.launch {
                    adGateChecker.onRewardEarned()
                }
            },
            onAdDismissed = {
                // Yeni reklam ön yükle
                rewardedAdManager.loadAd(adUnitId)
            }
        )
    }

    fun loadRewardedAd(adUnitId: String) {
        rewardedAdManager.loadAd(adUnitId)
    }

    fun launchBillingFlow(activity: Activity, billingProduct: BillingProduct) {
        billingManager.launchBillingFlow(activity, billingProduct)
    }
}

data class RewardsUiState(
    val remainingAdFreeMs: Long = 0L,
    val watchCount: Int = 0,
    val nextRewardMinutes: Int = 30,
    val isPremium: Boolean = false,
    val subscriptionState: SubscriptionState = SubscriptionState.Loading,
    val productDetails: List<BillingProduct> = emptyList()
)
