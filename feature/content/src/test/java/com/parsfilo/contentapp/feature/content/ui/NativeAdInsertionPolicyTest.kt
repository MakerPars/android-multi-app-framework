package com.parsfilo.contentapp.feature.content.ui

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NativeAdInsertionPolicyTest {

    @Test
    fun `single verse inserts ad after verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(0, 1)).isTrue()
    }

    @Test
    fun `two verses inserts ad after second verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(0, 2)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(1, 2)).isTrue()
    }

    @Test
    fun `three and four verses insert ad after second verse`() {
        assertThat(shouldInsertNativeAdAfterVerse(1, 3)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(0, 3)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(2, 3)).isFalse()

        assertThat(shouldInsertNativeAdAfterVerse(1, 4)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(0, 4)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(2, 4)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(3, 4)).isFalse()
    }

    @Test
    fun `five verses insert ads after second and fourth verses`() {
        assertThat(shouldInsertNativeAdAfterVerse(1, 5)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(3, 5)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(0, 5)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(2, 5)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(4, 5)).isFalse()
    }

    @Test
    fun `more than five verses inserts ad after each five verses including the last verse when aligned`() {
        assertThat(shouldInsertNativeAdAfterVerse(4, 6)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(0, 6)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(5, 6)).isFalse()

        assertThat(shouldInsertNativeAdAfterVerse(4, 10)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(9, 10)).isTrue()
        assertThat(shouldInsertNativeAdAfterVerse(8, 10)).isFalse()
    }

    @Test
    fun `invalid indexes and totals return false`() {
        assertThat(shouldInsertNativeAdAfterVerse(-1, 3)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(3, 3)).isFalse()
        assertThat(shouldInsertNativeAdAfterVerse(0, 0)).isFalse()
    }
}
