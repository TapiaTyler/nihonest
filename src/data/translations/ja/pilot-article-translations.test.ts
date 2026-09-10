import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { translationPilotArticles } from "@/data/translation-pilots";
import { japanesePilotArticleTranslations } from "./pilot-article-translations";

vi.mock("server-only", () => ({}));

const sourcePaths: Readonly<Record<string, string>> = {
  "visa-and-status-of-residence-explained": "content/articles/visa-and-status-of-residence-explained.mdx",
  "preparing-to-enter-japan": "content/articles/preparing-to-enter-japan.mdx",
};

describe("Japanese pilot article translations", () => {
  it("covers exactly the declared pilot corpus without claiming human review", () => {
    expect(japanesePilotArticleTranslations.map(({ contentId }) => contentId).sort())
      .toEqual(translationPilotArticles.map(({ articleId }) => articleId).sort());
    expect(japanesePilotArticleTranslations.every(({ targetLocale, reviewState }) => (
      targetLocale === "ja" && reviewState === "machine-translated"
    ))).toBe(true);
  });

  it("retains the required Japanese administrative terminology", () => {
    const visaTranslation = japanesePilotArticleTranslations.find(({ contentId }) => (
      contentId === "visa-and-status-of-residence-explained"
    ));
    expect(visaTranslation?.fields.body).toContain("在留資格認定証明書（COE）");
    expect(visaTranslation?.fields.body).toContain("上陸許可");
    expect(visaTranslation?.fields.body).toContain("在留カード");
  });

  it("matches the current canonical article revisions", async () => {
    const { createTranslationSourceRevision } = await import("@/lib/translation/source-revision");
    for (const artifact of japanesePilotArticleTranslations) {
      const source = readFileSync(resolve(process.cwd(), sourcePaths[artifact.contentId]), "utf8");
      expect(artifact.sourceRevision).toBe(createTranslationSourceRevision({ source }));
    }
  });

  it("matches the current terminology and translation-prompt revisions", async () => {
    const { createTranslationSourceRevision } = await import("@/lib/translation/source-revision");
    const terminology = readFileSync(resolve(process.cwd(), "src/data/translations/pilot-terminology.ts"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "content/translations/PILOT-PROMPT.md"), "utf8");
    const expectedTerminologyRevision = createTranslationSourceRevision({ source: terminology });
    const expectedPromptRevision = createTranslationSourceRevision({ source: prompt });

    expect(japanesePilotArticleTranslations.every((artifact) => (
      artifact.terminologyRevision === expectedTerminologyRevision
      && artifact.promptRevision === expectedPromptRevision
    ))).toBe(true);
  });
});
