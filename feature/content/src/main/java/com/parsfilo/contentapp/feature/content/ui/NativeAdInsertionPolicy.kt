package com.parsfilo.contentapp.feature.content.ui

/**
 * Native reklam ekleme kuralı:
 * - 1 ayet: tek ayetten sonra 1 reklam
 * - 2-5 ayet arası: 1. ayetten sonra tek reklam
 * - 5+ ayet: her 5 ayetten sonra reklam
 */
fun shouldInsertNativeAdAfterVerse(
    verseIndex: Int,
    totalVerses: Int
): Boolean {
    if (totalVerses <= 0) return false

    if (totalVerses == 1) {
        return verseIndex == 0
    }

    if (verseIndex >= totalVerses - 1) return false

    return if (totalVerses > 5) {
        (verseIndex + 1) % 5 == 0
    } else {
        verseIndex == 0
    }
}
