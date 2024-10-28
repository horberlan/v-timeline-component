import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts(),
    {
      name: "include-types",
      generateBundle(options, bundle) {
        Object.keys(bundle).forEach((key) => {
          if (key.endsWith(".d.ts")) return;
          const chunk = bundle[key];
          if (chunk.type === "chunk") {
            chunk.code += `\n// Types: ${key.replace(".js", ".d.ts")}\n`;
          }
        });
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Timeline",
      fileName: "timeline",
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
