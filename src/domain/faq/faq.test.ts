import { describe, expect, it } from "vitest";
import { faqSchema, validateFaqCollection } from "./faq";

const faq = faqSchema.parse({
  id: "example-question",
  slug: "example-question",
  question: "What should I read?",
  summary: "Start with the related guide.",
  primaryBrowseGroupId: "immigration-and-entry",
  relatedArticleIds: ["guide"],
  status: "draft",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

const targets = {
  articleIds: ["guide"],
  groupIds: [],
  journeyIds: [],
  glossaryTermIds: [],
  residenceStatusIds: [],
};

describe("FAQ model", () => {
  it("requires verified questions to carry a current human review date", () => {
    expect(() => faqSchema.parse({ ...faq, status: "verified" })).toThrow("human review date");
  });

  it("requires a canonical target", () => {
    expect(() => faqSchema.parse({ ...faq, relatedArticleIds: [] })).toThrow();
  });

  it("validates linked target IDs", () => {
    expect(() => validateFaqCollection([faq], targets)).not.toThrow();
    expect(() => validateFaqCollection([{ ...faq, relatedArticleIds: ["missing"] }], targets)).toThrow(
      'references unknown target "missing"',
    );
  });
});
