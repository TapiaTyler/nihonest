import { describe, expect, it } from "vitest";
import {
  anonymousPreferencesStorageKey,
  readAnonymousPreferences,
  writeAnonymousPreferences,
} from "./anonymous-preferences";

function memoryStorage(initialValue?: string) {
  const values = new Map<string, string>();
  if (initialValue) values.set(anonymousPreferencesStorageKey, initialValue);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("anonymous preference storage", () => {
  it("round-trips valid versioned preferences", () => {
    const storage = memoryStorage();
    const preferences = { version: 2 as const, journeyStage: "preparing" as const, onboardingCompleted: true };

    writeAnonymousPreferences(preferences, storage);

    expect(readAnonymousPreferences(storage)).toEqual(preferences);
  });

  it("falls back safely when stored data is invalid", () => {
    expect(readAnonymousPreferences(memoryStorage("not-json"))).toEqual({
      version: 2,
      onboardingCompleted: false,
    });
  });
});
