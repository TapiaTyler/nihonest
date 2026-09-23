import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseGlossaryTranslations } from "./glossary-translations";

vi.mock("server-only", () => ({}));

describe("Japanese glossary translations", () => {
  it("keeps the bounded term batch current and machine translated", () => {
    expect(japaneseGlossaryTranslations).toHaveLength(46);
    expect(new Set(japaneseGlossaryTranslations.map(({ contentId }) => contentId)).size).toBe(46);
    expect(japaneseGlossaryTranslations.some(({ contentId }) => contentId === "juminhyo")).toBe(true);
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.id === "claude-code-codex-reviewed")).toHaveLength(18);
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.model === "claude-opus-5-5")).toHaveLength(3);
    expect(japaneseGlossaryTranslations.filter(({ generatedAt }) => generatedAt === "2026-09-23T13:07:23.000Z")).toHaveLength(5);
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
