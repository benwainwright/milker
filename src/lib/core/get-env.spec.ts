import { getEnv } from "./get-env";

beforeEach(() => {
  process.env = {};
});

test("get env returns the value if value is present in env", () => {
  process.env["FOO"] = "bar";
  const value = getEnv("FOO");
  expect(value).toEqual("bar");
});

test("get env throws an error if var is not in environment", () => {
  expect(() => getEnv("FOO")).toThrow();
});
