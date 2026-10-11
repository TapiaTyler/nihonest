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
      <div className="rounded-2xl border border-line bg-surface-subtle p-5 sm:p-6">
        <label htmlFor={searchId} className="block text-sm font-semibold text-ink-strong">
          {message("glossaryIndex.searchLabel")}
        </label>
        <p id={`${searchId}-hint`} className="mt-1 text-sm leading-6 text-ink-muted">
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
            className="min-h-12 flex-1 rounded-xl border border-field bg-surface px-4 text-base text-ink shadow-sm outline-none placeholder:text-ink-faint focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-12 rounded-xl px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
              className="min-h-11 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink-body transition-colors hover:border-brand-600 hover:text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-on-brand"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 text-sm text-ink-subtle" aria-live="polite">
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
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 border-b border-line px-1 py-4 font-semibold text-ink hover:text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                <span>{locale === "ja" ? japaneseTaxonomyLabels.topic[topic.id] : topic.label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink-subtle">{locale === "ja"
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
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-ink">{message("glossaryIndex.noResults")}</h2>
          <p className="mt-2 text-ink-muted">{message("glossaryIndex.noResultsHelp")}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {message("glossaryIndex.showAll")}
          </button>
        </div>
      )}
    </div>
  );
}
