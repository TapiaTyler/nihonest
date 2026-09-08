import { describe, expect, it } from "vitest";
import { updateSavedContent, visibleSavedContent } from "./saved-content";

describe("saved content contracts", () => {
  it("keeps a removal record while omitting it from the visible saved list", () => {
    const saved = updateSavedContent([], { kind: "article", contentId: "opening-a-bank-account" }, "saved", "2026-09-07T12:00:00.000Z");
    const removed = updateSavedContent(saved, { kind: "article", contentId: "opening-a-bank-account" }, "removed", "2026-09-07T12:05:00.000Z");

    expect(removed).toHaveLength(1);
    expect(removed[0].state).toBe("removed");
    expect(visibleSavedContent(removed)).toEqual([]);
  });
});

