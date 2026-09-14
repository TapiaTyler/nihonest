import type { Faq } from "@/domain/faq/faq";
import { buildSearchTextIndex, searchTextIndexScore, type SearchTextIndex } from "./search-text-index";

export type IndexedFaq = Readonly<{ faq: Faq; searchText: SearchTextIndex }>;

export function buildFaqSearchIndex(faqs: readonly Faq[]): readonly IndexedFaq[] {
  return faqs.map((faq) => ({
    faq,
    searchText: buildSearchTextIndex(faq.question, [faq.question, faq.summary, ...faq.searchTerms]),
  }));
}

/** Matches all query tokens while allowing compact user input such as "workvisa" to find spaced wording. */
export function faqSearchScore(faq: Faq, query: string): number {
  return searchTextIndexScore(buildSearchTextIndex(faq.question, [faq.question, faq.summary, ...faq.searchTerms]), query);
}

export function searchFaqIndex(index: readonly IndexedFaq[], query: string): readonly Faq[] {
  return index
    .map(({ faq, searchText }) => ({ faq, score: searchTextIndexScore(searchText, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.faq.question.localeCompare(right.faq.question, "en", { sensitivity: "base" }))
    .map(({ faq }) => faq);
}

export function searchFaqs(faqs: readonly Faq[], query: string): readonly Faq[] {
  return searchFaqIndex(buildFaqSearchIndex(faqs), query);
}
