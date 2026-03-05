# Timezone-Aware Bildirim Sistemi

> **Durum:** Aktif · Deploy: `europe-west1` · Proje: `makerpars-oaslananka-mobil`

Farklı ülkelerdeki kullanıcılara **yerel saatlerine göre** dini bildirimler gönderen sunucu altyapısı.

---

## Mimari

```
Mobil Uygulama                          Sunucu (Firebase)
┌────────────────┐                     ┌─────────────────────────────┐
│ PushRegistration│──HTTP POST──────▶  │ registerDevice (Cloud Fn)   │
│ Manager        │  timezone, locale,  │        │                    │
│                │  fcmToken, package  │        ▼                    │
│                │                     │  Firestore: devices/        │
│                │                     │                             │
│ FCM Topic:     │                     │ Cloud Scheduler (her saat)  │
│ "dini-bildirim"│◀───FCM──────────── │        │                    │
│                │                     │        ▼                    │
│                │                     │ dispatchNotifications       │
│                │                     │   • timezone eşleştirme     │
│                │                     │   • locale bazlı mesaj      │
│                │                     │   • FCM batch gönderim      │
│                │                     │        │                    │
│                │                     │        ▼                    │
│                │                     │ Firestore: scheduled_events/│
└────────────────┘                     └─────────────────────────────┘
```

---

## Dosya Yapısı

```
side-projects/firebase/functions/
├── package.json              # Node 22, firebase-admin 13.x, firebase-functions 7.x
├── tsconfig.json
├── .gitignore
└── src/
    ├── index.ts              # Firebase init + export'lar
    ├── registerDevice.ts     # HTTP endpoint — cihaz kaydı
    ├── dispatchNotifications.ts  # Cron — saatlik bildirim gönderim
    └── utils/
        ├── timezone.ts       # Intl API ile timezone hesaplama
        └── fcmSender.ts      # 500'lük batch FCM gönderim
```

---

## Cloud Functions

### `registerDevice` (HTTP — POST)

**URL:** `https://europe-west1-makerpars-oaslananka-mobil.cloudfunctions.net/registerDevice`

Mobil uygulamadan her uygulama açılışında (`app_start`) otomatik çağrılır. `PushRegistrationPayload` ile birebir uyumlu.

**Kabul ettiği alanlar:**
| Alan | Zorunlu | Örnek |
|------|---------|-------|
| `installationId` | ✅ | `"550e8400-e29b-41d4-a716-446655440000"` |
| `fcmToken` | ✅ | `"dKj3x..."` |
| `timezone` | — | `"Europe/Istanbul"` |
| `locale` | — | `"tr-TR"` |
| `packageName` | — | `"com.parsfilo.yasinsuresi"` |
| `notificationsEnabled` | — | `true` |
| `appVersion` | — | `"1.0.55"` |
| `deviceModel` | — | `"Samsung Galaxy S24"` |

### `dispatchNotifications` (Cron — Her Saat Başı)

**Zamanlama:** `0 * * * *` (UTC)

1. `scheduled_events` koleksiyonundan `status == "scheduled"` olanları çeker
2. Her event'in `localDeliveryTime`'ına uyan timezone'ları bulur
3. Daha önce gönderilmiş timezone'ları atlar (`sentTimezones`)
4. Tarih/gün kontrolü yapar (tek seferlik veya tekrarlayan)
5. Hedef timezone'daki cihazları Firestore'dan çeker
6. Cihazın `locale`'ine göre doğru dildeki mesajı seçer
7. FCM batch gönderir (500'lük gruplar)
8. Geçersiz token'ları otomatik temizler

---

## Event Ekleme Rehberi

### Firebase Console'dan Event Ekleme

**Firebase Console** → **Firestore Database** → **scheduled_events** → **Doküman Ekle**

### Tek Seferlik Event (Kandil, Kadir Gecesi vb.)

| Alan | Tip | Değer |
|------|-----|-------|
| `type` | string | `kandil` |
| `name` | string | `Miraç Kandili` |
| `date` | string | `2026-02-27` |
| `localDeliveryTime` | string | `21:00` |
| `topic` | string | `dini-bildirim` |
| `packages` | array | `["*"]` |
| `title` | map | `tr: "Miraç Kandili Mübarek Olsun 🌙"`, `en: "Blessed Night of Miraj 🌙"` |
| `body` | map | `tr: "Bu mübarek gecede dualarınızı..."`, `en: "Remember your prayers..."` |
| `status` | string | `scheduled` |
| `sentTimezones` | array | `[]` (boş) |

### Tekrarlayan Event (Cuma, Günlük)

| Alan | Tip | Değer |
|------|-----|-------|
| `type` | string | `cuma` |
| `name` | string | `Cuma Hatırlatma` |
| `date` | — | _(boş bırakın)_ |
| `recurrence` | string | `weekly:friday` |
| `localDeliveryTime` | string | `09:00` |
| `topic` | string | `dini-bildirim` |
| `packages` | array | `["*"]` |
| `title` | map | `tr: "Hayırlı Cumalar 🤲"` |
| `body` | map | `tr: "Fetih Suresi'ni okumayı unutmayın"` |
| `status` | string | `scheduled` |
| `sentTimezones` | array | `[]` |
| `lastResetAt` | timestamp | _(opsiyonel, sistem otomatik yönetir)_ |

> ✅ **Güncel davranış:** Tekrarlayan event'lerde `sentTimezones` artık otomatik sıfırlanır.
> - `daily` için her 24 saatte,
> - `weekly:*` için her 7 günde bir
> scheduler tarafından reset yapılır ve `lastResetAt` güncellenir.
> Manuel reset gerekmez.
>
> ℹ️ `topic` alanı şu an **metadata-only** tutulur. Scheduler gönderimi timezone + device hedefleme ile yapar.

### `recurrence` Değerleri

| Değer | Anlamı |
|-------|--------|
| `daily` | Her gün |
| `weekly:friday` | Her Cuma |
| `weekly:monday` | Her Pazartesi |
| _(boş)_ | Tek seferlik (`date` alanıyla birlikte) |

### `packages` Filtresi

| Değer | Anlamı |
|-------|--------|
| `["*"]` | Tüm uygulamalara gönder |
| `["com.parsfilo.yasinsuresi"]` | Sadece Yasin Suresi uygulamasına |
| `["com.parsfilo.ayetelkursi", "com.parsfilo.fetihsuresi"]` | Birden fazla uygulamaya |

---

## Mobil Taraf Entegrasyonu

### Yapılandırma

`.env` dosyasında:
```
PUSH_REGISTRATION_URL=https://europe-west1-makerpars-oaslananka-mobil.cloudfunctions.net/registerDevice
```

### Admin Panel (side-projects/admin-notifications) — Local Env

`side-projects/admin-notifications` Vite uygulaması Firebase Web config ister. Baslangic icin:

```powershell
Copy-Item .\side-projects\admin-notifications\.env.example .\side-projects\admin-notifications\.env
```

Gerekli alanlar:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Opsiyonel:

- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`

Notlar:

- `side-projects/admin-notifications/vite.config.ts` repo root `.env` dosyasini da okur (`envDir = ".."`).
- Geriye donuk uyumluluk icin sadece `FIREBASE_WEB_API_KEY` fallback olarak desteklenir; diger Firebase Web alanlari `VITE_` prefix ile verilmelidir.
- Admin yetki karari backend `adminAccessCheck` ile verilir; frontend local allowlist karar vermez.
- `ADMIN_ALLOWED_EMAILS` server-side fallback allowlist'tir; ilk giriste `/admins/<uid>` kaydi upsert edilir.

### Weekly AdMob Health Report (Cloud Functions Env)

`adPerformanceReport` ve `generateAdPerformanceWeeklyReport` fonksiyonlari icin gerekli env:

- `ADMOB_CLIENT_ID`
- `ADMOB_CLIENT_SECRET`
- `ADMOB_REFRESH_TOKEN`
- `ADMOB_PUBLISHER_ID` (`pub-...` veya `accounts/pub-...`)
- `ADMIN_ALLOWED_EMAILS` (admin endpoint fallback policy)

Opsiyonel threshold env:

- `AD_HEALTH_MIN_REQUESTS` (default: `500`)
- `AD_HEALTH_FILL_RATE_THRESHOLD` (default: `55`)
- `AD_HEALTH_SHOW_RATE_THRESHOLD` (default: `20`)

Doppler'dan functions `.env` dosyasi uretmek icin:

```powershell
npm run sync-env:doppler --prefix side-projects/firebase/functions
```

Functions env kontratini dogrulamak icin:

```powershell
npm run verify-env --prefix side-projects/firebase/functions
```

Ad health payload (admin panel) now includes:

- `today.totals.ecpmTry`
- `weekly.totals.ecpmTry`
- alert-level `ecpmTry`
- additional alert reasons:
  - `requests_without_impressions`
  - `ecpm_drop_spike`

Panelde bu alanlar backward-compatible sekilde conditionally render edilir; eski rapor dokumanlari bozulmaz.

### Otomatik Çalışan Bileşenler

| Bileşen | Nerede | Ne Yapar |
|---------|--------|----------|
| `PushRegistrationManager` | `core:firebase` | Her açılışta timezone + token gönderir |
| `subscribeToTopic("dini-bildirim")` | `MainActivity.kt` | FCM topic aboneliği |
| `AppFirebaseMessagingService` | `feature:notifications` | Bildirimi gösterir + Room'a kaydeder |

---

## Yönetim Komutları

```powershell
# Functions deploy
Set-Location android-multi-app-framework
npm run deploy:with-doppler --prefix side-projects/firebase/functions

# Firestore rules deploy
firebase deploy --only firestore:rules --project makerpars-oaslananka-mobil --config side-projects/firebase/firebase.json

# Firestore composite indexes deploy (repo-declared)
firebase deploy --only firestore:indexes --project makerpars-oaslananka-mobil --config side-projects/firebase/firebase.json

# Function loglarını izle
firebase functions:log --only registerDevice --project makerpars-oaslananka-mobil
firebase functions:log --only dispatchNotifications --project makerpars-oaslananka-mobil
firebase functions:log --only adPerformanceReport --project makerpars-oaslananka-mobil

# Functions'ı yeniden build et
npm run build --prefix side-projects/firebase/functions
```

---

## Maliyet

| Bileşen | Aylık |
|---------|-------|
| Cloud Functions (saatte 1 çalışma) | **Ücretsiz** (2M limit) |
| Firestore okuma/yazma | **Ücretsiz** (50K/gün limit) |
| FCM | **Her zaman ücretsiz** |
| Cloud Scheduler (1 job) | **Ücretsiz** (3 job limit) |

---

## Güvenlik

- `devices/` ve `scheduled_events/` koleksiyonlarına client erişimi **kapalı** (`allow: false`)
- Cloud Functions Admin SDK kuralları bypass eder
- Event ekleme sadece **Firebase Console** veya **Admin SDK** ile yapılabilir
- `registerDevice` endpoint'i payload doğrulama + sanitizasyon uygular
- Opsiyonel App Check zorlamasi: `REGISTER_DEVICE_REQUIRE_APP_CHECK=true` (header: `x-firebase-appcheck`)
- `PUSH_REGISTRATION_URL` endpoint'i icin ilave WAF/rate-limit (Cloud Armor / API Gateway) dusunulmelidir
