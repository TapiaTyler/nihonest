import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseFaqTranslations } from "@/data/translations/ja/faq-translations";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { bundledCatalogTranslationSchema } from "@/domain/content-bundle/catalog-translations";
import { buildContentBundle } from "./content-bundle";
import { selectCurrentBundleTranslations } from "./content-bundle-translations";

describe("catalog translation export", () => {
  it("exports registered current artifacts with their complete provenance and canonical ordering", async () => {
    const bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
    const families = [
      { path: "faq-translations.ja.json", kind: "faq" as const, artifacts: japaneseFaqTranslations,
        revisions: new Map(faqs.map((record) => [record.id, createTranslationSourceRevision(translationSourceFields.faq(record))])) },
      { path: "glossary-translations.ja.json", kind: "glossary-term" as const, artifacts: japaneseGlossaryTranslations,
        revisions: new Map(glossaryTerms.map((record) => [record.id, createTranslationSourceRevision(translationSourceFields["glossary-term"](record))])) },
      { path: "residence-status-translations.ja.json", kind: "residence-status" as const, artifacts: japaneseResidenceStatusTranslations,
        revisions: new Map(residenceStatuses.map((record) => [record.id, createTranslationSourceRevision(translationSourceFields["residence-status"](record))])) },
    ];
    expect(bundle.manifest.formatVersion).toBe(8);
    for (const family of families) {
      const emitted = JSON.parse(bundle.files.get(family.path)!);
      const expected = family.artifacts.filter((artifact) => artifact.availability === "active" && artifact.targetLocale === "ja"
        && family.revisions.get(artifact.contentId) === artifact.sourceRevision);
      expect(emitted).toEqual(expected);
      expect(() => bundledCatalogTranslationSchema(family.kind).array().parse(emitted)).not.toThrow();
      expect(emitted.every((artifact: { contentId: string }) => family.revisions.has(artifact.contentId))).toBe(true);
    }
  });
  it("omits missing, revision-stale, explicitly stale, and other-locale artifacts without mutating them", () => {
    const original = japaneseFaqTranslations[0]!;
    const artifacts = [original,
      { ...original, contentId: "missing-target" },
      { ...original, sourceRevision: "0".repeat(64) },
      { ...original, availability: "stale" as const },
      { ...original, targetLocale: "fr" }];
    const before = structuredClone(artifacts);
    const result = selectCurrentBundleTranslations(artifacts, new Map([[original.contentId, original.sourceRevision]]));
    expect(result).toEqual([original]);
    expect(artifacts).toEqual(before);
    expect(selectCurrentBundleTranslations([], new Map([[original.contentId, original.sourceRevision]]))).toEqual([]);
  });
  it("does not promote current translations to human reviewed", () => {
    const machine = japaneseFaqTranslations[0]!;
    const human = { ...machine, reviewState: "human-reviewed" as const, reviewedAt: "2026-09-29T00:00:00.000Z" };
    for (const artifact of [machine, human]) {
      expect(selectCurrentBundleTranslations([artifact], new Map([[artifact.contentId, artifact.sourceRevision]]))).toEqual([artifact]);
    }
  });
  it.each(["faq", "glossary-term", "residence-status"] as const)("rejects wrong artifact kinds and incomplete %s fields", (kind) => {
    const schema = bundledCatalogTranslationSchema(kind);
    expect(() => schema.parse({ ...japaneseFaqTranslations[0], fields: {} })).toThrow();
    expect(() => schema.parse({ ...japaneseFaqTranslations[0], contentKind: "article" })).toThrow();
  });
  it("rejects malformed structured status arrays", () => {
    const original = japaneseResidenceStatusTranslations[0]!;
    for (const value of ["{", "{}", '[1]', '[""]']) {
      expect(() => bundledCatalogTranslationSchema("residence-status").parse({ ...original,
        fields: { ...original.fields, examples: value } })).toThrow();
    }
  });
});
