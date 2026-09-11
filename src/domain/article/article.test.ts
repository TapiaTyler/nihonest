import { describe, expect, it } from "vitest";
import { articleMetadataSchema, validateArticleCollection } from "./article";
import { officialSourceSchema } from "@/domain/source/source";

const validArticle = articleMetadataSchema.parse({
  id: "sample-article",
  title: "Sample article",
  description: "A clearly identified sample.",
  slug: "sample-article",
  journeyStageIds: ["planning"],
  topicIds: ["daily-life"],
  audienceIds: ["newcomer"],
  geographicScopes: ["national"],
  importance: "informational",
  contentType: "guide",
  sourceIds: [],
  residenceStatusIds: [],
  relationships: [],
  status: "draft",
  createdAt: "2026-09-05",
  updatedAt: "2026-09-05",
});

describe("article metadata", () => {
  it("requires verified content to carry a current human review date", () => {
    expect(() => articleMetadataSchema.parse({ ...validArticle, status: "verified" })).toThrow("human review date");
    expect(() => articleMetadataSchema.parse({ ...validArticle, status: "verified", lastReviewedAt: "2026-09-04" })).toThrow("cannot precede");
  });

  it("rejects values outside the controlled taxonomy", () => {
    expect(() =>
      articleMetadataSchema.parse({
        ...validArticle,
        topicIds: ["miscellaneous"],
      }),
    ).toThrow();
  });

  it("rejects relationships to unknown articles", () => {
    expect(() =>
      validateArticleCollection(
        [
          {
            ...validArticle,
            relationships: [{ type: "related", articleId: "missing-article" }],
          },
        ],
        [
          officialSourceSchema.parse({
            id: "official-source",
            organization: "Example authority",
            title: "Example source",
            url: "https://example.com/",
            authorityLevel: "public-institution",
            language: "en",
          }),
        ],
      ),
    ).toThrow('references unknown article "missing-article"');
  });

  it("rejects unknown glossary term references", () => {
    expect(() =>
      validateArticleCollection([{ ...validArticle, termIds: ["missing-term"] }], [], [], []),
    ).toThrow('references unknown glossary term "missing-term"');
  });
});
