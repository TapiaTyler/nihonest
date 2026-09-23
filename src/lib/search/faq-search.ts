import type { Faq } from "@/domain/faq/faq";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { buildSearchTextIndex, searchTextIndexScore, type SearchTextIndex } from "./search-text-index";

export type FaqSearchTranslation = Readonly<{
  contentId: string;
  targetLocale: string;
  question: string;
  summary: string;
}>;

export type IndexedFaq = Readonly<{
  faq: Faq;
  searchText: SearchTextIndex;
  presentedQuestion: string;
}>;

export function buildFaqSearchIndex(
  faqs: readonly Faq[],
  options: Readonly<{ locale?: ContentLocalePreference; translations?: readonly FaqSearchTranslation[] }> = {},
): readonly IndexedFaq[] {
  const locale = options.locale ?? "en";
  const translationsById = new Map((options.translations ?? [])
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation]));
  return faqs.map((faq) => {
    const translation = translationsById.get(faq.id);
    return {
      faq,
      presentedQuestion: translation?.question ?? faq.question,
      searchText: buildSearchTextIndex(translation?.question ?? faq.question, [
        translation?.question,
        translation?.summary,
        faq.question,
        faq.summary,
        ...faq.searchTerms,
      ]),
    };
  });
}

/** Matches all query tokens while allowing compact user input such as "workvisa" to find spaced wording. */
export function faqSearchScore(faq: Faq, query: string): number {
  return searchTextIndexScore(buildSearchTextIndex(faq.question, [faq.question, faq.summary, ...faq.searchTerms]), query);
}

export function searchFaqIndex(index: readonly IndexedFaq[], query: string, locale: ContentLocalePreference = "en"): readonly Faq[] {
  return index
    .map(({ faq, searchText, presentedQuestion }) => ({ faq, presentedQuestion, score: searchTextIndexScore(searchText, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.presentedQuestion.localeCompare(right.presentedQuestion, locale, { sensitivity: "base" }))
    .map(({ faq }) => faq);
}

export function searchFaqs(faqs: readonly Faq[], query: string): readonly Faq[] {
  return searchFaqIndex(buildFaqSearchIndex(faqs), query);
}
