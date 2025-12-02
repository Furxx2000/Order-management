import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    coverage: {
      provider: "v8", // 或 'istanbul'
      exclude: [
        // 預設排除項目
        "node_modules/**",
        "dist/**",
        "**/*.config.*",
        "**/*.d.ts",

        // 測試相關檔案
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/test/**",
        "**/tests/**",
        "src/test/**",
        "src/mocks/**",

        // Service layer (thin API wrappers)
        "src/services/**",

        // 其他低測試價值的檔案（可選）
        // "src/lib/definitions.ts", // Type definitions
        // "src/data/**", // Mock data
      ],
    },
  },
});
