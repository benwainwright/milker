import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      all: true,
      include: ["src/lib/**/*.ts"],
      provider: "istanbul",
      cleanOnRerun: true,
      thresholdAutoUpdate: true,
      lines: 96.98,
      branches: 89.16,
      functions: 98.57,
      statements: 96.99,
    },
  },
});
