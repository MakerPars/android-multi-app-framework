# Release (Local) - Standard Akis

Bu repo'da release cikarmak icin hedef:

- Yanlislikla `Debug` yerine `Release` build almamak
- Signing + Crashlytics mapping upload + (opsiyonel) Play publish adimlarini tek komutla kosmak
- Cikti yollarini (AAB/APK) net gostermek

## Gereken Ortam Degiskenleri

Signing icin (iki yoldan biri):

- `KEYSTORE_FILE` = `C:\path\to\release.jks` (dosya yolu)
  - `KEYSTORE_PASSWORD`
  - `KEY_ALIAS`
  - `KEY_PASSWORD`

veya

- `KEYSTORE_BASE64` (release.jks base64)
  - `KEYSTORE_PASSWORD`
  - `KEY_ALIAS`
  - `KEY_PASSWORD`

Play'a publish icin:

- `PLAY_SERVICE_ACCOUNT_JSON`
  - Dosya yolu (onerilen): `C:\secure\service-account.json`
  - veya JSON icerigi (script gecici dosyaya yazar)

Opsiyonel Firebase override (CI ile ayni model):

- `FIREBASE_CONFIGS_ZIP_BASE64` (zip base64) + `-OverrideFirebaseFromZipBase64`

## Komutlar

### 1) Sadece AAB (bundleRelease)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\release.ps1 -Flavor amenerrasulu -Action bundle -NoDaemon -LoadFromDotEnv
```

### 2) Patch bump + AAB

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\release.ps1 -Flavor amenerrasulu -Bump patch -Action bundle -NoDaemon -LoadFromDotEnv
```

### 3) Play'a publish (Gradle Play Publisher)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\release.ps1 -Flavor amenerrasulu -Action publish -NoDaemon -LoadFromDotEnv
```

> Not: `app/build.gradle.kts` icindeki `play { track = "internal" }` ayarini kullaniyor.

### 4) Tag olustur (opsiyonel)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\release.ps1 -Flavor amenerrasulu -Action bundle -CreateTag
```

Tag formati: `v<major>.<minor>.<patch>+<build>` (ornek: `v1.0.0+12`)

## Ciktilar

- AAB: `app/build/outputs/bundle/<flavor>Release/`
- APK: `app/build/outputs/apk/<flavor>/release/`

