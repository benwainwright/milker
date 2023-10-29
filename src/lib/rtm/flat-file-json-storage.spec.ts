import mockFs from "mock-fs";
import { FlatFileJsonStorage } from "./flat-file-json-storage";
import { readFile } from "fs/promises";

afterEach(() => {
  mockFs.restore();
});

test("flat-file-json-storage.get retrieves the correct value from the specified json file", async () => {
  const theKey = "the-key";
  const theValue = "the-value";
  const theFilePath = "one/two/three.json";

  const data = {
    [theKey]: theValue,
    "the-other-key": "the-other-value",
  };

  mockFs({
    [theFilePath]: mockFs.file({ content: JSON.stringify(data) }),
  });

  const storage = new FlatFileJsonStorage(theFilePath);

  const result = await storage.get(theKey);
  expect(result).toEqual(theValue);
});

test("flat-file-json-storage.set creates the file if it doesn't exist", async () => {
  const theKey = "the-key";
  const theNewValue = "the-new-value";
  const theFilePath = "one/two/three.json";

  mockFs();

  const storage = new FlatFileJsonStorage(theFilePath);

  await storage.set(theKey, theNewValue);

  const contents = await readFile(theFilePath, "utf8");
  expect(JSON.parse(contents)).toEqual({ [theKey]: theNewValue });
});

test("flat-file-json-storage.set correctly encodes the value in the JSON file", async () => {
  const theKey = "the-key";
  const theValue = "the-value";
  const theNewValue = "the-new-value";
  const theFilePath = "one/two/three.json";

  const data = {
    [theKey]: theValue,
    "the-other-key": "the-other-value",
  };

  mockFs({
    [theFilePath]: mockFs.file({ content: JSON.stringify(data) }),
  });

  const storage = new FlatFileJsonStorage(theFilePath);

  await storage.set(theKey, theNewValue);

  const contents = await readFile(theFilePath, "utf8");
  expect(JSON.parse(contents)).toEqual({ ...data, [theKey]: theNewValue });
});

test("flat-file-json-storage.set returns undefined if a value is not present", async () => {
  const theKey = "the-key";
  const theFilePath = "one/two/three.json";

  const data = {
    "the-other-key": "the-other-value",
  };

  mockFs({
    [theFilePath]: JSON.stringify(data),
  });

  const storage = new FlatFileJsonStorage(theFilePath);

  const result = await storage.get(theKey);
  expect(result).toBeUndefined();
});
