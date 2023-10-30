import { describe, it, expect } from "vitest";
import { readdirSync } from "fs";
import { join } from "path";
import { initialisePlanningRules } from "./initialise-rules";

describe("initialisePlanningRules", () => {
  it("should return an array with items equal to the number of non-test modules in the rules directory", () => {
    const directoryPath = join(__dirname, "../planning/rules");

    const files = readdirSync(directoryPath);

    const ruleFiles = files.filter(
      (file) => !file.endsWith(".spec.ts") && file.endsWith(".ts"),
    );

    const rules = initialisePlanningRules();

    expect(rules.length).toBe(ruleFiles.length);
  });
});
