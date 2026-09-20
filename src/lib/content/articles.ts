import type { ComponentType } from "react";
import { entryAndArrivalArticleRegistrations } from "@/lib/content/article-registry/entry-and-arrival";
import { routeSelectionAndVisaArticleRegistrations } from "@/lib/content/article-registry/route-selection-and-visas";
import { workStatusArticleRegistrations } from "@/lib/content/article-registry/work-statuses";
import { familyAndDesignatedActivityArticleRegistrations } from "@/lib/content/article-registry/family-and-designated-activities";
import { taxWorkAndResidentLifecycleArticleRegistrations } from "@/lib/content/article-registry/tax-work-and-resident-lifecycle";
import { transportSafetyAndDailyLifeArticleRegistrations } from "@/lib/content/article-registry/transport-safety-and-daily-life";
import {
  articleMetadataSchema,
  validateArticleCollection,
  type ArticleMetadata,
} from "@/domain/article/article";
import { sources } from "@/data/sources";
import { residenceStatuses } from "@/data/residence-statuses";
import { validateResidenceStatusCollection } from "@/domain/residence-status/residence-status";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { getJourneyArticleIds, getJourneyRouteById, resolveJourneySteps, validateDiscoveryModel } from "@/domain/discovery/discovery";
import { glossaryTerms } from "@/data/glossary";
import { validateGlossaryCollection } from "@/domain/glossary/glossary";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { validateLocalGuidanceCollection } from "@/domain/geography/local-guidance";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { validateAnnotatedDocumentCollection } from "@/domain/document/annotated-document";

export type ArticleRecord = Readonly<{
  metadata: ArticleMetadata;
  Content: ComponentType;
}>;

// Module order is the established catalog order; each family owns only its local order.
const entries = [
  ...entryAndArrivalArticleRegistrations,
  ...routeSelectionAndVisaArticleRegistrations,
  ...workStatusArticleRegistrations,
  ...familyAndDesignatedActivityArticleRegistrations,
  ...taxWorkAndResidentLifecycleArticleRegistrations,
  ...transportSafetyAndDailyLifeArticleRegistrations,
] as const;

const articles: readonly ArticleRecord[] = entries.map(([metadata, Content]) => ({
  metadata: articleMetadataSchema.parse(metadata),
  Content,
}));

validateResidenceStatusCollection(
  residenceStatuses,
  sources,
  articles.map(({ metadata }) => metadata.id),
  glossaryTerms.map(({ id }) => id),
);
validateArticleCollection(
  articles.map((article) => article.metadata),
  sources,
  residenceStatuses.map((status) => status.id),
  glossaryTerms.map((term) => term.id),
);
validateGlossaryCollection(
  glossaryTerms,
  sources,
  articles.map(({ metadata }) => metadata.id),
);
validateDiscoveryModel(
  articleGroups,
  guidedJourneys,
  articles.map(({ metadata }) => metadata.id),
);
validateLocalGuidanceCollection(
  supportedGeographies,
  localGuidanceSupplements,
  articles.map(({ metadata }) => metadata.id),
  sources.map(({ id }) => id),
);
validateAnnotatedDocumentCollection(
  annotatedDocumentFamilies,
  articles.map(({ metadata }) => metadata.id),
  glossaryTerms.map(({ id }) => id),
  sources.map(({ id }) => id),
  supportedGeographies.filter(({ selectable }) => selectable).map(({ id }) => id),
);

export function getAllArticles(): readonly ArticleRecord[] {
  return articles;
}

function resolveArticleIds(articleIds: readonly string[]) {
  return articleIds.flatMap((articleId) => {
    const article = getArticleById(articleId);
    return article ? [article] : [];
  });
}

export function getArticlesByGroup(groupId: string) {
  const group = articleGroups.find(({ id }) => id === groupId);
  return group ? resolveArticleIds(group.articleIds) : [];
}

export function getAllArticleGroups() {
  return articleGroups;
}

export function getArticleGroupById(groupId: string) {
  return articleGroups.find(({ id }) => id === groupId);
}

export function getArticleGroupsByArticleIds(articleIds: readonly string[]) {
  const requestedIds = new Set(articleIds);
  return articleGroups.filter((group) => group.articleIds.some((articleId) => requestedIds.has(articleId)));
}

export function getArticlesByJourney(journeyId: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  return journey ? resolveArticleIds(getJourneyArticleIds(journey)) : [];
}

export function getGuidedJourneyById(journeyId: string) {
  return guidedJourneys.find(({ id }) => id === journeyId);
}

export function getAllGuidedJourneys() {
  return guidedJourneys;
}

export function getJourneysByGroup(groupId: string) {
  return guidedJourneys.filter((journey) => journey.groupId === groupId);
}

export function getGuidedJourneysByArticleIds(articleIds: readonly string[]) {
  const requestedIds = new Set(articleIds);
  return guidedJourneys.filter((journey) => getJourneyArticleIds(journey).some((articleId) => requestedIds.has(articleId)));
}

export function getJourneySteps(journeyId: string, routeId?: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  if (!journey) return [];

  return resolveJourneySteps(journey, routeId).flatMap((step) => {
    const article = getArticleById(step.articleId);
    return article ? [{ step, article }] : [];
  });
}

export function getJourneyRoute(journeyId: string, routeId?: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  return journey ? getJourneyRouteById(journey, routeId) : undefined;
}

export function getArticleBySlug(slug: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.slug === slug);
}

export function getArticleById(id: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.id === id);
}
