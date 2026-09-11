import { z } from "zod";
import { journeyStageIdSchema, topicIdSchema } from "@/domain/taxonomy/taxonomy";
import type { OfficialSource } from "@/domain/source/source";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const japaneseTermSchema = z.object({
  id: stableIdSchema,
  slug: stableIdSchema,
  japanese: z.string().min(1),
  kana: z.string().min(1).optional(),
  romaji: z.string().min(1).optional(),
  englishName: z.string().min(1),
  shortDefinition: z.string().min(1),
  detailedExplanation: z.string().min(1),
  commonContext: z.string().min(1),
  topicIds: z.array(topicIdSchema).min(1),
  primaryBrowseGroupId: topicIdSchema.optional(),
  journeyStageIds: z.array(journeyStageIdSchema).default([]),
  relatedArticleIds: z.array(stableIdSchema).default([]),
  relatedTermIds: z.array(stableIdSchema).default([]),
  sourceIds: z.array(stableIdSchema).default([]),
  searchTerms: z.array(z.string().min(1)).default([]),
  status: z.enum(["draft", "verified", "needs-review"]),
  lastReviewedAt: z.iso.date().optional(),
}).superRefine((term, context) => {
  if (term.status === "verified" && !term.lastReviewedAt) {
    context.addIssue({ code: "custom", path: ["lastReviewedAt"], message: "Verified glossary terms require a human review date." });
  }
  if (term.primaryBrowseGroupId && !term.topicIds.includes(term.primaryBrowseGroupId)) {
    context.addIssue({
      code: "custom",
      path: ["primaryBrowseGroupId"],
      message: "The primary browse group must also appear in topicIds.",
    });
  }
}).transform((term) => ({
  ...term,
  // Existing terms adopt their first curated topic without requiring a bulk content rewrite.
  primaryBrowseGroupId: term.primaryBrowseGroupId ?? term.topicIds[0]!,
}));

export type JapaneseTerm = z.infer<typeof japaneseTermSchema>;

export function validateGlossaryCollection(
  terms: readonly JapaneseTerm[],
  sources: readonly OfficialSource[],
  articleIds: readonly string[],
): void {
  const termIds = new Set(terms.map(({ id }) => id));
  const termSlugs = new Set(terms.map(({ slug }) => slug));
  const sourceIds = new Set(sources.map(({ id }) => id));
  const knownArticleIds = new Set(articleIds);

  if (termIds.size !== terms.length) throw new Error("Glossary term IDs must be unique.");
  if (termSlugs.size !== terms.length) throw new Error("Glossary term slugs must be unique.");

  for (const term of terms) {
    for (const relatedTermId of term.relatedTermIds) {
      if (relatedTermId === term.id) {
        throw new Error(`Glossary term \"${term.id}\" cannot relate to itself.`);
      }
      if (!termIds.has(relatedTermId)) {
        throw new Error(`Glossary term \"${term.id}\" references unknown term \"${relatedTermId}\".`);
      }
    }

    for (const articleId of term.relatedArticleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(`Glossary term \"${term.id}\" references unknown article \"${articleId}\".`);
      }
    }

    for (const sourceId of term.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(`Glossary term \"${term.id}\" references unknown source \"${sourceId}\".`);
      }
    }
  }
}
