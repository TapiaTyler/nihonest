"use client";

import { useId, useMemo } from "react";
import { DebouncedSearchInput } from "@/components/search/debounced-search-input";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels, type ResidenceStatus } from "@/domain/residence-status/residence-status";
import { audiences, CONTENT_TYPE_IDS, geographicScopes, IMPORTANCE_IDS, journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import type { KnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";
import type { UpdateExploreFilter } from "@/components/discovery/explore-search-state";

const contentTypeLabels: Record<(typeof CONTENT_TYPE_IDS)[number], string> = {
  guide: "Guide", reference: "Reference", checklist: "Checklist", glossary: "Glossary", "official-procedure": "Official procedure",
};
const importanceLabels: Record<(typeof IMPORTANCE_IDS)[number], string> = {
  informational: "Informational", recommended: "Recommended", important: "Important", critical: "Critical",
};
const kindOptions = [
  { id: "all", label: "Everything" },
  { id: "group", label: "Groups" },
  { id: "faq", label: "FAQs" },
  { id: "article", label: "Guides" },
  { id: "glossary", label: "Glossary terms" },
] as const;

export function ExploreFilterPanel({
  filters,
  isSearching,
  locale,
  residenceStatuses,
  updateFilter,
  commitQuery,
  clearSearch,
}: Readonly<{
  filters: KnowledgebaseSearchFilters;
  isSearching: boolean;
  locale: ContentLocalePreference;
  residenceStatuses: readonly ResidenceStatus[];
  updateFilter: UpdateExploreFilter;
  commitQuery: (value: string) => void;
  clearSearch: () => void;
}>) {
  const searchId = useId();
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

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="knowledgebase-search-heading">
      <h2 id="knowledgebase-search-heading" className="text-xl font-semibold tracking-tight text-slate-950">Search every guide and term</h2>
      <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-slate-900">What do you need help with?</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <DebouncedSearchInput
          id={searchId}
          value={filters.query}
          onCommit={commitQuery}
          placeholder={locale === "ja" ? "例：在留資格、ビザ、日本へ入国" : "Try bank account, Student status, or juminhyo"}
          className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        {isSearching && <button type="button" onClick={clearSearch} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Clear search and filters</button>}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by content kind">
        {kindOptions.map((option) => (
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
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as "all" | OptionId)} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal text-slate-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
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
