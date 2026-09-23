import { describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import type { ArticleMetadata } from "@/domain/article/article";
import { routeOptionsForJourney, searchFocusedGuides, searchJourneyOptions } from "./journey-search";
import { getJourneyTranslations } from "@/lib/content/translations";
import { localizeJourney } from "@/domain/localization/journey-presentation";

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

  it("searches a localized journey in Japanese while retaining canonical English fallback", () => {
    const translations = getJourneyTranslations();
    const localizedJourneys = guidedJourneys.map((journey) => localizeJourney(
      journey,
      translations.find(({ contentId }) => contentId === journey.id),
    ));

    expect(searchJourneyOptions("短期留学", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("student-moving-to-japan");
    expect(searchJourneyOptions("技術・人文知識", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("professional-worker-moving-to-japan");
    expect(searchJourneyOptions("家族滞在", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("joining-family-in-japan");
    expect(searchJourneyOptions("高度専門職", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("founder-or-highly-skilled-moving-to-japan");
    expect(searchJourneyOptions("育成就労", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("workforce-development-in-japan");
    expect(searchJourneyOptions("ワーキング・ホリデー", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("working-holiday-in-japan");
    expect(searchJourneyOptions("デジタルノマド", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("digital-nomad-in-japan");
    expect(searchJourneyOptions("興行", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("skilled-or-sector-worker-moving-to-japan");
    expect(searchJourneyOptions("外国人材受入れ", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("accepting-foreign-workers");
    expect(searchJourneyOptions("副業", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("side-work-or-freelancing-while-employed");
    expect(searchJourneyOptions("未来創造人材", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("j-find-future-creation");
    expect(searchJourneyOptions("長期観光", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("long-stay-sightseeing-in-japan");
    expect(searchJourneyOptions("文化活動", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("cultural-activities-or-training-in-japan");
    expect(searchJourneyOptions("医療滞在", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("medical-visit-to-japan");
    expect(searchJourneyOptions("外交 公用", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("diplomatic-or-official-assignment");
    expect(searchJourneyOptions("永住許可申請", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("preparing-for-permanent-residence");
    expect(searchJourneyOptions("継続的な責任", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("ongoing-resident-responsibilities");
    expect(searchJourneyOptions("雇用ライフサイクル", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("employment-lifecycle-in-japan");
    expect(searchJourneyOptions("Student", localizedJourneys, articleGroups, articles, { fallbackJourneys: guidedJourneys })
      .map(({ journey }) => journey.id)).toContain("student-moving-to-japan");
  });

  it("finds a focused guide even when no guided journey contains it", () => {
    const diplomatic = article("diplomatic-visa", "Diplomatic visa");

    expect(searchFocusedGuides("diplomatic", [...articles, diplomatic]).map(({ id }) => id)).toEqual([
      "diplomatic-visa",
    ]);
  });
});
