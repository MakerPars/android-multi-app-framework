import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const ROOT_DIR = path.resolve(__dirname, "..");

export default defineConfig(({ mode }) => {
  // Support both admin-notifications/.env and repo root .env.
  const rootEnv = loadEnv(mode, ROOT_DIR, "");
  const localEnv = loadEnv(mode, __dirname, "");
  const mergedEnv = { ...rootEnv, ...localEnv };

  const envDefineEntries = Object.entries(mergedEnv).filter(([key]) =>
    key.startsWith("VITE_") || key.startsWith("FIREBASE_WEB_"),
  );

  const define: Record<string, string> = {};
  for (const [key, value] of envDefineEntries) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    envDir: __dirname,
    envPrefix: ["VITE_", "FIREBASE_WEB_"],
    define,
    plugins: [react()],
    resolve: {
      alias: {
        "@ciapps": path.resolve(__dirname, "../.ci/apps.json"),
      },
    },
    server: {
      fs: {
        allow: [".."],
      },
    },
  };
});
