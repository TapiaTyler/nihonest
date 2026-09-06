"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { TopicId } from "@/domain/taxonomy/taxonomy";
import { topics } from "@/domain/taxonomy/taxonomy";
import { searchGlossary } from "@/lib/search/glossary-search";
import { GlossaryCard } from "./glossary-card";

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

export function GlossaryExplorer({ terms }: Readonly<{ terms: readonly JapaneseTerm[] }>) {
  const searchId = useId();
  const [filters, setFilters] = useState<GlossaryFilters>(defaultGlossaryFilters);
  const filtersRef = useRef<GlossaryFilters>(defaultGlossaryFilters);
  const { query, topicId } = filters;
  const availableTopics = topics.filter((topic) =>
    terms.some((term) => term.topicIds.includes(topic.id)),
  );
  const visibleTerms = searchGlossary(terms, { query, topicId });
  const hasFilters = Boolean(query.trim()) || topicId !== "all";
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
          Search Japanese or English
        </label>
        <p id={`${searchId}-hint`} className="mt-1 text-sm leading-6 text-slate-600">
          Try Japanese characters, kana, romaji with or without macrons, or an English meaning.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => updateFilters({ query: event.target.value })}
            aria-describedby={`${searchId}-hint`}
            placeholder="Example: 住民票, juminhyo, residence certificate"
            className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Clear search and filters
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter glossary by topic">
          {[{ id: "all" as const, label: "All topics" }, ...availableTopics].map((topic) => (
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

      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        Showing {visibleTerms.length} of {terms.length} terms
      </p>

      {visibleTerms.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleTerms.map((term) => (
            <GlossaryCard
              key={term.id}
              term={term}
              returnTo={hasFilters ? returnTo : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-950">No glossary terms found</h2>
          <p className="mt-2 text-slate-600">Check the spelling, try the English meaning, or clear the topic filter.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show all terms
          </button>
        </div>
      )}
    </div>
  );
}
