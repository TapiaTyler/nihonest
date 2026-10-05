"use client";

import { useId, useMemo } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { DebouncedSearchInput } from "@/components/search/debounced-search-input";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels, type ResidenceStatus } from "@/domain/residence-status/residence-status";
import { audiences, CONTENT_TYPE_IDS, geographicScopes, IMPORTANCE_IDS, journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import type { KnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";
import type { UpdateExploreFilter } from "@/components/discovery/explore-search-state";
import { usePreHydrationInput } from "@/components/navigation/use-pre-hydration-input";

const englishContentTypeLabels: Record<(typeof CONTENT_TYPE_IDS)[number], string> = {
  guide: "Guide", reference: "Reference", checklist: "Checklist", glossary: "Glossary", "official-procedure": "Official procedure",
};
const englishImportanceLabels: Record<(typeof IMPORTANCE_IDS)[number], string> = {
  informational: "Informational", recommended: "Recommended", important: "Important", critical: "Critical",
};
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
  const { message } = useInterfaceMessages();
  const searchId = useId();
  const kindOptions = [
    { id: "all", label: message("explore.everything") },
    { id: "group", label: message("explore.groups") },
    { id: "faq", label: message("explore.faqs") },
    { id: "article", label: message("explore.guides") },
    { id: "glossary", label: message("explore.glossaryTerms") },
  ] as const;
  const residenceStatusOptionGroups = useMemo(
    () => RESIDENCE_STATUS_CATEGORY_IDS.map((category) => ({
      label: locale === "ja" ? japaneseTaxonomyLabels.residenceStatusCategory[category] : residenceStatusCategoryLabels[category],
      options: residenceStatuses
        .filter((status) => status.category === category)
        .map(({ id, englishName, japaneseName }) => ({ id, label: locale === "ja" ? japaneseName : englishName }))
        .sort((left, right) => left.label.localeCompare(right.label, locale, { sensitivity: "base" })),
    })).filter(({ options }) => options.length > 0),
    [locale, residenceStatuses],
  );

  const optionsFor = <OptionId extends string>(
    options: readonly { id: OptionId; label: string }[],
    labels: Readonly<Record<OptionId, string>>,
  ) => locale === "ja" ? options.map(({ id }) => ({ id, label: labels[id] })) : options;

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="knowledgebase-search-heading">
      <h2 id="knowledgebase-search-heading" className="text-xl font-semibold tracking-tight text-slate-950">{message("explore.searchHeading")}</h2>
      <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-slate-900">{message("explore.searchQuestion")}</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <DebouncedSearchInput
          id={searchId}
          value={filters.query}
          onCommit={commitQuery}
          placeholder={locale === "ja" ? "例：在留資格、ビザ、日本へ入国" : "Try bank account, Student status, or juminhyo"}
          className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        {isSearching && <button type="button" onClick={clearSearch} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("explore.clearSearch")}</button>}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={message("explore.filterByKind")}>
        {kindOptions.map((option) => (
          <button key={option.id} type="button" aria-pressed={filters.kind === option.id} onClick={() => updateFilter("kind", option.id)} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white">{option.label}</button>
        ))}
      </div>

      <details className="group mt-5 border-t border-slate-200 pt-5">
        <summary className="flex min-h-11 cursor-pointer list-none select-none items-center justify-between gap-4 font-semibold text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden"><span>{message("explore.moreFilters")}</span><DisclosureChevron /></summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect allLabel={message("explore.all")} label={message("explore.journeyStage")} value={filters.journeyStageId} onChange={(value) => updateFilter("journeyStageId", value)} options={optionsFor(journeyStages, japaneseTaxonomyLabels.journeyStage)} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.topic")} value={filters.topicId} onChange={(value) => updateFilter("topicId", value)} options={optionsFor(topics, japaneseTaxonomyLabels.topic)} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.audience")} value={filters.audienceId} onChange={(value) => updateFilter("audienceId", value)} options={optionsFor(audiences, japaneseTaxonomyLabels.audience)} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.geographicScope")} value={filters.geographicScopeId} onChange={(value) => updateFilter("geographicScopeId", value)} options={optionsFor(geographicScopes, japaneseTaxonomyLabels.geographicScope)} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.contentType")} value={filters.contentType} onChange={(value) => updateFilter("contentType", value)} options={CONTENT_TYPE_IDS.map((id) => ({ id, label: locale === "ja" ? japaneseTaxonomyLabels.contentType[id] : englishContentTypeLabels[id] }))} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.importance")} value={filters.importance} onChange={(value) => updateFilter("importance", value)} options={IMPORTANCE_IDS.map((id) => ({ id, label: locale === "ja" ? japaneseTaxonomyLabels.importance[id] : englishImportanceLabels[id] }))} />
          <FilterSelect allLabel={message("explore.all")} label={message("explore.residenceStatus")} value={filters.residenceStatusId} onChange={(value) => updateFilter("residenceStatusId", value)} optionGroups={residenceStatusOptionGroups} />
        </div>
      </details>
    </section>
  );
}

function FilterSelect<OptionId extends string>({ allLabel, label, value, onChange, options = [], optionGroups = [] }: Readonly<{
  allLabel: string;
  label: string;
  value: "all" | OptionId;
  onChange: (value: "all" | OptionId) => void;
  options?: readonly { id: OptionId; label: string }[];
  optionGroups?: readonly { label: string; options: readonly { id: OptionId; label: string }[] }[];
}>) {
  const id = useId();
  const selectRef = usePreHydrationInput<HTMLSelectElement>((chosen) => onChange(chosen as "all" | OptionId));
  return (
    <label htmlFor={id} className="text-sm font-semibold text-slate-800">
      {label}
      <select ref={selectRef} id={id} value={value} onChange={(event) => onChange(event.target.value as "all" | OptionId)} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal text-slate-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
        <option value="all">{allLabel}</option>
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
