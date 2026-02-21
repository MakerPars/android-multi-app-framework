package com.parsfilo.contentapp.feature.content.ui

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NativeAdInsertionPolicyTest {

    @Test
    fun `single verse inserts ad after verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(0, 1)).isTrue()
    }

    @Test
    fun `two verses inserts ad after first verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(0, 2)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(1, 2)).isFalse()
    }

    @Test
    fun `up to five verses inserts one ad after first verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(0, 5)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(1, 5)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(3, 5)).isFalse()
    }

    @Test
    fun `more than five verses inserts ad after each five verses`() {
        assertThat(shouldInsertNativeAdAfterVerse(4, 6)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(0, 6)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(5, 6)).isFalse()
    }

    @Test
    fun `long content inserts multiple ad slots at five step intervals`() {
        assertThat(shouldInsertNativeAdAfterVerse(4, 11)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(9, 11)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(10, 11)).isFalse()
    }
}
