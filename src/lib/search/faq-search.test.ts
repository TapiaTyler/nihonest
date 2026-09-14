import { describe, expect, it } from "vitest";
import { faqSchema } from "@/domain/faq/faq";
import { buildFaqSearchIndex, searchFaqIndex, searchFaqs } from "./faq-search";

const faq = faqSchema.parse({
  id: "address-bank-loop",
  slug: "address-bank-loop",
  question: "How do I handle the address and bank-account loop?",
  summary: "Follow a practical arrival sequence.",
  primaryBrowseGroupId: "arrival-and-daily-life",
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

  it("ignores grammatical question words without relaxing substantive terms", () => {
    const freelanceFaq = faqSchema.parse({
      ...faq,
      id: "freelance-work",
      slug: "freelance-work",
      question: "Can I freelance while working in Japan?",
      summary: "Check the proposed activity against the current status.",
      searchTerms: ["work visa"],
    });

    expect(searchFaqs([freelanceFaq], "Can I freelance on my work visa?")).toEqual([freelanceFaq]);
    expect(searchFaqs([freelanceFaq], "freelancing")).toEqual([freelanceFaq]);
    expect(searchFaqs([freelanceFaq], "freelance pension")).toEqual([]);
  });

  it("reuses one prepared index for different natural-language questions", () => {
    const freelanceFaq = faqSchema.parse({
      ...faq,
      id: "freelance-work",
      slug: "freelance-work",
      question: "Can I freelance while working in Japan?",
      searchTerms: ["work visa"],
    });
    const taxFaq = faqSchema.parse({
      ...faq,
      id: "file-taxes",
      slug: "file-taxes",
      question: "Where do I file an income tax return?",
      searchTerms: ["file taxes", "tax office"],
    });
    const index = buildFaqSearchIndex([freelanceFaq, taxFaq]);

    expect(searchFaqIndex(index, "Can I do freelancing on my visa?")[0]?.id).toBe("freelance-work");
    expect(searchFaqIndex(index, "where can i file taxes?")[0]?.id).toBe("file-taxes");
  });
});
