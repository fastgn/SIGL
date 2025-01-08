import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/integration/**/*.test.ts"],
    fileParallelism: false,
    root: "./",
    setupFiles: ["test/helpers/setup.ts"],
  },
});
