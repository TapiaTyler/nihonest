import { describe, expect, it } from "vitest";
import { defaultContentLocale } from "@/domain/localization/content-locale";
import { contentLocaleStorageKey, readContentLocale, writeContentLocale } from "./content-locale";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(contentLocaleStorageKey, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("content locale storage", () => {
  it("uses canonical English when the preference is absent or invalid", () => {
    expect(readContentLocale(memoryStorage())).toBe(defaultContentLocale);
    expect(readContentLocale(memoryStorage("unsupported"))).toBe(defaultContentLocale);
  });

  it("persists a supported content locale", () => {
    const storage = memoryStorage();
    writeContentLocale("ja", storage);
    expect(readContentLocale(storage)).toBe("ja");
  });
});
