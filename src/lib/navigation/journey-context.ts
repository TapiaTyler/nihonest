import type { ArticleMetadata } from "@/domain/article/article";
import { resolveJourneySteps, type GuidedJourney } from "@/domain/discovery/discovery";

export function journeyHref(journeyId: string, routeId?: string) {
  return routeId
    ? `/explore/journeys/${journeyId}?route=${encodeURIComponent(routeId)}`
    : `/explore/journeys/${journeyId}`;
}

export function articleJourneyHref(slug: string, journeyId: string, routeId?: string, returnTo?: string) {
  const query = new URLSearchParams({ journey: journeyId });
  if (routeId) query.set("route", routeId);
  if (returnTo) query.set("returnTo", returnTo);
  return `/articles/${slug}?${query.toString()}`;
}

/**
 * Resolves a journey's steps against a lookup of article metadata, matching getJourneySteps on the server.
 * Prebuilt pages pass every candidate article so a client boundary can resolve the route chosen in the query.
 */
export function resolveJourneyViewSteps(journey: GuidedJourney, routeId: string | undefined, articles: readonly ArticleMetadata[]) {
  const byId = new Map(articles.map((article) => [article.id, article]));
  return resolveJourneySteps(journey, routeId).flatMap((step) => {
    const article = byId.get(step.articleId);
    return article ? [{ step, article }] : [];
  });
}

/** Every article a journey can show on any route, so route selection never needs another server request. */
export function journeyCandidateArticleIds(journey: GuidedJourney): string[] {
  const ids = [
    ...journey.phases.flatMap(({ steps }) => steps.flatMap((step) => (step.type === "article" ? [step.articleId] : []))),
    ...journey.routes.map(({ articleId }) => articleId),
  ];
  return [...new Set(ids)];
}
