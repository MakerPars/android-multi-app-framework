package com.parsfilo.contentapp.feature.billing

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryProductDetailsResult
import com.android.billingclient.api.QueryPurchasesParams
import com.parsfilo.contentapp.core.datastore.PreferencesDataSource
import com.parsfilo.contentapp.core.model.SubscriptionState
import com.parsfilo.contentapp.feature.billing.model.BillingProduct
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BillingManager @Inject constructor(
    @ApplicationContext private val appContext: Context,
    private val preferencesDataSource: PreferencesDataSource
) {

    private var scope = createScope()

    private val _subscriptionState = MutableStateFlow<SubscriptionState>(SubscriptionState.Loading)
    val subscriptionState: StateFlow<SubscriptionState> = _subscriptionState.asStateFlow()

    private val _productDetails = MutableStateFlow<List<BillingProduct>>(emptyList())
    val productDetails: StateFlow<List<BillingProduct>> = _productDetails.asStateFlow()

    private val purchasesUpdatedListener = PurchasesUpdatedListener { billingResult, purchases ->
        onPurchasesUpdated(billingResult, purchases.orEmpty())
    }

    private var billingClient: BillingClient = createBillingClient()

    private val isConnecting = AtomicBoolean(false)

    private fun createScope(): CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private fun ensureScope() {
        if (scope.coroutineContext[Job]?.isActive != true) {
            scope = createScope()
        }
    }

    private fun createBillingClient(): BillingClient {
        val pendingPurchasesParams = PendingPurchasesParams.newBuilder()
            .enableOneTimeProducts()
            .build()

        return BillingClient.newBuilder(appContext)
            .enablePendingPurchases(pendingPurchasesParams)
            .setListener(purchasesUpdatedListener)
            .build()
    }

    fun startConnection() {
        if (billingClient.isReady) {
            queryProductDetails()
            refreshPurchaseState()
            return
        }
        if (!isConnecting.compareAndSet(false, true)) return
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                isConnecting.set(false)
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    queryProductDetails()
                    refreshPurchaseState()
                } else {
                    setError("Billing setup failed: ${billingResult.debugMessage}")
                }
            }

            override fun onBillingServiceDisconnected() {
                isConnecting.set(false)
                Timber.w("Billing service disconnected")
                endConnection()
            }
        })
    }

    fun endConnection() {
        if (billingClient.isReady) {
            billingClient.endConnection()
        }
        scope.coroutineContext[Job]?.cancel()
        scope = createScope()
    }

    fun launchBillingFlow(activity: Activity, billingProduct: BillingProduct) {
        if (!billingClient.isReady) {
            startConnection()
            _subscriptionState.value = SubscriptionState.Error("Ödeme servisine bağlanılıyor, tekrar deneyin")
            return
        }

        _subscriptionState.value = SubscriptionState.Loading

        val productParamsBuilder = BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(billingProduct.productDetails)

        if (billingProduct.offerToken.isNotBlank()) {
            productParamsBuilder.setOfferToken(billingProduct.offerToken)
        }

        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(listOf(productParamsBuilder.build()))
            .build()

        val result = billingClient.launchBillingFlow(activity, flowParams)
        if (result.responseCode != BillingClient.BillingResponseCode.OK) {
            setError("Satın alma başlatılamadı: ${result.debugMessage}")
        }
    }

    fun restorePurchases() {
        refreshPurchaseState()
    }

    fun refreshPurchaseState() {
        if (!billingClient.isReady) {
            startConnection()
            return
        }
        queryPurchases()
    }

    private fun onPurchasesUpdated(
        billingResult: BillingResult,
        purchases: List<Purchase>
    ) {
        when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.OK -> handlePurchases(purchases)
            BillingClient.BillingResponseCode.USER_CANCELED -> queryPurchases()
            else -> setError("Satın alma hatası: ${billingResult.debugMessage}")
        }
    }

    private fun queryProductDetails() {
        val productIds = BillingCatalog.subscriptionProductIds

        val products = productIds.map { productId ->
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        }

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(products)
            .build()

        billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsResult ->
            if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                setError("Planlar alınamadı: ${billingResult.debugMessage}")
                return@queryProductDetailsAsync
            }

            val rawProducts = productDetailsResult.productDetailsList
                .flatMap { details -> details.toBillingProducts() }

            logUnfetchedProducts(productDetailsResult)

            // 1) Öncelikli productId'yi seç (aynı anda birden çok katalogu karıştırma)
            val preferredProductId = BillingCatalog.resolvePreferredProductId(rawProducts)
            val scopedProducts = if (preferredProductId != null) {
                rawProducts.filter { it.productId == preferredProductId }
            } else {
                rawProducts
            }

            // 2) Sadece kullanıcıya göstermek istediğimiz temel planları tut.
            val basePlanFiltered = scopedProducts.filter { product ->
                BillingCatalog.isAllowedBasePlan(product.basePlanId)
            }
            val candidateProducts = if (basePlanFiltered.isNotEmpty()) basePlanFiltered else scopedProducts

            // 3) Aynı plan birden fazla offer ile gelirse en uygun fiyatı bırak.
            val deduplicated = candidateProducts
                .groupBy { product -> BillingCatalog.deduplicationKey(product) }
                .map { (_, items) ->
                    items.minByOrNull { it.priceAmountMicros } ?: items.first()
                }

            val mapped = deduplicated.sortedWith(
                compareBy({ BillingCatalog.periodOrder(it.billingPeriod) }, { it.priceAmountMicros })
            )

            _productDetails.value = mapped
            if (mapped.isEmpty()) {
                Timber.w("Billing products are empty")
            }
        }
    }

    private fun logUnfetchedProducts(result: QueryProductDetailsResult) {
        val unfetched = result.unfetchedProductList
        if (unfetched.isEmpty()) return

        unfetched.forEach { unfetchedProduct ->
            Timber.w(
                "Unfetched product: id=%s status=%s",
                unfetchedProduct.productId,
                unfetchedProduct.statusCode
            )
        }
    }

    private fun ProductDetails.toBillingProducts(): List<BillingProduct> {
        return subscriptionOfferDetails.orEmpty().map { offer ->
            val phase = offer.pricingPhases.pricingPhaseList.lastOrNull()
            val period = phase?.billingPeriod
            val price = phase?.formattedPrice.orEmpty()
            val basePlanId = offer.basePlanId
            val id = "$productId:$basePlanId"

            BillingProduct(
                id = id,
                productId = productId,
                basePlanId = basePlanId,
                offerToken = offer.offerToken,
                priceAmountMicros = phase?.priceAmountMicros ?: Long.MAX_VALUE,
                priceText = price,
                billingPeriod = period,
                productDetails = this
            )
        }
    }

    private fun queryPurchases() {
        if (!billingClient.isReady) {
            startConnection()
            return
        }

        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()

        billingClient.queryPurchasesAsync(params) { billingResult, purchases ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                handlePurchases(purchases)
            } else {
                setError("Satın alma geçmişi alınamadı: ${billingResult.debugMessage}")
            }
        }
    }

    private fun handlePurchases(purchases: List<Purchase>) {
        val purchased = purchases.filter { it.purchaseState == Purchase.PurchaseState.PURCHASED }

        if (purchased.isEmpty()) {
            applySubscriptionState(isPremium = false, isAutoRenewing = false)
            return
        }

        purchased.forEach { purchase ->
            acknowledgeIfNeeded(purchase)
        }

        val autoRenewing = purchased.any { it.isAutoRenewing }
        applySubscriptionState(isPremium = true, isAutoRenewing = autoRenewing)
    }

    private fun acknowledgeIfNeeded(purchase: Purchase) {
        if (purchase.isAcknowledged) return

        val params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()

        billingClient.acknowledgePurchase(params) { result ->
            if (result.responseCode != BillingClient.BillingResponseCode.OK) {
                Timber.w("Acknowledge failed: %s", result.debugMessage)
            }
        }
    }

    private fun applySubscriptionState(
        isPremium: Boolean,
        isAutoRenewing: Boolean
    ) {
        ensureScope()
        scope.launch {
            preferencesDataSource.setPremium(isPremium)
        }

        _subscriptionState.value = if (isPremium) {
            SubscriptionState.Active(
                expiryDate = null,
                isAutoRenewing = isAutoRenewing
            )
        } else {
            SubscriptionState.Inactive
        }
    }

    private fun setError(message: String) {
        _subscriptionState.value = SubscriptionState.Error(message)
        Timber.w(message)
    }
}


