import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins = [];

if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// Fix for JSX runtime issues
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    exclude: ["tempo-devtools/swc"],
    include: [
      "@radix-ui/react-select",
      "@radix-ui/react-toast",
      "@radix-ui/react-dialog",
      "@radix-ui/react-alert-dialog",
    ],
    force: true,
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
  },
  cacheDir: "node_modules/.vite",
});
