import { describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { articleGroupSchema } from "@/domain/discovery/discovery";
import { faqSchema } from "@/domain/faq/faq";
import { glossaryTerms } from "@/data/glossary";
import {
  defaultKnowledgebaseSearchFilters,
  buildKnowledgebaseSearchIndex,
  hasActiveKnowledgebaseSearch,
  searchKnowledgebaseIndex,
  searchKnowledgebase,
} from "./knowledgebase-search";

const bankArticle = articleMetadataSchema.parse({
  id: "opening-bank-account",
  slug: "opening-bank-account",
  title: "Opening a bank account",
  description: "Prepare identity and address records for bank screening.",
  journeyStageIds: ["recently-arrived"],
  topicIds: ["banking"],
  audienceIds: ["newcomer"],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  status: "needs-review",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

const arrivalGroup = articleGroupSchema.parse({
  id: "arrival-essentials",
  title: "Arrival essentials",
  description: "Set up housing, banking, and other essentials after moving.",
  articleIds: [bankArticle.id],
});

describe("knowledgebase search", () => {
  it("searches articles and glossary terms through one boundary", () => {
    const articleResults = searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
      ...defaultKnowledgebaseSearchFilters,
      query: "bank account",
    });
    const glossaryResults = searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
      ...defaultKnowledgebaseSearchFilters,
      query: "juminhyo",
    });

    expect(articleResults.map(({ kind }) => kind)).toEqual(["group", "article", "glossary"]);
    expect(glossaryResults[0]?.kind).toBe("glossary");
  });

  it("reuses prepared catalog text and ID lookups across queries", () => {
    const index = buildKnowledgebaseSearchIndex([arrivalGroup], [bankArticle], glossaryTerms);

    expect(index.articlesById.get(bankArticle.id)?.searchText.haystack).toContain("bank account");
    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "bank account" })).not.toEqual([]);
    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "juminhyo" })[0]?.kind).toBe("glossary");
  });

  it("combines query and structured taxonomy filters", () => {
    expect(
      searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
        ...defaultKnowledgebaseSearchFilters,
        query: "bank",
        topicId: "healthcare",
      }),
    ).toEqual([]);
  });

  it("finds articles and their groups through reviewed search aliases", () => {
    const aliasedArticle = articleMetadataSchema.parse({
      ...bankArticle,
      searchTerms: ["cash card setup"],
    });

    const results = searchKnowledgebase([arrivalGroup], [aliasedArticle], [], {
      ...defaultKnowledgebaseSearchFilters,
      query: "cash card",
    });

    expect(results.map(({ kind }) => kind)).toEqual(["group", "article"]);
  });

  it("excludes glossary results from article-only dimensions", () => {
    const results = searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
      ...defaultKnowledgebaseSearchFilters,
      audienceId: "newcomer",
    });
    expect(results.map(({ kind }) => kind)).toEqual(["group", "article"]);
  });

  it("can return only groups whose member articles match the active filters", () => {
    const results = searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
      ...defaultKnowledgebaseSearchFilters,
      kind: "group",
      topicId: "banking",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.kind).toBe("group");
  });

  it("recognizes either a query or filter as active discovery", () => {
    expect(hasActiveKnowledgebaseSearch(defaultKnowledgebaseSearchFilters)).toBe(false);
    expect(hasActiveKnowledgebaseSearch({ ...defaultKnowledgebaseSearchFilters, kind: "glossary" })).toBe(true);
  });

  it("searches the selected-language index while retaining canonical English fallback", () => {
    const translations = [{
      contentId: bankArticle.id,
      targetLocale: "ja",
      title: "銀行口座を開設する",
      description: "銀行の審査に備えて住所と本人確認書類を準備します。",
    }];
    const japaneseResults = searchKnowledgebase([arrivalGroup], [bankArticle], [], {
      ...defaultKnowledgebaseSearchFilters,
      query: "銀行口座",
    }, [], { locale: "ja", articleTranslations: translations });
    const englishFallbackResults = searchKnowledgebase([arrivalGroup], [bankArticle], [], {
      ...defaultKnowledgebaseSearchFilters,
      query: "bank account",
    }, [], { locale: "ja", articleTranslations: translations });

    expect(japaneseResults.map(({ kind }) => kind)).toEqual(["group", "article"]);
    expect(englishFallbackResults.map(({ kind }) => kind)).toEqual(["group", "article"]);
  });

  it("indexes localized group fields while retaining canonical English fallback", () => {
    const groupTranslations = [{
      contentId: arrivalGroup.id,
      targetLocale: "ja",
      title: "来日後の生活手続き",
      description: "住居、銀行、その他の来日後の手続きを確認します。",
    }];
    const index = buildKnowledgebaseSearchIndex([arrivalGroup], [bankArticle], [], [], {
      locale: "ja",
      groupTranslations,
    });

    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "生活手続き" })[0]?.kind).toBe("group");
    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "arrival essentials" })[0]?.kind).toBe("group");
    expect(index.translationsByGroupId.get(arrivalGroup.id)?.title).toBe("来日後の生活手続き");
  });

  it("indexes localized FAQ fields while retaining canonical English fallback", () => {
    const localizedFaq = faqSchema.parse({
      id: "phone-or-bank-first",
      slug: "phone-or-bank-first",
      question: "Should I get a Japanese phone number or bank account first?",
      summary: "Provider requirements vary.",
      primaryBrowseGroupId: "arrival-and-daily-life",
      relatedArticleIds: [bankArticle.id],
      status: "needs-review",
      createdAt: "2026-09-06",
      updatedAt: "2026-09-06",
    });
    const faqTranslations = [{
      contentId: localizedFaq.id,
      targetLocale: "ja",
      question: "日本の電話番号と銀行口座は、どちらを先に取得すべきですか？",
      summary: "事業者によって要件が異なります。",
    }];
    const index = buildKnowledgebaseSearchIndex([arrivalGroup], [bankArticle], [], [localizedFaq], {
      locale: "ja",
      faqTranslations,
    });

    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "電話番号" })[0]?.kind).toBe("faq");
    expect(searchKnowledgebaseIndex(index, { ...defaultKnowledgebaseSearchFilters, query: "phone number" })[0]?.kind).toBe("faq");
    expect(index.translationsByFaqId.get(localizedFaq.id)?.question).toBe(faqTranslations[0].question);
  });

  it("orders groups, articles, and glossary terms by type and then title", () => {
    const secondArticle = articleMetadataSchema.parse({
      ...bankArticle,
      id: "another-bank-guide",
      slug: "another-bank-guide",
      title: "Another bank guide",
    });
    const secondGroup = articleGroupSchema.parse({
      id: "banking-basics",
      title: "Banking basics",
      description: "Bank account guidance.",
      articleIds: [secondArticle.id],
    });

    const results = searchKnowledgebase(
      [secondGroup, arrivalGroup],
      [bankArticle, secondArticle],
      glossaryTerms,
      { ...defaultKnowledgebaseSearchFilters, query: "bank" },
    );

    expect(results.map((result) => result.kind)).toEqual(["group", "group", "article", "article", "glossary"]);
    expect(results.map((result) => result.kind === "group"
      ? result.group.title
      : result.kind === "faq"
        ? result.faq.question
        : result.kind === "article"
          ? result.article.title
          : result.term.englishName)).toEqual([
      "Arrival essentials",
      "Banking basics",
      "Another bank guide",
      "Opening a bank account",
      "Ordinary Deposit Account",
    ]);
  });
});
