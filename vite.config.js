import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    // Development config
    return {
      root: resolve(__dirname, "dev"),
      server: {
        port: 5173,
      },
      resolve: {
        alias: {
          "@sdk": resolve(__dirname, "src"),
        },
      },
    };
  }
  // Build config
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "ClientSDK",
        fileName: (format) => `index.${format}.js`,
        formats: ["esm", "umd"],
      },
      rollupOptions: {
        external: [], // Add external dependencies here if needed
        output: {
          globals: {}, // Add global variable names for external dependencies if needed
        },
      },
    },
  };
});
