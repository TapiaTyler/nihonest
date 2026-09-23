import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { TopicId } from "@/domain/taxonomy/taxonomy";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { normalizeSearchText } from "./normalize";

export type GlossarySearchFilters = Readonly<{
  query?: string;
  topicId?: TopicId | "all";
}>;

export type GlossarySearchTranslation = Readonly<{
  contentId: string;
  targetLocale: string;
  shortDefinition: string;
  detailedExplanation: string;
  commonContext: string;
}>;

function searchableValues(term: JapaneseTerm, translation?: GlossarySearchTranslation) {
  return [
    term.japanese,
    term.kana,
    term.romaji,
    term.englishName,
    term.shortDefinition,
    translation?.shortDefinition,
    translation?.detailedExplanation,
    translation?.commonContext,
    ...term.searchTerms,
  ].filter((value): value is string => Boolean(value));
}

export function searchGlossary(
  terms: readonly JapaneseTerm[],
  { query = "", topicId = "all" }: GlossarySearchFilters,
  options: Readonly<{ locale?: ContentLocalePreference; translations?: readonly GlossarySearchTranslation[] }> = {},
): readonly JapaneseTerm[] {
  const locale = options.locale ?? "en";
  const translationsById = new Map((options.translations ?? [])
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation]));
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = normalizedQuery.replaceAll(" ", "");

  return terms.filter((term) => {
    if (topicId !== "all" && !term.topicIds.includes(topicId)) return false;
    if (!normalizedQuery) return true;

    return searchableValues(term, translationsById.get(term.id)).some((value) => {
      const normalizedValue = normalizeSearchText(value);
      return (
        normalizedValue.includes(normalizedQuery) ||
        normalizedValue.replaceAll(" ", "").includes(compactQuery)
      );
    });
  });
}
