# Env & Secret Contract

Bu doküman repo genelindeki env/secret sözleşmesini tek yerde toplar.

## Kanonik Kaynaklar

Kaynak önceliği ve amacı:

1. `Doppler (android-multi-app-framework/prod)`
   - üretim için kanonik secret kaynağı
2. `.env.template`
   - repo içindeki placeholder contract
3. Lokal `.env`
   - gitignored geliştirici çalışma kopyası
4. GitHub Actions repository/environment secrets
   - CI runtime injection kaynağı

`app/build.gradle.kts` içindeki `pick()` sırası:

1. Gradle property (`-P`)
2. environment variable
3. `.env`

Bu, CI'nin env değerlerinin lokal `.env` placeholder/path değerleri tarafından override edilmesini engeller.

## Ortak Composite Action'lar

| Action | Rol |
|--------|-----|
| `.github/actions/export-firebase-override-env` | Firebase Web/R2 override env export |
| `.github/actions/resolve-release-secrets` | signing ve publish için temel env çözümü |
| `.github/actions/verify-google-signin-config` | `FIREBASE_WEB_CLIENT_ID` / `google-services.json` uyum kontrolü |
| `.github/actions/decode-play-service-account` | Play service account decode + JSON validation |
| `.github/actions/verify-env-contract` | env/template drift kontrolü |

## Temel Secret Grupları

### Android signing
- `KEYSTORE_FILE`
- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

### Play publish
- `PLAY_SERVICE_ACCOUNT_JSON`
- `PLAY_SERVICE_ACCOUNT_JSON_BASE64`
- `FIREBASE_WEB_CLIENT_ID`

### Runtime backend
- `PUSH_REGISTRATION_URL`
- `PURCHASE_VERIFICATION_URL`

### Admin / ops
- `ADMIN_ALLOWED_EMAILS`
- `ADMOB_CLIENT_ID`
- `ADMOB_CLIENT_SECRET`
- `ADMOB_REFRESH_TOKEN`
- `ADMOB_PUBLISHER_ID`

### Admin web / Vite
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FUNCTIONS_BASE_URL`

## Operasyon Notları

1. Yeni secret eklenirse aynı anda şu yerler güncellenir:
   - Doppler
   - `.env.template`
   - `side-projects/admin-notifications/.env.example`
   - ilgili workflow/action
   - gerekiyorsa `docs/SECRETS_SETUP.md`
2. Lokal `.env` kanonik kaynak değildir; sadece runtime convenience kopyasıdır.
3. Secret değerleri workflow içinde normalize edilse bile log'a yazdırılmaz, gerekiyorsa yeniden maskelenir.
