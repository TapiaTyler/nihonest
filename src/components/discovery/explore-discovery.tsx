"use client";

import { useId, useMemo, useState } from "react";
import { ArticleCard } from "@/components/content/article-card";
import { GlossaryCard } from "@/components/glossary/glossary-card";
import { ArticleGroupCard } from "./article-group-card";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { audiences, CONTENT_TYPE_IDS, geographicScopes, IMPORTANCE_IDS, journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { defaultKnowledgebaseSearchFilters, hasActiveKnowledgebaseSearch, searchKnowledgebase, type KnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";

const contentTypeLabels: Record<(typeof CONTENT_TYPE_IDS)[number], string> = {
  guide: "Guide", reference: "Reference", checklist: "Checklist", glossary: "Glossary", "official-procedure": "Official procedure",
};
const importanceLabels: Record<(typeof IMPORTANCE_IDS)[number], string> = {
  informational: "Informational", recommended: "Recommended", important: "Important", critical: "Critical",
};

export function ExploreDiscovery({ groups, articles, terms, residenceStatuses }: Readonly<{
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
  terms: readonly JapaneseTerm[];
  residenceStatuses: readonly ResidenceStatus[];
}>) {
  const searchId = useId();
  const [filters, setFilters] = useState<KnowledgebaseSearchFilters>(defaultKnowledgebaseSearchFilters);
  const isSearching = hasActiveKnowledgebaseSearch(filters);
  const results = useMemo(() => searchKnowledgebase(groups, articles, terms, filters), [articles, filters, groups, terms]);

  function updateFilter<Key extends keyof KnowledgebaseSearchFilters>(key: Key, value: KnowledgebaseSearchFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearSearch() {
    setFilters(defaultKnowledgebaseSearchFilters);
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
          {[{ id: "all" as const, label: "Everything" }, { id: "group" as const, label: "Groups" }, { id: "article" as const, label: "Guides" }, { id: "glossary" as const, label: "Glossary terms" }].map((option) => (
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
            <FilterSelect label="Residence status" value={filters.residenceStatusId} onChange={(value) => updateFilter("residenceStatusId", value)} options={residenceStatuses.map(({ id, englishName }) => ({ id, label: englishName }))} />
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
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => {
                if (result.kind === "group") return <ArticleGroupCard key={`group-${result.group.id}`} group={result.group} />;
                if (result.kind === "article") return <ArticleCard key={`article-${result.article.id}`} article={result.article} />;
                return <GlossaryCard key={`glossary-${result.term.id}`} term={result.term} />;
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-950">No matching guidance found</h3>
              <p className="mt-2 text-slate-600">Try a broader phrase, remove a filter, or return to the content groups.</p>
              <button type="button" onClick={clearSearch} className="mt-5 min-h-11 rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Browse all groups</button>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-14" aria-labelledby="content-groups-heading">
          <p className="eyebrow">Browse by group</p>
          <h2 id="content-groups-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Choose a place to begin</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">Open a group to see its guides. Search above can take you directly to any individual article or glossary term.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => <ArticleGroupCard key={group.id} group={group} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function FilterSelect<OptionId extends string>({ label, value, onChange, options }: Readonly<{
  label: string;
  value: "all" | OptionId;
  onChange: (value: "all" | OptionId) => void;
  options: readonly { id: OptionId; label: string }[];
}>) {
  const id = useId();
  return (
    <label htmlFor={id} className="text-sm font-semibold text-slate-800">
      {label}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as "all" | OptionId)} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal text-slate-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
        <option value="all">All</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  );
}
