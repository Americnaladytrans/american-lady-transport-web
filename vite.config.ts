import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// Base path can be overridden at build time via VITE_BASE.
//
//   - Local dev / pplx.app:  base = "./"  (default, relative paths)
//   - GitHub Pages copy site: base = "/american-lady-transport-web/"
//     (set by .github/workflows/*.yml so SPA assets resolve correctly)
export default defineConfig(() => ({
  base: process.env.VITE_BASE || "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[hash].js",
        entryFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash].[ext]",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
  },
}));
