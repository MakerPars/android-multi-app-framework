package com.parsfilo.contentapp.ui

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.MainActivity
import com.parsfilo.contentapp.core.firebase.AppAnalytics
import com.parsfilo.contentapp.core.firebase.logAudioPause
import com.parsfilo.contentapp.core.firebase.logAudioPlay
import com.parsfilo.contentapp.core.firebase.logAudioStop
import com.parsfilo.contentapp.core.firebase.logScreenView
import com.parsfilo.contentapp.feature.ads.AdPlacement
import com.parsfilo.contentapp.feature.ads.RewardedInterstitialIntroSpec
import com.parsfilo.contentapp.feature.ads.ui.BannerAd
import com.parsfilo.contentapp.feature.ads.ui.NativeAdItem
import com.parsfilo.contentapp.feature.ads.ui.NativeAdViewModel
import com.parsfilo.contentapp.feature.audio.ui.AudioPlayerViewModel
import com.parsfilo.contentapp.feature.audio.ui.InlineAudioPlayer
import com.parsfilo.contentapp.feature.auth.ui.AuthRoute
import com.parsfilo.contentapp.feature.billing.ui.SubscriptionRoute
import com.parsfilo.contentapp.feature.content.ui.ContentRoute
import com.parsfilo.contentapp.feature.content.ui.miracles.MiraclesContentVariant
import com.parsfilo.contentapp.feature.content.ui.miracles.MiraclesDetailRoute
import com.parsfilo.contentapp.feature.content.ui.miracles.MiraclesListRoute
import com.parsfilo.contentapp.feature.content.ui.prayer.PrayerDetailRoute
import com.parsfilo.contentapp.feature.content.ui.prayer.PrayerListRoute
import com.parsfilo.contentapp.feature.counter.ui.CounterRoute
import com.parsfilo.contentapp.feature.messages.ui.MessageDetailRoute
import com.parsfilo.contentapp.feature.messages.ui.MessagesRoute
import com.parsfilo.contentapp.feature.notifications.ui.NotificationDetailRoute
import com.parsfilo.contentapp.feature.notifications.ui.NotificationsRoute
import com.parsfilo.contentapp.feature.otherapps.ui.OtherAppsRoute
import com.parsfilo.contentapp.feature.prayertimes.model.PrayerAppVariant
import com.parsfilo.contentapp.feature.prayertimes.ui.PrayerLocationPickerRoute
import com.parsfilo.contentapp.feature.prayertimes.ui.PrayerTimesRoute
import com.parsfilo.contentapp.feature.qibla.QiblaRoute
import com.parsfilo.contentapp.feature.quran.ui.bookmarks.QuranBookmarksRoute
import com.parsfilo.contentapp.feature.quran.ui.reciter.QuranReciterSettingsRoute
import com.parsfilo.contentapp.feature.quran.ui.suradetail.QuranSuraDetailRoute
import com.parsfilo.contentapp.feature.quran.ui.surelist.QuranSuraListRoute
import com.parsfilo.contentapp.feature.settings.ui.SettingsRoute
import com.parsfilo.contentapp.monetization.AppAdUnitIds
import com.parsfilo.contentapp.navigation.AppRoute
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

@Composable
fun AppNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    isUserSignedIn: Boolean,
    audioPlayerViewModel: AudioPlayerViewModel,
    appAnalytics: AppAnalytics,
    onPrivacyOptionsUpdated: () -> Unit = {},
    updateDebugSummary: String? = null,
    onUpdateDebugFetchNow: () -> Unit = {},
    onUpdateDebugSimulateSoft: () -> Unit = {},
    onUpdateDebugSimulateHard: () -> Unit = {},
    onUpdateDebugClearSimulation: () -> Unit = {},
    onUpdateDebugResetSoftPrompt: () -> Unit = {},
    nativeAdViewModel: NativeAdViewModel = hiltViewModel()
) {
    val audioState by audioPlayerViewModel.playerState.collectAsStateWithLifecycle()
    val nativeAd by nativeAdViewModel.nativeAdState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val hostActivity = context as? MainActivity
    val coroutineScope = rememberCoroutineScope()
    var rewardedInterstitialIntroRequest by remember { mutableStateOf<RewardedInterstitialIntroRequest?>(null) }
    val adUnitIds = remember(context, BuildConfig.USE_TEST_ADS) {
        AppAdUnitIds.resolve(context, BuildConfig.USE_TEST_ADS)
    }

    fun requestInterstitialAd(
        placement: AdPlacement = AdPlacement.INTERSTITIAL_NAV_BREAK,
        route: String? = null,
        onAdDismissed: () -> Unit = {},
    ) {
        val activity = hostActivity ?: return
        coroutineScope.launch {
            activity.adOrchestrator.showInterstitialIfEligible(
                activity = activity,
                placement = placement,
                route = route,
                onAdDismissed = onAdDismissed,
            )
        }
    }

    LaunchedEffect(navController) {
        navController.currentBackStackEntryFlow
            // Keep route template names (avoid ids in analytics to reduce cardinality).
            .map { entry -> entry.destination.route ?: entry.destination.displayName }
            .distinctUntilChanged()
            .collect { route ->
                appAnalytics.logScreenView(screenName = route, screenClass = "AppNavHost")
                hostActivity?.adOrchestrator?.updateSessionContext(
                    activeRoute = route,
                    contentType = routeToContentType(route),
                )
            }
    }

    NavHost(
        navController = navController,
        startDestination = AppRoute.HomeGraph.route,
        modifier = modifier
    ) {
        // Home Graph
        navigation(
            route = AppRoute.HomeGraph.route,
            startDestination = when {
                BuildConfig.IS_PRAYER_TIMES_FLAVOR -> AppRoute.PrayerTimesHome.route
                BuildConfig.FLAVOR == "kible" -> AppRoute.Qibla.route
                BuildConfig.FLAVOR == "namazsurelerivedualarsesli" -> AppRoute.PrayerList.route
                BuildConfig.FLAVOR == "mucizedualar" || BuildConfig.FLAVOR == "esmaulhusna" -> AppRoute.MiraclesList.route
                BuildConfig.FLAVOR == "zikirmatik" -> AppRoute.ZikirCounter.route
                BuildConfig.FLAVOR == "kuran_kerim" -> AppRoute.QuranSuraList.route
                else -> AppRoute.Content.route
            }
        ) {
            composable(AppRoute.PrayerTimesHome.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_HOME)
                }
                PrayerTimesRoute(
                    appName = stringResource(com.parsfilo.contentapp.R.string.app_name),
                    variant = if (BuildConfig.FLAVOR == "imsakiye") {
                        PrayerAppVariant.IMSAKIYE
                    } else {
                        PrayerAppVariant.NAMAZ_VAKITLERI
                    },
                    bannerAdContent = {
                        BannerAd(
                            adUnitId = adUnitIds.banner,
                            placement = AdPlacement.BANNER_HOME,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad ->
                            NativeAdItem(nativeAd = ad)
                        }
                    },
                    onOpenQibla = {
                        navController.navigate(AppRoute.Qibla.route)
                    },
                    onOpenLocationPicker = {
                        navController.navigate(AppRoute.PrayerLocationPicker.route)
                    },
                    onOpenRewards = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                )
            }
            composable(AppRoute.PrayerLocationPicker.route) {
                PrayerLocationPickerRoute(
                    appName = stringResource(com.parsfilo.contentapp.R.string.app_name),
                    bannerAdContent = {
                        BannerAd(
                            adUnitId = adUnitIds.banner,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    onBackClick = { navController.popBackStack() }
                )
            }
            composable(AppRoute.Qibla.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_HOME)
                }
                QiblaRoute(
                    appName = stringResource(com.parsfilo.contentapp.R.string.app_name),
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    bannerAdContent = {
                        BannerAd(
                            adUnitId = adUnitIds.banner,
                            placement = AdPlacement.BANNER_QIBLA,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                    },
                )
            }
            composable(AppRoute.ZikirCounter.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_ZIKIR)
                }
                CounterRoute(
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    onShowInterstitial = {
                        requestInterstitialAd(
                            placement = AdPlacement.INTERSTITIAL_NAV_BREAK,
                            route = AppRoute.ZikirCounter.route,
                        )
                    },
                    onShowRewardedHistoryAd = { onUnlocked ->
                        val activity = hostActivity
                        if (activity == null) {
                            onUnlocked()
                        } else {
                            val placement = AdPlacement.REWARDED_INTERSTITIAL_HISTORY_UNLOCK
                            val route = AppRoute.ZikirCounter.route
                            val adUnitId = AppAdUnitIds.resolvePlacement(
                                activity,
                                placement,
                                BuildConfig.USE_TEST_ADS,
                            )
                            val introSpec = activity.adOrchestrator.buildRewardedInterstitialIntro(placement)
                            activity.adOrchestrator.onRewardedInterstitialIntroShown(
                                placement = placement,
                                route = route,
                                adUnitId = adUnitId,
                            )
                            rewardedInterstitialIntroRequest = RewardedInterstitialIntroRequest(
                                placement = placement,
                                route = route,
                                adUnitId = adUnitId,
                                spec = introSpec,
                                onRewardEarned = onUnlocked,
                            )
                        }
                    },
                    bannerAdContent = {
                        BannerAd(
                            adUnitId = adUnitIds.banner,
                            placement = AdPlacement.BANNER_ZIKIR,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                    },
                )
            }
            if (BuildConfig.FLAVOR_NAME == "kuran_kerim") {
                composable(AppRoute.QuranSuraList.route) {
                    LaunchedEffect(Unit) {
                        nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_HOME)
                    }
                    QuranSuraListRoute(
                        onSuraClick = { suraNumber ->
                            val activity = hostActivity
                            if (activity == null) {
                                navController.navigate(AppRoute.QuranSuraDetail.createRoute(suraNumber))
                            } else {
                                requestInterstitialAd(
                                    placement = AdPlacement.INTERSTITIAL_NAV_BREAK,
                                    route = AppRoute.QuranSuraList.route,
                                    onAdDismissed = {
                                        navController.navigate(AppRoute.QuranSuraDetail.createRoute(suraNumber))
                                    },
                                )
                            }
                        },
                        onBookmarksClick = { navController.navigate(AppRoute.QuranBookmarks.route) },
                        onSettingsClick = {
                            navController.navigate(AppRoute.Settings.route)
                        },
                        onRewardsClick = {
                            navController.navigate(AppRoute.Rewards.route)
                        },
                        bannerAdContent = {
                            BannerAd(
                                adUnitId = adUnitIds.banner,
                                modifier = Modifier.fillMaxWidth(),
                            )
                        },
                        nativeAdContent = {
                            nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                        },
                    )
                }
                composable(
                    route = AppRoute.QuranSuraDetail.route,
                    arguments = AppRoute.QuranSuraDetail.arguments,
                ) {
                    LaunchedEffect(Unit) {
                        nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_CONTENT)
                    }
                    val seenAyahsInSession = remember { mutableSetOf<Int>() }
                    QuranSuraDetailRoute(
                        onBack = { navController.popBackStack() },
                        onBookmarksClick = { navController.navigate(AppRoute.QuranBookmarks.route) },
                        onPlayAudioUrl = { url ->
                            audioPlayerViewModel.setOverrideAudioFileName(null)
                            audioPlayerViewModel.playFromUrl(url)
                        },
                        onPauseAudio = {
                            audioPlayerViewModel.pause()
                        },
                        onAyahVisibleExternal = { ayah ->
                            if (seenAyahsInSession.add(ayah.ayahNumber)) {
                                hostActivity?.adOrchestrator?.updateSessionContext(
                                    contentType = "quran",
                                    verseReadIncrement = 1,
                                )
                            }
                        },
                        bannerAdContent = {
                            BannerAd(
                                adUnitId = adUnitIds.banner,
                                modifier = Modifier.fillMaxWidth(),
                            )
                        },
                        nativeAdContent = {
                            nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                        },
                    )
                }
                composable(AppRoute.QuranBookmarks.route) {
                    LaunchedEffect(Unit) {
                        nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_CONTENT)
                    }
                    QuranBookmarksRoute(
                        onAyahClick = { sura, _ ->
                            navController.navigate(AppRoute.QuranSuraDetail.createRoute(sura))
                        },
                        onBack = { navController.popBackStack() },
                        bannerAdContent = {
                            BannerAd(
                                adUnitId = adUnitIds.banner,
                                modifier = Modifier.fillMaxWidth(),
                            )
                        },
                        nativeAdContent = {
                            nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                        },
                    )
                }
                composable(AppRoute.QuranReciterSettings.route) {
                    QuranReciterSettingsRoute(onBack = { navController.popBackStack() })
                }
            }
            composable(AppRoute.Content.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_CONTENT)
                }
                LaunchedEffect(Unit) {
                    audioPlayerViewModel.setOverrideAudioFileName(null)
                }
                ContentRoute(
                    appName = stringResource(com.parsfilo.contentapp.R.string.app_name),
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    }, onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    }, onModeChanged = { _ -> }, audioPlayerContent = {
                        InlineAudioPlayer(
                            state = audioState,
                            onPlayPause = {
                                if (audioState.isPlaying) {
                                    appAnalytics.logAudioPause(
                                        positionMs = audioState.currentPosition,
                                        durationMs = audioState.duration,
                                    )
                                } else {
                                    hostActivity?.adOrchestrator?.updateSessionContext(audioPlayed = true)
                                    appAnalytics.logAudioPlay(
                                        positionMs = audioState.currentPosition,
                                        durationMs = audioState.duration,
                                    )
                                }
                                audioPlayerViewModel.togglePlayPause()
                            },
                            onStop = {
                                appAnalytics.logAudioStop(
                                    positionMs = audioState.currentPosition,
                                    durationMs = audioState.duration,
                                )
                                audioPlayerViewModel.stop()
                            },
                            onSeek = audioPlayerViewModel::seekTo,
                            onRetry = audioPlayerViewModel::retryAssetLoad
                        )
                    }, nativeAdContent = {
                        nativeAd?.let { ad ->
                            NativeAdItem(nativeAd = ad)
                        }
                    },
                    bannerAdUnitId = adUnitIds.banner
                )
            }
            composable(AppRoute.PrayerList.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_HOME)
                }
                LaunchedEffect(Unit) {
                    audioPlayerViewModel.setOverrideAudioFileName(null)
                }
                PrayerListRoute(
                    onPrayerClick = { prayerId ->
                        navController.navigate(AppRoute.PrayerDetail.createRoute(prayerId))
                    },
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                    },
                    showVerseCount = BuildConfig.FLAVOR != "namazsurelerivedualarsesli",
                    bannerAdUnitId = adUnitIds.banner
                )
            }
            composable(
                route = AppRoute.PrayerDetail.route,
                arguments = AppRoute.PrayerDetail.arguments
            ) { backStackEntry ->
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_CONTENT)
                }
                backStackEntry.arguments?.getInt("prayerId") ?: 0
                PrayerDetailRoute(
                    onBackClick = { navController.popBackStack() },
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    onAudioFileChanged = { mediaKey ->
                        audioPlayerViewModel.setOverrideAudioFileName(mediaKey)
                    },
                    onModeChanged = { _ -> },
                    audioPlayerContent = {
                        InlineAudioPlayer(
                            state = audioState,
                            onPlayPause = {
                                if (audioState.isPlaying) {
                                    appAnalytics.logAudioPause(
                                        positionMs = audioState.currentPosition,
                                        durationMs = audioState.duration,
                                    )
                                } else {
                                    hostActivity?.adOrchestrator?.updateSessionContext(audioPlayed = true)
                                    appAnalytics.logAudioPlay(
                                        positionMs = audioState.currentPosition,
                                        durationMs = audioState.duration,
                                    )
                                }
                                audioPlayerViewModel.togglePlayPause()
                            },
                            onStop = {
                                appAnalytics.logAudioStop(
                                    positionMs = audioState.currentPosition,
                                    durationMs = audioState.duration,
                                )
                                audioPlayerViewModel.stop()
                            },
                            onSeek = audioPlayerViewModel::seekTo,
                            onRetry = audioPlayerViewModel::retryAssetLoad
                        )
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad ->
                            NativeAdItem(nativeAd = ad)
                        }
                    },
                    isDebug = BuildConfig.USE_TEST_ADS
                )
            }
            composable(AppRoute.MiraclesList.route) {
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_HOME)
                }
                val isEsmaFlavor = BuildConfig.FLAVOR == "esmaulhusna"
                if (isEsmaFlavor) {
                    LaunchedEffect(Unit) {
                        // Esma listesi için flavor default sesine dön.
                        audioPlayerViewModel.setOverrideAudioFileName(null)
                    }
                }
                MiraclesListRoute(
                    onPrayerClick = { prayerIndex ->
                        navController.navigate(AppRoute.MiraclesDetail.createRoute(prayerIndex))
                    },
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                    },
                    audioPlayerContent = if (isEsmaFlavor) {
                        {
                            InlineAudioPlayer(
                                state = audioState,
                                onPlayPause = audioPlayerViewModel::togglePlayPause,
                                onStop = audioPlayerViewModel::stop,
                                onSeek = audioPlayerViewModel::seekTo,
                                onRetry = audioPlayerViewModel::retryAssetLoad,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    } else {
                        null
                    },
                    onPlayAllAudioClick = if (isEsmaFlavor) {
                        {
                            hostActivity?.adOrchestrator?.updateSessionContext(audioPlayed = true)
                            audioPlayerViewModel.setOverrideAudioFileName(null)
                            audioPlayerViewModel.play()
                        }
                    } else {
                        null
                    },
                    bannerAdUnitId = adUnitIds.banner,
                    variant = if (isEsmaFlavor) {
                        MiraclesContentVariant.ESMAUL_HUSNA
                    } else {
                        MiraclesContentVariant.MUCIZEDUALAR
                    },
                    headerTitle = stringResource(com.parsfilo.contentapp.R.string.app_name),
                )
            }
            composable(
                route = AppRoute.MiraclesDetail.route,
                arguments = AppRoute.MiraclesDetail.arguments
            ) { backStackEntry ->
                LaunchedEffect(Unit) {
                    nativeAdViewModel.setPlacement(AdPlacement.NATIVE_FEED_CONTENT)
                }
                backStackEntry.arguments?.getInt("prayerIndex") ?: 0
                MiraclesDetailRoute(
                    onBackClick = { navController.popBackStack() },
                    onSettingsClick = {
                        navController.navigate(AppRoute.Settings.route)
                    },
                    onRewardsClick = {
                        navController.navigate(AppRoute.Rewards.route)
                    },
                    nativeAdContent = {
                        nativeAd?.let { ad -> NativeAdItem(nativeAd = ad) }
                    },
                    bannerAdUnitId = adUnitIds.banner,
                    variant = if (BuildConfig.FLAVOR == "esmaulhusna") {
                        MiraclesContentVariant.ESMAUL_HUSNA
                    } else {
                        MiraclesContentVariant.MUCIZEDUALAR
                    },
                )
            }
            composable(AppRoute.Settings.route) {
                SettingsRoute(
                    onBackClick = { navController.popBackStack() },
                    onPrivacyOptionsUpdated = onPrivacyOptionsUpdated,
                    updateDebugSummary = updateDebugSummary,
                    onUpdateDebugFetchNow = onUpdateDebugFetchNow,
                    onUpdateDebugSimulateSoft = onUpdateDebugSimulateSoft,
                    onUpdateDebugSimulateHard = onUpdateDebugSimulateHard,
                    onUpdateDebugClearSimulation = onUpdateDebugClearSimulation,
                    onUpdateDebugResetSoftPrompt = onUpdateDebugResetSoftPrompt,
                )
            }
            composable(AppRoute.Rewards.route) {
                RewardsRoute(
                    onBackClick = { navController.popBackStack() })
            }
        }

        // Subscription Tab
        composable(AppRoute.Subscription.route) {
            SubscriptionRoute(onBackClick = { navController.popBackStack() })
        }

        // Other Apps Tab
        composable(AppRoute.OtherApps.route) {
            OtherAppsRoute()
        }

        // Messages Graph
        navigation(
            route = AppRoute.MessagesGraph.route,
            startDestination = if (isUserSignedIn) AppRoute.MessageList.route else AppRoute.Auth.route
        ) {
            composable(AppRoute.MessageList.route) {
                MessagesRoute()
            }
            composable(AppRoute.Auth.route) {
                AuthRoute(
                    onSignInSuccess = {
                        navController.navigate(AppRoute.MessageList.route) {
                            popUpTo(AppRoute.Auth.route) { inclusive = true }
                        }
                    })
            }
            composable(
                route = AppRoute.MessageDetail.route,
                arguments = AppRoute.MessageDetail.arguments
            ) { backStackEntry ->
                val messageId = backStackEntry.arguments?.getString("messageId") ?: ""
                MessageDetailRoute(
                    messageId = messageId, onBackClick = { navController.popBackStack() })
            }
        }

        // Notifications Graph
        navigation(
            route = AppRoute.NotificationsGraph.route,
            startDestination = AppRoute.NotificationList.route
        ) {
            composable(AppRoute.NotificationList.route) {
                NotificationsRoute()
            }
            composable(
                route = AppRoute.NotificationDetail.route,
                arguments = AppRoute.NotificationDetail.arguments
            ) { backStackEntry ->
                val notificationId = backStackEntry.arguments?.getLong("notificationId") ?: 0L
                NotificationDetailRoute(
                    notificationId = notificationId, onBackClick = { navController.popBackStack() })
            }
        }
    }

    rewardedInterstitialIntroRequest?.let { request ->
        RewardedInterstitialIntroDialog(
            spec = request.spec,
            onConfirm = {
                val activity = hostActivity ?: return@RewardedInterstitialIntroDialog
                val launchToken = activity.adOrchestrator.confirmRewardedInterstitialIntro(
                    placement = request.placement,
                    route = request.route,
                    adUnitId = request.adUnitId,
                )
                rewardedInterstitialIntroRequest = null
                coroutineScope.launch {
                    activity.adOrchestrator.showRewardedInterstitialIfEligible(
                        activity = activity,
                        launchToken = launchToken,
                        placement = request.placement,
                        route = request.route,
                        onUserEarnedReward = request.onRewardEarned,
                    )
                }
            },
            onDismiss = {
                val activity = hostActivity
                if (activity != null) {
                    activity.adOrchestrator.onRewardedInterstitialIntroSkipped(
                        placement = request.placement,
                        route = request.route,
                        adUnitId = request.adUnitId,
                    )
                }
                rewardedInterstitialIntroRequest = null
            },
        )
    }
}

private fun routeToContentType(route: String): String =
    when {
        route.startsWith(AppRoute.QuranSuraDetail.route.substringBefore("/{")) ||
            route.startsWith(AppRoute.QuranSuraList.route) ||
            route.startsWith(AppRoute.QuranBookmarks.route) -> "quran"
        route.startsWith(AppRoute.PrayerTimesHome.route) ||
            route.startsWith(AppRoute.PrayerList.route) ||
            route.startsWith(AppRoute.PrayerDetail.route.substringBefore("/{")) -> "prayer"
        route.startsWith(AppRoute.ZikirCounter.route) -> "zikir"
        route.startsWith(AppRoute.MiraclesList.route) ||
            route.startsWith(AppRoute.MiraclesDetail.route.substringBefore("/{")) -> "miracle"
        route.startsWith(AppRoute.Content.route) -> "content"
        route.startsWith(AppRoute.Qibla.route) -> "qibla"
        else -> "other"
    }

private data class RewardedInterstitialIntroRequest(
    val placement: AdPlacement,
    val route: String,
    val adUnitId: String,
    val spec: RewardedInterstitialIntroSpec,
    val onRewardEarned: () -> Unit,
)








