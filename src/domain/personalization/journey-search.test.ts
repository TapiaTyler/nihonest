import { describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import type { ArticleMetadata } from "@/domain/article/article";
import { routeOptionsForJourney, searchFocusedGuides, searchJourneyOptions } from "./journey-search";

describe("journey onboarding search", () => {
  const article = (id: string, title: string, description = `${title} guidance`): ArticleMetadata => ({
    id,
    title,
    description,
    slug: id,
    journeyStageIds: ["planning"],
    topicIds: ["immigration"],
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
  const articles = [
    article("business-manager-status", "Business Manager status"),
    article("startup-visa", "Start-up pathway", "A transition toward Business Manager status"),
    article("short-term-study-in-japan", "Short-term study in Japan"),
    article("student-visa-and-certificate-of-eligibility", "Student visa and Certificate of Eligibility"),
    article("technical-intern-training-status", "Technical Intern Training status"),
    article("employment-for-skill-development-system", "Employment for Skill Development"),
  ];

  it("finds a journey through the title of a specific visa route", () => {
    const results = searchJourneyOptions("Business Manager", guidedJourneys, articleGroups, articles);

    expect(results.map(({ journey }) => journey.id)).toContain("founder-or-highly-skilled-moving-to-japan");
    const founderResult = results.find(({ journey }) => journey.id === "founder-or-highly-skilled-moving-to-japan");
    expect(founderResult?.matchingArticles.map(({ id }) => id)).toEqual([
      "business-manager-status",
      "startup-visa",
    ]);
  });

  it("exposes only explicit route options as specific route choices", () => {
    const journey = guidedJourneys.find(({ id }) => id === "student-moving-to-japan");

    expect(routeOptionsForJourney(journey, articles).map(({ article }) => article.id)).toEqual([
      "short-term-study-in-japan",
      "student-visa-and-certificate-of-eligibility",
    ]);
  });

  it("finds the dedicated workforce-development journey through successor terminology", () => {
    const results = searchJourneyOptions("skill development", guidedJourneys, articleGroups, articles);

    expect(results.map(({ journey }) => journey.id)).toContain("workforce-development-in-japan");
  });

  it("finds a focused guide even when no guided journey contains it", () => {
    const diplomatic = article("diplomatic-visa", "Diplomatic visa");

    expect(searchFocusedGuides("diplomatic", [...articles, diplomatic]).map(({ id }) => id)).toEqual([
      "diplomatic-visa",
    ]);
  });
});
