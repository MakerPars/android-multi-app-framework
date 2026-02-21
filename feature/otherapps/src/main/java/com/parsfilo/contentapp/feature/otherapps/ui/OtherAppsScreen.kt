package com.parsfilo.contentapp.feature.otherapps.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.SubcomposeAsyncImage
import coil3.compose.SubcomposeAsyncImageContent
import com.parsfilo.contentapp.core.designsystem.component.AppButton
import com.parsfilo.contentapp.core.designsystem.component.AppCard
import com.parsfilo.contentapp.core.designsystem.tokens.LocalDimens
import com.parsfilo.contentapp.feature.otherapps.R
import com.parsfilo.contentapp.feature.otherapps.model.OtherApp

@Composable
fun OtherAppsRoute(
    viewModel: OtherAppsViewModel = hiltViewModel()
) {
    val apps by viewModel.apps.collectAsStateWithLifecycle()
    OtherAppsScreen(apps)
}

@Composable
fun OtherAppsScreen(apps: List<OtherApp>) {
    val context = LocalContext.current
    val dimens = LocalDimens.current
    val colorScheme = MaterialTheme.colorScheme

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colorScheme.background)
    ) {
        // Başlık
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = dimens.space16, bottom = dimens.space8),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(R.string.other_apps_title),
                color = colorScheme.onBackground,
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.SemiBold,
                fontSize = 22.sp
            )
        }

        HorizontalDivider(
            thickness = dimens.stroke,
            color = colorScheme.outline.copy(alpha = 0.3f),
            modifier = Modifier.padding(horizontal = dimens.space24, vertical = dimens.space4)
        )

        Spacer(modifier = Modifier.height(dimens.space8))

        LazyColumn(
            contentPadding = PaddingValues(horizontal = dimens.space12, vertical = dimens.space8),
            verticalArrangement = Arrangement.spacedBy(dimens.space14),
            modifier = Modifier.fillMaxSize()
        ) {
            itemsIndexed(
                items = apps,
                key = { index, app -> "${app.packageName}_$index" },
            ) { _, app ->
                AppItem(
                    app = app,
                    onClick = {
                    try {
                        context.startActivity(
                            Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=${app.packageName}"))
                        )
                    } catch (_: Exception) {
                        context.startActivity(
                            Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://play.google.com/store/apps/details?id=${app.packageName}")
                            )
                        )
                    }
                })
            }
        }
    }
}

@Composable
fun AppItem(app: OtherApp, onClick: () -> Unit) {
    val dimens = LocalDimens.current
    val colorScheme = MaterialTheme.colorScheme
    AppCard(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(dimens.space14),
        colors = CardDefaults.cardColors(containerColor = colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = dimens.elevationMedium)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = dimens.space14, vertical = dimens.space14)
        ) {
            SubcomposeAsyncImage(
                model = app.appIconUrl,
                contentDescription = app.appName,
                modifier = Modifier
                    .size(dimens.topBarHeight)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop,
                loading = {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(dimens.iconMd),
                            strokeWidth = dimens.space2,
                            color = colorScheme.primary
                        )
                    }
                },
                success = { SubcomposeAsyncImageContent() },
                error = {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Text(
                            text = app.appName.take(1),
                            style = MaterialTheme.typography.titleLarge,
                            color = colorScheme.primary
                        )
                    }
                }
            )

            Text(
                text = app.appName,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = dimens.space12)
            )

            if (app.isNew) {
                Surface(
                    color = Color(0xFFFF6F00),
                    shape = RoundedCornerShape(dimens.radiusSmall),
                    modifier = Modifier.padding(end = dimens.space6)
                ) {
                    Text(
                        text = stringResource(R.string.other_apps_new),
                        color = Color.White,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(horizontal = dimens.space8, vertical = dimens.space4)
                    )
                }
            }

            AppButton(
                text = stringResource(R.string.other_apps_install),
                onClick = onClick,
                shape = RoundedCornerShape(dimens.radiusXLarge),
                colors = ButtonDefaults.buttonColors(containerColor = colorScheme.primary),
                contentPadding = PaddingValues(horizontal = dimens.space12, vertical = dimens.space8),
            ) {
                Text(
                    text = stringResource(R.string.other_apps_install),
                    color = colorScheme.onPrimary,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
