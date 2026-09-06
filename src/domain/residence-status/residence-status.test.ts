import { describe, expect, it } from "vitest";
import {
  residenceStatusSchema,
  validateResidenceStatusCollection,
} from "./residence-status";
import { officialSourceSchema } from "@/domain/source/source";

const validStatus = residenceStatusSchema.parse({
  id: "sample-status",
  slug: "sample-status",
  englishName: "Sample status",
  japaneseName: "サンプル",
  category: "study",
  summary: "A sample record used to test the domain model.",
  purpose: "Testing validation.",
  typicalActivities: ["A sample activity"],
  examples: [],
  considerations: ["Verify the details."],
  sourceIds: ["official-source"],
  relatedArticleIds: [],
  lastReviewedAt: "2026-09-05",
  status: "draft",
});

const validSource = officialSourceSchema.parse({
  id: "official-source",
  organization: "Example authority",
  title: "Example source",
  url: "https://example.com/",
  authorityLevel: "public-institution",
  language: "en",
});

describe("residence status domain", () => {
  it("rejects categories outside the controlled set", () => {
    expect(() => residenceStatusSchema.parse({ ...validStatus, category: "other" })).toThrow();
  });

  it("rejects unknown source relationships", () => {
    expect(() =>
      validateResidenceStatusCollection(
        [{ ...validStatus, sourceIds: ["missing-source"] }],
        [validSource],
      ),
    ).toThrow('references unknown source "missing-source"');
  });
});
