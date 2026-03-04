declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_ID = "recaptcha-v3-script";
let scriptLoadPromise: Promise<void> | null = null;

function ensureRecaptchaScript(siteKey: string): Promise<void> {
  if (window.grecaptcha?.execute) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
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
  if (!window.grecaptcha?.ready || !window.grecaptcha?.execute) {
    throw new Error("reCAPTCHA is not available on window.");
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(trimmedKey, { action: trimmedAction });
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

