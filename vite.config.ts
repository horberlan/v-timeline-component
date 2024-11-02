import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: "dist/types",
      staticImport: true,
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/v-timeline-component.vue"),
      name: "VTimelineComponent",
      fileName: "v-timeline-component",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
