import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {

      all: true,
      include: ["src/**/*.ts"],
      provider: "istanbul",
    },
  },
});
