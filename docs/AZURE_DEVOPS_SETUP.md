# Azure DevOps Geçiş Rehberi

Bu repo Azure DevOps üzerinde **Microsoft-hosted** (`ubuntu-latest`) agent ile çalışacak şekilde hazırlandı.

## Eklenen Pipeline Dosyaları

- `pipelines/azure-pipelines.yml`: PR/push için kalite kapısı (impact analizi + detekt + ktlint + dinamik lint)
- `pipelines/azure-pipelines-manual.yml`: Elle tetiklenen build/publish operasyonları
- `pipelines/azure-pipelines-release.yml`: Elle tetiklenen release build, opsiyonel production publish

## PR Quality Gate Özeti

`pipelines/azure-pipelines.yml` içinde PR doğrulamasında şu kontroller zorunludur:

1. `detekt` + `ktlintCheck`
2. `:app:validateFlavorVersions`
3. `test` (unit testler)
4. Dinamik flavour `lint` görevleri

Ktlint davranışı:

1. PR (`BUILD_REASON=PullRequest` veya `SYSTEM_PULLREQUEST_PULLREQUESTID` set) için `ignoreFailures=false`
2. PR dışı CI için mevcut davranış korunur (`ignoreFailures=true`)

Opsiyonel connected smoke test:

1. Pipeline değişkeni `RUN_CONNECTED_TESTS` varsayılan `false`
2. `true` yapıldığında `ConnectedSmokeTests` job'u `:app:connectedAmenerrasuluDebugAndroidTest` çalıştırır
3. Job, bağlı cihaz/emulator yoksa bilinçli olarak fail eder

> Not: Bu repo'da CI/CD için Azure DevOps kullanılır. GitHub Actions workflow'ları özellikle devre dışı bırakıldı ve
> referans için `docs/legacy/github-actions/` altına arşivlendi.

## 1) Hosted Agent Gereksinimleri

Microsoft-hosted Ubuntu agent üzerinde aşağıdaki araçlar zaten bulunur / pipeline tarafından kurulur:

1. JDK 21 (`java -version`)
2. Android SDK (pipeline içindeki `scripts/ci/setup-android-sdk.sh` adımı ile `platforms;android-36` vb. kurulur)
3. `unzip`, `base64`, `bash`
4. Gradle wrapper çalıştırma yetkisi (`chmod +x gradlew`)

Not: YAML adımları bash kullandığı için `ubuntu-latest` hedeflenmiştir.

## 2) Azure Secret / Variable Tanımları

Pipeline/Variable Group seviyesinde aşağıdaki secret'ları tanımlayın:

1. `KEYSTORE_BASE64`
2. `KEYSTORE_PASSWORD`
3. `KEY_ALIAS`
4. `KEY_PASSWORD`
5. `PLAY_SERVICE_ACCOUNT_JSON`
6. `FIREBASE_CONFIGS_ZIP_BASE64` (opsiyonel)

Release/publish adımlarında geçici dosyalar (`release.jks`, `service-account.json`) job sonunda silinir.

## 3) Pipeline Oluşturma

Azure DevOps > Pipelines > New Pipeline:

1. Repo: `android-multi-app-framework`
2. Existing Azure Pipelines YAML file seçin
3. Sırasıyla oluşturun:
   - `pipelines/azure-pipelines.yml`
   - `pipelines/azure-pipelines-manual.yml`
   - `pipelines/azure-pipelines-release.yml`

### Alternatif: Tek Komutla Otomatik Kurulum

PowerShell script'i ile pipeline create/update + variable ayarı:

```powershell
./scripts/setup-azure-pipelines.ps1
```

Secret'ları environment üzerinden set ederek kurulum:

```powershell
$env:KEYSTORE_BASE64="..."
$env:KEYSTORE_PASSWORD="..."
$env:KEY_ALIAS="..."
$env:KEY_PASSWORD="..."
$env:PLAY_SERVICE_ACCOUNT_JSON="..."
$env:FIREBASE_CONFIGS_ZIP_BASE64="..." # opsiyonel

./scripts/setup-azure-pipelines.ps1 -ConfigureSecrets
```

`.env` dosyasından da okumak isterseniz:

```powershell
./scripts/setup-azure-pipelines.ps1 -ConfigureSecrets -LoadFromDotEnv
```

Dry run (komutları göstermesi için):

```powershell
./scripts/setup-azure-pipelines.ps1 -DryRun
```

## 4) Branch Policy (Önerilen)

`main` için PR policy ekleyin:

1. Build validation: `pipelines/azure-pipelines.yml`
2. Succeeded zorunlu
3. Expire when new changes pushed: açık

## 5) Release Publish Onayı

`pipelines/azure-pipelines-release.yml` içindeki publish stage `environment: production` kullanır.

Azure DevOps > Pipelines > Environments > `production`:

1. Approvals and checks ekleyin
2. Manuel onay olmadan production publish başlamasın

## 6) Çalıştırma Senaryoları

### PR / Push kalite kontrolü

Bu repo şu an **otomatik tetik kapalı** (push/PR ile koşmaz). İsterseniz Azure DevOps UI veya `az pipelines run` ile manuel çalıştırılır.

### Manuel build/publish

`pipelines/azure-pipelines-manual.yml` > Run Pipeline:

- `targetFlavor`: `all` veya tek flavour adı
- `buildType`: `Debug` / `Release`
- `doQuality`: kalite kontrolleri
- `doBuild`: assemble/bundle
- `doInternalTest`: Play **Internal testing** track'e publish (AAB, Release zorunlu)
- `doPublish`: Play **Production** track'e publish (AAB, Release zorunlu)

### Release build/publish (seçilen flavor'lar)

`pipelines/azure-pipelines-release.yml` > Run Pipeline:

- `targetFlavors`: virgülle ayrılmış liste (`amenerrasulu,yasinsuresi`) veya `all`
- Publish stage için `PUBLISH_TO_PLAY=true` variable set edilmelidir ve `environment: production` onayı gerekir.

## 7) Google Sign-In Konfig Doğrulama (Otomatik)

Manual ve release pipeline'larda build başlamadan önce şu kontrol otomatik çalışır:

- `scripts/ci/verify_google_signin_config.py`

Kontrol edilenler:

1. Her seçilen flavor için `app/src/<flavor>/google-services.json` var mı
2. `google-services.json` içinde flavor `applicationId` paket adı mevcut mu
3. Web OAuth client (`client_type=3`) var mı ve formatı doğru mu
4. `local.properties` içindeki `WEB_CLIENT_ID` değeri dosyadaki web client ile eşleşiyor mu
5. `config/firebase-apps.json` içindeki `projectId/appId` ile uyumlu mu

Lokal çalıştırma:

```bash
python3 scripts/ci/verify_google_signin_config.py --flavors all
python3 scripts/ci/verify_google_signin_config.py --flavors amenerrasulu,ayetelkursi
```

## 8) Play Store Listing/Metadata/Screenshot/Release Notes (Opsiyonel)

Bu repo **Gradle Play Publisher** (`com.github.triplet.play`) kullandığı için Play Store tarafındaki birçok şeyi git'ten yönetebiliriz.

### Neler Yönetilebilir?

- AAB upload: `publish<Flavor>ReleaseBundle`
- Store listing metadata (title/short/full description vb): `publish<Flavor>ReleaseListing`
- Release notes (track + locale): `publish<Flavor>ReleaseListing`
- Screenshots/graphics (repo'da dosya varsa): `publish<Flavor>ReleaseListing`

### Play Console'daki Mevcut Veriyi Repo'ya Alma (Bootstrap)

Play Console'da önce manuel doldurulmuş listing/metadata varsa bunu bir kere indirip commit'lemek en doğru başlangıç:

```bash
./gradlew :app:bootstrapAmenerrasuluReleaseListing
```

Bu işlem `app/src/<flavor>/play/...` altına dosyaları yazar.

### Pipeline'da Kontrollü (Seçmeli) Upload

Varsayılan davranış: pipeline'lar **bundle publish** yapar, listing/screenshot/release notes upload **kapalıdır**.

- `pipelines/azure-pipelines-release.yml`: `updatePlayListing` (default `false`)
- `pipelines/azure-pipelines-manual.yml`: `updatePlayListing` (default `false`)

`updatePlayListing=true` verildiğinde, seçilen flavor(lar) için şu task'lar çalışır:

- `publish<Flavor>ReleaseListing` (listing/metadata/screenshots/release-notes)
- `publish<Flavor>ReleaseBundle` (AAB upload)

Not: `updatePlayListing=true` iken ilgili flavor için `app/src/<flavor>/play` yoksa pipeline bilinçli olarak fail eder.

### CLI ile Tetikleme Örneği (Release Pipeline)

```powershell
az pipelines run --name release --org https://dev.azure.com/<org> --project <project> --branch main --parameters targetFlavors=amenerrasulu updatePlayListing=true --variables PUBLISH_TO_PLAY=true
```

## 9) Service Account Yetkisi Doğrulama (Play API Smoke Test)

Play Console izinleri API üzerinden direkt okunmaz; bunun yerine gerçek Android Publisher API çağrılarıyla kontrol ederiz.

Script:
- `scripts/ci/verify_play_console_access.py`

Neleri test eder?
- Edit oluşturma (`edits.insert`)
- Track erişimi (`edits.tracks.list`)
- Listing erişimi (`edits.listings.list`)
- Screenshot/graphics erişimi (`edits.images.list`)

Lokal çalıştırma:

```bash
python scripts/ci/verify_play_console_access.py --flavors all
python scripts/ci/verify_play_console_access.py --flavors amenerrasulu,ayetelkursi
```
