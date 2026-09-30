import { resolve } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { japaneseAnnotatedDocumentTranslations } from "@/data/translations/ja/annotated-documents";
import { bundledAnnotatedDocumentSchema, bundledAnnotatedDocumentTranslationSchema } from "@/domain/content-bundle/annotated-document-payload";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { getAnnotatedDocumentsForArticle } from "./annotated-documents";
import { selectCurrentAnnotatedDocumentTranslations } from "./content-bundle-translations";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

vi.mock("server-only", () => ({}));
let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});

describe("annotated-document bundle", () => {
  it("preserves canonical versions, variants, dates, notices and visual attribution with complete artifact provenance", () => {
    expect(JSON.parse(bundle.files.get("annotated-documents.en.json")!)).toEqual(annotatedDocumentFamilies);
    const expected = japaneseAnnotatedDocumentTranslations.filter((artifact) => {
      const family = annotatedDocumentFamilies.find(({ id }) => id === artifact.contentId);
      if (!family || artifact.availability !== "active" || artifact.targetLocale !== "ja") return false;
      const english = translationSourceFields["annotated-document"](family);
      return artifact.sourceRevision === createTranslationSourceRevision(english) && Object.keys(english).every((key) => artifact.fields[key]);
    });
    expect(JSON.parse(bundle.files.get("annotated-document-translations.ja.json")!)).toEqual(expected);
  });
  it("matches the existing viewer's whole-family Japanese overlay", () => {
    const artifacts = JSON.parse(bundle.files.get("annotated-document-translations.ja.json")!);
    for (const family of annotatedDocumentFamilies) {
      const web = getAnnotatedDocumentsForArticle(family.articleId).find(({ id }) => id === family.id)!;
      const artifact = artifacts.find((item: { contentId: string }) => item.contentId === family.id);
      expect(artifact?.fields).toEqual(web.japanese);
    }
  });
  it("omits missing/stale/incomplete artifacts without mutating canonical content or translations", () => {
    const current = japaneseAnnotatedDocumentTranslations[0]!;
    const family = annotatedDocumentFamilies.find(({ id }) => id === current.contentId)!;
    const partial = { ...current, fields: { ...current.fields } };
    delete partial.fields.title;
    const artifacts = [current, partial, { ...current, sourceRevision: "0".repeat(64) },
      { ...current, availability: "stale" as const }, { ...current, contentId: "missing-target" }];
    const before = structuredClone({ family, artifacts });
    expect(selectCurrentAnnotatedDocumentTranslations(artifacts, [family])).toEqual([current]);
    expect(selectCurrentAnnotatedDocumentTranslations([current], [])).toEqual([]);
    const changed = structuredClone(family);
    changed.description += " changed";
    expect(selectCurrentAnnotatedDocumentTranslations([current], [changed])).toEqual([]);
    expect({ family, artifacts }).toEqual(before);
  });
  it("rejects ambiguous section/visual paths and backwards validity dates", () => {
    const original = annotatedDocumentFamilies.find((family) => family.versions.some((version) => version.officialVisuals.length))!;
    for (const kind of ["section", "visual", "dates"]) {
      const family = structuredClone(original);
      const version = family.versions.find((record) => record.officialVisuals.length)!;
      if (kind === "section") version.sections.push(structuredClone(version.sections[0]!));
      if (kind === "visual") version.officialVisuals.push(structuredClone(version.officialVisuals[0]!));
      if (kind === "dates") { version.validFrom = "2026-09-29"; version.validThrough = "2026-09-28"; }
      expect(() => bundledAnnotatedDocumentSchema.parse(family)).toThrow();
    }
  });
  it("rejects wrong artifact kind, locale, availability and empty supplied fields", () => {
    const current = japaneseAnnotatedDocumentTranslations[0]!;
    for (const mutation of [{ contentKind: "article" }, { targetLocale: "fr" }, { availability: "stale" }, { fields: { title: "" } }]) {
      expect(() => bundledAnnotatedDocumentTranslationSchema.parse({ ...current, ...mutation })).toThrow();
    }
  });
});
