import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { guidedJourneys } from "@/data/discovery";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseJourneyTranslations } from "./journey-translations";

vi.mock("server-only", () => ({}));

function journeyRevision(journey: (typeof guidedJourneys)[number]) {
  return createTranslationSourceRevision({
    title: journey.title,
    description: journey.description,
    introduction: journey.introduction,
    routes: JSON.stringify(journey.routes.map(({ id, title, description }) => ({ id, title, description }))),
    phases: JSON.stringify(journey.phases.map(({ id, title, description }) => ({ id, title, ...(description ? { description } : {}) }))),
    conditions: JSON.stringify(journey.phases.flatMap(({ steps }) => steps.flatMap((step) => (
      step.type === "article" && step.conditionLabel ? [{ id: step.id, label: step.conditionLabel }] : []
    )))),
  });
}

describe("Japanese journey translations", () => {
  it("keeps the representative journey batch current and machine translated", () => {
    expect(japaneseJourneyTranslations).toHaveLength(20);
    expect(japaneseJourneyTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
    expect(new Set(japaneseJourneyTranslations.map(({ contentId }) => contentId)))
      .toEqual(new Set(guidedJourneys.map(({ id }) => id)));
  });

  it("matches canonical journey and shared input revisions", () => {
    const terminologyRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8") });
    const promptRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8") });
    const expectedSourceRevisions = Object.fromEntries(japaneseJourneyTranslations.map(({ contentId }) => {
      const journey = guidedJourneys.find(({ id }) => id === contentId);
      expect(journey).toBeDefined();
      return [contentId, journeyRevision(journey!)];
    }));
    expect(Object.fromEntries(japaneseJourneyTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision])))
      .toEqual(expectedSourceRevisions);

    for (const artifact of japaneseJourneyTranslations) {
      const journey = guidedJourneys.find(({ id }) => id === artifact.contentId);
      expect(journey).toBeDefined();
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);

      const routeIds = new Set(journey!.routes.map(({ id }) => id));
      const phaseIds = new Set(journey!.phases.map(({ id }) => id));
      const stepIds = new Set(journey!.phases.flatMap(({ steps }) => steps.map(({ id }) => id)));
      expect(JSON.parse(artifact.fields.routes ?? "[]").every(({ id }: { id: string }) => routeIds.has(id))).toBe(true);
      expect(JSON.parse(artifact.fields.phases ?? "[]").every(({ id }: { id: string }) => phaseIds.has(id))).toBe(true);
      expect(JSON.parse(artifact.fields.conditions ?? "[]").every(({ id }: { id: string }) => stepIds.has(id))).toBe(true);
    }
  });
});
