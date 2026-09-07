"use client";

import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/content/article-card";
import { FaqResult } from "@/components/faq/faq-result";
import { GlossaryCard } from "@/components/glossary/glossary-card";
import { ArticleGroupCard } from "./article-group-card";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { FaqEntry } from "@/lib/content/faqs";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { audiences, CONTENT_TYPE_IDS, geographicScopes, IMPORTANCE_IDS, journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { defaultKnowledgebaseSearchFilters, hasActiveKnowledgebaseSearch, searchKnowledgebase, type KnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";

const contentTypeLabels: Record<(typeof CONTENT_TYPE_IDS)[number], string> = {
  guide: "Guide", reference: "Reference", checklist: "Checklist", glossary: "Glossary", "official-procedure": "Official procedure",
};
const importanceLabels: Record<(typeof IMPORTANCE_IDS)[number], string> = {
  informational: "Informational", recommended: "Recommended", important: "Important", critical: "Critical",
};
const exploreReturnStorageKey = "nihonest:explore-return";

const filterParamKeys: Record<keyof KnowledgebaseSearchFilters, string> = {
  query: "q",
  kind: "kind",
  journeyStageId: "stage",
  topicId: "topic",
  audienceId: "audience",
  geographicScopeId: "scope",
  contentType: "content",
  importance: "importance",
  residenceStatusId: "status",
};

function filtersFromSearch(search: string, residenceStatuses: readonly ResidenceStatus[]): KnowledgebaseSearchFilters {
  const params = new URLSearchParams(search);
  const accepted = <Value extends string>(value: string | null, values: readonly Value[]): Value | "all" =>
    value && values.includes(value as Value) ? value as Value : "all";

  return {
    query: params.get("q") ?? "",
    kind: accepted(params.get("kind"), ["all", "group", "faq", "article", "glossary"] as const),
    journeyStageId: accepted(params.get("stage"), ["all", ...journeyStages.map(({ id }) => id)]),
    topicId: accepted(params.get("topic"), ["all", ...topics.map(({ id }) => id)]),
    audienceId: accepted(params.get("audience"), ["all", ...audiences.map(({ id }) => id)]),
    geographicScopeId: accepted(params.get("scope"), ["all", ...geographicScopes.map(({ id }) => id)]),
    contentType: accepted(params.get("content"), ["all", ...CONTENT_TYPE_IDS]),
    importance: accepted(params.get("importance"), ["all", ...IMPORTANCE_IDS]),
    residenceStatusId: accepted(params.get("status"), ["all", ...residenceStatuses.map(({ id }) => id)]),
  };
}

function searchForFilters(filters: KnowledgebaseSearchFilters) {
  const params = new URLSearchParams();
  for (const [key, paramKey] of Object.entries(filterParamKeys) as [keyof KnowledgebaseSearchFilters, string][]) {
    const value = filters[key];
    if (value && value !== "all") params.set(paramKey, value);
  }
  return params.toString();
}

export function ExploreDiscovery({ groups, articles, terms, residenceStatuses, faqEntries = [] }: Readonly<{
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
  terms: readonly JapaneseTerm[];
  residenceStatuses: readonly ResidenceStatus[];
  faqEntries?: readonly FaqEntry[];
}>) {
  const searchId = useId();
  const [filters, setFilters] = useState<KnowledgebaseSearchFilters>(defaultKnowledgebaseSearchFilters);
  const filtersRef = useRef<KnowledgebaseSearchFilters>(defaultKnowledgebaseSearchFilters);
  const isSearching = hasActiveKnowledgebaseSearch(filters);
  const results = useMemo(
    () => searchKnowledgebase(groups, articles, terms, filters, faqEntries.map(({ faq }) => faq)),
    [articles, faqEntries, filters, groups, terms],
  );
  const groupResults = results.flatMap((result) => result.kind === "group" ? [result.group] : []);
  const faqResults = results.flatMap((result) => {
    if (result.kind !== "faq") return [];
    const entry = faqEntries.find((candidate) => candidate.faq.id === result.faq.id);
    return entry ? [entry] : [];
  });
  const articleResults = results.flatMap((result) => result.kind === "article" ? [result.article] : []);
  const glossaryResults = results.flatMap((result) => result.kind === "glossary" ? [result.term] : []);
  const defaultGroups = useMemo(
    () => [...groups].sort((left, right) => left.title.localeCompare(right.title, "en", { sensitivity: "base" })),
    [groups],
  );
  const residenceStatusOptionGroups = useMemo(
    () => RESIDENCE_STATUS_CATEGORY_IDS.map((category) => ({
      label: residenceStatusCategoryLabels[category],
      options: residenceStatuses
        .filter((status) => status.category === category)
        .map(({ id, englishName }) => ({ id, label: englishName }))
        .sort((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" })),
    })).filter(({ options }) => options.length > 0),
    [residenceStatuses],
  );
  const filterSearch = searchForFilters(filters);
  const returnTo = filterSearch ? `/explore?${filterSearch}` : "/explore";

  useEffect(() => {
    // The URL is the durable discovery state so result-page returns, refresh, and browser history reconstruct the same filters.
    function restoreFromUrl() {
      const restoredFilters = filtersFromSearch(window.location.search, residenceStatuses);
      filtersRef.current = restoredFilters;
      setFilters(restoredFilters);
      sessionStorage.setItem(exploreReturnStorageKey, window.location.pathname + window.location.search);
    }
    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, [residenceStatuses]);

  function updateFilter<Key extends keyof KnowledgebaseSearchFilters>(key: Key, value: KnowledgebaseSearchFilters[Key]) {
    const next = { ...filtersRef.current, [key]: value };
    filtersRef.current = next;
    setFilters(next);
    const search = searchForFilters(next);
    window.history.replaceState(null, "", search ? `/explore?${search}` : "/explore");
    sessionStorage.setItem(exploreReturnStorageKey, search ? `/explore?${search}` : "/explore");
  }

  function clearSearch() {
    filtersRef.current = defaultKnowledgebaseSearchFilters;
    setFilters(defaultKnowledgebaseSearchFilters);
    window.history.replaceState(null, "", "/explore");
    sessionStorage.setItem(exploreReturnStorageKey, "/explore");
  }

  return (
    <div className="mt-10">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="knowledgebase-search-heading">
        <h2 id="knowledgebase-search-heading" className="text-xl font-semibold tracking-tight text-slate-950">Search every guide and term</h2>
        <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-slate-900">What do you need help with?</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id={searchId}
            type="search"
            value={filters.query}
            onChange={(event) => updateFilter("query", event.target.value)}
            placeholder="Try bank account, Student status, or juminhyo"
            className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
          {isSearching && <button type="button" onClick={clearSearch} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Clear search and filters</button>}
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by content kind">
          {[{ id: "all" as const, label: "Everything" }, { id: "group" as const, label: "Groups" }, { id: "faq" as const, label: "FAQs" }, { id: "article" as const, label: "Guides" }, { id: "glossary" as const, label: "Glossary terms" }].map((option) => (
            <button key={option.id} type="button" aria-pressed={filters.kind === option.id} onClick={() => updateFilter("kind", option.id)} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white">{option.label}</button>
          ))}
        </div>

        <details className="mt-5 border-t border-slate-200 pt-5">
          <summary className="min-h-11 cursor-pointer select-none font-semibold text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">More filters</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FilterSelect label="Journey stage" value={filters.journeyStageId} onChange={(value) => updateFilter("journeyStageId", value)} options={journeyStages} />
            <FilterSelect label="Topic" value={filters.topicId} onChange={(value) => updateFilter("topicId", value)} options={topics} />
            <FilterSelect label="Audience" value={filters.audienceId} onChange={(value) => updateFilter("audienceId", value)} options={audiences} />
            <FilterSelect label="Geographic scope" value={filters.geographicScopeId} onChange={(value) => updateFilter("geographicScopeId", value)} options={geographicScopes} />
            <FilterSelect label="Content type" value={filters.contentType} onChange={(value) => updateFilter("contentType", value)} options={CONTENT_TYPE_IDS.map((id) => ({ id, label: contentTypeLabels[id] }))} />
            <FilterSelect label="Importance" value={filters.importance} onChange={(value) => updateFilter("importance", value)} options={IMPORTANCE_IDS.map((id) => ({ id, label: importanceLabels[id] }))} />
            <FilterSelect label="Residence status" value={filters.residenceStatusId} onChange={(value) => updateFilter("residenceStatusId", value)} optionGroups={residenceStatusOptionGroups} />
          </div>
        </details>
      </section>

      {isSearching ? (
        <section className="mt-12" aria-labelledby="search-results-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Search results</p>
              <h2 id="search-results-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Matching guidance</h2>
            </div>
            <p className="text-sm text-slate-500" aria-live="polite">{results.length} {results.length === 1 ? "result" : "results"}</p>
          </div>
          {results.length > 0 ? (
            <div className="mt-7">
              <nav aria-label="Jump to result type" className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="mr-1 text-sm font-semibold text-slate-700">Jump to:</span>
                {groupResults.length > 0 && <ResultJumpLink href="#result-groups" label="Groups" count={groupResults.length} />}
                {faqResults.length > 0 && <ResultJumpLink href="#result-faqs" label="FAQs" count={faqResults.length} />}
                {articleResults.length > 0 && <ResultJumpLink href="#result-guides" label="Guides" count={articleResults.length} />}
                {glossaryResults.length > 0 && <ResultJumpLink href="#result-terms" label="Glossary terms" count={glossaryResults.length} />}
              </nav>

              {groupResults.length > 0 && (
                <ResultSection id="result-groups" title="Content groups" count={groupResults.length}>
                  {groupResults.map((group) => <ArticleGroupCard key={group.id} group={group} returnTo={returnTo} />)}
                </ResultSection>
              )}
              {faqResults.length > 0 && (
                <ResultSection id="result-faqs" title="Frequently asked questions" count={faqResults.length} layout="list">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    {faqResults.map((entry) => <FaqResult key={entry.faq.id} entry={entry} />)}
                  </div>
                </ResultSection>
              )}
              {articleResults.length > 0 && (
                <ResultSection id="result-guides" title="Guides" count={articleResults.length}>
                  {articleResults.map((article) => <ArticleCard key={article.id} article={article} returnTo={returnTo} />)}
                </ResultSection>
              )}
              {glossaryResults.length > 0 && (
                <ResultSection id="result-terms" title="Glossary terms" count={glossaryResults.length}>
                  {glossaryResults.map((term) => <GlossaryCard key={term.id} term={term} />)}
                </ResultSection>
              )}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-950">No matching guidance found</h3>
              <p className="mt-2 text-slate-600">Try a broader phrase, remove a filter, or return to the content groups.</p>
              <button type="button" onClick={clearSearch} className="mt-5 min-h-11 rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Browse all groups</button>
              {filters.query.trim() && (
                <Link href={{ pathname: "/faq", query: { q: filters.query } }} className="mt-3 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  Search FAQs for this question →
                </Link>
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-14" aria-labelledby="content-groups-heading">
          <p className="eyebrow">Browse by group</p>
          <h2 id="content-groups-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Choose a place to begin</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">Open a group to see its guides. Search above can take you directly to any individual article or glossary term.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {defaultGroups.map((group) => <ArticleGroupCard key={group.id} group={group} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ResultJumpLink({ href, label, count }: Readonly<{ href: string; label: string; count: number }>) {
  return (
    <a href={href} className="inline-flex min-h-11 items-center rounded-full border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      {label} ({count})
    </a>
  );
}

function ResultSection({ id, title, count, children, layout = "grid" }: Readonly<{ id: string; title: string; count: number; children: ReactNode; layout?: "grid" | "list" }>) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6 border-b border-slate-200 py-10 last:border-b-0 last:pb-0">
      <div className="flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <span className="text-sm text-slate-500">{count} {count === 1 ? "match" : "matches"}</span>
      </div>
      <div className={layout === "grid" ? "mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "mt-6"}>{children}</div>
    </section>
  );
}

function FilterSelect<OptionId extends string>({ label, value, onChange, options = [], optionGroups = [] }: Readonly<{
  label: string;
  value: "all" | OptionId;
  onChange: (value: "all" | OptionId) => void;
  options?: readonly { id: OptionId; label: string }[];
  optionGroups?: readonly { label: string; options: readonly { id: OptionId; label: string }[] }[];
}>) {
  const id = useId();
  return (
    <label htmlFor={id} className="text-sm font-semibold text-slate-800">
      {label}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as "all" | OptionId)} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal text-slate-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
        <option value="all">All</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        {optionGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
