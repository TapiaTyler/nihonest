import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { Faq } from "@/domain/faq/faq";
import type {
  AudienceId,
  GeographicScopeId,
  JourneyStageId,
  TopicId,
} from "@/domain/taxonomy/taxonomy";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { buildSearchTextIndex, searchRelatedTextIndexesScore, searchTextIndexScore, type SearchTextIndex } from "./search-text-index";

export type ArticleSearchTranslation = Readonly<{
  contentId: string;
  targetLocale: string;
  title: string;
  description: string;
  searchTerms?: readonly string[];
}>;

export type KnowledgebaseSearchOptions = Readonly<{
  locale?: ContentLocalePreference;
  articleTranslations?: readonly ArticleSearchTranslation[];
}>;

type AllOption = "all";

export type KnowledgebaseSearchFilters = Readonly<{
  query: string;
  kind: AllOption | "group" | "faq" | "article" | "glossary";
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
  | Readonly<{ kind: "faq"; faq: Faq; score: number }>
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

type IndexedArticle = Readonly<{ article: ArticleMetadata; searchText: SearchTextIndex }>;
type IndexedGroup = Readonly<{ group: ArticleGroup; baseSearchText: SearchTextIndex }>;
type IndexedFaq = Readonly<{ faq: Faq; searchText: SearchTextIndex }>;
type IndexedTerm = Readonly<{ term: JapaneseTerm; searchText: SearchTextIndex }>;

export type KnowledgebaseSearchIndex = Readonly<{
  locale: ContentLocalePreference;
  groups: readonly IndexedGroup[];
  articles: readonly IndexedArticle[];
  faqs: readonly IndexedFaq[];
  terms: readonly IndexedTerm[];
  articlesById: ReadonlyMap<string, IndexedArticle>;
  translationsByArticleId: ReadonlyMap<string, ArticleSearchTranslation>;
}>;

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

/** Builds the disposable in-memory catalog used by every Explore query in this page session. */
export function buildKnowledgebaseSearchIndex(
  groups: readonly ArticleGroup[],
  articles: readonly ArticleMetadata[],
  terms: readonly JapaneseTerm[],
  faqs: readonly Faq[] = [],
  options: KnowledgebaseSearchOptions = {},
): KnowledgebaseSearchIndex {
  const locale = options.locale ?? "en";
  const translationsByArticleId = new Map<string, ArticleSearchTranslation>();
  for (const translation of options.articleTranslations ?? []) {
    if (translation.targetLocale === locale && !translationsByArticleId.has(translation.contentId)) {
      translationsByArticleId.set(translation.contentId, translation);
    }
  }
  const indexedArticles = articles.map((article) => {
    const translation = translationsByArticleId.get(article.id);
    return {
      article,
      searchText: buildSearchTextIndex(translation?.title ?? article.title, [
        translation?.title,
        translation?.description,
        ...(translation?.searchTerms ?? []),
        article.title,
        article.description,
        ...article.searchTerms,
        article.id,
        ...article.topicIds,
        ...article.journeyStageIds,
        ...article.termIds,
      ]),
    };
  });
  return {
    locale,
    groups: groups.map((group) => ({
      group,
      baseSearchText: buildSearchTextIndex(group.title, [group.title, group.description, group.id]),
    })),
    articles: indexedArticles,
    faqs: faqs.map((faq) => ({
      faq,
      searchText: buildSearchTextIndex(faq.question, [faq.question, faq.summary, ...faq.searchTerms]),
    })),
    terms: terms.map((term) => ({
      term,
      searchText: buildSearchTextIndex(term.englishName, [term.japanese, term.kana, term.romaji, term.englishName, term.shortDefinition, ...term.searchTerms]),
    })),
    articlesById: new Map(indexedArticles.map((article) => [article.article.id, article])),
    translationsByArticleId,
  };
}

export function searchKnowledgebaseIndex(
  index: KnowledgebaseSearchIndex,
  filters: KnowledgebaseSearchFilters,
): readonly KnowledgebaseSearchResult[] {
  const groupResults: KnowledgebaseSearchResult[] = index.groups.flatMap(({ group, baseSearchText }) => {
    if (filters.kind !== "all" && filters.kind !== "group") return [];
    const matchingMembers = group.articleIds.flatMap((articleId) => {
      const indexedArticle = index.articlesById.get(articleId);
      return indexedArticle && articleMatchesStructuredFilters(indexedArticle.article, filters) ? [indexedArticle] : [];
    });
    if (matchingMembers.length === 0) return [];
    const score = searchRelatedTextIndexesScore(
      baseSearchText,
      matchingMembers.map(({ searchText }) => searchText),
      filters.query,
    );
    return score >= 0 ? [{ kind: "group" as const, group, score }] : [];
  });

  const articleResults: KnowledgebaseSearchResult[] = index.articles.flatMap(({ article, searchText }) => {
    if (!articleMatchesFilters(article, filters)) return [];
    const score = searchTextIndexScore(searchText, filters.query);
    return score >= 0 ? [{ kind: "article" as const, article, score }] : [];
  });

  const faqResults: KnowledgebaseSearchResult[] = index.faqs.flatMap(({ faq, searchText }) => {
    if (filters.kind !== "all" && filters.kind !== "faq") return [];
    const linkedArticles = faq.relatedArticleIds.flatMap((articleId) => {
      const indexedArticle = index.articlesById.get(articleId);
      return indexedArticle ? [indexedArticle.article] : [];
    });
    const hasStructuredFilter = filters.journeyStageId !== "all"
      || filters.topicId !== "all"
      || filters.audienceId !== "all"
      || filters.geographicScopeId !== "all"
      || filters.contentType !== "all"
      || filters.importance !== "all"
      || filters.residenceStatusId !== "all";
    if (hasStructuredFilter && !linkedArticles.some((article) => articleMatchesStructuredFilters(article, filters))) return [];
    const score = searchTextIndexScore(searchText, filters.query);
    return score >= 0 ? [{ kind: "faq" as const, faq, score }] : [];
  });

  const glossaryResults: KnowledgebaseSearchResult[] = index.terms.flatMap(({ term, searchText }) => {
    if (!glossaryTermMatchesFilters(term, filters)) return [];
    const score = searchTextIndexScore(searchText, filters.query);
    return score >= 0 ? [{ kind: "glossary" as const, term, score }] : [];
  });

  const kindOrder: Record<KnowledgebaseSearchResult["kind"], number> = { group: 0, faq: 1, article: 2, glossary: 3 };
  const collator = new Intl.Collator(index.locale, { sensitivity: "base" });
  return [...groupResults, ...faqResults, ...articleResults, ...glossaryResults].sort(
    (left, right) => kindOrder[left.kind] - kindOrder[right.kind]
      || collator.compare(indexedResultTitle(left, index), indexedResultTitle(right, index)),
  );
}

export function searchKnowledgebase(
  groups: readonly ArticleGroup[],
  articles: readonly ArticleMetadata[],
  terms: readonly JapaneseTerm[],
  filters: KnowledgebaseSearchFilters,
  faqs: readonly Faq[] = [],
  options: KnowledgebaseSearchOptions = {},
): readonly KnowledgebaseSearchResult[] {
  return searchKnowledgebaseIndex(buildKnowledgebaseSearchIndex(groups, articles, terms, faqs, options), filters);
}

function indexedResultTitle(result: KnowledgebaseSearchResult, index: KnowledgebaseSearchIndex) {
  if (result.kind === "group") return result.group.title;
  if (result.kind === "faq") return result.faq.question;
  if (result.kind === "article") return index.translationsByArticleId.get(result.article.id)?.title ?? result.article.title;
  return index.locale === "ja"
    ? result.term.kana ?? result.term.japanese
    : result.term.englishName;
}
