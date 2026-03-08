package com.parsfilo.contentapp.feature.content.ui

/**
 * Native reklam ekleme kuralı:
 * - Toplam 1 ayet: 1. ayetten sonra 1 reklam
 * - Toplam 2 ayet: 2. ayetten sonra 1 reklam
 * - Toplam 3 ayet: 2. ayetten sonra 1 reklam
 * - Toplam 4 ayet: 2. ayetten sonra 1 reklam
 * - Toplam 5 ayet: 2. ve 4. ayetten sonra reklam
 * - 5'ten fazla ayet: her 5 ayetten sonra reklam
 */
fun shouldInsertNativeAdAfterVerse(
    verseIndex: Int,
    totalVerses: Int
): Boolean {
    if (totalVerses <= 0) return false
    if (verseIndex < 0 || verseIndex >= totalVerses) return false

    return if (totalVerses > 5) {
        (verseIndex + 1) % 5 == 0
    } else {
        when (totalVerses) {
            1 -> verseIndex == 0
            2, 3, 4 -> verseIndex == 1
            5 -> verseIndex == 1 || verseIndex == 3
            else -> false
        }
    }
}
