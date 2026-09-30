import { resolve } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { japaneseLocalGuidanceTranslations } from "@/data/translations/ja/local-guidance";
import { japaneseGeneralLocalAdviceTranslations } from "@/data/translations/ja/local-guidance-general-advice";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { getJapaneseGeneralLocalAdvice, getJapaneseLocalGuidanceFields } from "./local-guidance-translations";
import { selectCurrentBundleTranslations, selectCurrentGeneralAdviceTranslations } from "./content-bundle-translations";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

vi.mock("server-only", () => ({}));
let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});
const advice = Object.entries(generalLocalAdvice).map(([id, record]) => ({ id, kind: "general-lookup-prompts" as const, ...record }));

describe("local guidance bundle coverage", () => {
  it("preserves canonical supplements, researched geography and general lookup prompts in registration order", () => {
    expect(bundle.manifest.formatVersion).toBe(3);
    expect(JSON.parse(bundle.files.get("local-guidance.en.json")!)).toEqual(localGuidanceSupplements);
    expect(JSON.parse(bundle.files.get("supported-geographies.en.json")!)).toEqual(supportedGeographies);
    expect(JSON.parse(bundle.files.get("general-local-advice.en.json")!)).toEqual(advice);
  });
  it("preserves full current supplement artifacts and matches the web revision selector", () => {
    const revisions = new Map(localGuidanceSupplements.map((record) => [record.id,
      createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](record))]));
    const expected = japaneseLocalGuidanceTranslations.filter((artifact) => artifact.availability === "active"
      && artifact.targetLocale === "ja" && revisions.get(artifact.contentId) === artifact.sourceRevision);
    const emitted = JSON.parse(bundle.files.get("local-guidance-translations.ja.json")!);
    expect(emitted).toEqual(expected);
    expect(Object.fromEntries(expected.map((artifact) => [artifact.contentId, artifact.fields])))
      .toEqual(getJapaneseLocalGuidanceFields(localGuidanceSupplements));
  });
  it("preserves complete general-advice artifacts and matches web whole-advice fallback", () => {
    const emitted = JSON.parse(bundle.files.get("general-local-advice-translations.ja.json")!);
    expect(emitted).toEqual(selectCurrentGeneralAdviceTranslations(japaneseGeneralLocalAdviceTranslations, advice));
    for (const record of advice) {
      const artifact = emitted.find((item: { contentId: string }) => item.contentId === record.id);
      expect(artifact ? { title: artifact.fields.title, steps: record.steps.map((_, index) => artifact.fields[`steps.${index}`]) } : undefined)
        .toEqual(getJapaneseGeneralLocalAdvice(record.id));
    }
  });
  it("omits incomplete, missing and stale general advice without changing artifacts", () => {
    const current = japaneseGeneralLocalAdviceTranslations[0]!;
    const record = advice.find(({ id }) => id === current.contentId)!;
    const missingTitle = { ...current, fields: { ...current.fields } };
    delete missingTitle.fields.title;
    const missingStep = { ...current, fields: { ...current.fields } };
    delete missingStep.fields["steps.0"];
    const artifacts = [current, missingTitle, missingStep,
      { ...current, sourceRevision: "0".repeat(64) }, { ...current, availability: "stale" as const },
      { ...current, contentId: "missing-target" }];
    const before = structuredClone(artifacts);
    expect(selectCurrentGeneralAdviceTranslations(artifacts, [record])).toEqual([current]);
    expect(artifacts).toEqual(before);
    expect(selectCurrentGeneralAdviceTranslations([], [record])).toEqual([]);
  });
  it("retains supplement per-field English fallback while omitting revision-stale overlays", () => {
    const current = japaneseLocalGuidanceTranslations[0]!;
    const partial = { ...current, fields: { title: current.fields.title! } };
    const artifacts = [partial, { ...current, sourceRevision: "0".repeat(64) },
      { ...current, availability: "stale" as const }, { ...current, contentId: "missing-target" }];
    expect(selectCurrentBundleTranslations(artifacts, new Map([[current.contentId, current.sourceRevision]]))).toEqual([partial]);
    expect(partial.reviewState).toBe(current.reviewState);
    expect(partial.generator).toEqual(current.generator);
  });
});
