import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standalone Vite + React SPA (deployable to Vercel).
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    port: 8080,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 8080,
  },
});
