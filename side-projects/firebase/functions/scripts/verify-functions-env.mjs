import { execFileSync } from "node:child_process";

const PROJECT = process.env.DOPPLER_PROJECT || "android-multi-app-framework";
const CONFIG = process.env.DOPPLER_CONFIG || "prod";

const requiredKeys = [
  ["ADMOB_CLIENT_ID", 20],
  ["ADMOB_CLIENT_SECRET", 20],
  ["ADMOB_REFRESH_TOKEN", 20],
  ["ADMOB_PUBLISHER_ID", 10],
  ["ADMIN_ALLOWED_EMAILS", 8],
];

const optionalKeyGroups = [
  [["GOOGLE_RECAPTCHA_SECRET_KEY", "GOOGLE_reCAPTCHA_SECRET_KEY"], 20],
];

function getSecret(key) {
  if (!hasDopplerCli()) {
    return (process.env[key] ?? "").trim();
  }

  try {
    return execFileSync(
      "doppler",
      [
        "secrets",
        "get",
        key,
        "--plain",
        "--project",
        PROJECT,
        "--config",
        CONFIG,
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ).trim();
  } catch {
    return (process.env[key] ?? "").trim();
  }
}

function hasDopplerCli() {
  try {
    execFileSync("doppler", ["--version"], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

const source = hasDopplerCli() ? "doppler+env-fallback" : "env-only";
console.log(`Secret source: ${source}`);

let failed = false;
for (const [key, minLen] of requiredKeys) {
  const value = getSecret(key);
  const len = value.length;
  if (len < minLen) {
    console.error(`ERROR: ${key} missing/too short (len=${len}, expected>=${minLen})`);
    failed = true;
  } else {
    console.log(`OK: ${key} (len=${len})`);
  }
}

for (const [keys, minLen] of optionalKeyGroups) {
  const found = keys
    .map((key) => ({ key, value: getSecret(key) }))
    .find((entry) => entry.value.length > 0);

  if (!found) {
    console.warn(`WARN: ${keys.join(" or ")} not set (optional)`);
    continue;
  }

  const len = found.value.length;
  if (len < minLen) {
    console.warn(`WARN: ${found.key} seems too short (len=${len}, expected>=${minLen})`);
  } else {
    console.log(`OK: ${found.key} (len=${len})`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Verified functions env for project=${PROJECT} config=${CONFIG} (${source})`);
