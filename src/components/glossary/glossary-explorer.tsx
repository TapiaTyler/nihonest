"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useOptionalContentLocale } from "@/components/localization/content-locale-provider";
import { defaultContentLocale } from "@/domain/localization/content-locale";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { TopicId } from "@/domain/taxonomy/taxonomy";
import { topics } from "@/domain/taxonomy/taxonomy";
import { searchGlossary } from "@/lib/search/glossary-search";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { GlossaryCard } from "./glossary-card";
import { useViewMode, ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";

type TopicFilter = "all" | TopicId;
type GlossaryFilters = Readonly<{ query: string; topicId: TopicFilter }>;

const defaultGlossaryFilters: GlossaryFilters = { query: "", topicId: "all" };
const glossaryReturnStorageKey = "nihonest:glossary-return";

function filtersFromSearch(search: string): GlossaryFilters {
  const params = new URLSearchParams(search);
  const requestedTopic = params.get("topic");
  return {
    query: params.get("q") ?? "",
    topicId: requestedTopic && topics.some(({ id }) => id === requestedTopic)
      ? requestedTopic as TopicId
      : "all",
  };
}

function searchForFilters({ query, topicId }: GlossaryFilters) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (topicId !== "all") params.set("topic", topicId);
  return params.toString();
}

export function GlossaryExplorer({ terms, translations = [] }: Readonly<{
  terms: readonly JapaneseTerm[];
  translations?: readonly GlossarySearchTranslation[];
}>) {
  const locale = useOptionalContentLocale()?.locale ?? defaultContentLocale;
  const { message } = useInterfaceMessages();
  const searchId = useId();
  const [filters, setFilters] = useState<GlossaryFilters>(defaultGlossaryFilters);
  const [viewMode, setViewMode] = useViewMode("glossary");
  const variant = viewMode === "list" ? "row" : "card";
  const filtersRef = useRef<GlossaryFilters>(defaultGlossaryFilters);
  const { query, topicId } = filters;
  const availableTopics = topics.filter((topic) =>
    terms.some((term) => term.topicIds.includes(topic.id)),
  );
  const translationsById = useMemo(() => new Map(translations
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation])), [locale, translations]);
  const visibleTerms = [...searchGlossary(terms, { query, topicId }, { locale, translations })]
    .sort((left, right) => (locale === "ja" ? left.kana ?? left.japanese : left.englishName)
      .localeCompare(locale === "ja" ? right.kana ?? right.japanese : right.englishName, locale, { sensitivity: "base" }));
  const hasFilters = Boolean(query.trim()) || topicId !== "all";
  const browseGroups = availableTopics.flatMap((topic) => {
    const groupedTerms = visibleTerms.filter((term) => term.primaryBrowseGroupId === topic.id);
    return groupedTerms.length > 0 ? [{ topic, terms: groupedTerms }] : [];
  });
  const filterSearch = searchForFilters(filters);
  const returnTo = filterSearch ? `/glossary?${filterSearch}` : "/glossary";

  useEffect(() => {
    function restoreFromUrl() {
      const restoredFilters = filtersFromSearch(window.location.search);
      filtersRef.current = restoredFilters;
      setFilters(restoredFilters);
      sessionStorage.setItem(glossaryReturnStorageKey, window.location.pathname + window.location.search);
    }
    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  function updateFilters(update: Partial<GlossaryFilters>) {
    const next = { ...filtersRef.current, ...update };
    filtersRef.current = next;
    setFilters(next);
    const search = searchForFilters(next);
    const href = search ? `/glossary?${search}` : "/glossary";
    window.history.replaceState(null, "", href);
    sessionStorage.setItem(glossaryReturnStorageKey, href);
  }

  function clearFilters() {
    filtersRef.current = defaultGlossaryFilters;
    setFilters(defaultGlossaryFilters);
    window.history.replaceState(null, "", "/glossary");
    sessionStorage.setItem(glossaryReturnStorageKey, "/glossary");
  }

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <label htmlFor={searchId} className="block text-sm font-semibold text-slate-900">
          {message("glossaryIndex.searchLabel")}
        </label>
        <p id={`${searchId}-hint`} className="mt-1 text-sm leading-6 text-slate-600">
          {message("glossaryIndex.searchHint")}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => updateFilters({ query: event.target.value })}
            aria-describedby={`${searchId}-hint`}
            placeholder={message("glossaryIndex.searchPlaceholder")}
            className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {message("glossaryIndex.clear")}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={message("glossaryIndex.filterByTopic")}>
          {[{ id: "all" as const, label: message("glossaryIndex.allTopics") }, ...availableTopics.map((topic) => ({
            ...topic,
            label: locale === "ja" ? japaneseTaxonomyLabels.topic[topic.id] : topic.label,
          }))].map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={topicId === topic.id}
              onClick={() => updateFilters({ topicId: topic.id })}
              className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 text-sm text-slate-500" aria-live="polite">
          {message("glossaryIndex.resultCount").replace("{count}", String(visibleTerms.length)).replace("{total}", String(terms.length))}
        </p>
        <div className="ml-auto"><ViewModeToggle mode={viewMode} onChange={setViewMode} /></div>
      </div>

      {visibleTerms.length > 0 && hasFilters ? (
        <ViewModeItems
          mode={viewMode}
          gridClassName="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          listContainerClassName="mt-6"
          items={visibleTerms.map((term) => ({
            key: term.id,
            node: <GlossaryCard term={term} translation={translationsById.get(term.id)} returnTo={hasFilters ? returnTo : undefined} variant={variant} />,
          }))}
        />
      ) : visibleTerms.length > 0 ? (
        <div className="mt-6 space-y-4">
          {browseGroups.map(({ topic, terms: groupedTerms }) => (
            <details key={topic.id} open className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 border-b border-slate-200 px-1 py-4 font-semibold text-slate-950 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                <span>{locale === "ja" ? japaneseTaxonomyLabels.topic[topic.id] : topic.label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">{locale === "ja"
                    ? message("glossaryIndex.groupCount").replace("{count}", String(groupedTerms.length))
                    : message("glossaryIndex.groupCount")
                      .replace("{count}", String(groupedTerms.length))
                      .replace("{label}", message(groupedTerms.length === 1 ? "glossaryIndex.term" : "glossaryIndex.terms"))}</span>
                  <DisclosureChevron />
                </span>
              </summary>
              <ViewModeItems
                mode={viewMode}
                gridClassName="grid gap-6 pt-5 md:grid-cols-2 xl:grid-cols-3"
                listContainerClassName="pt-5"
                items={groupedTerms.map((term) => ({ key: term.id, node: <GlossaryCard term={term} translation={translationsById.get(term.id)} variant={variant} /> }))}
              />
            </details>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-950">{message("glossaryIndex.noResults")}</h2>
          <p className="mt-2 text-slate-600">{message("glossaryIndex.noResultsHelp")}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {message("glossaryIndex.showAll")}
          </button>
        </div>
      )}
    </div>
  );
}
