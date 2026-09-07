import { faqs } from "@/data/faqs";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { residenceStatuses } from "@/data/residence-statuses";
import { validateFaqCollection, type Faq } from "@/domain/faq/faq";
import { getAllArticles } from "./articles";
import { getAllGlossaryTerms } from "./glossary";

export type FaqTarget = Readonly<{
  kind: "guide" | "group" | "journey" | "glossary" | "residence-status";
  id: string;
  label: string;
  href: string;
}>;

export type FaqEntry = Readonly<{ faq: Faq; targets: readonly FaqTarget[] }>;

const articles = getAllArticles().map(({ metadata }) => metadata);
const glossaryTerms = getAllGlossaryTerms();

validateFaqCollection(faqs, {
  articleIds: articles.map(({ id }) => id),
  groupIds: articleGroups.map(({ id }) => id),
  journeyIds: guidedJourneys.map(({ id }) => id),
  glossaryTermIds: glossaryTerms.map(({ id }) => id),
  residenceStatusIds: residenceStatuses.map(({ id }) => id),
});

/** Resolves stable FAQ relationships at the content boundary so UI components receive display-ready links. */
function resolveTargets(faq: Faq): readonly FaqTarget[] {
  return [
    ...faq.relatedArticleIds.flatMap((id) => {
      const article = articles.find((candidate) => candidate.id === id);
      return article ? [{ kind: "guide" as const, id, label: article.title, href: `/articles/${article.slug}` }] : [];
    }),
    ...faq.relatedGroupIds.flatMap((id) => {
      const group = articleGroups.find((candidate) => candidate.id === id);
      return group ? [{ kind: "group" as const, id, label: group.title, href: `/explore/${group.id}` }] : [];
    }),
    ...faq.relatedJourneyIds.flatMap((id) => {
      const journey = guidedJourneys.find((candidate) => candidate.id === id);
      return journey ? [{ kind: "journey" as const, id, label: journey.title, href: `/explore/journeys/${journey.id}` }] : [];
    }),
    ...faq.relatedGlossaryTermIds.flatMap((id) => {
      const term = glossaryTerms.find((candidate) => candidate.id === id);
      return term ? [{ kind: "glossary" as const, id, label: `${term.englishName} (${term.japanese})`, href: `/glossary/${term.slug}` }] : [];
    }),
    ...faq.relatedResidenceStatusIds.flatMap((id) => {
      const status = residenceStatuses.find((candidate) => candidate.id === id);
      return status ? [{ kind: "residence-status" as const, id, label: `${status.englishName} status`, href: `/residence-statuses/${status.slug}` }] : [];
    }),
  ];
}

const entries: readonly FaqEntry[] = faqs.map((faq) => ({ faq, targets: resolveTargets(faq) }));

export function getAllFaqEntries(): readonly FaqEntry[] {
  return entries;
}
