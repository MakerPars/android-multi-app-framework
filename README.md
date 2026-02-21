# ContentApp

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Kotlin](https://img.shields.io/badge/kotlin-2.3.10-blue.svg)](https://kotlinlang.org)
[![Android](https://img.shields.io/badge/android-SDK%2036-green.svg)](https://developer.android.com)
[![Gradle](https://img.shields.io/badge/gradle-8.10-blue.svg)](https://gradle.org)

> Professional multi-flavour Android framework for managing 18 apps from a single codebase. Built with Kotlin, Jetpack Compose, and modern Android best practices.

A multi-flavour Android application for delivering rich content experiences. This project supports 18 distinct product flavours, each tailored for specific content delivery.

## Project Structure

- **app**: Main application module containing high-level configuration and flavour definitions.
- **core**: Fundamental components and utilities shared across the project.
   - **common**: Shared extensions and helper classes.
   - **model**: Data models used throughout the app.
   - **database**: Room database implementation including schemas.
   - **designsystem**: Reusable UI components and theme.

- **feature**: Feature-specific modules.
   - **content**: Main content display logic.
   - **audio**: Audio playback functionality.
   - **settings**: App settings and configuration.

- **buildSrc**: Custom build logic and dependency management.

## Setup & Configuration

### Prerequisites

- JDK 21+
- Android Studio Ladybug or newer
- CMake (for NDK support if needed)
- Kotlin 2.3.10
- Android Gradle Plugin 9.0.1

### Environment Variables

This project uses `.env` for local configuration.

1. Copy `.env.template` to `.env`.

2. Fill in the required values:

```properties
KEYSTORE_FILE=C:/path/to/keystore.jks
KEYSTORE_PASSWORD=***
KEY_ALIAS=***
KEY_PASSWORD=***

```

### Building the Project

**Build all flavours (Debug):**

```bash
./scripts/build-all-flavours.sh Debug

```

**Bump Version:**

```bash
./scripts/bump-version.sh imsakiye build
```

### Per-Flavour Versions (Recommended for Play)

Each Play Store app (each flavor / `applicationId`) must have its own monotonically increasing `versionCode`.

This repo supports per-flavour versions via `app-versions.properties`:

- `<flavor>.versionCode`
- `<flavor>.versionName`

If a flavour is missing, build fallback is `versionCode=1` and `versionName=1.0.0`.

## CI/CD (Azure DevOps)

Azure DevOps pipeline dosyaları:

- `pipelines/azure-pipelines.yml`
- `pipelines/azure-pipelines-manual.yml`
- `pipelines/azure-pipelines-release.yml`

Kurulum adımları için: `docs/AZURE_DEVOPS_SETUP.md`

## Play Store Management (Listing/Metadata/Screenshots/Release Notes)

This repo uses **Gradle Play Publisher** (`com.github.triplet.play`) so we can manage Play Store state from git (similar to Fastlane `supply`), without adding Fastlane/Ruby.

### What We Can Manage From Git

- App bundles upload (AAB) per flavour: `publish<Flavor>ReleaseBundle`
- Store listing metadata (title/descriptions, etc): `publish<Flavor>ReleaseListing`
- Screenshots/graphics: `publish<Flavor>ReleaseListing` (if you commit assets under `app/src/<flavor>/play/...`)
- Release notes (per track + locale): `publish<Flavor>ReleaseListing`

### Bootstrap Existing Play Store Data Into The Repo

If Play Console was filled manually before, download it once and commit the result:

```bash
./gradlew :app:bootstrapAmenerrasuluReleaseListing
```

This writes files under:
`app/src/<flavor>/play/...`

### Controlled CI Upload (Manual / Optional)

By default, pipelines publish **bundles only**. Listing/graphics/release notes are **opt-in**:

- `pipelines/azure-pipelines-release.yml`: parameter `updatePlayListing` (default `false`)
- `pipelines/azure-pipelines-manual.yml`: parameter `updatePlayListing` (default `false`)

When enabled for a flavour, the pipeline runs:

- `publish<Flavor>ReleaseListing` (uploads store listing assets from repo)
- `publish<Flavor>ReleaseBundle` (uploads AAB)

### Service Account Permissions (Play Console)

To upload bundles + listing assets, the Play service account must have both:

- Release permissions (tracks / publishing)
- Store presence permissions (store listing, graphics, release notes)

Optional verification (API smoke test):

```bash
# PLAY_SERVICE_ACCOUNT_JSON can be a file path or inline JSON content.
python scripts/ci/verify_play_console_access.py --flavors amenerrasulu,ayetelkursi
```

## Architecture

The app follows modern Android development practices:

- **MVVM**: Model-View-ViewModel pattern.
- **Jetpack Compose**: For UI building.
- **Hilt**: Dependency Injection.
- **Coroutines & Flow**: Asynchronous programming.
- **Room**: Local database.

## Flavours

See `buildSrc/src/main/kotlin/FlavorConfig.kt` for the full list of supported flavours.

## Content Translations (Meal/Translation Mode)

The content modules support showing **Arabic**, **Latin transliteration**, and a third mode for **Meal/Translation**.

### JSON Fields (per flavour)

Most flavours store their verse content in:

- `app/src/<flavor>/assets/data.json`

Supported fields (optional translations):

- `ayetAR`: Arabic text
- `ayetLAT`: Latin transliteration
- `ayetTR`: Turkish meal (fallback/default)
- `ayetEN`: English translation (optional)
- `ayetDE`: German translation (optional)

If `ayetEN` / `ayetDE` are missing, the app **falls back to `ayetTR`**.

### Adding Translations Later

You can bulk export/import translation columns without changing code:

- Export: `python scripts/content/export_translations_csv.py` (writes `TEMP_OUT/translations_export.csv`)
- Import: `python scripts/content/import_translations_csv.py TEMP_OUT/translations_export.csv`

Note: Some flavours have different `data.json` schemas (not verse-based). The export script skips unknown schemas.

### App Language (Locale)

Per-app language switching follows Android/Google standards:

- Android 13+ uses `LocaleManager` (App language settings).
- Android 12 and below use AppCompat per-app locales.
- Supported app locales are declared in `app/src/main/res/xml/locales_config.xml` and referenced via `android:localeConfig` in the manifest.

## License

Copyright © 2026 Parsfilo. All rights reserved.

## Firebase Web Key Injection

Firebase web API key artık repoda tutulmuyor. Deploy öncesi şu komutu çalıştırın:

```bash
export FIREBASE_WEB_API_KEY="YOUR_KEY"
python scripts/firebase/render_web_index.py
```

Not: `firebase_projects/mobil_web/public/index.html` repoda placeholder ile tutulur.
