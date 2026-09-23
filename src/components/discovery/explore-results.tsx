"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ActivitySearchSuggestion } from "@/components/activity-cross-reference/activity-search-suggestion";
import { ArticleCard } from "@/components/content/article-card";
import { ArticleGroupCard } from "@/components/discovery/article-group-card";
import { FaqResult } from "@/components/faq/faq-result";
import { GlossaryCard } from "@/components/glossary/glossary-card";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import type { FaqEntry } from "@/lib/content/faqs";
import type { KnowledgebaseSearchFilters, KnowledgebaseSearchIndex, KnowledgebaseSearchResult } from "@/lib/search/knowledgebase-search";
import { useInterfaceMessages } from "@/components/localization/interface-text";

export function ExploreResults({
  results,
  index,
  filters,
  faqEntries,
  locale,
  returnTo,
  searchIsPending,
  clearSearch,
}: Readonly<{
  results: readonly KnowledgebaseSearchResult[];
  index: KnowledgebaseSearchIndex;
  filters: KnowledgebaseSearchFilters;
  faqEntries: readonly FaqEntry[];
  locale: ContentLocalePreference;
  returnTo: string;
  searchIsPending: boolean;
  clearSearch: () => void;
}>) {
  const { message } = useInterfaceMessages();
  const groupResults = results.flatMap((result) => result.kind === "group" ? [result.group] : []);
  const faqResults = results.flatMap((result) => {
    if (result.kind !== "faq") return [];
    const entry = faqEntries.find((candidate) => candidate.faq.id === result.faq.id);
    return entry ? [entry] : [];
  });
  const articleResults = results.flatMap((result) => result.kind === "article" ? [result.article] : []);
  const glossaryResults = results.flatMap((result) => result.kind === "glossary" ? [result.term] : []);

  return (
    <section className="mt-12" aria-labelledby="search-results-heading" aria-busy={searchIsPending}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{message("explore.resultsEyebrow")}</p>
          <h2 id="search-results-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{message("explore.resultsHeading")}</h2>
        </div>
        <p className="text-sm text-slate-500" aria-live="polite">{message("explore.resultCount").replace("{count}", String(results.length)).replace("{label}", message(results.length === 1 ? "explore.resultSingular" : "explore.resultPlural"))}</p>
      </div>
      {filters.query.trim() && <ActivitySearchSuggestion query={filters.query} returnTo={returnTo} />}
      {results.length > 0 ? (
        <div className="mt-7">
          <nav aria-label={message("explore.jumpNavigation")} className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="mr-1 text-sm font-semibold text-slate-700">{message("explore.jumpTo")}</span>
            {groupResults.length > 0 && <ResultJumpLink href="#result-groups" label={message("explore.groups")} count={groupResults.length} />}
            {faqResults.length > 0 && <ResultJumpLink href="#result-faqs" label={message("explore.faqs")} count={faqResults.length} />}
            {articleResults.length > 0 && <ResultJumpLink href="#result-guides" label={message("explore.guides")} count={articleResults.length} />}
            {glossaryResults.length > 0 && <ResultJumpLink href="#result-terms" label={message("explore.glossaryTerms")} count={glossaryResults.length} />}
          </nav>

          {groupResults.length > 0 && (
            <ResultSection id="result-groups" title={message("explore.contentGroups")} count={groupResults.length}>
              {groupResults.map((group) => {
                const translation = index.translationsByGroupId.get(group.id);
                const presentedGroup = translation
                  ? { ...group, title: translation.title, description: translation.description }
                  : group;
                return <ArticleGroupCard key={group.id} group={presentedGroup} returnTo={returnTo} contentLanguage={translation ? locale : "en"} />;
              })}
            </ResultSection>
          )}
          {faqResults.length > 0 && (
            <ResultSection id="result-faqs" title={message("explore.frequentlyAsked")} count={faqResults.length} layout="list">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                {faqResults.map((entry) => <FaqResult key={entry.faq.id} entry={entry} translation={index.translationsByFaqId.get(entry.faq.id)} returnTo={returnTo} />)}
              </div>
            </ResultSection>
          )}
          {articleResults.length > 0 && (
            <ResultSection id="result-guides" title={message("explore.guides")} count={articleResults.length}>
              {articleResults.map((article) => {
                const translation = index.translationsByArticleId.get(article.id);
                const presentedArticle = translation
                  ? { ...article, title: translation.title, description: translation.description }
                  : article;
                return (
                  <ArticleCard
                    key={article.id}
                    article={presentedArticle}
                    returnTo={returnTo}
                    notice={translation ? message("explore.japanesePilotNotice") : undefined}
                    contentLanguage={translation ? locale : "en"}
                  />
                );
              })}
            </ResultSection>
          )}
          {glossaryResults.length > 0 && (
            <ResultSection id="result-terms" title={message("explore.glossaryTerms")} count={glossaryResults.length}>
              {glossaryResults.map((term) => <GlossaryCard key={term.id} term={term} translation={index.translationsByGlossaryId.get(term.id)} />)}
            </ResultSection>
          )}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-950">{message("explore.noResultsTitle")}</h3>
          <p className="mt-2 text-slate-600">{message("explore.noResultsHelp")}</p>
          <button type="button" onClick={clearSearch} className="mt-5 min-h-11 rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("explore.browseAllGroups")}</button>
          {filters.query.trim() && (
            <Link href={{ pathname: "/faq", query: { q: filters.query, ...(locale !== "en" ? { lang: locale } : {}) } }} className="mt-3 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              {message("explore.searchFaqForQuestion")}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

function ResultJumpLink({ href, label, count }: Readonly<{ href: string; label: string; count: number }>) {
  const { message } = useInterfaceMessages();
  return (
    <a href={href} className="inline-flex min-h-11 items-center rounded-full border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      {message("explore.jumpItemCount").replace("{label}", label).replace("{count}", String(count))}
    </a>
  );
}

function ResultSection({ id, title, count, children, layout = "grid" }: Readonly<{ id: string; title: string; count: number; children: ReactNode; layout?: "grid" | "list" }>) {
  const { message } = useInterfaceMessages();
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6 border-b border-slate-200 py-10 last:border-b-0 last:pb-0">
      <div className="flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <span className="text-sm text-slate-500">{message("explore.sectionCount").replace("{count}", String(count)).replace("{label}", message(count === 1 ? "explore.matchSingular" : "explore.matchPlural"))}</span>
      </div>
      <div className={layout === "grid" ? "mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "mt-6"}>{children}</div>
    </section>
  );
}
