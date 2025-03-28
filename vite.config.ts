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
      // Add empty modules for missing exports
      "react-syntax-highlighter/dist/esm/styles/hljs/dust": path.resolve(
        __dirname,
        "./src/lib/empty-module.js",
      ),
      "lowlight/lib/core": path.resolve(__dirname, "./src/lib/empty-module.js"),
      lowlight: path.resolve(__dirname, "./src/lib/lowlight-module.js"),
      "@babel/runtime/helpers/esm/objectWithoutProperties": path.resolve(
        __dirname,
        "./src/lib/object-without-properties.js",
      ),
    },
  },
  optimizeDeps: {
    // Exclude problematic dependencies from optimization
    exclude: ["react-syntax-highlighter", "lowlight", "@babel/runtime"],
    include: [
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
      sourcemap: false,
    },
  },
  build: {
    sourcemap: false,
    commonjsOptions: {
      sourceMap: false,
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        sourcemap: false,
      },
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
