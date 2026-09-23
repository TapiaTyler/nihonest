import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { faqs } from "@/data/faqs";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseFaqTranslations } from "./faq-translations";

vi.mock("server-only", () => ({}));

describe("Japanese FAQ translations", () => {
  it("publishes one current machine-translated artifact for the bounded FAQ batch", () => {
    expect(japaneseFaqTranslations).toHaveLength(20);
    expect(new Set(japaneseFaqTranslations.map(({ contentId }) => contentId)).size).toBe(20);
    expect(japaneseFaqTranslations.every(({ availability, reviewState }) => (
      availability === "active" && reviewState === "machine-translated"
    ))).toBe(true);
  });

  it("matches canonical FAQ and shared translation-input revisions", () => {
    const terminology = readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8");
    const terminologyRevision = createTranslationSourceRevision({ source: terminology });
    const promptRevision = createTranslationSourceRevision({ source: prompt });
    const expectedSourceRevisions = Object.fromEntries(japaneseFaqTranslations.map(({ contentId }) => {
      const faq = faqs.find(({ id }) => id === contentId);
      expect(faq).toBeDefined();
      return [contentId, createTranslationSourceRevision({ question: faq!.question, summary: faq!.summary })];
    }));
    expect(Object.fromEntries(japaneseFaqTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision])))
      .toEqual(expectedSourceRevisions);

    for (const artifact of japaneseFaqTranslations) {
      const faq = faqs.find(({ id }) => id === artifact.contentId);
      expect(faq).toBeDefined();
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
