declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise?: {
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const SCRIPT_ID = "recaptcha-v3-script";
const ENTERPRISE_SCRIPT_ID = "recaptcha-enterprise-script";
let scriptLoadPromise: Promise<void> | null = null;

function canExecuteRecaptcha(): boolean {
  return Boolean(
    window.grecaptcha?.ready &&
      (window.grecaptcha?.execute || window.grecaptcha?.enterprise?.execute),
  );
}

function loadScript(scriptId: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "1" || canExecuteRecaptcha()) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load script: ${scriptId}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${scriptId}`));
    document.head.appendChild(script);
  });
}

function ensureRecaptchaScript(siteKey: string): Promise<void> {
  if (canExecuteRecaptcha()) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = (async () => {
    await loadScript(
      SCRIPT_ID,
      `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`,
    );
    if (canExecuteRecaptcha()) return;
    await loadScript(
      ENTERPRISE_SCRIPT_ID,
      `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`,
    );
    if (!canExecuteRecaptcha()) {
      throw new Error(
        "reCAPTCHA loaded but execute API is unavailable (possible blocker/extension or key type mismatch).",
      );
    }
  })();

  return scriptLoadPromise!;
}

export async function executeRecaptcha(siteKey: string, action: string): Promise<string> {
  const trimmedKey = siteKey.trim();
  const trimmedAction = action.trim();
  if (!trimmedKey) {
    throw new Error("reCAPTCHA site key is missing.");
  }
  if (!trimmedAction) {
    throw new Error("reCAPTCHA action is missing.");
  }

  await ensureRecaptchaScript(trimmedKey);
  if (!window.grecaptcha?.ready) {
    throw new Error("reCAPTCHA is not available on window.");
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha!.ready(async () => {
      try {
        const executeFn =
          window.grecaptcha!.execute ?? window.grecaptcha!.enterprise?.execute;
        if (!executeFn) {
          reject(
            new Error(
              "reCAPTCHA execute API is unavailable (blocked script or unsupported key type).",
            ),
          );
          return;
        }
        const token = await executeFn(trimmedKey, { action: trimmedAction });
        if (!token) {
          reject(new Error("reCAPTCHA returned empty token."));
          return;
        }
        resolve(token);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to execute reCAPTCHA."));
      }
    });
  });
}
