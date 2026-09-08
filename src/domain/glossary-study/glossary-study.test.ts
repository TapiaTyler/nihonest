import { describe, expect, it } from "vitest";
import { createGlossaryStudyProgress, recordGlossaryReview } from "./glossary-study";

describe("glossary study contracts", () => {
  it("uses a small review-state model without scheduling language lessons", () => {
    const initial = createGlossaryStudyProgress("zairyu-card", "2026-09-07T12:00:00.000Z");
    const learning = recordGlossaryReview(initial, "again", "2026-09-07T12:05:00.000Z");
    const reviewed = recordGlossaryReview(learning, "understood", "2026-09-07T12:10:00.000Z");

    expect(initial.state).toBe("new");
    expect(learning.state).toBe("learning");
    expect(reviewed).toMatchObject({ state: "reviewed", reviewCount: 2 });
  });
});

