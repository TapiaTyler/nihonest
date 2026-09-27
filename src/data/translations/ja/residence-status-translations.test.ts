import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { japaneseResidenceStatusTranslations } from "./residence-status-translations";

vi.mock("server-only", () => ({}));

describe("Japanese residence-status translations", () => {
  it("keeps the representative status batch current and machine translated", () => {
    expect(japaneseResidenceStatusTranslations).toHaveLength(30);
    expect(new Set(japaneseResidenceStatusTranslations.map(({ contentId }) => contentId)).size).toBe(30);
    expect(japaneseResidenceStatusTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
  });

  it("matches canonical status and shared input revisions", () => {
    const terminologyRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8") });
    const promptRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8") });
    const actualSourceRevisions = Object.fromEntries(japaneseResidenceStatusTranslations.map((artifact) => {
      const status = residenceStatuses.find(({ id }) => id === artifact.contentId);
      expect(status).toBeDefined();
      return [artifact.contentId, createTranslationSourceRevision(translationSourceFields["residence-status"](status!))];
    }));
    expect(Object.fromEntries(japaneseResidenceStatusTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision]))).toEqual(actualSourceRevisions);
    for (const artifact of japaneseResidenceStatusTranslations) {
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
