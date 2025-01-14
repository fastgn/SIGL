import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/unit/**/*.test.ts"],
    coverage: {
      exclude: [
        "vitest.*.config.ts",
        "coverage/**",
        "dist/**",
        "**/__mocks__/**",
        "**/types/**",
        "test/**",
        "*prisma/**",
        "**/swagger/**",
        "**/fileMiddleware.ts",
        "**/dashboardController.ts",
        "**/dashboardRoutes.ts",
      ],
    },
    root: "./",
    clearMocks: true,
    environment: "node",
  },
});
