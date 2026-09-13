import { describe, expect, it } from "vitest";
import type { ArticleMetadata } from "@/domain/article/article";
import {
  anonymousPreferencesSchema,
  recommendationsForStage,
} from "./preferences";

const article = (id: string, journeyStageIds: ArticleMetadata["journeyStageIds"]): ArticleMetadata => ({
  id,
  title: id,
  description: id,
  slug: id,
  journeyStageIds,
  topicIds: ["daily-life"],
  audienceIds: [],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  sourceIds: [],
  termIds: [],
  searchTerms: [],
  residenceStatusIds: [],
  relationships: [],
  status: "draft",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

describe("anonymous personalization", () => {
  it("rejects invalid or unversioned preferences", () => {
    expect(anonymousPreferencesSchema.safeParse({ journeyStage: "planning" }).success).toBe(false);
    expect(anonymousPreferencesSchema.safeParse({ version: 2, journeyStage: "unknown", onboardingCompleted: true }).success).toBe(false);
  });

  it("returns curated recommendations only when their metadata matches the stage", () => {
    const recommendations = recommendationsForStage("recently-arrived", [
      article("documents-received-when-entering-japan", ["recently-arrived"]),
      article("registering-your-address-after-arrival", ["planning"]),
      article("getting-a-phone-number-in-japan", ["recently-arrived"]),
    ]);

    expect(recommendations.map(({ id }) => id)).toEqual([
      "documents-received-when-entering-japan",
      "getting-a-phone-number-in-japan",
    ]);
  });
});
