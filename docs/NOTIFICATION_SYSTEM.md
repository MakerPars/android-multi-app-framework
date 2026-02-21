# Timezone-Aware Bildirim Sistemi

> **Durum:** Aktif · Deploy: `europe-west1` · Proje: `mobil-oaslananka-firebase`

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
functions/
├── package.json              # Node 20, firebase-admin 13.x, firebase-functions 6.x
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

**URL:** `https://europe-west1-mobil-oaslananka-firebase.cloudfunctions.net/registerDevice`

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

> ⚠️ **ÖNEMLİ:** Tekrarlayan event'ler için `sentTimezones` dizisi her çalışmada dolar.
> Bir sonraki hafta/gün tekrar çalışması için `sentTimezones`'u boşaltmanız gerekir.
> İleride bu otomatik sıfırlanacak şekilde geliştirilebilir.

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
PUSH_REGISTRATION_URL=https://europe-west1-mobil-oaslananka-firebase.cloudfunctions.net/registerDevice
```

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
firebase deploy --only functions

# Firestore rules deploy
firebase deploy --only firestore:rules

# Function loglarını izle
firebase functions:log --only registerDevice
firebase functions:log --only dispatchNotifications

# Functions'ı yeniden build et
npm run build --prefix functions
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
- `PUSH_REGISTRATION_URL` endpoint'i rate limiting için Cloud Functions'ın varsayılan limitleri geçerli
