import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type {
  AudienceId,
  GeographicScopeId,
  JourneyStageId,
  TopicId,
} from "@/domain/taxonomy/taxonomy";
import { normalizeSearchText } from "./normalize";

type AllOption = "all";

export type KnowledgebaseSearchFilters = Readonly<{
  query: string;
  kind: AllOption | "group" | "article" | "glossary";
  journeyStageId: AllOption | JourneyStageId;
  topicId: AllOption | TopicId;
  audienceId: AllOption | AudienceId;
  geographicScopeId: AllOption | GeographicScopeId;
  contentType: AllOption | ArticleMetadata["contentType"];
  importance: AllOption | ArticleMetadata["importance"];
  residenceStatusId: AllOption | string;
}>;

export type KnowledgebaseSearchResult =
  | Readonly<{ kind: "group"; group: ArticleGroup; score: number }>
  | Readonly<{ kind: "article"; article: ArticleMetadata; score: number }>
  | Readonly<{ kind: "glossary"; term: JapaneseTerm; score: number }>;

export const defaultKnowledgebaseSearchFilters: KnowledgebaseSearchFilters = {
  query: "",
  kind: "all",
  journeyStageId: "all",
  topicId: "all",
  audienceId: "all",
  geographicScopeId: "all",
  contentType: "all",
  importance: "all",
  residenceStatusId: "all",
};

export function hasActiveKnowledgebaseSearch(filters: KnowledgebaseSearchFilters) {
  return Object.entries(filters).some(([key, value]) =>
    key === "query" ? String(value).trim().length > 0 : value !== "all",
  );
}

function queryScore(primary: string, values: readonly (string | undefined)[], query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery.split(" ");
  const normalizedValues = values
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearchText);
  const haystack = normalizedValues.join(" ");
  const compactHaystack = haystack.replaceAll(" ", "");
  const matches = tokens.every((token) =>
    haystack.includes(token) || compactHaystack.includes(token.replaceAll(" ", "")),
  );

  if (!matches) return -1;

  const normalizedPrimary = normalizeSearchText(primary);
  if (normalizedPrimary === normalizedQuery) return 100;
  if (normalizedPrimary.startsWith(normalizedQuery)) return 75;
  if (normalizedPrimary.includes(normalizedQuery)) return 50;
  return 10;
}

function articleMatchesFilters(article: ArticleMetadata, filters: KnowledgebaseSearchFilters) {
  return (
    (filters.kind === "all" || filters.kind === "article") &&
    articleMatchesStructuredFilters(article, filters)
  );
}

function articleMatchesStructuredFilters(article: ArticleMetadata, filters: KnowledgebaseSearchFilters) {
  return (
    (filters.journeyStageId === "all" || article.journeyStageIds.includes(filters.journeyStageId)) &&
    (filters.topicId === "all" || article.topicIds.includes(filters.topicId)) &&
    (filters.audienceId === "all" || article.audienceIds.includes(filters.audienceId)) &&
    (filters.geographicScopeId === "all" || article.geographicScopes.includes(filters.geographicScopeId)) &&
    (filters.contentType === "all" || article.contentType === filters.contentType) &&
    (filters.importance === "all" || article.importance === filters.importance) &&
    (filters.residenceStatusId === "all" || article.residenceStatusIds.includes(filters.residenceStatusId))
  );
}

function glossaryTermMatchesFilters(term: JapaneseTerm, filters: KnowledgebaseSearchFilters) {
  return (
    (filters.kind === "all" || filters.kind === "glossary") &&
    (filters.journeyStageId === "all" || term.journeyStageIds.includes(filters.journeyStageId)) &&
    (filters.topicId === "all" || term.topicIds.includes(filters.topicId)) &&
    filters.audienceId === "all" &&
    filters.geographicScopeId === "all" &&
    (filters.contentType === "all" || filters.contentType === "glossary") &&
    filters.importance === "all" &&
    filters.residenceStatusId === "all"
  );
}

export function searchKnowledgebase(
  groups: readonly ArticleGroup[],
  articles: readonly ArticleMetadata[],
  terms: readonly JapaneseTerm[],
  filters: KnowledgebaseSearchFilters,
): readonly KnowledgebaseSearchResult[] {
  const groupResults: KnowledgebaseSearchResult[] = groups.flatMap((group) => {
    if (filters.kind !== "all" && filters.kind !== "group") return [];

    const memberArticles = articles.filter((article) => group.articleIds.includes(article.id));
    const matchingMembers = memberArticles.filter((article) => articleMatchesStructuredFilters(article, filters));
    if (matchingMembers.length === 0) return [];

    const score = queryScore(
      group.title,
      [
        group.title,
        group.description,
        group.id,
        ...matchingMembers.flatMap((article) => [
          article.title,
          article.description,
          article.id,
          ...article.topicIds,
          ...article.journeyStageIds,
          ...article.termIds,
        ]),
      ],
      filters.query,
    );
    return score >= 0 ? [{ kind: "group" as const, group, score }] : [];
  });

  const articleResults: KnowledgebaseSearchResult[] = articles.flatMap((article) => {
    if (!articleMatchesFilters(article, filters)) return [];
    const score = queryScore(
      article.title,
      [article.title, article.description, article.id, ...article.topicIds, ...article.journeyStageIds, ...article.termIds],
      filters.query,
    );
    return score >= 0 ? [{ kind: "article" as const, article, score }] : [];
  });

  const glossaryResults: KnowledgebaseSearchResult[] = terms.flatMap((term) => {
    if (!glossaryTermMatchesFilters(term, filters)) return [];
    const score = queryScore(
      term.englishName,
      [term.japanese, term.kana, term.romaji, term.englishName, term.shortDefinition, ...term.searchTerms],
      filters.query,
    );
    return score >= 0 ? [{ kind: "glossary" as const, term, score }] : [];
  });

  return [...groupResults, ...articleResults, ...glossaryResults].sort(
    (left, right) => right.score - left.score ||
      resultTitle(left).localeCompare(resultTitle(right)),
  );
}

function resultTitle(result: KnowledgebaseSearchResult) {
  if (result.kind === "group") return result.group.title;
  if (result.kind === "article") return result.article.title;
  return result.term.englishName;
}
