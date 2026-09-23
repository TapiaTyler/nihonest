import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { articleGroups } from "@/data/discovery/article-groups";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseArticleGroupTranslations } from "./article-group-translations";

vi.mock("server-only", () => ({}));

describe("Japanese article-group translations", () => {
  it("covers every canonical group once without claiming human review", () => {
    expect(japaneseArticleGroupTranslations.map(({ contentId }) => contentId).sort())
      .toEqual(articleGroups.map(({ id }) => id).sort());
    expect(japaneseArticleGroupTranslations.every(({ availability, reviewState }) => (
      availability === "active" && reviewState === "machine-translated"
    ))).toBe(true);
  });

  it("matches every canonical group and shared translation-input revision", () => {
    const terminology = readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8");
    const terminologyRevision = createTranslationSourceRevision({ source: terminology });
    const promptRevision = createTranslationSourceRevision({ source: prompt });

    for (const artifact of japaneseArticleGroupTranslations) {
      const group = articleGroups.find(({ id }) => id === artifact.contentId);
      expect(group).toBeDefined();
      expect(artifact.sourceRevision).toBe(createTranslationSourceRevision({
        title: group!.title,
        description: group!.description,
      }));
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
