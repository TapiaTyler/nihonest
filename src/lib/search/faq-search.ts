import type { Faq } from "@/domain/faq/faq";
import { normalizeSearchText } from "./normalize";

/** Matches all query tokens while allowing compact user input such as "workvisa" to find spaced wording. */
export function faqSearchScore(faq: Faq, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;
  const question = normalizeSearchText(faq.question);
  const haystack = [faq.question, faq.summary, ...faq.searchTerms].map(normalizeSearchText).join(" ");
  const compactHaystack = haystack.replaceAll(" ", "");
  if (!normalizedQuery.split(" ").every((token) => haystack.includes(token) || compactHaystack.includes(token))) return -1;
  if (question === normalizedQuery) return 100;
  if (question.startsWith(normalizedQuery)) return 75;
  if (question.includes(normalizedQuery)) return 50;
  return 10;
}

export function searchFaqs(faqs: readonly Faq[], query: string): readonly Faq[] {
  return faqs
    .map((faq) => ({ faq, score: faqSearchScore(faq, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.faq.question.localeCompare(right.faq.question, "en", { sensitivity: "base" }))
    .map(({ faq }) => faq);
}
