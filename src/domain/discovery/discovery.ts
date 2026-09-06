import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const articleGroupSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  articleIds: z.array(stableIdSchema).min(1),
});

export const journeyApplicabilitySchema = z.enum([
  "all-students",
  "student-status",
  "temporary-visitor",
  "registered-resident",
]);

export const journeyStepSchema = z.object({
  articleId: stableIdSchema,
  applicability: z.array(journeyApplicabilitySchema).min(1),
});

export const guidedJourneySchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(journeyStepSchema).min(1),
});

export type ArticleGroup = z.infer<typeof articleGroupSchema>;
export type GuidedJourney = z.infer<typeof guidedJourneySchema>;
export type JourneyStep = z.infer<typeof journeyStepSchema>;

export function validateDiscoveryModel(
  groups: readonly ArticleGroup[],
  journeys: readonly GuidedJourney[],
  articleIds: readonly string[],
) {
  const knownArticleIds = new Set(articleIds);
  for (const group of groups) {
    if (new Set(group.articleIds).size !== group.articleIds.length) {
      throw new Error(`Discovery record \"${group.id}\" contains duplicate articles.`);
    }
    for (const articleId of group.articleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(`Discovery record \"${group.id}\" references unknown article \"${articleId}\".`);
      }
    }
  }

  for (const journey of journeys) {
    const journeyArticleIds = journey.steps.map(({ articleId }) => articleId);
    if (new Set(journeyArticleIds).size !== journeyArticleIds.length) {
      throw new Error(`Discovery record \"${journey.id}\" contains duplicate articles.`);
    }
    for (const articleId of journeyArticleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(`Discovery record \"${journey.id}\" references unknown article \"${articleId}\".`);
      }
    }
  }
}
