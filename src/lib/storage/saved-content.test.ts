import { describe, expect, it } from "vitest";
import { readSavedContent, savedContentStorageKey, writeSavedContent } from "./saved-content";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>(initial ? [[savedContentStorageKey, initial]] : []);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("saved content browser storage", () => {
  it("round-trips validated saved records", () => {
    const storage = memoryStorage();
    const records = [{ kind: "article" as const, contentId: "banking-in-japan", state: "saved" as const, updatedAt: "2026-09-07T12:00:00.000Z" }];
    writeSavedContent(records, storage);
    expect(readSavedContent(storage)).toEqual(records);
  });

  it("falls back safely when stored data is invalid", () => {
    expect(readSavedContent(memoryStorage('{"unexpected":true}'))).toEqual([]);
  });
});

