import { describe, expect, it, vi } from "vitest";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { applyActivityText, extractActivityText } from "@/domain/activity-cross-reference/activity-text";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseActivityTranslations } from "./activity-translations";

vi.mock("server-only", () => ({}));

describe("Japanese activity cross-reference translations", () => {
  it("covers every activity with current, machine-translated overlays", () => {
    expect(new Set(japaneseActivityTranslations.map(({ contentId }) => contentId))).toEqual(new Set(activityCrossReferences.map(({ id }) => id)));
    expect(japaneseActivityTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
  });

  it("matches the current English text and its paths", () => {
    for (const artifact of japaneseActivityTranslations) {
      const activity = activityCrossReferences.find(({ id }) => id === artifact.contentId)!;
      const english = extractActivityText(activity);
      expect(artifact.sourceRevision).toBe(createTranslationSourceRevision(english));
      expect(Object.keys(artifact.fields).sort()).toEqual(Object.keys(english).sort());
    }
  });

  it("overlays text without changing IDs, conditions, or links", () => {
    const activity = activityCrossReferences[0];
    const artifact = japaneseActivityTranslations.find(({ contentId }) => contentId === activity.id)!;
    const translated = applyActivityText(activity, artifact.fields);
    expect(translated.label).toBe(artifact.fields.label);
    expect(translated.questions.map(({ id }) => id)).toEqual(activity.questions.map(({ id }) => id));
    expect(translated.rules.map(({ when, links }) => ({ when, links }))).toEqual(activity.rules.map(({ when, links }) => ({ when, links })));
    expect(translated.searchTerms).toEqual(activity.searchTerms);
  });
});
