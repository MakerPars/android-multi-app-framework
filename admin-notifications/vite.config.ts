import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
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
});
