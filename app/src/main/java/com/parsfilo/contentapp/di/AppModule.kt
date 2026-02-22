package com.parsfilo.contentapp.di

import com.parsfilo.contentapp.BuildConfig
import com.parsfilo.contentapp.core.firebase.push.PUSH_REGISTRATION_URL
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Named

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Named("audioFileName")
    fun provideAudioFileName(): String = if (BuildConfig.FLAVOR_NAME == "kuran_kerim") "" else BuildConfig.AUDIO_FILE_NAME

    @Provides
    @Named("useAssetPackAudio")
    fun provideUseAssetPackAudio(): Boolean = BuildConfig.USE_ASSET_PACK_AUDIO

    @Provides
    @Named(PUSH_REGISTRATION_URL)
    fun providePushRegistrationUrl(): String = BuildConfig.PUSH_REGISTRATION_URL
}

