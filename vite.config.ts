import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tempo()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react-syntax-highlighter/dist/esm/styles/prism",
      "framer-motion",
      "@radix-ui/react-tabs",
      "@codemirror/lang-html",
      "@codemirror/lang-css",
      "@codemirror/lang-javascript",
      "@codemirror/lang-json",
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/basic-setup",
      "@codemirror/theme-one-dark",
    ],
    esbuildOptions: {
      sourcemap: true,
    },
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      sourceMap: true,
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
