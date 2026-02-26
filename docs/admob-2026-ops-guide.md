# AdMob Operasyon Rehberi (Şubat 2026)

Bu doküman, projedeki AdMob alarm sonuçlarını teknik olarak yorumlamak ve hızlı aksiyon almak için hazırlandı.

## Resmi API kapsamı (2026-02)

## Stabil `v1`
- `accounts.get`
- `accounts.apps.list`
- `accounts.adUnits.list`
- `accounts.networkReport.generate`
- `accounts.mediationReport.generate`

## `v1beta` (ileri mediation envanteri/yönetimi)
- `accounts.adSources.list`
- `accounts.adSources.adapters.list`
- mediation group / mapping / experiment endpointleri

Referans:
- https://developers.google.com/admob/api/v1/get-started
- https://developers.google.com/admob/api/reference/rest/v1/accounts.networkReport/generate
- https://developers.google.com/admob/api/reference/rest/v1/accounts.mediationReport/generate
- https://developers.google.com/admob/api/reference/rest/v1/accounts.apps/list
- https://developers.google.com/admob/api/reference/rest/v1/accounts.adUnits/list
- https://developers.google.com/admob/api/reference/rest/v1beta/accounts.adSources/list

## Alarmların olası kök nedenleri

1. `rewarded request var ama gelir yok`
- Reklam yüklense bile kullanıcı gösterimi/impression oluşmuyor olabilir.
- Show rate düşük olabilir (`impressions / matched_requests`).
- Yanlış zamanlama: ad hazır olmadan `show` çağrısı.
- Rewarded ad unit ID doğru olsa bile trafik düşük kaliteli segmentte eCPM çok düşük kalabilir.

2. eCPM düşüşleri (`>= %30`)
- Ülke karışımı değişimi (TR dışı düşük CPM trafiği artışı).
- Mediation rekabetinin zayıf olması (tek kaynak).
- Session içi gösterim sıklığı/frequency cap nedeniyle düşük değerli gösterimler.
- App version fragmentation nedeniyle farklı davranışların aynı ad unit üzerinde karışması.

3. Düşük fill rate
- Bazı ad unit’lerde talep yoğun ama match düşük (özellikle native/interstitial).
- GDPR ülkelerinde consent funnel eksikliği.
- Tek ağ bağımlılığı (yalnız AdMob Network) nedeniyle açık artırma rekabeti düşük.

4. Mediation partner eksikliği
- Çok sayıda uygulama sadece AdMob Network ile çalıştığında gelir/fill kırılgan olur.

## Bu repoda yapılan teknik iyileştirmeler

1. Rewarded delivery görünürlüğü artırıldı:
- `feature/ads/.../RewardedAdManager.kt`
- `feature/ads/.../RewardedInterstitialAdManager.kt`
- `onPaidEvent` ve `onAdImpression` logları eklendi.
- `responseInfo.responseId` ve adapter bilgisi loglanıyor.

2. Rewarded istek israfı azaltıldı:
- `app/.../monetization/AdOrchestrator.kt`
- Uygulama açılışındaki zorunlu rewarded preload kaldırıldı.

3. Rewarded gösterim akışı düzeltildi:
- `app/.../ui/RewardsViewModel.kt`
- `app/.../ui/RewardsScreen.kt`
- Reklam hazır değilse yükle + bekle + göster akışı kullanılıyor.

4. `SECRET/ADMOB_KOTNROL` araçları güncellendi:
- `admob_checker.py`
  - fill + show rate birlikte alarm
  - rewarded anomaly sınıflandırması
  - parametreli eşikler
  - `inventory` check (v1 + v1beta görünümü)
  - token cache varsayılanı repo dışı
  - `admob_debug.py`
  - OAuth tabanlı hızlı API erişim testi

5. Resmi privacy standardına göre global ad request konfigürasyonu eklendi:
- `feature/ads/src/main/java/com/parsfilo/contentapp/feature/ads/AdManager.kt`
- UMP tarafındaki `setTagForUnderAgeOfConsent(false)` bilgisi, ad isteklerine de
  `MobileAds.setRequestConfiguration(...)` ile yansıtılıyor.
- Bu, Google dokümantasyonundaki TFUA notuyla uyumlu:
  UMP etiketi tek başına ad isteği tarafına otomatik taşınmaz.

6. Consent sonucu gelmeden banner ad request gönderimi kapatıldı:
- `feature/ads/src/main/java/com/parsfilo/contentapp/feature/ads/AdsConsentRuntimeState.kt`
- `feature/ads/src/main/java/com/parsfilo/contentapp/feature/ads/ui/BannerAd.kt`
- `feature/ads/src/main/java/com/parsfilo/contentapp/feature/ads/AdManager.kt`
- Varsayılan durum `canRequestAds=false`; UMP olumlu sonuç vermeden banner yüklenmez.

7. Privacy options sonrası rıza değişikliği aynı oturumda uygulanıyor:
- `feature/settings/.../SettingsScreen.kt` form kapanış callback'i
- `app/.../MainActivity.kt` -> `AdOrchestrator.refreshConsent(...)`
- `app/.../monetization/AdOrchestrator.kt` consent false ise preload adlar temizlenir
- Böylece kullanıcı rızayı geri çektiğinde app restart beklenmeden ad istekleri durur.

## Resmi örneklerle eşleme (GoogleAds Android Examples)

Bu repo AdMob ad unit (`ca-app-pub-...`) kullandığı için yükleme tarafında
`AdRequest.Builder()` ile devam eder; Ad Manager örneklerindeki
`AdManagerAdRequest` yalnız GAM envanteri içindir.

- APIDemo:
  `kotlin/advanced/APIDemo/.../MainActivity.kt`
  ve `.../snippets/RequestConfigurationSnippets.kt`
  → `MobileAds.getRequestConfiguration().toBuilder()` + `setRequestConfiguration`.
- AdManager örnekleri (AppOpen/Banner/Interstitial/Rewarded/Native):
  UMP gather + privacy options + request configuration + sonra SDK init pattern’i.
- Bizdeki karşılığı:
  `feature/ads/src/main/java/com/parsfilo/contentapp/feature/ads/AdManager.kt`
  ve
  `feature/settings/src/main/java/com/parsfilo/contentapp/feature/settings/ui/SettingsScreen.kt`.

## AdMob panelinde yapılanlar (bu oturum)

1. `Uyumlulaştırma > Uyumlulaştırma grupları` içinde iki ödüllü grupte aktif A/B testleri kapatıldı:
- `OdulluUyumlulastirma`
- `OdulluGecisUyumlulastirma`

2. Kontrol sonucu:
- Her iki grupta da artık `A/B testi yok` görünüyor.
- Gruplar listesinde durum `Hazır`.

3. `Policy Center` kontrolü:
- `Verse of Kursi Audio and ... (com.parsfilo.ayetelkursi)` için
  `Kısıtlanmış reklam sunumu` uyarısı yalnızca eski sürümler için görünüyor.

4. `Gizlilik ve mesajlaşma` kontrolü:
- Avrupa mesajı `etkin`.
- ABD eyalet mesajı `etkin`.

## Senin manuel tamamlaman gerekenler (AdMob legal/onay)

AdMob panelinde teknik olarak otomasyona uygun olmayan, hesap sahibinin onaylaması gereken adımlar kaldı:

1. `Uyumlulaştırma > OdulluUyumlulastirma` ve `OdulluGecisUyumlulastirma` içinde
`Reklam kaynağı ekle` adımından:
- `Meta Audience Network`: iş ortaklığı sözleşmesi/onay akışını tamamla.
- `Liftoff Monetize`: `Onayla ve kabul et` adımını tamamla.

2. Bu onaylar sonrası aynı ekranlardan kaynakları gruba ekle ve `Kaydet`.

3. `Engelleme kontrolleri > AB kullanıcı izni` tarafında eklenen partnerlerin
reklam teknolojisi sağlayıcısı olarak listelendiğini doğrula.

## Operasyon komutları

```bash
python SECRET/ADMOB_KOTNROL/admob_debug.py --client-secret SECRET/ADMOB_KOTNROL/client_secret.json --publisher pub-XXXX --check-v1beta

python SECRET/ADMOB_KOTNROL/admob_checker.py --client-secret SECRET/ADMOB_KOTNROL/client_secret.json --publisher pub-XXXX

python SECRET/ADMOB_KOTNROL/admob_checker.py --client-secret SECRET/ADMOB_KOTNROL/client_secret.json --publisher pub-XXXX --check inventory
```

## GDPR / UMP kontrol referansları
- https://developers.google.com/admob/android/privacy
- https://developers.google.com/admob/android/privacy/gdpr
- https://developers.google.com/admob/android/privacy/options
- https://developers.google.com/admob/privacy/consent-groups/sync-consent-across-apps

## Uyum durumu (kod + panel)

Koddan tamamlananlar:
- UMP consent her açılışta çağrılıyor.
- Consent yoksa ad SDK initialize akışı bloke.
- Privacy options form (gerekli ülkelerde) Settings ekranından açılabiliyor.
- TFUA bilgisi `RequestConfiguration` ile ad request katmanına uygulanıyor.
- Banner ad request'leri, consent sonucu gelene kadar gönderilmiyor.

AdMob panelde manuel zorunlu olanlar:
- `Privacy & messaging` altında GDPR ve US States mesajlarını oluşturup yayınlamak.
- Her mesaj tipinde hedef ülkeler/eyaletler ve dil kapsamını doğru seçmek.
- Test cihazlarında UMP formunun görünüp kapanabildiğini doğrulamak.

## Rıza grubu (Consent Group) uyarıları — yorum ve aksiyon

AdMob `Privacy & messaging > Rıza grubu` ekranındaki iki uyarı tipi farklı kaynaktan gelir:

1. `İlgilenilmesi gerekiyor`
- Genelde ilgili uygulama için publish edilmiş UMP mesajı / uygun dağıtım yöntemi / eligibility kontrolü eksik olduğu anlamına gelir.
- Bu uyarı kod ile tek başına kapanmaz; AdMob panelde mesaj yayını ve uygulama kapsamı doğrulanmalıdır.

2. `UMP SDK ile kullanıcı kimliklerini sağlamadığınız sürece...`
- Bu uyarı uygulama tarafıyla ilgilidir.
- Cross-app consent sync için UMP request parametrelerine bir senkronizasyon kimliği verilmelidir.
- Bu repoda çözüm: `setConsentSyncId(...)` + Android `App Set ID` (Play Services App Set API).

### Tüm uygulamalar için rıza grubu rollout checklist (Şubat 2026)

1. Android uygulamaların UMP sürümünü güncel tut (`UMP SDK 4.x`).
2. UMP request akışında `setConsentSyncId(...)` çağrısını etkinleştir (bu repo: App Set ID tabanlı).
3. AdMob `Privacy & messaging` içinde:
- GDPR mesajı published
- US states mesajı published
- Hedef bölge/dil kapsamı doğrulanmış
4. Rıza grubuna eklenecek tüm uygulamalarda `İlgilenilmesi gerekiyor` uyarısını tek tek temizle.
5. Gizlilik politikasında rıza grubundaki tüm uygulamaları ve consent paylaşımı/senkronizasyonunu açıkça listele.
6. Aynı test cihazında birden fazla uygulama ile consent sync davranışını doğrula (grant/deny/change).

## Reklam tuning (Remote Config) — yeni anahtarlar

Kod tarafında agresif gelir profili için RC destekli reklam policy anahtarları eklendi:

- `ads_banner_enabled`
- `ads_native_enabled`
- `ads_interstitial_frequency_cap_ms`
- `ads_app_open_cooldown_ms`
- `ads_rewarded_interstitial_min_interval_ms`
- `ads_rewarded_interstitial_max_per_session`
- `ads_native_pool_max`
- `ads_native_ttl_ms`
- `ads_banner_placements_disabled_csv`
- `ads_native_placements_disabled_csv`

Not:
- Premium ve rewarded ad-free kullanıcılar için reklam kapatma kuralı RC ile override edilmez.
- RC tuning sadece gösterim sıklığı/placement enablement optimizasyonu içindir.
- Play Console veri güvenliği formunu bu davranışla uyumlu doldurmak.

## Android gelir/teşhis referansları
- Rewarded: https://developers.google.com/admob/android/rewarded
- Ad Inspector: https://developers.google.com/admob/android/ad-inspector
- Response info: https://developers.google.com/admob/android/response-info
- Impression-level ad revenue: https://developers.google.com/admob/android/impression-level-ad-revenue

## Güvenlik notu
- OAuth `client_secret.json` ve refresh token dosyaları gizli kalmalı.
- Şüpheli sızıntıda client secret + refresh token rotate edilmeli.
