import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";

export const japaneseArticleTerminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
export const japaneseArticlePromptRevision = "5a8fc2cd3c7bc572297b89a72c5fa44c6b5ee6057bb96d714ee45c05defdccaa";
export const japaneseArticleGenerator = { id: "codex-assisted", model: "gpt-5" } as const;

/** Creates a current Japanese article artifact with the shared provenance contract. */
export function defineJapaneseArticleTranslation(
  contentId: string,
  sourceRevision: string,
  title: string,
  description: string,
  body: string,
  generator: TranslationArtifact["generator"] = japaneseArticleGenerator,
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision: japaneseArticleTerminologyRevision,
    promptRevision: japaneseArticlePromptRevision,
    generator,
    fields: { title, description, body },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-20T00:00:00.000Z",
  });
}
