import { describe, expect, it } from "vitest";
import { getAdministrativeGeography, legacyGeographyIds } from "@/data/geography";
import { guidedJourneys } from "@/data/discovery";
import { getJourneyRouteById } from "@/domain/discovery/discovery";
import { getArticleJourneyData } from "@/lib/content/article-journey-data";
import { getAllArticles, getArticleById, getGuidedJourneysByArticleIds, getJourneySteps } from "@/lib/content/articles";
import { getLocalLocationAliases, getSelectableLocalGuidanceLocations } from "@/lib/content/local-guidance";
import { resolveArticleJourneyContext } from "./article-journey";
import { journeyCandidateArticleIds, resolveJourneyViewSteps } from "./journey-context";
import { articleReturnDestination, singleQueryValue, statusReturnDestination } from "./query-values";

const query = (value: string) => new URLSearchParams(value);

describe("query values on prebuilt pages", () => {
  it("counts a parameter only when it appears once, like the request-time pages", () => {
    expect(singleQueryValue(query("journey=a"), "journey")).toBe("a");
    expect(singleQueryValue(query(""), "journey")).toBeUndefined();
    expect(singleQueryValue(query("journey=a&journey=b"), "journey")).toBeUndefined();
    expect(singleQueryValue(query("journey="), "journey")).toBe("");
  });

  it("validates return destinations", () => {
    expect(articleReturnDestination("/roadmap")).toBe("/roadmap");
    expect(articleReturnDestination("/my-journey")).toBe("/my-journey");
    for (const unsafe of ["https://example.com", "//example.com", "/saved", undefined]) expect(articleReturnDestination(unsafe)).toBeUndefined();
    expect(statusReturnDestination("/saved")).toBe("/saved");
    expect(statusReturnDestination("/residence-statuses?category=work")).toBe("/residence-statuses?category=work");
    for (const unsafe of ["https://example.com", "//example.com", "/residence-statuses-evil", "/articles/x", undefined]) {
      expect(statusReturnDestination(unsafe)).toBe("/residence-statuses");
    }
  });
});

describe("local location aliases", () => {
  const locations = getSelectableLocalGuidanceLocations();
  const aliases = getLocalLocationAliases(locations);
  /** The article page's former request-time rule. */
  const serverRule = (requested: string) => locations.find(({ geography }) => (
    getAdministrativeGeography(geography.id)?.id === getAdministrativeGeography(requested)?.id
  ))?.geography.id;

  it("matches the former server rule for every location ID, canonical ID, legacy alias, and unknown value", () => {
    const candidates = new Set<string>([...Object.keys(legacyGeographyIds), "jp-99999", "", "tokyo ", "__proto__", "constructor"]);
    for (const { geography } of locations) {
      candidates.add(geography.id);
      candidates.add(getAdministrativeGeography(geography.id)?.id ?? geography.id);
    }
    for (const requested of candidates) {
      const expected = requested ? serverRule(requested) : undefined;
      expect(Object.hasOwn(aliases, requested) ? aliases[requested] : undefined, requested).toBe(expected);
    }
    expect(aliases.shinjuku).toBe(serverRule("shinjuku"));
    expect(aliases.shinjuku).toBeDefined();
  });
});

describe("article journey context", () => {
  it("resolves every journey and route exactly as the request-time page did", () => {
    let contexts = 0;
    for (const { metadata } of getAllArticles()) {
      const data = getArticleJourneyData(metadata.id);
      for (const journey of getGuidedJourneysByArticleIds([metadata.id])) {
        for (const routeId of [undefined, "unknown-route", ...journey.routes.map(({ id }) => id)]) {
          const route = getJourneyRouteById(journey, routeId);
          const steps = getJourneySteps(journey.id, route?.id);
          const index = steps.findIndex(({ article }) => article.metadata.id === metadata.id);
          const resolved = resolveArticleJourneyContext(data, journey.id, routeId);
          if (index < 0) {
            expect(resolved).toBeUndefined();
            continue;
          }
          contexts++;
          expect(resolved?.route?.id).toBe(route?.id);
          expect(resolved?.index).toBe(index);
          expect(resolved?.steps.map((articleIndex) => data.articles[articleIndex].slug)).toEqual(steps.map(({ article }) => article.metadata.slug));
          expect(resolved?.steps.map((articleIndex) => resolved.journey.conditions[articleIndex]?.english))
            .toEqual(steps.map(({ step }) => (step.requiredness === "conditional" ? step.conditionLabel ?? "" : undefined)));
        }
      }
      expect(resolveArticleJourneyContext(data, "not-a-journey", undefined)).toBeUndefined();
      expect(resolveArticleJourneyContext(data, undefined, undefined)).toBeUndefined();
    }
    expect(contexts).toBeGreaterThan(0);
  });

  it("ignores journeys that do not include the article", () => {
    const [first] = getAllArticles();
    const unrelated = guidedJourneys.find((journey) => !getGuidedJourneysByArticleIds([first.metadata.id]).some(({ id }) => id === journey.id));
    expect(unrelated).toBeDefined();
    expect(resolveArticleJourneyContext(getArticleJourneyData(first.metadata.id), unrelated!.id, undefined)).toBeUndefined();
  });
});

describe("journey page steps", () => {
  it("match getJourneySteps for every journey and route", () => {
    for (const journey of guidedJourneys) {
      const articles = journeyCandidateArticleIds(journey).flatMap((id) => {
        const article = getArticleById(id);
        return article ? [article.metadata] : [];
      });
      for (const routeId of [undefined, ...journey.routes.map(({ id }) => id)]) {
        expect(resolveJourneyViewSteps(journey, routeId, articles).map(({ step, article }) => [step.articleId, step.requiredness, article.id]))
          .toEqual(getJourneySteps(journey.id, routeId).map(({ step, article }) => [step.articleId, step.requiredness, article.metadata.id]));
      }
    }
  });
});
