import { describe, expect, it } from "vitest";
import {
  accountProfileSchema,
  accountRowToAnonymousPreferences,
  anonymousPreferencesToAccountRow,
} from "./account";

const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("account domain", () => {
  it("round-trips approved anonymous preferences without adding personal data", () => {
    const preferences = {
      version: 2 as const,
      journeyStage: "preparing" as const,
      journeyId: "student-moving-to-japan",
      routeId: "student-status",
      focusedArticleId: "student-visa-and-certificate-of-eligibility",
      onboardingCompleted: true,
    };

    const row = anonymousPreferencesToAccountRow(userId, preferences);
    expect(accountRowToAnonymousPreferences(row)).toEqual(preferences);
  });

  it("normalizes a blank optional display name and rejects excessive profile data", () => {
    expect(accountProfileSchema.parse({ displayName: "  " })).toEqual({ displayName: "" });
    expect(() => accountProfileSchema.parse({ displayName: "a".repeat(81) })).toThrow();
  });
});
