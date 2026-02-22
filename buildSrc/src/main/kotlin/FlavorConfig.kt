
data class FlavorConfig(
    val name: String,
    val displayName: String,
    val packageName: String,
    val audioFileName: String? = null, // Audio asset pack için mp3 dosya adı
    val isPrayerTimesFlavor: Boolean = false,
)

object AppFlavors {
    val all = listOf(
        FlavorConfig("amenerrasulu", "Amenerrasulu Sesli", "com.parsfilo.amenerrasulu", "amenerrasulu.mp3"),
        FlavorConfig("ayetelkursi", "Ayetel Kursi Sesli", "com.parsfilo.ayetelkursi", "ayetelkursi.mp3"),
        FlavorConfig("bereketduasi", "Bereket Duası", "com.parsfilo.bereketduasi", "bereketduasi.mp3"),
        FlavorConfig("esmaulhusna", "Esmaül Hüsna", "com.parsfilo.esmaulhusna"),
        FlavorConfig("fetihsuresi", "Fetih Suresi Sesli", "com.parsfilo.fetihsuresi", "fetihsuresi.mp3"),
        FlavorConfig("imsakiye", "İmsakiye", "com.parsfilo.imsakiye", isPrayerTimesFlavor = true),
        FlavorConfig("insirahsuresi", "İnşirah Sesli", "com.parsfilo.insirahsuresi", "insirahsuresi.mp3"),
        FlavorConfig("ismiazamduasi", "İsmi Azam Sesli", "com.parsfilo.ismiazamduasi", "ismiazamduasi.mp3"),
        FlavorConfig("kenzularsduasi", "Kenzül Arş Sesli", "com.parsfilo.kenzularsduasi", "kenzularsduasi.mp3"),
        FlavorConfig("kuran_kerim", "Kuran-ı Kerim", "com.parsfilo.kuran_kerim", audioFileName = null),
        FlavorConfig("kible", "Kıble", "com.parsfilo.kible"),
        FlavorConfig("mucizedualar", "Mucize Dualar", "com.parsfilo.mucizedualar"),
        FlavorConfig("namazvakitleri", "Namaz Vakitleri", "com.parsfilo.namazvakitleri", isPrayerTimesFlavor = true),
        FlavorConfig("namazsurelerivedualarsesli", "Namaz Sureleri Sesli", "com.parsfilo.namazsurelerivedualarsesli", "fatiha.mp3"),
        FlavorConfig("vakiasuresi", "Vakıa Sesli", "com.parsfilo.vakiasuresi", "vakiasuresi.mp3"),
        FlavorConfig("nazarayeti", "Nazar Ayeti", "com.parsfilo.nazarayeti", "nazarayeti.mp3"),
        FlavorConfig("yasinsuresi", "Yasin Sesli", "com.parsfilo.yasinsuresi", "yasinsuresi.mp3"),
        FlavorConfig("zikirmatik", "Zikirmatik", "com.parsfilo.zikirmatik")
    )
}

