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
      lines: 97.42,
      branches: 90,
      functions: 100,
      statements: 97.43,
    },
  },
});
