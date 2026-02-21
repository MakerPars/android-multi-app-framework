package com.parsfilo.contentapp.feature.audio.di

import android.content.Context
import com.google.android.play.core.assetpacks.AssetPackManager
import com.google.android.play.core.assetpacks.AssetPackManagerFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AudioModule {



    @Provides
    @Singleton
    fun provideAssetPackManager(
        @ApplicationContext context: Context
    ): AssetPackManager = AssetPackManagerFactory.getInstance(context)
}
