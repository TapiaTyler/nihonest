import { normalizeSearchText, normalizeSearchVocabulary, searchQueryTokens } from "./normalize";

export type SearchTextIndex = Readonly<{
  normalizedPrimary: string;
  haystack: string;
  compactHaystack: string;
}>;

/** Prepares immutable searchable text once so queries do not repeatedly normalize catalog content. */
export function buildSearchTextIndex(primary: string, values: readonly (string | undefined)[]): SearchTextIndex {
  const haystack = values
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearchVocabulary)
    .join(" ");
  return {
    normalizedPrimary: normalizeSearchText(primary),
    haystack,
    compactHaystack: haystack.replaceAll(" ", ""),
  };
}

/** Scores a prepared document while preserving strict matching of every substantive query token. */
export function searchTextIndexScore(index: SearchTextIndex, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;
  const matches = searchQueryTokens(query).every((token) => (
    index.haystack.includes(token) || index.compactHaystack.includes(token)
  ));
  if (!matches) return -1;
  if (index.normalizedPrimary === normalizedQuery) return 100;
  if (index.normalizedPrimary.startsWith(normalizedQuery)) return 75;
  if (index.normalizedPrimary.includes(normalizedQuery)) return 50;
  return 10;
}

/** Searches a group and its eligible members without rebuilding one large combined string for every query. */
export function searchRelatedTextIndexesScore(
  primary: SearchTextIndex,
  related: readonly SearchTextIndex[],
  query: string,
): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;
  const indexes = [primary, ...related];
  const matches = searchQueryTokens(query).every((token) => indexes.some((index) => (
    index.haystack.includes(token) || index.compactHaystack.includes(token)
  )));
  if (!matches) return -1;
  if (primary.normalizedPrimary === normalizedQuery) return 100;
  if (primary.normalizedPrimary.startsWith(normalizedQuery)) return 75;
  if (primary.normalizedPrimary.includes(normalizedQuery)) return 50;
  return 10;
}
