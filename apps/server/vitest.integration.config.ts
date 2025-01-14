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
        "**/fileMiddleware.ts",
        "**/biannulalEvaluationController.ts",
        "**/meetingController.ts",
        "**/dashboardController.ts",
        "**/biannulalEvaluationRoutes.ts",
        "**/meetingRoutes.ts",
        "**/dashboardRoutes.ts",
        "**/utils/controller.ts",
      ],
    },
    fileParallelism: false,
    root: "./",
    setupFiles: ["test/helpers/setup.ts"],
  },
});
