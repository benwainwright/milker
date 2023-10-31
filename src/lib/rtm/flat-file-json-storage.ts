import { mkdir, readFile, writeFile } from "fs/promises";
import { AppStorage } from "../../types/storage";
import { dirname } from "path";
import { jsonParse } from "../core/json-parse";
const JSON_INDENT_SPACES = 2;
export class FlatFileJsonStorage implements AppStorage {
  public constructor(private path: string) {}

  private static async getCurrent(
    path: string,
  ): Promise<Record<string, string>> {
    try {
      return jsonParse(await readFile(path, "utf8"));
    } catch {
      return {};
    }
  }

  private static async writeToFile(path: string, data: string) {
    const dir = dirname(path);

    try {
      await mkdir(dir, { recursive: true });
    } catch {
      // If directory already exists, do nothing
    }

    await writeFile(path, data);
  }

  async get(key: string): Promise<string | undefined> {
    const current = await FlatFileJsonStorage.getCurrent(this.path);
    return current[key];
  }
  async set(key: string, value: string): Promise<void> {
    const newData = {
      ...(await FlatFileJsonStorage.getCurrent(this.path)),
      [key]: value,
    };
    await FlatFileJsonStorage.writeToFile(
      this.path,
      JSON.stringify(newData, null, JSON_INDENT_SPACES),
    );
  }
}
