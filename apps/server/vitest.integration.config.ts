import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/integration/**/*.test.ts"],
    coverage: {
      exclude: [
        "vitest.*.config.ts",
        "coverage/**",
        "dist/**",
        "**/__mocks__/**",
        "**/types/**",
        "test/**",
        "*prisma/**",
      ],
    },
    fileParallelism: false,
    root: "./",
    setupFiles: ["test/helpers/setup.ts"],
  },
});
