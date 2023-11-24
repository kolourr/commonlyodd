import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
  plugins: [solidPlugin(), suidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  envDir: "environment/",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
