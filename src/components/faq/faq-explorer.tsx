"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { FaqResult } from "./faq-result";
import { useViewMode, ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import { ActivitySearchSuggestion } from "@/components/activity-cross-reference/activity-search-suggestion";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { FAQ_BROWSE_GROUP_IDS, faqBrowseGroupLabels } from "@/domain/faq/faq";
import type { FaqEntry } from "@/lib/content/faqs";
import { buildFaqSearchIndex, searchFaqIndex } from "@/lib/search/faq-search";
import { useContentLocale } from "@/components/localization/content-locale-provider";
import { contentLocalePreferenceSchema } from "@/domain/localization/content-locale";
import { writeContentLocale } from "@/lib/storage/content-locale";
import { DebouncedSearchInput } from "@/components/search/debounced-search-input";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import type { FaqSearchTranslation } from "@/lib/search/faq-search";

export function FaqExplorer({ entries, translations = [] }: Readonly<{
  entries: readonly FaqEntry[];
  translations?: readonly FaqSearchTranslation[];
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const searchId = useId();
  const [searchIsPending, startSearchTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useViewMode("faq");
  const variant = viewMode === "list" ? "row" : "card";
  const hasQuery = Boolean(query.trim());
  const translationsById = useMemo(() => new Map(translations
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation])), [locale, translations]);
  const searchIndex = useMemo(
    () => buildFaqSearchIndex(entries.map(({ faq }) => faq), { locale, translations }),
    [entries, locale, translations],
  );
  const returnParams = new URLSearchParams();
  if (hasQuery) returnParams.set("q", query);
  if (locale !== "en") returnParams.set("lang", locale);
  const returnTo = returnParams.size ? `/faq?${returnParams}` : "/faq";
  const results = useMemo(() => {
    const matches = searchFaqIndex(searchIndex, query, locale);
    return matches.flatMap((faq) => {
      const entry = entries.find((candidate) => candidate.faq.id === faq.id);
      return entry ? [entry] : [];
    });
  }, [entries, locale, query, searchIndex]);
  const browseGroups = FAQ_BROWSE_GROUP_IDS.flatMap((groupId) => {
    const groupedEntries = results
      .filter(({ faq }) => faq.primaryBrowseGroupId === groupId)
      .sort((left, right) => (
        translationsById.get(left.faq.id)?.question ?? left.faq.question
      ).localeCompare(
        translationsById.get(right.faq.id)?.question ?? right.faq.question,
        locale,
        { sensitivity: "base" },
      ));
    return groupedEntries.length > 0 ? [{ groupId, entries: groupedEntries }] : [];
  });

  // URL-backed state makes cross-search handoffs, refresh, and browser Back reproduce the same question.
  useEffect(() => {
    function restoreFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const requestedLocale = contentLocalePreferenceSchema.safeParse(params.get("lang"));
      if (requestedLocale.success) writeContentLocale(requestedLocale.data);
      const restoredQuery = params.get("q") ?? "";
      setQuery(restoredQuery);
    }
    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  function updateQuery(nextQuery: string) {
    startSearchTransition(() => setQuery(nextQuery));
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery);
    if (locale !== "en") params.set("lang", locale);
    window.history.replaceState(null, "", params.size ? `/faq?${params}` : "/faq");
  }

  return (
    <div className="mt-10">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="faq-search-heading">
        <h2 id="faq-search-heading" className="text-xl font-semibold tracking-tight text-slate-950">{message("faq.searchHeading")}</h2>
        <label htmlFor={searchId} className="mt-4 block text-sm font-semibold text-slate-900">{message("faq.searchPrompt")}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <DebouncedSearchInput id={searchId} value={query} onCommit={updateQuery} placeholder={message("faq.searchPlaceholder")} className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
          {query && <button type="button" onClick={() => updateQuery("")} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("faq.clearSearch")}</button>}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-results-heading" aria-busy={searchIsPending}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-72">
            <p className="eyebrow">{message("faq.knowledgebase")}</p>
            <h2 id="faq-results-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{message(query ? "faq.matchingQuestions" : "faq.browseCommon")}</h2>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            <p className="text-sm text-slate-500" aria-live="polite">{results.length} {message(results.length === 1 ? "faq.question" : "faq.questions")}</p>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>
        {hasQuery && <ActivitySearchSuggestion query={query} returnTo={returnTo} />}
        {results.length > 0 && hasQuery ? (
          <ViewModeItems
            mode={viewMode}
            gridClassName="mt-7 grid items-start gap-4 md:grid-cols-2"
            listContainerClassName="mt-7"
            items={results.map((entry) => ({
              key: entry.faq.id,
              node: <FaqResult entry={entry} translation={translationsById.get(entry.faq.id)} headingLevel={3} returnTo={returnTo} variant={variant} />,
            }))}
          />
        ) : results.length > 0 ? (
          <div className="mt-7 space-y-4">
            {browseGroups.map(({ groupId, entries: groupedEntries }) => (
              <details key={groupId} open className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 border-b border-slate-200 px-1 py-4 font-semibold text-slate-950 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                  <span>{locale === "ja" ? japaneseTaxonomyLabels.faqBrowseGroup[groupId] : faqBrowseGroupLabels[groupId]}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">{groupedEntries.length} {message(groupedEntries.length === 1 ? "faq.question" : "faq.questions")}</span>
                    <DisclosureChevron />
                  </span>
                </summary>
                <ViewModeItems
                  mode={viewMode}
                  gridClassName="grid items-start gap-4 md:grid-cols-2 pt-5"
                  listContainerClassName="pt-5"
                  items={groupedEntries.map((entry) => ({
                    key: entry.faq.id,
                    node: <FaqResult entry={entry} translation={translationsById.get(entry.faq.id)} headingLevel={3} returnTo={returnTo} variant={variant} />,
                  }))}
                />
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-950">{message("faq.noMatch")}</h3>
            <p className="mt-2 text-slate-600">{message("faq.noMatchHelp")}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Link href={{ pathname: "/explore", query: { q: query, ...(locale !== "en" ? { lang: locale } : {}) } }} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                {message("faq.searchAll")}
              </Link>
              <button type="button" onClick={() => updateQuery("")} className="min-h-11 rounded-full px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("faq.browseAll")}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
