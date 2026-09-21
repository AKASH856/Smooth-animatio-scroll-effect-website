import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

// `vite` (dev) serves the playground via index.html.
// `vite build` produces the distributable library in dist/.
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      // Playground-only files are not part of the public API.
      exclude: ["src/App.tsx", "src/main.tsx"],
      rollupTypes: false,
    }),
  ],
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // Consumers bring their own React; Lenis is a runtime dependency.
      external: ["react", "react-dom", "react/jsx-runtime", "lenis"],
      output: {
        assetFileNames: "new-studio-nav.[ext]",
      },
    },
  },
});
