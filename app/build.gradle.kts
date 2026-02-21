import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
    alias(libs.plugins.google.services)
    alias(libs.plugins.firebase.crashlytics)
    alias(libs.plugins.firebase.perf)
    alias(libs.plugins.play.publisher)
    id("io.sentry.android.gradle")
}

/* =========================
   ENV & VERSION PROPERTIES
   ========================= */

val envFile: File? = rootProject.file(".env")
val envProps = Properties()
if (envFile?.exists() == true) {
    envFile.inputStream().use { envProps.load(it) }
}

val fallbackVersionCode = 1
val fallbackVersionName = "1.0.0"

val appVersionsFile: File = rootProject.file("app-versions.properties")
val appVersionsProps = Properties()
if (appVersionsFile.exists()) {
    appVersionsFile.inputStream().use { appVersionsProps.load(it) }
}

fun pick(name: String): String? =
    project.findProperty(name)?.toString() ?: envProps.getProperty(name)?.trim('"')
        ?: System.getenv(name)

fun asBuildConfigString(value: String): String = "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\""

data class ResolvedVersion(
    val versionCode: Int,
    val versionName: String,
)

fun resolvedFlavorVersion(flavorName: String): ResolvedVersion {
    val defaultCode = fallbackVersionCode
    val defaultName = fallbackVersionName

    val codeKey = "$flavorName.versionCode"
    val nameKey = "$flavorName.versionName"

    val codeRaw = appVersionsProps.getProperty(codeKey)?.trim().orEmpty()
    val nameRaw = appVersionsProps.getProperty(nameKey)?.trim().orEmpty()

    val code =
        if (codeRaw.isNotEmpty()) {
            codeRaw.toIntOrNull()
                ?: error("Invalid int for '$codeKey' in app-versions.properties: '$codeRaw'")
        } else {
            defaultCode
        }

    val name = nameRaw.ifEmpty { defaultName }

    require(code > 0) { "versionCode must be > 0 for flavor '$flavorName' (resolved=$code)" }
    require(name.isNotBlank()) { "versionName must not be blank for flavor '$flavorName'" }

    return ResolvedVersion(versionCode = code, versionName = name)
}

android {
    namespace = "com.parsfilo.contentapp"
    compileSdk = 36

    flavorDimensions += "app"

    productFlavors {
        AppFlavors.all.forEach { config ->
            create(config.name) {
                dimension = "app"
                applicationId = config.packageName
                resValue("string", "app_name", config.displayName)
                buildConfigField("String", "FLAVOR_NAME", "\"${config.name}\"")

                val resolved = resolvedFlavorVersion(config.name)
                versionCode = resolved.versionCode
                versionName = resolved.versionName

                // Audio dosya adı (varsa)
                val audioFile = config.audioFileName ?: "content_audio.mp3"
                buildConfigField("String", "AUDIO_FILE_NAME", "\"$audioFile\"")
                buildConfigField("boolean", "IS_PRAYER_TIMES_FLAVOR", "${config.isPrayerTimesFlavor}")
            }
        }
    }

    signingConfigs {
        create("release") {
            val keystorePath = pick("KEYSTORE_FILE")

            if (!keystorePath.isNullOrBlank() && file(keystorePath).exists()) {
                storeFile = file(keystorePath)
                storePassword = pick("KEYSTORE_PASSWORD") ?: ""
                keyAlias = pick("KEY_ALIAS") ?: ""
                keyPassword = pick("KEY_PASSWORD") ?: ""
            } else {
                logger.warn("⚠️ Release signing config missing - unsigned build")
            }
        }
    }

    defaultConfig {
        minSdk = 24
        targetSdk = 36

        // Fallback defaults. Flavors override via app-versions.properties.
        versionCode = fallbackVersionCode
        versionName = fallbackVersionName

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        vectorDrawables {
            useSupportLibrary = true
        }

        // ✅ DOĞRU buildConfigField
        buildConfigField(
            "String",
            "APP_SHARE_URL_BASE",
            "\"https://play.google.com/store/apps/details?id=\"",
        )

        buildConfigField("String", "ASSET_PACK_NAME", "\"audioassets\"")
        buildConfigField("boolean", "USE_ASSET_PACK_AUDIO", "false")
        buildConfigField(
            "String",
            "PUSH_REGISTRATION_URL",
            asBuildConfigString(pick("PUSH_REGISTRATION_URL") ?: ""),
        )
        buildConfigField("String", "SENTRY_DSN", asBuildConfigString(pick("SENTRY_DSN") ?: ""))
    }

    buildTypes {
        debug {
            buildConfigField("boolean", "USE_TEST_ADS", "true")
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true

            if (!pick("KEYSTORE_FILE").isNullOrBlank()) {
                signingConfig = signingConfigs.getByName("release")
            }

            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )

            buildConfigField("boolean", "USE_TEST_ADS", "false")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    buildFeatures {
        compose = true
        buildConfig = true
        resValues = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
        jniLibs {
            useLegacyPackaging = true
            keepDebugSymbols +=
                setOf(
                    "**/libandroidx.graphics.path.so",
                    "**/libdatastore_shared_counter.so",
                )
        }
    }

    lint {
        abortOnError = true
        checkAllWarnings = true
        warningsAsErrors = false
        checkDependencies = true
        htmlReport = true
        xmlReport = true
        sarifReport = true
        baseline = file("lint-baseline.xml")
    }
}

/* =========================
   KOTLIN (android DIŞINDA!)
   ========================= */

kotlin {
    jvmToolchain(21)
}

/* =========================
   PLAY PUBLISHER
   ========================= */

play {
    val serviceAccountJson = pick("PLAY_SERVICE_ACCOUNT_JSON")

    if (!serviceAccountJson.isNullOrBlank() && file(serviceAccountJson).exists()) {
        serviceAccountCredentials.set(file(serviceAccountJson))
    } else {
        logger.warn("⚠️ Play Console service account not configured")
    }

    // Default to production; pipelines can still override with -PPLAY_TRACK=internal/beta/etc.
    val resolvedTrack =
        providers
            .gradleProperty("PLAY_TRACK")
            .orElse(providers.environmentVariable("PLAY_TRACK"))
            .orElse("internal")
    track.set(resolvedTrack)
    defaultToAppBundles.set(true)
}

sentry {
    org.set("oaslananka")
    projectName.set("android-multi-app-framework")
    includeSourceContext.set(false)
    autoUploadProguardMapping.set(true)

    val sentryAuthToken = pick("SENTRY_AUTH_TOKEN")
    if (!sentryAuthToken.isNullOrBlank()) {
        authToken.set(sentryAuthToken)
    }
}
/* =========================
   DEPENDENCIES
   ========================= */

dependencies {
    implementation(project(":core:common"))
    implementation(project(":core:model"))
    implementation(project(":core:designsystem"))
    implementation(project(":core:datastore"))
    implementation(project(":core:database"))
    implementation(project(":core:firebase"))
    implementation(project(":core:auth"))

    implementation(project(":feature:content"))
    implementation(project(":feature:audio"))
    implementation(project(":feature:ads"))
    implementation(project(":feature:billing"))
    implementation(project(":feature:auth"))
    implementation(project(":feature:notifications"))
    implementation(project(":feature:messages"))
    implementation(project(":feature:settings"))
    implementation(project(":feature:otherapps"))
    implementation(project(":feature:curvedbottomnavigation"))
    implementation(project(":feature:prayertimes"))
    implementation(project(":feature:qibla"))

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.process)
    implementation(libs.androidx.activity.compose)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material3.window.size)
    implementation(libs.androidx.compose.material3.adaptive.navigation.suite)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.hilt.navigation.compose)
    implementation(libs.androidx.material3)
    implementation(libs.play.services.ads)

    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)

    implementation(libs.play.asset.delivery.ktx) {
        exclude(group = "com.google.android.play", module = "core-common")
    }

    implementation(libs.firebase.crashlytics)
    implementation("io.sentry:sentry-compose-android:8.33.0")
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.timber)

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)

    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
