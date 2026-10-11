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
import { ExploreActiveFilters, type ActiveExploreFilter } from "@/components/discovery/explore-active-filters";
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

  const advancedFilters = [
    { key: "journeyStageId", label: message("explore.journeyStage"), value: filters.journeyStageId, options: optionsFor(journeyStages, japaneseTaxonomyLabels.journeyStage) },
    { key: "topicId", label: message("explore.topic"), value: filters.topicId, options: optionsFor(topics, japaneseTaxonomyLabels.topic) },
    { key: "audienceId", label: message("explore.audience"), value: filters.audienceId, options: optionsFor(audiences, japaneseTaxonomyLabels.audience) },
    { key: "geographicScopeId", label: message("explore.geographicScope"), value: filters.geographicScopeId, options: optionsFor(geographicScopes, japaneseTaxonomyLabels.geographicScope) },
    { key: "contentType", label: message("explore.contentType"), value: filters.contentType, options: CONTENT_TYPE_IDS.map((id) => ({ id, label: locale === "ja" ? japaneseTaxonomyLabels.contentType[id] : englishContentTypeLabels[id] })) },
    { key: "importance", label: message("explore.importance"), value: filters.importance, options: IMPORTANCE_IDS.map((id) => ({ id, label: locale === "ja" ? japaneseTaxonomyLabels.importance[id] : englishImportanceLabels[id] })) },
    { key: "residenceStatusId", label: message("explore.residenceStatus"), value: filters.residenceStatusId, options: residenceStatusOptionGroups.flatMap(({ options }) => options) },
  ] as const;
  const activeFilters: ActiveExploreFilter[] = advancedFilters.flatMap(({ key, label, value, options }) => {
    const valueLabel = value === "all" ? undefined : (options as readonly { id: string; label: string }[]).find(({ id }) => id === value)?.label;
    return valueLabel ? [{ key, label, valueLabel, remove: () => updateFilter(key, "all") }] : [];
  });

  return (
    <section role="search" className="rounded-3xl border border-line bg-surface-subtle p-5 sm:p-7" aria-labelledby="knowledgebase-search-heading">
      <h2 id="knowledgebase-search-heading" className="text-xl font-semibold tracking-tight text-ink">{message("explore.searchHeading")}</h2>
      <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-ink-strong">{message("explore.searchQuestion")}</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <DebouncedSearchInput
          id={searchId}
          value={filters.query}
          onCommit={commitQuery}
          placeholder={message("explore.searchPlaceholder")}
          className="min-h-12 flex-1 rounded-xl border border-line-strong bg-surface px-4 text-base text-ink shadow-sm outline-none placeholder:text-ink-faint focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
        />
        {isSearching && <button type="button" onClick={clearSearch} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("explore.clearSearch")}</button>}
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={message("explore.filterByKind")}>
        {kindOptions.map((option) => (
          <button key={option.id} type="button" aria-pressed={filters.kind === option.id} onClick={() => updateFilter("kind", option.id)} className="min-h-11 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink-body hover:border-brand-600 hover:text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-on-brand">{option.label}</button>
        ))}
      </div>

      <ExploreActiveFilters filters={activeFilters} />

      <details className="group mt-5 border-t border-line pt-5">
        <summary className="flex min-h-11 cursor-pointer list-none select-none items-center justify-between gap-4 font-semibold text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden"><span>{message("explore.moreFilters")}</span><DisclosureChevron /></summary>
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
    <label htmlFor={id} className="text-sm font-semibold text-ink-firm">
      {label}
      <select ref={selectRef} id={id} value={value} onChange={(event) => onChange(event.target.value as "all" | OptionId)} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 font-normal text-ink-firm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20">
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
