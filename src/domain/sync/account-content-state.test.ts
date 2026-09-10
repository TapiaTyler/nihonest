import { describe, expect, it } from "vitest";
import { emptyAccountContentState, mergeAccountContentState, type AccountContentState } from "./account-content-state";

describe("account content state merging", () => {
  it("merges each record family by timestamp and preserves equal-time removals", () => {
    const deviceState: AccountContentState = {
      ...emptyAccountContentState,
      savedContent: [{ kind: "article", contentId: "banking", state: "removed", updatedAt: "2026-09-08T12:00:00.000Z" }],
      glossaryProgress: [{ termId: "zairyu-card", state: "reviewed", reviewCount: 2, updatedAt: "2026-09-08T13:00:00.000Z", lastReviewedAt: "2026-09-08T13:00:00.000Z" }],
      checklistProgress: [{ checklistId: "register-address", state: "in-progress", updatedAt: "2026-09-08T11:00:00.000Z" }],
    };
    const accountState: AccountContentState = {
      ...emptyAccountContentState,
      savedContent: [{ kind: "article", contentId: "banking", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" }],
      glossaryProgress: [{ termId: "zairyu-card", state: "learning", reviewCount: 1, updatedAt: "2026-09-08T12:00:00.000Z", lastReviewedAt: "2026-09-08T12:00:00.000Z" }],
      checklistProgress: [{ checklistId: "register-address", state: "complete", updatedAt: "2026-09-08T14:00:00.000Z", completedAt: "2026-09-08T14:00:00.000Z" }],
    };

    expect(mergeAccountContentState(deviceState, accountState)).toEqual({
      savedContent: deviceState.savedContent,
      glossaryProgress: deviceState.glossaryProgress,
      checklistProgress: accountState.checklistProgress,
    });
  });
});
