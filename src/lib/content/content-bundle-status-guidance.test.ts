import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseResidenceStatusGuidanceTranslations } from "@/data/translations/ja/residence-status-guidance-translations";
import { applyGuidanceText, extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { bundledStatusGuidanceTranslationSchema } from "@/domain/content-bundle/status-guidance-payload";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { buildContentBundle, type ContentBundle } from "./content-bundle";
import { selectCurrentStatusGuidanceTranslations } from "./content-bundle-translations";

let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});

describe("structured residence-status guidance bundle", () => {
  it("preserves every canonical status and complete current guidance artifact in registration order", () => {
    const statuses = JSON.parse(bundle.files.get("residence-statuses.en.json")!);
    expect(statuses).toEqual(residenceStatuses);
    const expected = japaneseResidenceStatusGuidanceTranslations.filter((artifact) => {
      const guidance = residenceStatuses.find(({ id }) => id === artifact.contentId)?.structuredGuidance;
      return guidance && artifact.availability === "active" && artifact.targetLocale === "ja"
        && artifact.sourceRevision === createTranslationSourceRevision(extractGuidanceText(guidance));
    });
    expect(JSON.parse(bundle.files.get("residence-status-guidance-translations.ja.json")!)).toEqual(expected);
  });
  it("omits missing, unstructured, explicitly stale and source-changed targets without mutating them", () => {
    const artifact = japaneseResidenceStatusGuidanceTranslations[0]!;
    const status = residenceStatuses.find(({ id }) => id === artifact.contentId)!;
    const before = structuredClone(status);
    expect(selectCurrentStatusGuidanceTranslations([artifact], [])).toEqual([]);
    expect(selectCurrentStatusGuidanceTranslations([artifact], [{ id: status.id }])).toEqual([]);
    expect(selectCurrentStatusGuidanceTranslations([{ ...artifact, availability: "stale" }], [status])).toEqual([]);
    const changed = structuredClone(status);
    changed.structuredGuidance!.routeKindLabel += " changed";
    expect(selectCurrentStatusGuidanceTranslations([artifact], [changed])).toEqual([]);
    expect(status).toEqual(before);
  });
  it("retains current partial overlays and English text for unprovided paths", () => {
    const artifact = japaneseResidenceStatusGuidanceTranslations[0]!;
    const status = residenceStatuses.find(({ id }) => id === artifact.contentId)!;
    const partial = { ...artifact, fields: { "route-kind-label": artifact.fields["route-kind-label"]! } };
    expect(selectCurrentStatusGuidanceTranslations([partial], [status])).toEqual([partial]);
    const guidance = applyGuidanceText(status.structuredGuidance!, partial.fields);
    expect(guidance.routeKindLabel).toBe(partial.fields["route-kind-label"]);
    expect(guidance.workAuthorization).toEqual(status.structuredGuidance!.workAuthorization);
  });
  it("localizes reader text without altering source assertions, IDs or research/authorization metadata", () => {
    const overlays = selectCurrentStatusGuidanceTranslations(japaneseResidenceStatusGuidanceTranslations, residenceStatuses);
    for (const artifact of overlays) {
      const canonical = residenceStatuses.find(({ id }) => id === artifact.contentId)!.structuredGuidance!;
      const before = structuredClone(canonical);
      const localized = applyGuidanceText(canonical, artifact.fields);
      expect(localized.sourceAssertions).toEqual(canonical.sourceAssertions);
      expect(localized.searchTerms).toEqual(canonical.searchTerms);
      expect(localized.researchState).toBe(canonical.researchState);
      expect(localized.routeKind).toBe(canonical.routeKind);
      expect(localized.workAuthorization.mode).toBe(canonical.workAuthorization.mode);
      expect(localized.qualificationPathways.map(({ id, sourceIds }) => ({ id, sourceIds })))
        .toEqual(canonical.qualificationPathways.map(({ id, sourceIds }) => ({ id, sourceIds })));
      expect(canonical).toEqual(before);
      const original = japaneseResidenceStatusGuidanceTranslations.find(({ contentId }) => contentId === artifact.contentId)!;
      expect(artifact.reviewState).toBe(original.reviewState);
      expect(artifact.reviewedAt).toBe(original.reviewedAt);
    }
  });
  it("rejects wrong kinds, locales, availability and empty supplied text", () => {
    const original = japaneseResidenceStatusGuidanceTranslations[0]!;
    for (const mutation of [{ contentKind: "article" }, { targetLocale: "fr" }, { availability: "stale" }, { fields: { "route-kind-label": "" } }]) {
      expect(() => bundledStatusGuidanceTranslationSchema.parse({ ...original, ...mutation })).toThrow();
    }
  });
});
