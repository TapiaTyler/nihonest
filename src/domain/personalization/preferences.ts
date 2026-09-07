import { z } from "zod";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { resolveJourneySteps } from "@/domain/discovery/discovery";
import { journeyStageIdSchema, type JourneyStageId } from "@/domain/taxonomy/taxonomy";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const anonymousPreferencesSchema = z.object({
  version: z.literal(2),
  journeyStage: journeyStageIdSchema.optional(),
  journeyId: stableIdSchema.optional(),
  routeId: stableIdSchema.optional(),
  focusedArticleId: stableIdSchema.optional(),
  onboardingCompleted: z.boolean(),
});

export type AnonymousPreferences = z.infer<typeof anonymousPreferencesSchema>;

export const defaultAnonymousPreferences: AnonymousPreferences = {
  version: 2,
  onboardingCompleted: false,
};

const recommendationIdsByStage: Record<JourneyStageId, readonly string[]> = {
  planning: [
    "visa-and-status-of-residence-explained",
    "planning-your-studies-in-japan",
    "choosing-a-work-status-and-coe",
  ],
  preparing: [
    "preparing-for-long-term-entry-to-japan",
    "preparing-to-enter-japan",
    "finding-housing-and-moving-in",
  ],
  "recently-arrived": [
    "documents-received-when-entering-japan",
    "registering-your-address-after-arrival",
    "getting-a-phone-number-in-japan",
  ],
  "living-in-japan": [
    "understanding-my-number",
    "joining-national-health-insurance",
    "national-pension-after-moving-to-japan",
  ],
};

export function recommendationsForStage(
  stage: JourneyStageId,
  articles: readonly ArticleMetadata[],
  journeys: readonly GuidedJourney[] = [],
  journeyId?: string,
  routeId?: string,
  focusedArticleId?: string,
): readonly ArticleMetadata[] {
  const articlesById = new Map(articles.map((article) => [article.id, article]));
  const selectedJourney = journeys.find(({ id }) => id === journeyId);
  const journeyIds = [
    ...(focusedArticleId ? [focusedArticleId] : []),
    ...(selectedJourney ? resolveJourneySteps(selectedJourney, routeId).map(({ articleId }) => articleId) : []),
  ];
  const recommendationIds = [...new Set([
    ...journeyIds,
    ...recommendationIdsByStage[stage],
  ])];

  return recommendationIds.flatMap((id) => {
    const article = articlesById.get(id);
    return article?.journeyStageIds.includes(stage) ? [article] : [];
  }).slice(0, 3);
}
