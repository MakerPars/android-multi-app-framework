#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const PROJECT = (process.env.DOPPLER_PROJECT || "android-multi-app-framework").trim();
const CONFIG = (process.env.DOPPLER_CONFIG || "prod").trim();

const rootDir = resolve(process.cwd());
const rootEnvPath = resolve(rootDir, ".env");
const templatePath = resolve(rootDir, ".env.template");
const adminEnvPath = resolve(rootDir, "side-projects/admin-notifications/.env");
const adminEnvExamplePath = resolve(rootDir, "side-projects/admin-notifications/.env.example");

const derivedRootKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_FUNCTIONS_REGION",
  "VITE_FUNCTIONS_BASE_URL",
  "VITE_ADMIN_ALLOWED_EMAILS",
];

const templateOptionalKeys = [
  "VITE_CONTENT_API_URL",
  "VITE_GA4_PROPERTY_ID",
  "VITE_FLAVOR_VERSIONS",
];

const adminEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_FUNCTIONS_REGION",
  "VITE_FUNCTIONS_BASE_URL",
  "VITE_CONTENT_API_URL",
  "VITE_GA4_PROPERTY_ID",
  "VITE_FLAVOR_VERSIONS",
  "VITE_ADMIN_ALLOWED_EMAILS",
];

const templateDefaults = new Map([
  ["DOPPLER_PROJECT", "android-multi-app-framework"],
  ["DOPPLER_CONFIG", "prod"],
  ["DOPPLER_ENVIRONMENT", "prod"],
  ["KEY_ALIAS", "upload"],
  ["KEY_PASSWORD", "CHANGE_ME"],
  ["KEYSTORE_PASSWORD", "CHANGE_ME"],
  ["KEYSTORE_FILE", "C:/path/to/release.jks"],
  ["PLAY_SERVICE_ACCOUNT_JSON", "C:/path/to/play-service-account.json"],
  ["PURCHASE_VERIFICATION_URL", "https://contentapp-admin-api.oaslananka.workers.dev/verifyPurchase"],
  ["PUSH_REGISTRATION_URL", "https://contentapp-admin-api.oaslananka.workers.dev/registerDevice"],
  ["VITE_FIREBASE_FUNCTIONS_REGION", "europe-west1"],
  ["VITE_FUNCTIONS_BASE_URL", "https://contentapp-admin-api.oaslananka.workers.dev"],
  ["VITE_ADMIN_ALLOWED_EMAILS", "admin@example.com,ops@example.com"],
  ["ADMIN_ALLOWED_EMAILS", "admin@example.com,ops@example.com"],
]);

function parseEnv(content) {
  const out = new Map();
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1);
    if (key) out.set(key, value);
  }
  return out;
}

function parseEnvFile(path) {
  if (!existsSync(path)) return new Map();
  return parseEnv(readFileSync(path, "utf8"));
}

function fetchDopplerEnvMap() {
  const raw = execFileSync(
    "doppler",
    [
      "secrets",
      "download",
      "--no-file",
      "--format",
      "env",
      "--project",
      PROJECT,
      "--config",
      CONFIG,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  return parseEnv(raw);
}

function escapeEnvValue(value) {
  if (value == null) return "";
  return String(value).replace(/\r?\n/g, "\\n");
}

function writeEnv(path, keysInOrder, map, headerLines = []) {
  const lines = [...headerLines];
  for (const key of keysInOrder) {
    const value = map.get(key) ?? "";
    lines.push(`${key}=${escapeEnvValue(value)}`);
  }
  const extraKeys = [...map.keys()].filter((k) => !keysInOrder.includes(k)).sort();
  if (extraKeys.length > 0) {
    lines.push("", "# Preserved extra keys");
    for (const key of extraKeys) {
      lines.push(`${key}=${escapeEnvValue(map.get(key) ?? "")}`);
    }
  }
  writeFileSync(path, `${lines.join("\n")}\n`, "utf8");
}

function deriveFunctionsBaseUrl(purchaseVerificationUrl) {
  if (!purchaseVerificationUrl) return "";
  try {
    const u = new URL(purchaseVerificationUrl);
    return `${u.origin}`;
  } catch {
    return "";
  }
}

function ensureParentDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function toSortedList(iterable) {
  return [...iterable].sort((a, b) => a.localeCompare(b));
}

function uniqueKeys(keys) {
  return [...new Set(keys)];
}

function printContractDiff(templateMap, contractKeys) {
  const templateKeys = new Set(templateMap.keys());
  const contractSet = new Set(contractKeys);
  const missingInTemplate = contractKeys.filter((k) => !templateKeys.has(k));
  const extraInTemplate = [...templateKeys].filter((k) => !contractSet.has(k)).sort();

  console.log("Secret contract check (.env.template vs contract):");
  console.log(`- Missing in template: ${missingInTemplate.length}`);
  for (const key of missingInTemplate) console.log(`  - ${key}`);
  console.log(`- Extra in template: ${extraInTemplate.length}`);
  for (const key of extraInTemplate) console.log(`  - ${key}`);
}

function pickRootValue(rootMap, key, fallback = "") {
  return rootMap.get(key) || fallback;
}

function main() {
  const dopplerMap = fetchDopplerEnvMap();
  const currentRootMap = parseEnvFile(rootEnvPath);
  const currentAdminMap = parseEnvFile(adminEnvPath);
  const currentAdminExampleMap = parseEnvFile(adminEnvExamplePath);
  const templateMap = parseEnvFile(templatePath);

  const canonicalSecretKeys = toSortedList(dopplerMap.keys());
  const rootOut = new Map();

  for (const key of canonicalSecretKeys) {
    rootOut.set(key, (dopplerMap.get(key) ?? currentRootMap.get(key) ?? "").trim());
  }

  rootOut.set("DOPPLER_PROJECT", rootOut.get("DOPPLER_PROJECT") || PROJECT);
  rootOut.set("DOPPLER_CONFIG", rootOut.get("DOPPLER_CONFIG") || CONFIG);
  rootOut.set("DOPPLER_ENVIRONMENT", rootOut.get("DOPPLER_ENVIRONMENT") || CONFIG);

  rootOut.set(
    "VITE_FIREBASE_API_KEY",
    pickRootValue(rootOut, "VITE_FIREBASE_API_KEY")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_API_KEY")
      || pickRootValue(rootOut, "FIREBASE_WEB_API_KEY"),
  );
  rootOut.set(
    "VITE_FIREBASE_AUTH_DOMAIN",
    pickRootValue(rootOut, "VITE_FIREBASE_AUTH_DOMAIN")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_AUTH_DOMAIN")
      || pickRootValue(rootOut, "FIREBASE_WEB_AUTH_DOMAIN"),
  );
  rootOut.set(
    "VITE_FIREBASE_PROJECT_ID",
    pickRootValue(rootOut, "VITE_FIREBASE_PROJECT_ID")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_PROJECT_ID")
      || pickRootValue(rootOut, "FIREBASE_WEB_PROJECT_ID"),
  );
  rootOut.set(
    "VITE_FIREBASE_APP_ID",
    pickRootValue(rootOut, "VITE_FIREBASE_APP_ID")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_APP_ID")
      || pickRootValue(rootOut, "FIREBASE_WEB_APP_ID"),
  );
  rootOut.set(
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    pickRootValue(rootOut, "VITE_FIREBASE_MESSAGING_SENDER_ID")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_MESSAGING_SENDER_ID")
      || pickRootValue(rootOut, "FIREBASE_WEB_MESSAGING_SENDER_ID"),
  );
  rootOut.set(
    "VITE_FIREBASE_STORAGE_BUCKET",
    pickRootValue(rootOut, "VITE_FIREBASE_STORAGE_BUCKET")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_STORAGE_BUCKET")
      || pickRootValue(rootOut, "FIREBASE_WEB_STORAGE_BUCKET"),
  );
  rootOut.set(
    "VITE_FIREBASE_FUNCTIONS_REGION",
    pickRootValue(rootOut, "VITE_FIREBASE_FUNCTIONS_REGION")
      || pickRootValue(currentRootMap, "VITE_FIREBASE_FUNCTIONS_REGION")
      || "europe-west1",
  );

  const existingFunctionsBaseUrl =
    pickRootValue(rootOut, "VITE_FUNCTIONS_BASE_URL")
    || pickRootValue(currentRootMap, "VITE_FUNCTIONS_BASE_URL");
  const derivedFunctionsBaseUrl = deriveFunctionsBaseUrl(rootOut.get("PURCHASE_VERIFICATION_URL") || "");
  rootOut.set("VITE_FUNCTIONS_BASE_URL", existingFunctionsBaseUrl || derivedFunctionsBaseUrl);
  rootOut.set(
    "VITE_ADMIN_ALLOWED_EMAILS",
    pickRootValue(rootOut, "VITE_ADMIN_ALLOWED_EMAILS")
      || pickRootValue(currentRootMap, "VITE_ADMIN_ALLOWED_EMAILS")
      || pickRootValue(rootOut, "ADMIN_ALLOWED_EMAILS"),
  );

  for (const [key, value] of currentRootMap.entries()) {
    if (!rootOut.has(key)) rootOut.set(key, value);
  }

  const rootKeyOrder = uniqueKeys([...canonicalSecretKeys, ...derivedRootKeys]);

  ensureParentDir(rootEnvPath);
  writeEnv(
    rootEnvPath,
    rootKeyOrder,
    rootOut,
    [
      "# Auto-generated by scripts/sync-env-contract-from-doppler.mjs",
      `# Source: Doppler project=${PROJECT} config=${CONFIG}`,
      "# Canonical keys stay aligned with Doppler. Extra local-only keys are preserved at the bottom.",
      "",
    ],
  );

  const adminOut = new Map();
  for (const key of adminEnvKeys) {
    if (key === "VITE_CONTENT_API_URL" || key === "VITE_GA4_PROPERTY_ID" || key === "VITE_FLAVOR_VERSIONS") {
      adminOut.set(key, currentAdminMap.get(key) || currentRootMap.get(key) || "");
      continue;
    }
    adminOut.set(key, currentAdminMap.get(key) || rootOut.get(key) || "");
  }

  ensureParentDir(adminEnvPath);
  writeEnv(
    adminEnvPath,
    adminEnvKeys,
    adminOut,
    [
      "# Auto-generated by scripts/sync-env-contract-from-doppler.mjs",
      `# Source: ${rootEnvPath}`,
      "# This file is derived from canonical root .env + admin-specific optional fields.",
      "",
    ],
  );

  const adminExampleOut = new Map();
  for (const key of adminEnvKeys) {
    const existingValue = currentAdminExampleMap.get(key);
    adminExampleOut.set(key, existingValue ?? templateDefaults.get(key) ?? "");
  }

  ensureParentDir(adminEnvExamplePath);
  writeEnv(
    adminEnvExamplePath,
    adminEnvKeys,
    adminExampleOut,
    [
      "# Admin panel env contract.",
      "# Source of truth: repo root .env (canonical keys synced from Doppler).",
      "# Quick sync command:",
      "#   node scripts/sync-env-contract-from-doppler.mjs",
      "",
    ],
  );

  const templateOut = new Map();
  const templateContractKeys = uniqueKeys([
    ...canonicalSecretKeys,
    ...derivedRootKeys,
    ...templateOptionalKeys,
  ]);
  for (const key of templateContractKeys) {
    const existingValue = templateMap.get(key);
    templateOut.set(key, existingValue ?? templateDefaults.get(key) ?? "");
  }

  ensureParentDir(templatePath);
  writeEnv(
    templatePath,
    templateContractKeys,
    templateOut,
    [
      "# Canonical env contract (auto-synced from Doppler keys)",
      "# Generated by scripts/sync-env-contract-from-doppler.mjs",
      `# Source: Doppler project=${PROJECT} config=${CONFIG}`,
      "# Values are placeholders; never commit real secret values.",
      "",
    ],
  );

  console.log(`Synced root .env (${rootKeyOrder.length} canonical/derived keys + preserved extras).`);
  console.log(`Synced admin .env (${adminEnvKeys.length} keys).`);
  console.log(`Synced admin .env.example (${adminEnvKeys.length} keys).`);
  console.log(`Synced .env.template (${templateContractKeys.length} contract keys).`);
  console.log(`Doppler canonical key count: ${canonicalSecretKeys.length}`);

  const updatedTemplateMap = parseEnvFile(templatePath);
  printContractDiff(updatedTemplateMap, templateContractKeys);
  console.log(`Canonical key list (${canonicalSecretKeys.length}): ${canonicalSecretKeys.join(", ")}`);
}

main();
