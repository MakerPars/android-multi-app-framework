package com.parsfilo.contentapp.feature.ads

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FirebaseConsentMappingTest {
    @Test
    fun `granted maps all firebase consent flags to true`() {
        val result = mapToFirebaseConsentGrantedFlags(granted = true)

        assertThat(result.adStorageGranted).isTrue()
        assertThat(result.analyticsStorageGranted).isTrue()
        assertThat(result.adUserDataGranted).isTrue()
        assertThat(result.adPersonalizationGranted).isTrue()
    }

    @Test
    fun `denied maps all firebase consent flags to false`() {
        val result = mapToFirebaseConsentGrantedFlags(granted = false)

        assertThat(result.adStorageGranted).isFalse()
        assertThat(result.analyticsStorageGranted).isFalse()
        assertThat(result.adUserDataGranted).isFalse()
        assertThat(result.adPersonalizationGranted).isFalse()
    }
}
