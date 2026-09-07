import { describe, expect, it } from "vitest";
import { faqSchema } from "@/domain/faq/faq";
import { searchFaqs } from "./faq-search";

const faq = faqSchema.parse({
  id: "address-bank-loop",
  slug: "address-bank-loop",
  question: "How do I handle the address and bank-account loop?",
  summary: "Follow a practical arrival sequence.",
  searchTerms: ["rent needs bank account"],
  relatedArticleIds: ["guide"],
  status: "draft",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

describe("FAQ search", () => {
  it("matches natural-language aliases that canonical titles may not contain", () => {
    expect(searchFaqs([faq], "rent needs bank")).toEqual([faq]);
  });

  it("requires every query token", () => {
    expect(searchFaqs([faq], "rent pension")).toEqual([]);
  });
});
