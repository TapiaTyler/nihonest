import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { japaneseArticleGroupTranslations } from "@/data/translations/ja/article-group-translations";
import { japaneseJourneyTranslations } from "@/data/translations/ja/journey-translations";
import { bundledGroupSourceFields, bundledJourneySourceFields, bundledJourneyTranslationSchema,
  parseBundledJourneyTranslation, validateBundledJourneyTranslation } from "@/domain/content-bundle/discovery-payloads";
import { localizeJourney } from "@/domain/localization/journey-presentation";
import { resolveJourneySteps } from "@/domain/discovery/discovery";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { getJourneyTranslations } from "./translations";
import { selectCurrentBundleTranslations } from "./content-bundle-translations";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});
describe("localized discovery bundle", () => {
  it("preserves canonical registration order, records and complete artifact provenance", () => {
    expect(JSON.parse(bundle.files.get("article-groups.en.json")!)).toEqual(articleGroups);
    expect(JSON.parse(bundle.files.get("journeys.en.json")!)).toEqual(guidedJourneys);
    const families = [
      { path: "article-group-translations.ja.json", artifacts: japaneseArticleGroupTranslations,
        revisions: new Map(articleGroups.map((record) => [record.id, createTranslationSourceRevision(bundledGroupSourceFields(record))])) },
      { path: "journey-translations.ja.json", artifacts: japaneseJourneyTranslations,
        revisions: new Map(guidedJourneys.map((record) => [record.id, createTranslationSourceRevision(bundledJourneySourceFields(record))])) },
    ];
    for (const family of families) {
      expect(JSON.parse(bundle.files.get(family.path)!)).toEqual(family.artifacts.filter((artifact) => artifact.availability === "active"
        && artifact.targetLocale === "ja" && family.revisions.get(artifact.contentId) === artifact.sourceRevision));
    }
  });
  it("parses journey presentation like the existing web selector", () => {
    const artifacts = JSON.parse(bundle.files.get("journey-translations.ja.json")!);
    expect(artifacts.map(parseBundledJourneyTranslation)).toEqual(getJourneyTranslations());
  });
  it("preserves route/article/phase/step relationships and route-choice behavior after localization", () => {
    const artifacts = JSON.parse(bundle.files.get("journey-translations.ja.json")!);
    for (const artifact of artifacts) {
      const canonical = guidedJourneys.find(({ id }) => id === artifact.contentId)!;
      const before = structuredClone(canonical);
      const localized = localizeJourney(canonical, parseBundledJourneyTranslation(artifact));
      expect(localized.groupId).toBe(canonical.groupId);
      expect(localized.routes.map(({ id, articleId }) => ({ id, articleId })))
        .toEqual(canonical.routes.map(({ id, articleId }) => ({ id, articleId })));
      for (const routeId of [undefined, ...canonical.routes.map(({ id }) => id)]) {
        const relationship = ({ phaseId, articleId, requiredness, isRouteSelection }: ReturnType<typeof resolveJourneySteps>[number]) =>
          ({ phaseId, articleId, requiredness, isRouteSelection });
        expect(resolveJourneySteps(localized, routeId).map(relationship)).toEqual(resolveJourneySteps(canonical, routeId).map(relationship));
      }
      expect(canonical).toEqual(before);
    }
  });
  it("omits stale/missing overlays and keeps partial route/phase/condition text in English", () => {
    const original = japaneseJourneyTranslations[0]!;
    const journey = guidedJourneys.find(({ id }) => id === original.contentId)!;
    const revisions = new Map([[journey.id, createTranslationSourceRevision(bundledJourneySourceFields(journey))]]);
    expect(selectCurrentBundleTranslations([{ ...original, sourceRevision: "0".repeat(64) }], revisions)).toEqual([]);
    expect(selectCurrentBundleTranslations([original], new Map())).toEqual([]);
    const partial = { ...original, fields: { ...original.fields, routes: "[]", phases: "[]", conditions: "[]" } };
    const localized = localizeJourney(journey, parseBundledJourneyTranslation(partial));
    expect(localized.routes).toEqual(journey.routes);
    expect(localized.phases).toEqual(journey.phases);
  });
  it.each(["routes", "phases", "conditions"])("rejects invalid %s arrays and injected relationship fields", (field) => {
    const original = japaneseJourneyTranslations.find((artifact) => JSON.parse(artifact.fields[field]!).length > 0)!;
    const entry = JSON.parse(original.fields[field]!)[0];
    for (const value of ["{", "{}", JSON.stringify([entry, entry]), JSON.stringify([{ ...entry, articleId: "injected-target" }])]) {
      expect(() => bundledJourneyTranslationSchema.parse({ ...original, fields: { ...original.fields, [field]: value } })).toThrow();
    }
  });
  it.each(["routes", "phases", "conditions"])("rejects unknown %s identities", (field) => {
    const original = japaneseJourneyTranslations.find((artifact) => JSON.parse(artifact.fields[field]!).length > 0)!;
    const journey = guidedJourneys.find(({ id }) => id === original.contentId)!;
    const entries = JSON.parse(original.fields[field]!);
    entries[0].id = "missing-target";
    expect(() => validateBundledJourneyTranslation(journey, { ...original, fields: { ...original.fields, [field]: JSON.stringify(entries) } }))
      .toThrow("unknown route, phase or condition");
  });
  it("rejects translated descriptions for canonical phases without a description", () => {
    const original = japaneseJourneyTranslations[0]!;
    const journey = structuredClone(guidedJourneys.find(({ id }) => id === original.contentId)!);
    const phase = journey.phases[0]!;
    delete phase.description;
    const overlay = { ...original, fields: { ...original.fields,
      phases: JSON.stringify([{ id: phase.id, title: "Translated phase", description: "Unexpected description" }]) } };
    expect(() => validateBundledJourneyTranslation(journey, overlay)).toThrow("missing canonical phase description");
  });
});
