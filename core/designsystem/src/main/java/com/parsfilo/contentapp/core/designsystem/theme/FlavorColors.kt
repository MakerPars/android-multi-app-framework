package com.parsfilo.contentapp.core.designsystem.theme

import androidx.compose.ui.graphics.Color

/**
 * Her flavor için premium renk kimliği.
 *
 * primary        → Ana buton, FAB, aktif nav, başlık rengi
 * primaryDark    → primary'nin koyu tonu (header gradient başlangıcı)
 * primaryDeep    → En derin ton (gradient bitiş / overlay)
 * secondary      → Vurgu, fiyat rozeti, highlight
 * background     → Ekran arka planı (artık saf beyaz değil — hafif tinted)
 * surface        → Kart yüzeyi (hafif tinted)
 * onPrimary      → primary üzerindeki metin/ikon
 * onSurface      → surface üzerindeki metin
 * onBackground   → background üzerindeki metin
 * surfaceVariant → İkincil kart, chip, input arka planı
 * outline        → Border, divider
 * gold           → Altın vurgu (Arapça başlık süsleme, rozet)
 */
data class FlavorColorTokens(
    val primary: Color,
    val primaryDark: Color,
    val primaryDeep: Color,
    val secondary: Color,
    val background: Color,
    val surface: Color,
    val onPrimary: Color = Color(0xFFFFFBF0),
    val onSurface: Color = Color(0xFF12121A),
    val onBackground: Color = Color(0xFF12121A),
    val surfaceVariant: Color,
    val outline: Color,
    val gold: Color = Color(0xFFBF9640),
)

object FlavorColors {
    fun forFlavor(flavorName: String): FlavorColorTokens = when (flavorName) {

        // ── Ramazan / Vakitler ───────────────────────────────────────────────

        "imsakiye" -> FlavorColorTokens(
            // Gece yarısı laciverd + antik altın — Ramazan gecesi gökyüzü
            primary        = Color(0xFF0F1F5C),
            primaryDark    = Color(0xFF091440),
            primaryDeep    = Color(0xFF050B28),
            secondary      = Color(0xFFBF9B3A),
            background     = Color(0xFFECEFF8),
            surface        = Color(0xFFF4F6FC),
            surfaceVariant = Color(0xFFDDE3F4),
            outline        = Color(0xFFACBBDE),
            gold           = Color(0xFFBF9B3A),
        )

        "namazvakitleri" -> FlavorColorTokens(
            // Derin orman + altın yeşil — namaz huzuru
            primary        = Color(0xFF0E4A30),
            primaryDark    = Color(0xFF08321E),
            primaryDeep    = Color(0xFF041A10),
            secondary      = Color(0xFF2E8B57),
            background     = Color(0xFFEBF4EF),
            surface        = Color(0xFFF2F8F4),
            surfaceVariant = Color(0xFFD5E9DC),
            outline        = Color(0xFFA3CCAF),
            gold           = Color(0xFFB8862A),
        )

        // ── Sesli Sureler ────────────────────────────────────────────────────

        "yasinsuresi" -> FlavorColorTokens(
            // Koyu zeytin-haki + eski altın — köklü kudsiyyet
            primary        = Color(0xFF233D0E),
            primaryDark    = Color(0xFF162608),
            primaryDeep    = Color(0xFF0B1404),
            secondary      = Color(0xFF9E7A0A),
            background     = Color(0xFFEEF2E8),
            surface        = Color(0xFFF3F6EE),
            surfaceVariant = Color(0xFFDDE7CF),
            outline        = Color(0xFFB4CA98),
            gold           = Color(0xFF9E7A0A),
        )

        "fetihsuresi" -> FlavorColorTokens(
            // Prusya mavisi + gümüş-çelik — zafer ve onur
            primary        = Color(0xFF0E2875),
            primaryDark    = Color(0xFF081955),
            primaryDeep    = Color(0xFF040D35),
            secondary      = Color(0xFF4A78C8),
            background     = Color(0xFFECF0FA),
            surface        = Color(0xFFF2F5FC),
            surfaceVariant = Color(0xFFD8E1F5),
            outline        = Color(0xFFA4BAE5),
            gold           = Color(0xFF8FA8D4),
        )

        "amenerrasulu" -> FlavorColorTokens(
            // Koyu bordo-şarap + champagne — derin iman
            primary        = Color(0xFF4A1220),
            primaryDark    = Color(0xFF320B16),
            primaryDeep    = Color(0xFF1E060D),
            secondary      = Color(0xFFB8904A),
            background     = Color(0xFFF2ECEE),
            surface        = Color(0xFFF7F3F4),
            onSurface      = Color(0xFF200D12),
            onBackground   = Color(0xFF200D12),
            surfaceVariant = Color(0xFFE8DADD),
            outline        = Color(0xFFCCB0B5),
            gold           = Color(0xFFB8904A),
        )

        "ayetelkursi" -> FlavorColorTokens(
            // Gece yarısı moru + teal ışığı — Kürsî yüceliği
            primary        = Color(0xFF1E1055),
            primaryDark    = Color(0xFF120A38),
            primaryDeep    = Color(0xFF08051E),
            secondary      = Color(0xFF0097A7),
            background     = Color(0xFFEEECF7),
            surface        = Color(0xFFF4F2FB),
            surfaceVariant = Color(0xFFDDD8F2),
            outline        = Color(0xFFB5ADE3),
            gold           = Color(0xFF9B82CC),
        )

        "esmaulhusna" -> FlavorColorTokens(
            // Koyu erguvani mor + antik altın — 99 ismin ihtişamı
            primary        = Color(0xFF3E0F5A),
            primaryDark    = Color(0xFF28083C),
            primaryDeep    = Color(0xFF150422),
            secondary      = Color(0xFFB8922A),
            background     = Color(0xFFF0ECF8),
            surface        = Color(0xFFF6F3FC),
            surfaceVariant = Color(0xFFE6D9F5),
            outline        = Color(0xFFCCB0E8),
            gold           = Color(0xFFB8922A),
        )

        "kenzularsduasi" -> FlavorColorTokens(
            // Derin petrol mavisi + yakut kırmızısı — Arş'ın hazinesi
            primary        = Color(0xFF082A46),
            primaryDark    = Color(0xFF041A2E),
            primaryDeep    = Color(0xFF020D18),
            secondary      = Color(0xFFC0522A),
            background     = Color(0xFFEAEFF5),
            surface        = Color(0xFFF0F5FA),
            surfaceVariant = Color(0xFFD2E2EF),
            outline        = Color(0xFF9BBCDA),
            gold           = Color(0xFFC0A050),
        )

        "insirahsuresi" -> FlavorColorTokens(
            // Derin teal + slate lavanta — genişlik, ferahlık
            primary        = Color(0xFF0E4D5C),
            primaryDark    = Color(0xFF08323D),
            primaryDeep    = Color(0xFF041A22),
            secondary      = Color(0xFF7E57A8),
            background     = Color(0xFFEAF4F6),
            surface        = Color(0xFFF0F8FA),
            surfaceVariant = Color(0xFFD2E8EE),
            outline        = Color(0xFF9ACCDA),
            gold           = Color(0xFF8E9E80),
        )

        "ismiazamduasi" -> FlavorColorTokens(
            // Derin indigo + antika altın — yüce isim
            primary        = Color(0xFF2A0850),
            primaryDark    = Color(0xFF1A0534),
            primaryDeep    = Color(0xFF0E021E),
            secondary      = Color(0xFFA87E1A),
            background     = Color(0xFFEEEAF8),
            surface        = Color(0xFFF5F2FC),
            surfaceVariant = Color(0xFFE0D5F5),
            outline        = Color(0xFFBFAAE5),
            gold           = Color(0xFFA87E1A),
        )

        "vakiasuresi" -> FlavorColorTokens(
            // Yanık toprak + kor kırmızısı — kıyamet ağırlığı
            primary        = Color(0xFF5C2410),
            primaryDark    = Color(0xFF3D1608),
            primaryDeep    = Color(0xFF220B04),
            secondary      = Color(0xFFB86830),
            background     = Color(0xFFF3EDE8),
            surface        = Color(0xFFF8F4F0),
            surfaceVariant = Color(0xFFEDD9CC),
            outline        = Color(0xFFD4B09A),
            gold           = Color(0xFFB86830),
        )

        "namazsurelerivedualarsesli" -> FlavorColorTokens(
            // Çelik gece mavisi + gümüş — toplu namaz bütünlüğü
            primary        = Color(0xFF1A3260),
            primaryDark    = Color(0xFF0E1E42),
            primaryDeep    = Color(0xFF070F26),
            secondary      = Color(0xFF5A84B8),
            background     = Color(0xFFECF0F8),
            surface        = Color(0xFFF2F5FB),
            surfaceVariant = Color(0xFFD8E2F2),
            outline        = Color(0xFFA4BCD8),
            gold           = Color(0xFF8AAACE),
        )

        // ── Araçlar ──────────────────────────────────────────────────────────

        "kuran_kerim" -> FlavorColorTokens(
            // Mushaf koyu yeşili + pergamen krem — Kuran'ın klasik ruhu
            primary        = Color(0xFF0F3D20),
            primaryDark    = Color(0xFF082714),
            primaryDeep    = Color(0xFF04140A),
            secondary      = Color(0xFF7A5A10),
            background     = Color(0xFFEAF2EC),
            surface        = Color(0xFFF2F8F3),
            surfaceVariant = Color(0xFFCEE4D4),
            outline        = Color(0xFF96C4A2),
            gold           = Color(0xFF7A5A10),
        )

        "kible" -> FlavorColorTokens(
            // Koyu amber-toprak + bakır — pusulada yön ve kök
            primary        = Color(0xFF6B2E0A),
            primaryDark    = Color(0xFF491E06),
            primaryDeep    = Color(0xFF280F02),
            secondary      = Color(0xFFBF8A22),
            background     = Color(0xFFF2EDE6),
            surface        = Color(0xFFF8F4EE),
            surfaceVariant = Color(0xFFEDD9C2),
            outline        = Color(0xFFD4B890),
            gold           = Color(0xFFBF8A22),
        )

        "mucizedualar" -> FlavorColorTokens(
            // Gül kırmızısı + altın gece — mucizevi atmosfer
            primary        = Color(0xFF6B0F34),
            primaryDark    = Color(0xFF480A22),
            primaryDeep    = Color(0xFF280512),
            secondary      = Color(0xFFBF922A),
            background     = Color(0xFFF2EAEE),
            surface        = Color(0xFFF8F2F5),
            surfaceVariant = Color(0xFFEED5E0),
            outline        = Color(0xFFD4A8B8),
            gold           = Color(0xFFBF922A),
        )

        "zikirmatik" -> FlavorColorTokens(
            // Koyu mavi-siyah + elektrik teal — modern meditasyon aracı
            primary        = Color(0xFF0F1E2E),
            primaryDark    = Color(0xFF08121E),
            primaryDeep    = Color(0xFF030810),
            secondary      = Color(0xFF0E8C78),
            background     = Color(0xFFE8EEF2),
            surface        = Color(0xFFF0F5F8),
            surfaceVariant = Color(0xFFCCDDE6),
            outline        = Color(0xFF8AAEC2),
            gold           = Color(0xFF0E8C78),
        )

        "bereketduasi" -> FlavorColorTokens(
            // Koyu zeytin + kehribar toprak — bereket ve bolluk
            primary        = Color(0xFF1E4E28),
            primaryDark    = Color(0xFF12341A),
            primaryDeep    = Color(0xFF081C0D),
            secondary      = Color(0xFF9A6E1A),
            background     = Color(0xFFEBF2EB),
            surface        = Color(0xFFF2F7F2),
            surfaceVariant = Color(0xFFD4E5D2),
            outline        = Color(0xFF9EC2A0),
            gold           = Color(0xFF9A6E1A),
        )

        "nazarayeti" -> FlavorColorTokens(
            // Nazar laciverd + kehribar turkuaz — göz değmez bariyer
            primary        = Color(0xFF102060),
            primaryDark    = Color(0xFF091442),
            primaryDeep    = Color(0xFF040A26),
            secondary      = Color(0xFF1E7A94),
            background     = Color(0xFFEAEEF8),
            surface        = Color(0xFFF0F4FC),
            surfaceVariant = Color(0xFFD5DDEF),
            outline        = Color(0xFF9AB2D8),
            gold           = Color(0xFF6AADCC),
        )

        else -> FlavorColorTokens(
            primary        = Color(0xFF1A2880),
            primaryDark    = Color(0xFF0F185A),
            primaryDeep    = Color(0xFF080C30),
            secondary      = Color(0xFF5040A8),
            background     = Color(0xFFECEEF8),
            surface        = Color(0xFFF2F4FC),
            surfaceVariant = Color(0xFFD8DCEE),
            outline        = Color(0xFFA8B0D0),
        )
    }
}
