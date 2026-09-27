import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { japaneseGlossaryPromptRevisions, japaneseGlossaryTranslations } from "./glossary-translations";

vi.mock("server-only", () => ({}));

describe("Japanese glossary translations", () => {
  it("keeps the bounded term batch current and machine translated", () => {
    expect(japaneseGlossaryTranslations).toHaveLength(236);
    expect(new Set(japaneseGlossaryTranslations.map(({ contentId }) => contentId)).size).toBe(236);
    expect(japaneseGlossaryTranslations.some(({ contentId }) => contentId === "juminhyo")).toBe(true);
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.id === "claude-code-codex-reviewed")).toHaveLength(18);
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.id === "claude-code-codex-reviewed" && generator.model === "claude-opus-5-5")).toHaveLength(3);
    // Claude-reviewed: pipeline drafts and the older Codex drafts; see content/translations/CLAUDE-TRANSLATION-REPORT.md.
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.id === "claude-code-claude-reviewed")).toHaveLength(190);
    expect(japaneseGlossaryTranslations.filter(({ generator }) => generator.id === "codex-assisted-claude-reviewed")).toHaveLength(28);
    expect(japaneseGlossaryTranslations.filter(({ generatedAt }) => generatedAt === "2026-09-23T13:07:23.000Z")).toHaveLength(5);
    expect(japaneseGlossaryTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
  });

  it("matches canonical term and shared input revisions", () => {
    const terminologyRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8") });
    const promptRevision = createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8") });
    // Pipeline drafts keep the glossary-prompt revision they were generated with; earlier artifacts track the shared structured prompt.
    const knownGlossaryPromptRevisions: readonly string[] = Object.values(japaneseGlossaryPromptRevisions);
    const actualSourceRevisions = Object.fromEntries(japaneseGlossaryTranslations.map((artifact) => {
      const term = glossaryTerms.find(({ id }) => id === artifact.contentId);
      expect(term).toBeDefined();
      return [artifact.contentId, createTranslationSourceRevision(translationSourceFields["glossary-term"](term!))];
    }));
    expect(Object.fromEntries(japaneseGlossaryTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision]))).toEqual(actualSourceRevisions);
    for (const artifact of japaneseGlossaryTranslations) {
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      if (artifact.generator.id === "claude-code-claude-reviewed") expect(knownGlossaryPromptRevisions).toContain(artifact.promptRevision);
      else expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
