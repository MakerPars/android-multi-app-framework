package com.parsfilo.contentapp.feature.ads

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FirebaseConsentMappingTest {
    @Test
    fun `granted maps both firebase consent flags to true`() {
        val result = mapToFirebaseConsentGrantedFlags(granted = true)

        assertThat(result.first).isTrue()
        assertThat(result.second).isTrue()
    }

    @Test
    fun `denied maps both firebase consent flags to false`() {
        val result = mapToFirebaseConsentGrantedFlags(granted = false)

        assertThat(result.first).isFalse()
        assertThat(result.second).isFalse()
    }
}
