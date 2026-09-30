import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { japaneseActivityTranslations } from "@/data/translations/ja/activity-translations";
import { extractActivityText, applyActivityText } from "@/domain/activity-cross-reference/activity-text";
import { getApplicableActivityRules, assertionIsApproved } from "@/domain/activity-cross-reference/activity-cross-reference";
import { bundledActivitySchema, bundledActivityTranslationSchema } from "@/domain/content-bundle/activity-payload";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { getActivityTranslations } from "./translations";
import { selectCurrentBundleTranslations } from "./content-bundle-translations";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});
describe("activity cross-reference bundle", () => {
  it("preserves all canonical records and complete current artifact provenance in registration order", () => {
    expect(JSON.parse(bundle.files.get("activity-cross-references.en.json")!)).toEqual(activityCrossReferences);
    const expected = japaneseActivityTranslations.filter((artifact) => {
      const activity = activityCrossReferences.find(({ id }) => id === artifact.contentId);
      return activity && artifact.availability === "active" && artifact.targetLocale === "ja"
        && artifact.sourceRevision === createTranslationSourceRevision(extractActivityText(activity));
    });
    const emitted = JSON.parse(bundle.files.get("activity-translations.ja.json")!);
    expect(emitted).toEqual(expected);
    expect(Object.fromEntries(expected.map(({ contentId, fields }) => [contentId, fields]))).toEqual(getActivityTranslations());
  });
  it("preserves answer/rule selection, targets, mode, sources and approval state under localization", () => {
    for (const canonical of activityCrossReferences) {
      const artifact = japaneseActivityTranslations.find(({ contentId }) => contentId === canonical.id)!;
      const before = structuredClone(canonical);
      const localized = applyActivityText(canonical, artifact.fields);
      expect(localized.id).toBe(canonical.id);
      expect(localized.mode).toBe(canonical.mode);
      expect(localized.searchTerms).toEqual(canonical.searchTerms);
      expect(localized.questions.map(({ id, choices }) => ({ id, choices: choices.map(({ id }) => id) })))
        .toEqual(canonical.questions.map(({ id, choices }) => ({ id, choices: choices.map(({ id }) => id) })));
      const metadata = (rule: (typeof canonical.rules)[number]) => ({ id: rule.id, layer: rule.layer, when: rule.when, links: rule.links,
        sourceIds: rule.assertion?.sourceIds, editorialState: rule.assertion?.editorialState, approvedAt: rule.assertion?.approvedAt,
        approved: assertionIsApproved(rule.assertion) });
      expect(localized.rules.map(metadata)).toEqual(canonical.rules.map(metadata));
      const answers = canonical.questions.reduce<Record<string, string>[]>((combinations, question) => combinations.flatMap((answer) =>
        question.choices.map((choice) => ({ ...answer, [question.id]: choice.id }))), [{}]);
      for (const answer of [{}, ...answers]) {
        expect(getApplicableActivityRules(localized, answer).map(({ id }) => id))
          .toEqual(getApplicableActivityRules(canonical, answer).map(({ id }) => id));
      }
      expect(canonical).toEqual(before);
    }
  });
  it("keeps partial overlays with per-path English fallback and omits stale/missing targets", () => {
    const artifact = japaneseActivityTranslations[0]!;
    const canonical = activityCrossReferences.find(({ id }) => id === artifact.contentId)!;
    const revisions = new Map([[canonical.id, createTranslationSourceRevision(extractActivityText(canonical))]]);
    const partial = { ...artifact, fields: { label: artifact.fields.label! } };
    expect(selectCurrentBundleTranslations([partial], revisions)).toEqual([partial]);
    const localized = applyActivityText(canonical, partial.fields);
    expect(localized.label).toBe(partial.fields.label);
    expect(localized.questions).toEqual(canonical.questions);
    expect(localized.rules).toEqual(canonical.rules);
    expect(selectCurrentBundleTranslations([{ ...artifact, sourceRevision: "0".repeat(64) }], revisions)).toEqual([]);
    expect(selectCurrentBundleTranslations([artifact], new Map())).toEqual([]);
  });
  it.each(["question", "choice", "rule"])("rejects duplicate scoped %s IDs", (kind) => {
    const activity = structuredClone(activityCrossReferences.find(({ questions }) => questions.length)!);
    if (kind === "question") activity.questions.push(structuredClone(activity.questions[0]!));
    if (kind === "choice") activity.questions[0]!.choices.push(structuredClone(activity.questions[0]!.choices[0]!));
    if (kind === "rule") activity.rules.push(structuredClone(activity.rules[0]!));
    expect(() => bundledActivitySchema.parse(activity)).toThrow("must be unique");
  });
  it("rejects wrong artifact kind, locale, availability and empty supplied text", () => {
    const artifact = japaneseActivityTranslations[0]!;
    for (const mutation of [{ contentKind: "article" }, { targetLocale: "fr" }, { availability: "stale" }, { fields: { label: "" } }]) {
      expect(() => bundledActivityTranslationSchema.parse({ ...artifact, ...mutation })).toThrow();
    }
  });
});
