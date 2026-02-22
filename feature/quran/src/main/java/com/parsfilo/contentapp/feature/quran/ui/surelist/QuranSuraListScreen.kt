package com.parsfilo.contentapp.feature.quran.ui.surelist

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.parsfilo.contentapp.core.designsystem.component.AppButton
import com.parsfilo.contentapp.core.designsystem.component.AppCard
import com.parsfilo.contentapp.core.designsystem.component.AppTopBar
import com.parsfilo.contentapp.feature.quran.R
import com.parsfilo.contentapp.feature.quran.ui.component.SuraListItem

@Composable
fun QuranSuraListRoute(
    onSuraClick: (Int) -> Unit,
    onBookmarksClick: () -> Unit,
    bannerAdContent: (@Composable () -> Unit)? = null,
    nativeAdContent: (@Composable () -> Unit)? = null,
    viewModel: QuranSuraListViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    QuranSuraListScreen(
        state = uiState,
        onSuraClick = onSuraClick,
        onBookmarksClick = onBookmarksClick,
        onSearch = viewModel::onSearchQueryChange,
        onRetry = viewModel::retrySync,
        bannerAdContent = bannerAdContent,
        nativeAdContent = nativeAdContent,
    )
}

@Composable
fun QuranSuraListScreen(
    state: SuraListViewModelState,
    onSuraClick: (Int) -> Unit,
    onBookmarksClick: () -> Unit,
    onSearch: (String) -> Unit,
    onRetry: () -> Unit,
    bannerAdContent: (@Composable () -> Unit)? = null,
    nativeAdContent: (@Composable () -> Unit)? = null,
) {
    val meccanLabel = stringResource(R.string.quran_revelation_meccan)
    val medinanLabel = stringResource(R.string.quran_revelation_medinan)

    Scaffold(
        topBar = {
            AppTopBar(
                title = stringResource(R.string.quran_title),
                actions = {
                    androidx.compose.material3.IconButton(onClick = onBookmarksClick) {
                        androidx.compose.material3.Icon(
                            imageVector = Icons.Default.Bookmark,
                            contentDescription = stringResource(R.string.quran_open_bookmarks),
                        )
                    }
                },
            )
        },
        bottomBar = {
            if (state.shouldShowAds) {
                bannerAdContent?.invoke()
            }
        },
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
        ) {
            OutlinedTextField(
                value = state.query,
                onValueChange = onSearch,
                placeholder = { Text(stringResource(R.string.quran_search_placeholder)) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                singleLine = true,
            )

            val lastRead = state.lastRead
            if (lastRead != null) {
                AppCard(
                    modifier = Modifier
                        .padding(horizontal = 12.dp)
                        .fillMaxWidth()
                        .clickable { onSuraClick(lastRead.suraNumber) },
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = stringResource(R.string.quran_last_read_title),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = stringResource(
                                R.string.quran_last_read_format,
                                lastRead.suraNumber,
                                lastRead.ayahNumber,
                            ),
                            style = MaterialTheme.typography.bodyMedium,
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            if (state.isLoading && state.suras.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    CircularProgressIndicator()
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(stringResource(R.string.quran_loading))
                }
                return@Column
            }

            if (state.errorMessage != null && state.suras.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text(
                        text = stringResource(R.string.quran_error_load_suras),
                        style = MaterialTheme.typography.titleMedium,
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = state.errorMessage)
                    Spacer(modifier = Modifier.height(12.dp))
                    AppButton(text = stringResource(R.string.quran_retry), onClick = onRetry)
                }
                return@Column
            }

            val suras = state.filteredSuras
            if (suras.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text(
                        text = if (state.suras.isEmpty()) {
                            stringResource(R.string.quran_empty_offline)
                        } else {
                            stringResource(R.string.quran_no_results)
                        },
                        style = MaterialTheme.typography.titleMedium,
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (state.suras.isEmpty()) {
                            stringResource(R.string.quran_retry)
                        } else {
                            stringResource(R.string.quran_no_results_desc)
                        },
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
                return@Column
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 96.dp),
            ) {
                itemsIndexed(
                    items = suras,
                    key = { _, sura -> sura.number },
                ) { index, sura ->
                    SuraListItem(
                        sura = sura,
                        meccanLabel = meccanLabel,
                        medinanLabel = medinanLabel,
                        modifier = Modifier.clickable { onSuraClick(sura.number) },
                    )

                    if (state.shouldShowAds && nativeAdContent != null && (index + 1) % 6 == 0 && index < suras.lastIndex) {
                        nativeAdContent()
                    }
                }
            }
        }
    }
}
