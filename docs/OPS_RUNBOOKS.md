# Ops Runbooks

Bu doküman günlük operasyonlar için kısa ve uygulanabilir akışları toplar.

## 1. Secret Contract Drift Kontrolü

Amaç:
- `.env.template`
- `side-projects/admin-notifications/.env.example`
- Doppler contract

arasındaki drift'i yakalamak.

### Lokal

```bash
node scripts/sync-env-contract-from-doppler.mjs
git diff -- .env.template side-projects/admin-notifications/.env.example
```

### CI

Composite action:

- `.github/actions/verify-env-contract`

Workflow içinde bu action çalışıyorsa drift durumunda fail verir.

### Ne zaman koşulur

1. Yeni secret eklendiğinde
2. Doppler prod key seti değiştiğinde
3. Admin panel Vite env alanları değiştiğinde

## 2. Release / Publish Preflight

Amaç:
- signing ve publish için fail-fast doğrulama
- yanlış secret precedence yüzünden release kırılmaması

### Lokal minimum preflight

```powershell
./gradlew :app:validateFlavorVersions
./gradlew :app:validateReleaseConfig
```

### Publish ile ilgili kritik env'ler

- `KEYSTORE_FILE` veya `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`
- `PLAY_SERVICE_ACCOUNT_JSON` veya `PLAY_SERVICE_ACCOUNT_JSON_BASE64`
- `FIREBASE_WEB_CLIENT_ID`
- `PUSH_REGISTRATION_URL`
- `PURCHASE_VERIFICATION_URL`

### CI bootstrap zinciri

1. `resolve-release-secrets`
2. `decode-play-service-account`
3. `verify-google-signin-config`
4. `export-firebase-override-env`

## 3. Push Registration Repair

Amaç:
- cihaz kaydı Firestore'a düşmüyorsa hızlı teşhis ve onarım

### Kullanıcı / cihaz tarafı

Developer mode açıksa Ayarlar ekranında:

- cihaz kimliği
- son push sync zamanı
- son push hata nedeni
- `Push kaydını şimdi yeniden dene`

görünür.

### Admin panel tarafı

İzlenecek alanlar:

- `devicesWithToken`
- `devicesWithoutToken`
- `recentlySynced24h`
- `staleRegistration7d`
- `registrationHealthByPackage`

### Sahada şüphe varsa kontrol sırası

1. Cihaz kimliğini Ayarlar ekranından al
2. Admin panelde `Firestore devices` aramasını yap
3. Son hata nedeni varsa not al
4. `Push kaydını şimdi yeniden dene`
5. Gerekirse uygulamayı yeniden açıp token refresh/log akışını izle

## 4. AdMob Health Kontrolü

Amaç:
- rollout sonrası latest sürüm gelir/verim sinyalini hızlı görmek

### Lokal komut

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\monetization\admob-post-rollout-check.ps1
```

Artefaktlar:

- `TEMP_OUT/admob_today_report.json`
- `TEMP_OUT/admob_today_latest_report.json`

### Panel tarafında izlenecekler

1. overall weighted show rate
2. latest weighted show rate
3. runtime funnel by format
4. suppress reason counts
5. low-performing latest apps

## 5. Firebase Functions Deploy Blokaji

Mevcut bilinen blokaj:

- proje: `makerpars-oaslananka-mobil`
- neden: Firebase / GCP billing kapalı

Sonuç:
- `side-projects/firebase/functions` kodu build alabilir
- ama canlı deploy için Blaze/billing gerekir

Bu blokaj çözülmeden:

```bash
npm run deploy:with-doppler --prefix side-projects/firebase/functions
```

başarılı tamamlanmaz.
