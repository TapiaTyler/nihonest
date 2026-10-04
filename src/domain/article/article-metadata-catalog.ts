import { articleMetadataSchema } from "./article";
import { getJourneyArticleIds, getJourneyRouteById, resolveJourneySteps, validateDiscoveryModel,
  type ArticleGroup, type GuidedJourney } from "@/domain/discovery/discovery";

/** Portable selectors receive plain canonical metadata; they never load a renderer or source file. */
export function createArticleMetadataCatalog(input: readonly unknown[], groups: readonly ArticleGroup[], journeys: readonly GuidedJourney[]) {
  const articles = input.map((metadata) => ({ metadata: articleMetadataSchema.parse(metadata) }));
  if (new Set(articles.map(({ metadata }) => metadata.id)).size !== articles.length
    || new Set(articles.map(({ metadata }) => metadata.slug)).size !== articles.length) throw new Error("Duplicate article metadata identity.");
  validateDiscoveryModel(groups, journeys, articles.map(({ metadata }) => metadata.id));
  const getArticleById = (id: string) => articles.find(({ metadata }) => metadata.id === id);
  const resolveIds = (ids: readonly string[]) => ids.flatMap((id) => {
    const article = getArticleById(id);
    return article ? [article] : [];
  });
  return {
    getAllArticles: () => articles as readonly (typeof articles)[number][],
    getArticleById,
    getArticleBySlug: (slug: string) => articles.find(({ metadata }) => metadata.slug === slug),
    getArticlesByGroup: (groupId: string) => resolveIds(groups.find(({ id }) => id === groupId)?.articleIds ?? []),
    getAllArticleGroups: () => groups,
    getArticleGroupById: (id: string) => groups.find((group) => group.id === id),
    getArticleGroupsByArticleIds: (ids: readonly string[]) => groups.filter((group) => group.articleIds.some((id) => ids.includes(id))),
    getArticlesByJourney: (journeyId: string) => {
      const journey = journeys.find(({ id }) => id === journeyId);
      return resolveIds(journey ? getJourneyArticleIds(journey) : []);
    },
    getGuidedJourneyById: (id: string) => journeys.find((journey) => journey.id === id),
    getAllGuidedJourneys: () => journeys,
    getJourneysByGroup: (groupId: string) => journeys.filter((journey) => journey.groupId === groupId),
    getGuidedJourneysByArticleIds: (ids: readonly string[]) => journeys.filter((journey) => getJourneyArticleIds(journey).some((id) => ids.includes(id))),
    getJourneySteps: (journeyId: string, routeId?: string) => {
      const journey = journeys.find(({ id }) => id === journeyId);
      return journey ? resolveJourneySteps(journey, routeId).flatMap((step) => {
        const article = getArticleById(step.articleId);
        return article ? [{ step, article }] : [];
      }) : [];
    },
    getJourneyRoute: (journeyId: string, routeId?: string) => {
      const journey = journeys.find(({ id }) => id === journeyId);
      return journey ? getJourneyRouteById(journey, routeId) : undefined;
    },
  };
}
