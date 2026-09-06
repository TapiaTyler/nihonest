import { describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { articleGroupSchema } from "@/domain/discovery/discovery";
import { glossaryTerms } from "@/data/glossary";
import {
  defaultKnowledgebaseSearchFilters,
  hasActiveKnowledgebaseSearch,
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

  it("combines query and structured taxonomy filters", () => {
    expect(
      searchKnowledgebase([arrivalGroup], [bankArticle], glossaryTerms, {
        ...defaultKnowledgebaseSearchFilters,
        query: "bank",
        topicId: "healthcare",
      }),
    ).toEqual([]);
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
    expect(results.map((result) => result.kind === "group" ? result.group.title : result.kind === "article" ? result.article.title : result.term.englishName)).toEqual([
      "Arrival essentials",
      "Banking basics",
      "Another bank guide",
      "Opening a bank account",
      "Ordinary Deposit Account",
    ]);
  });
});
