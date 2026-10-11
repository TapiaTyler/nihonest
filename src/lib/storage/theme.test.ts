import { beforeEach, describe, expect, it } from "vitest";
import { readThemePreference, themeStorageKey, writeThemePreference } from "./theme";

describe("theme preference storage", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to the system setting", () => {
    expect(readThemePreference()).toBe("system");
  });

  it("stores a manual choice and clears the key when set back to system", () => {
    writeThemePreference("dark");
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
    expect(readThemePreference()).toBe("dark");

    writeThemePreference("system");
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
    expect(readThemePreference()).toBe("system");
  });

  it("ignores a value it does not recognise", () => {
    localStorage.setItem(themeStorageKey, "sepia");
    expect(readThemePreference()).toBe("system");
  });
});
