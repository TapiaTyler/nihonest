import type { ArticleMetadata } from "@/domain/article/article";
import { getJourneyArticleIds, getJourneyRouteForArticle, type ArticleGroup, type GuidedJourney, type JourneyRoute } from "@/domain/discovery/discovery";
import { normalizeSearchText } from "@/lib/search/normalize";

export type JourneySearchResult = Readonly<{
  journey: GuidedJourney;
  groupTitle: string;
  matchingArticles: readonly ArticleMetadata[];
}>;

function matchesQuery(value: string, queryTokens: readonly string[]): boolean {
  const normalized = normalizeSearchText(value);
  return queryTokens.every((token) => normalized.includes(token));
}

function matchingArticlesByRelevance(
  articles: readonly ArticleMetadata[],
  queryTokens: readonly string[],
): readonly ArticleMetadata[] {
  return articles
    .map((article, index) => ({
      article,
      index,
      titleMatch: matchesQuery(article.title, queryTokens),
    }))
    .filter(({ article }) => matchesQuery(`${article.title} ${article.description}`, queryTokens))
    .sort((left, right) => Number(right.titleMatch) - Number(left.titleMatch) || left.index - right.index)
    .map(({ article }) => article);
}

export function searchJourneyOptions(
  query: string,
  journeys: readonly GuidedJourney[],
  groups: readonly ArticleGroup[],
  articles: readonly ArticleMetadata[],
): readonly JourneySearchResult[] {
  const queryTokens = normalizeSearchText(query).split(" ").filter(Boolean);
  const groupsById = new Map(groups.map((group) => [group.id, group]));
  const articlesById = new Map(articles.map((article) => [article.id, article]));

  return journeys.flatMap((journey) => {
    const group = groupsById.get(journey.groupId);
    const journeyArticles = getJourneyArticleIds(journey).flatMap((articleId) => {
      const article = articlesById.get(articleId);
      return article ? [article] : [];
    });
    const matchingArticles = queryTokens.length === 0
      ? []
      : matchingArticlesByRelevance(journeyArticles, queryTokens);
    const journeyMatches = queryTokens.length === 0 || matchesQuery(
      `${journey.title} ${journey.description} ${journey.introduction} ${group?.title ?? ""} ${group?.description ?? ""}`,
      queryTokens,
    );

    return journeyMatches || matchingArticles.length > 0
      ? [{ journey, groupTitle: group?.title ?? journey.groupId, matchingArticles }]
      : [];
  });
}

export type JourneyRouteOption = Readonly<{ route: JourneyRoute; article: ArticleMetadata }>;

export function routeOptionsForJourney(
  journey: GuidedJourney | undefined,
  articles: readonly ArticleMetadata[],
): readonly JourneyRouteOption[] {
  if (!journey) return [];
  const articlesById = new Map(articles.map((article) => [article.id, article]));
  return journey.routes.flatMap((route) => {
    const article = articlesById.get(route.articleId);
    return article ? [{ route, article }] : [];
  });
}

export function routeForFocusedArticle(journey: GuidedJourney, articleId: string) {
  return getJourneyRouteForArticle(journey, articleId);
}

export function searchFocusedGuides(
  query: string,
  articles: readonly ArticleMetadata[],
): readonly ArticleMetadata[] {
  const queryTokens = normalizeSearchText(query).split(" ").filter(Boolean);
  if (queryTokens.length === 0) return [];
  return matchingArticlesByRelevance(articles, queryTokens);
}
