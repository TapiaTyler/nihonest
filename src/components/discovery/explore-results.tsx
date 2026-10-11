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
import { ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import type { ViewMode } from "@/lib/storage/view-mode";

export function ExploreResults({
  results,
  index,
  filters,
  faqEntries,
  locale,
  returnTo,
  searchIsPending,
  clearSearch,
  viewMode = "cards",
  setViewMode,
}: Readonly<{
  results: readonly KnowledgebaseSearchResult[];
  index: KnowledgebaseSearchIndex;
  filters: KnowledgebaseSearchFilters;
  faqEntries: readonly FaqEntry[];
  locale: ContentLocalePreference;
  returnTo: string;
  searchIsPending: boolean;
  clearSearch: () => void;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
}>) {
  const { message } = useInterfaceMessages();
  const variant = viewMode === "list" ? "row" : "card";
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
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 basis-72">
          <p className="eyebrow">{message("explore.resultsEyebrow")}</p>
          <h2 id="search-results-heading" className="mt-2 text-3xl font-semibold tracking-tight text-ink">{message("explore.resultsHeading")}</h2>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          <p className="text-sm text-ink-subtle" aria-live="polite">{message("explore.resultCount").replace("{count}", String(results.length)).replace("{label}", message(results.length === 1 ? "explore.resultSingular" : "explore.resultPlural"))}</p>
          {setViewMode && <ViewModeToggle mode={viewMode} onChange={setViewMode} />}
        </div>
      </div>
      {filters.query.trim() && <ActivitySearchSuggestion query={filters.query} returnTo={returnTo} />}
      {results.length > 0 ? (
        <div className="mt-7">
          <nav aria-label={message("explore.jumpNavigation")} className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface-subtle p-4">
            <span className="mr-1 text-sm font-semibold text-ink-body">{message("explore.jumpTo")}</span>
            {groupResults.length > 0 && <ResultJumpLink href="#result-groups" label={message("explore.groups")} count={groupResults.length} />}
            {faqResults.length > 0 && <ResultJumpLink href="#result-faqs" label={message("explore.faqs")} count={faqResults.length} />}
            {articleResults.length > 0 && <ResultJumpLink href="#result-guides" label={message("explore.guides")} count={articleResults.length} />}
            {glossaryResults.length > 0 && <ResultJumpLink href="#result-terms" label={message("explore.glossaryTerms")} count={glossaryResults.length} />}
          </nav>

          {groupResults.length > 0 && (
            <ResultSection id="result-groups" title={message("explore.contentGroups")} count={groupResults.length} viewMode={viewMode} items={groupResults.map((group) => {
              const translation = index.translationsByGroupId.get(group.id);
              const presentedGroup = translation
                ? { ...group, title: translation.title, description: translation.description }
                : group;
              return { key: group.id, node: <ArticleGroupCard group={presentedGroup} returnTo={returnTo} contentLanguage={translation ? locale : "en"} variant={variant} /> };
            })} />
          )}
          {faqResults.length > 0 && (
            <ResultSection id="result-faqs" title={message("explore.frequentlyAsked")} count={faqResults.length} viewMode={viewMode} gridClassName="mt-6 grid items-start gap-4 md:grid-cols-2"
              items={faqResults.map((entry) => ({ key: entry.faq.id, node: <FaqResult entry={entry} translation={index.translationsByFaqId.get(entry.faq.id)} returnTo={returnTo} variant={variant} /> }))} />
          )}
          {articleResults.length > 0 && (
            <ResultSection id="result-guides" title={message("explore.guides")} count={articleResults.length} viewMode={viewMode} items={articleResults.map((article) => {
              const translation = index.translationsByArticleId.get(article.id);
              const presentedArticle = translation
                ? { ...article, title: translation.title, description: translation.description }
                : article;
              return {
                key: article.id,
                node: (
                  <ArticleCard
                    article={presentedArticle}
                    returnTo={returnTo}
                    notice={translation ? message("explore.japanesePilotNotice") : undefined}
                    contentLanguage={translation ? locale : "en"}
                    variant={variant}
                  />
                ),
              };
            })} />
          )}
          {glossaryResults.length > 0 && (
            <ResultSection id="result-terms" title={message("explore.glossaryTerms")} count={glossaryResults.length} viewMode={viewMode}
              items={glossaryResults.map((term) => ({ key: term.id, node: <GlossaryCard term={term} translation={index.translationsByGlossaryId.get(term.id)} variant={variant} /> }))} />
          )}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <h3 className="text-xl font-semibold text-ink">{message("explore.noResultsTitle")}</h3>
          <p className="mt-2 text-ink-muted">{message("explore.noResultsHelp")}</p>
          <button type="button" onClick={clearSearch} className="mt-5 min-h-11 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("explore.browseAllGroups")}</button>
          {filters.query.trim() && (
            <Link href={{ pathname: "/faq", query: { q: filters.query, ...(locale !== "en" ? { lang: locale } : {}) } }} className="mt-3 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
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
    <a href={href} className="inline-flex min-h-11 items-center rounded-full border border-brand-line bg-surface px-4 text-sm font-semibold text-brand-link hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
      {message("explore.jumpItemCount").replace("{label}", label).replace("{count}", String(count))}
    </a>
  );
}

/** A titled result type, shown as cards or a list. */
function ResultSection({ id, title, count, children, items, viewMode = "cards", gridClassName = "mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" }: Readonly<{
  id: string;
  title: string;
  count: number;
  children?: ReactNode;
  items?: readonly Readonly<{ key: string; node: ReactNode }>[];
  viewMode?: ViewMode;
  gridClassName?: string;
}>) {
  const { message } = useInterfaceMessages();
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6 border-b border-line py-10 last:border-b-0 last:pb-0">
      <div className="flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-2xl font-semibold tracking-tight text-ink">{title}</h3>
        <span className="text-sm text-ink-subtle">{message("explore.sectionCount").replace("{count}", String(count)).replace("{label}", message(count === 1 ? "explore.matchSingular" : "explore.matchPlural"))}</span>
      </div>
      {items
        ? <ViewModeItems mode={viewMode} gridClassName={gridClassName} listContainerClassName="mt-6" items={items} />
        : <div className="mt-6">{children}</div>}
    </section>
  );
}
