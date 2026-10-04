import { generatedArticleMetadata } from "@/data/generated/article-metadata";
import { createArticleMetadataCatalog } from "@/domain/article/article-metadata-catalog";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { validateArticleMetadataReferences } from "./article-metadata-validation";

const catalog = createArticleMetadataCatalog(generatedArticleMetadata, articleGroups, guidedJourneys);
validateArticleMetadataReferences(catalog.getAllArticles().map(({ metadata }) => metadata));

/** Standalone metadata facade; no existing consumer is switched in checkpoint 1. */
export const { getAllArticles, getArticleById, getArticleBySlug, getArticlesByGroup, getAllArticleGroups,
  getArticleGroupById, getArticleGroupsByArticleIds, getArticlesByJourney, getGuidedJourneyById,
  getAllGuidedJourneys, getJourneysByGroup, getGuidedJourneysByArticleIds, getJourneySteps, getJourneyRoute } = catalog;
