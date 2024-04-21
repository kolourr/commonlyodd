import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import suidPlugin from "@suid/vite-plugin";
import visualizer from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    solidPlugin(),
    suidPlugin(),
    process.env.NODE_ENV === "production" &&
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  publicDir: "public",

  envDir: "environment/",
  envPrefix: "CO_",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
