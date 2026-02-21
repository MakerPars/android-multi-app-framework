# 🔐 Secrets & Environment Setup

Bu dokümanda projenin imzalama, Play Store yayınlama ve CI/CD için gereken tüm secret/env yapısı açıklanmaktadır.

---

## Genel Bakış

`app/build.gradle.kts` içindeki `pick()` fonksiyonu 3 kaynağı sırayla kontrol eder:

```
1. Gradle Property (-P ile)  →  2. .env dosyası  →  3. System.getenv()
```

---

## Gerekli Secret'lar

| Secret | Açıklama | Kullanıldığı Yer |
|--------|----------|-----------------|
| `KEYSTORE_BASE64` | JKS dosyasının Base64 kodlanmış hali | CI/CD (GitHub/Azure) |
| `KEYSTORE_FILE` | JKS dosyasının dosya yolu | Lokal geliştirme (.env) |
| `KEYSTORE_PASSWORD` | Keystore şifresi | Her yerde |
| `KEY_ALIAS` | İmza anahtarının alias adı | Her yerde |
| `KEY_PASSWORD` | Anahtar şifresi | Her yerde |
| `PLAY_SERVICE_ACCOUNT_JSON` | Play Console API service account JSON içeriği | CI/CD (publish) |

---

## GitHub Actions — Repository Secrets

> Not: Bu repo'da CI/CD icin Azure DevOps kullanilir. GitHub Actions workflow'lari devre disidir ve
> `docs/legacy/github-actions/` altina arsivlenmistir. Bu bolum referans amaclidir.

```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
```

Eklenecek 5 secret:

1. **`KEYSTORE_BASE64`** — JKS dosyasını Base64'e çevirerek
2. **`KEYSTORE_PASSWORD`** — Keystore şifresi
3. **`KEY_ALIAS`** — Genellikle `upload` veya `key0`
4. **`KEY_PASSWORD`** — Anahtar şifresi
5. **`PLAY_SERVICE_ACCOUNT_JSON`** — Service account JSON dosyasının tüm içeriği

### GitHub Environment (Zorunlu)

`release.yml` → `publish-production` job'u `environment: production` kullanır.

```
GitHub Repo → Settings → Environments → New → "production"
→ Required reviewers: kendinizi ekleyin
→ Save
```

Bu sayede Play Store'a yayınlamadan önce GitHub'da manuel onay gerekir.

---

## Azure DevOps — Pipeline Secrets

Azure DevOps'ta secret'ları aşağıdaki iki yöntemden biriyle tanımlayın:

1. Pipeline > Edit > Variables (secret işaretli)
2. Pipelines > Library > Variable Group (secret işaretli)

Önerilen değişkenler:

- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`
- `PLAY_SERVICE_ACCOUNT_JSON`
- `FIREBASE_CONFIGS_ZIP_BASE64` (opsiyonel override)

Azure YAML dosyaları:

- `pipelines/azure-pipelines.yml`
- `pipelines/azure-pipelines-manual.yml`
- `pipelines/azure-pipelines-release.yml`

---

## Lokal Geliştirme — `.env` Dosyası

Proje kökünde `.env` dosyası oluşturun (`.gitignore`'da zaten tanımlı, repo'ya girmez):

```properties
KEYSTORE_FILE=C:/Users/KULLANICI/path/to/release.jks
KEYSTORE_PASSWORD=senin_keystore_sifren
KEY_ALIAS=upload
KEY_PASSWORD=senin_key_sifren
```

> **Not:** Lokalde `KEYSTORE_BASE64` gerekmez — direkt dosya yolu kullanılır.

---

## Keystore (JKS) Oluşturma

Eğer henüz yoksa:

```bash
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass SIFRE \
  -keypass SIFRE \
  -alias upload \
  -keystore release.jks \
  -dname "CN=Parsfilo, O=Parsfilo, L=Istanbul, C=TR"
```

### Base64'e Çevirme

**PowerShell:**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks"))
```

**Git Bash / Linux:**
```bash
base64 -w 0 release.jks
```

Çıktıyı `KEYSTORE_BASE64` secret'ına yapıştırın.

---

## Play Console Service Account Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com) → **IAM & Admin → Service Accounts**
2. **Create Service Account** → İsim: `play-publisher`
3. **Keys** → Add Key → JSON → İndirin
4. [Google Play Console](https://play.google.com/console) → **Settings → API access**
5. Oluşturduğunuz Service Account'u **bağlayın**
6. **Permissions**: En az `Release manager` rolü verin
7. JSON dosyasının **tüm içeriğini** `PLAY_SERVICE_ACCOUNT_JSON` secret'ına kopyalayın

---

## Mimari Şema

```
┌─────────────────── GitHub Actions ───────────────────┐
│                                                       │
│  KEYSTORE_BASE64 ──base64 decode──► release.jks       │
│  KEYSTORE_PASSWORD ──► env var ──► Gradle pick()      │
│  KEY_ALIAS         ──► env var ──► Gradle pick()      │
│  KEY_PASSWORD      ──► env var ──► Gradle pick()      │
│  PLAY_SERVICE_ACCOUNT_JSON ──► service-account.json   │
│                                                       │
│  build.gradle.kts:                                    │
│    pick("KEYSTORE_FILE") → "../release.jks"           │
│    pick("KEYSTORE_PASSWORD") → System.getenv()        │
└───────────────────────────────────────────────────────┘

┌─────────────────── Lokal Geliştirme ─────────────────┐
│                                                       │
│  .env dosyası (gitignore'd):                          │
│    KEYSTORE_FILE=C:/path/to/release.jks               │
│    KEYSTORE_PASSWORD=sifre                            │
│    KEY_ALIAS=upload                                   │
│    KEY_PASSWORD=sifre                                 │
│                                                       │
│  build.gradle.kts → pick() → .env'den okur            │
└───────────────────────────────────────────────────────┘
```

---

## Güvenlik Notları

- `.env`, `*.jks`, `*.keystore`, `service-account*.json` dosyaları `.gitignore`'da tanımlıdır
- CI/CD'de keystore ve service account dosyaları iş bitince otomatik silinir (`rm -f`)
- Secret'ları asla log'a yazdırmayın (`echo` ile bile olsa)
- Keystore şifresini ve key şifresini aynı yapabilirsiniz (Google Play bunu önerir)

---

## Firebase Configuration (google-services.json)

16 farklı flavor olduğu için Firebase konfigürasyonunu hibrit modelle yönetiyoruz:

1. Varsayılan kaynak: Repo içindeki `app/src/*/google-services.json` dosyaları
2. Opsiyonel CI override: `FIREBASE_CONFIGS_ZIP_BASE64` secret'ı varsa dosyalar CI sırasında üzerine yazılır

### Varsayılan Akış (Repo Default)

- Lokal ve CI build'ler, ek secret olmadan repodaki `google-services.json` dosyalarıyla çalışır.
- Bu model onboarding sürecini basitleştirir.

### Opsiyonel Override (CI)

Gerekirse tüm flavor config'lerini zipleyip base64 olarak secret'a koyabilirsiniz:

```bash
zip -r firebase_configs.zip app/src/*/google-services.json
base64 -w 0 firebase_configs.zip > configs_base64.txt
```

GitHub Secret: `FIREBASE_CONFIGS_ZIP_BASE64`

Workflow/Pipeline adımı:
```yaml
- name: Optional Firebase Config Override
  if: ${{ secrets.FIREBASE_CONFIGS_ZIP_BASE64 != '' }}
  run: |
    echo "${{ secrets.FIREBASE_CONFIGS_ZIP_BASE64 }}" | base64 -d > firebase_configs.zip
    unzip -o firebase_configs.zip
    rm -f firebase_configs.zip
```

Azure Bash karşılığı:
```bash
if [ -n "${FIREBASE_CONFIGS_ZIP_BASE64:-}" ]; then
  echo "$FIREBASE_CONFIGS_ZIP_BASE64" | base64 -d > firebase_configs.zip
  unzip -o firebase_configs.zip
  rm -f firebase_configs.zip
fi
```

### Firebase'den Güncelleme (Lokal Yardımcı Script)

`scripts/download-firebase-configs.sh` script'i, Firebase CLI ile flavor dosyalarını yeniden çekmek için kullanılabilir.
Bu script zorunlu CI adımı değildir; repo default + opsiyonel override modeli esas alınır.

