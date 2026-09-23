import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseGlossaryTranslations } from "./glossary-translations";

vi.mock("server-only", () => ({}));

describe("Japanese glossary translations", () => {
  it("keeps the bounded term batch current and machine translated", () => {
    expect(japaneseGlossaryTranslations).toHaveLength(18);
    expect(new Set(japaneseGlossaryTranslations.map(({ contentId }) => contentId)).size).toBe(18);
    expect(japaneseGlossaryTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
  });

  it("matches canonical term and shared input revisions", () => {
    const terminologyRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8") });
    const promptRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8") });
    const actualSourceRevisions = Object.fromEntries(japaneseGlossaryTranslations.map((artifact) => {
      const term = glossaryTerms.find(({ id }) => id === artifact.contentId);
      expect(term).toBeDefined();
      return [artifact.contentId, createTranslationSourceRevision({
        shortDefinition: term!.shortDefinition,
        detailedExplanation: term!.detailedExplanation,
        commonContext: term!.commonContext,
      })];
    }));
    expect(Object.fromEntries(japaneseGlossaryTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision]))).toEqual(actualSourceRevisions);
    for (const artifact of japaneseGlossaryTranslations) {
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
