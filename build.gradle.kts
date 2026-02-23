import io.gitlab.arturbosch.detekt.Detekt
import org.jetbrains.kotlin.gradle.dsl.KotlinBaseExtension

// Top-level build file where you can add configuration options common to all subprojects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.google.services) apply false
    alias(libs.plugins.firebase.crashlytics) apply false
    alias(libs.plugins.firebase.perf) apply false
    alias(libs.plugins.room) apply false
    // ── Quality Tools ──
    alias(libs.plugins.detekt)
    alias(libs.plugins.ktlint) apply false

    id("io.sentry.android.gradle") version "6.1.0" apply false
}

// ═══════════════════════════════════════════════════════════════
// ▸ Gradle CPU Limiter (≈ %70–80 kullanım)
// ═══════════════════════════════════════════════════════════════
val cores = Runtime.getRuntime().availableProcessors()

// Tüm Gradle worker'larını sınırla (compile, dex, KSP, etc.)
gradle.startParameter.maxWorkerCount = (cores - 2).coerceAtLeast(1)

// Test JVM paralelliğini de sınırla
tasks.withType<Test>().configureEach {
    maxParallelForks = (cores / 3).coerceAtLeast(1)
}

// ═══════════════════════════════════════════════════════════════
// ▸ 1. Detekt — Minimal (Sadece Deprecated Detection)
// ═══════════════════════════════════════════════════════════════
detekt {
    source.setFrom(
        fileTree(rootDir) {
            include("app/src/**/*.kt", "core/*/src/**/*.kt", "feature/*/src/**/*.kt")
        })
    config.setFrom(files("config/detekt/detekt.yml"))
    baseline = file("config/detekt/detekt-baseline.xml")
    parallel = true
    buildUponDefaultConfig = false  // Sadece kendi config'imizi kullan
    autoCorrect = false
}

tasks.withType<Detekt>().configureEach {
    reports {
        html.required.set(true)
        html.outputLocation.set(project.layout.buildDirectory.file("reports/detekt/detekt.html"))
    }
    jvmTarget = "21"
    // Build fail olmasın - sadece rapor -> ARTIK FAIL OLMALI
    ignoreFailures = false
}

// ═══════════════════════════════════════════════════════════════
// ▸ 2. Subproject quality config (Android Lint + ktlint)
// ═══════════════════════════════════════════════════════════════
subprojects {
    val preReleaseVersionRegex = Regex(""".*[-.](alpha|beta|rc)\d*.*""", RegexOption.IGNORE_CASE)
    val allowedPreReleaseGroups = setOf(
        // Google Mobile Ads 25.x transitively requires these beta AndroidX artifacts.
        "androidx.privacysandbox.ads"
    )

    // Stabilize R8 inputs by pinning versions across the graph.
    val libsCatalog = rootProject.extensions.getByType<VersionCatalogsExtension>().named("libs")

    val coroutinesVersion = libsCatalog.findVersion("coroutines").get().requiredVersion
    val credentialsVersion = libsCatalog.findVersion("credentialsVersion").get().requiredVersion
    val googleIdVersion = libsCatalog.findVersion("googleidVersion").get().requiredVersion

    configurations.configureEach {
        resolutionStrategy {
            componentSelection {
                all {
                    if (
                        preReleaseVersionRegex.matches(candidate.version) &&
                        candidate.group !in allowedPreReleaseGroups
                    ) {
                        reject(
                            "Pre-release dependencies are not allowed: " + "${candidate.group}:${candidate.module}:${candidate.version}"
                        )
                    }
                }
            }
            force(
                "org.jetbrains.kotlinx:kotlinx-coroutines-bom:$coroutinesVersion",
                "org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion",
                "org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:$coroutinesVersion",
                "org.jetbrains.kotlinx:kotlinx-coroutines-android:$coroutinesVersion",
                "org.jetbrains.kotlinx:kotlinx-coroutines-play-services:$coroutinesVersion",
                "androidx.credentials:credentials:$credentialsVersion",
                "androidx.credentials:credentials-play-services-auth:$credentialsVersion",
                "com.google.android.libraries.identity.googleid:googleid:$googleIdVersion"
            )
        }
    }

    val shouldConfigureKtlint = gradle.startParameter.taskNames.any { taskName ->
        taskName.contains("ktlint", ignoreCase = true) || taskName.contains("qualityCheck", ignoreCase = true)
    }

    // ── ktlint (sadece kalite task'larında yükle) ──
    if (shouldConfigureKtlint) {
        apply(plugin = "org.jlleitschuh.gradle.ktlint")
    }

    // ✅ Plugin apply edildikten sonra extension kesin var
    plugins.withId("org.jlleitschuh.gradle.ktlint") {
        configure<org.jlleitschuh.gradle.ktlint.KtlintExtension> {
            android.set(true)
            outputToConsole.set(true)

            val isCi =
                (System.getenv("TF_BUILD") ?: "").equals("True", ignoreCase = true) || !System.getenv("BUILD_BUILDID")
                    .isNullOrBlank() || (System.getenv("CI") ?: "").equals("true", ignoreCase = true)
            val isPullRequest =
                (System.getenv("BUILD_REASON") ?: "").equals("PullRequest", ignoreCase = true) ||
                    !System.getenv("SYSTEM_PULLREQUEST_PULLREQUESTID").isNullOrBlank()

            // PR kalite kapısında ktlint ihlali pipeline'ı kırmalıdır.
            ignoreFailures.set(isCi && !isPullRequest)

            reporters {
                reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.HTML)
                reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.SARIF)
            }
        }
    }

    // ── Java Toolchain 21 Enforce ──
    extensions.findByType<JavaPluginExtension>()?.toolchain?.languageVersion?.set(
        JavaLanguageVersion.of(21)
    )
    extensions.findByType<KotlinBaseExtension>()?.jvmToolchain(21)

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=param-property")

            // Compose Compiler Metrics
            if (project.findProperty("composeCompilerReports") == "true") {
                freeCompilerArgs.addAll(
                    "-P",
                    "plugin:androidx.compose.compiler.plugins.kotlin:reportsDestination=" + project.layout.buildDirectory.dir(
                        "compose_reports"
                    ).get().asFile.absolutePath,
                    "-P",
                    "plugin:androidx.compose.compiler.plugins.kotlin:metricsDestination=" + project.layout.buildDirectory.dir(
                        "compose_metrics"
                    ).get().asFile.absolutePath
                )
            }
        }
    }

    // ── Test Control (enabled by default, optional disable via -PdisableTests=true) ──
    val disableTests = (findProperty("disableTests") as String?)?.toBoolean() == true
    if (disableTests) {
        tasks.withType<Test>().configureEach { enabled = false }
        tasks.matching { it.name.contains("UnitTest") }.configureEach { enabled = false }
    }

    // ── Android Lint for library modules ──
    plugins.withId("com.android.library") {
        @Suppress("UNCHECKED_CAST") val androidExt =
            extensions.getByName("android") as com.android.build.api.dsl.LibraryExtension

        androidExt.packaging {
            jniLibs {
                // Prebuilt libs may not be strip-compatible; keep symbols to avoid noisy warnings.
                keepDebugSymbols += setOf(
                    "**/libandroidx.graphics.path.so", "**/libdatastore_shared_counter.so"
                )
            }
        }

        androidExt.lint {
            abortOnError = true
            checkAllWarnings = true
            warningsAsErrors = false
            checkDependencies = false
            htmlReport = true
            xmlReport = true
            sarifReport = true
            baseline = file("lint-baseline.xml")
            // Ignore gRPC/Firebase library issues with javax.naming (not available on Android)
            disable.add("InvalidPackage")
        }

        // ProGuard Consumer Rules
        val consumerRules = file("consumer-rules.pro")
        if (consumerRules.exists()) {
            androidExt.defaultConfig.consumerProguardFiles(consumerRules)
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// ▸ 3. qualityCheck — Aggregate task (single entry-point)
//    Usage: ./gradlew qualityCheck
// ═══════════════════════════════════════════════════════════════
tasks.register("qualityCheck") {
    group = "verification"
    description = "Minimal checks: Android Lint + Detekt (deprecated only) + ktlint"
    dependsOn("detekt")
}

gradle.projectsEvaluated {
    subprojects.forEach { sub ->
        rootProject.tasks.named("qualityCheck") {
            sub.tasks.findByName("lintDebug")?.let { dependsOn(it) }
            sub.tasks.findByName("lintRelease")?.let { dependsOn(it) }
            sub.tasks.findByName("ktlintCheck")?.let { dependsOn(it) }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// ▸ 4. printFlavors — Utility for CI/CD to get flavor list
//    Usage: ./gradlew -q printFlavors
// ═══════════════════════════════════════════════════════════════
tasks.register("printFlavors") {
    description = "Prints all product flavors as a JSON array for CI matrix generation"
    group = "help"
    doLast {
        // Output format: ["flavor1","flavor2"]
        val flavors = AppFlavors.all.joinToString(
            prefix = "[", separator = ",", postfix = "]"
        ) { "\"${it.name}\"" }
        println(flavors)
    }
}
