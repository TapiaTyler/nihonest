import { beforeEach, describe, expect, it } from "vitest";
import { getViewModeSnapshot, readViewMode, viewModeStorageKey, writeViewMode } from "./view-mode";

describe("view mode storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("defaults to cards and stores only a choice of list", () => {
    expect(readViewMode("explore")).toBe("cards");
    writeViewMode("explore", "list");
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBe("list");
    expect(getViewModeSnapshot("explore")).toBe("list");
    writeViewMode("explore", "cards");
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBeNull();
    expect(readViewMode("explore")).toBe("cards");
  });

  it("remembers each page separately", () => {
    writeViewMode("residence-statuses", "list");
    expect(readViewMode("residence-statuses")).toBe("list");
    expect(readViewMode("explore")).toBe("cards");
  });

  it("treats unknown stored values as cards", () => {
    window.localStorage.setItem(viewModeStorageKey("explore"), "table");
    expect(readViewMode("explore")).toBe("cards");
  });
});
