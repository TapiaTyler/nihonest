import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { TopicId } from "@/domain/taxonomy/taxonomy";
import { normalizeSearchText } from "./normalize";

export type GlossarySearchFilters = Readonly<{
  query?: string;
  topicId?: TopicId | "all";
}>;

function searchableValues(term: JapaneseTerm) {
  return [
    term.japanese,
    term.kana,
    term.romaji,
    term.englishName,
    term.shortDefinition,
    ...term.searchTerms,
  ].filter((value): value is string => Boolean(value));
}

export function searchGlossary(
  terms: readonly JapaneseTerm[],
  { query = "", topicId = "all" }: GlossarySearchFilters,
): readonly JapaneseTerm[] {
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = normalizedQuery.replaceAll(" ", "");

  return terms.filter((term) => {
    if (topicId !== "all" && !term.topicIds.includes(topicId)) return false;
    if (!normalizedQuery) return true;

    return searchableValues(term).some((value) => {
      const normalizedValue = normalizeSearchText(value);
      return (
        normalizedValue.includes(normalizedQuery) ||
        normalizedValue.replaceAll(" ", "").includes(compactQuery)
      );
    });
  });
}
