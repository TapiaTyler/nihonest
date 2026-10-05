"use client";

import { useEffect, useState } from "react";
import type {
  ResidenceStatus,
  ResidenceStatusCategory,
} from "@/domain/residence-status/residence-status";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { ResidenceStatusCard } from "./residence-status-card";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { useViewMode, ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import { useOptionalContentLocale } from "@/components/localization/content-locale-provider";
import { defaultContentLocale } from "@/domain/localization/content-locale";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import type { ResidenceStatusTranslation } from "@/lib/content/translations";

type ResidenceStatusExplorerProps = Readonly<{
  residenceStatuses: readonly ResidenceStatus[];
  translations?: readonly ResidenceStatusTranslation[];
}>;

export function ResidenceStatusExplorer({ residenceStatuses, translations = [] }: ResidenceStatusExplorerProps) {
  const locale = useOptionalContentLocale()?.locale ?? defaultContentLocale;
  const { message } = useInterfaceMessages();
  const [activeFilter, setActiveFilter] = useState<"all" | ResidenceStatusCategory>("all");
  const [viewMode, setViewMode] = useViewMode("residence-statuses");
  const rowVariant = viewMode === "list" ? "row" : "card";
  const filters: readonly { id: "all" | ResidenceStatusCategory; label: string }[] = [
    { id: "all", label: message("status.all") },
    ...RESIDENCE_STATUS_CATEGORY_IDS.map((id) => ({
      id,
      label: locale === "ja" ? japaneseTaxonomyLabels.residenceStatusCategory[id] : residenceStatusCategoryLabels[id],
    })).sort((left, right) => left.label.localeCompare(right.label, locale, { sensitivity: "base" })),
  ];
  const translationsById = new Map(translations
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation]));
  const returnTo = activeFilter === "all" ? "/residence-statuses" : `/residence-statuses?category=${activeFilter}`;
  const visibleStatuses = residenceStatuses
    .filter((status) => activeFilter === "all" || status.category === activeFilter)
    .sort((left, right) => (locale === "ja" ? left.japaneseName : left.englishName)
      .localeCompare(locale === "ja" ? right.japaneseName : right.englishName, locale, { sensitivity: "base" }));
  const statusGroups = filters.slice(1).flatMap((filter) => {
    const groupedStatuses = visibleStatuses.filter((status) => status.category === filter.id);
    return groupedStatuses.length > 0 ? [{ filter, statuses: groupedStatuses }] : [];
  });

  useEffect(() => {
    function restoreFilterFromUrl() {
      const requestedCategory = new URLSearchParams(window.location.search).get("category");
      setActiveFilter(RESIDENCE_STATUS_CATEGORY_IDS.some((id) => id === requestedCategory)
        ? requestedCategory as ResidenceStatusCategory
        : "all");
    }

    restoreFilterFromUrl();
    window.addEventListener("popstate", restoreFilterFromUrl);
    return () => window.removeEventListener("popstate", restoreFilterFromUrl);
  }, []);

  function updateFilter(nextFilter: "all" | ResidenceStatusCategory) {
    setActiveFilter(nextFilter);
    window.history.replaceState(
      null,
      "",
      nextFilter === "all" ? "/residence-statuses" : `/residence-statuses?category=${nextFilter}`,
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2" role="group" aria-label={message("status.filterByCategory")}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => updateFilter(filter.id)}
            className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          {visibleStatuses.length} / {residenceStatuses.length} {message("status.statuses")}
        </p>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {activeFilter === "all" ? (
        <div className="mt-6 space-y-4">
          {statusGroups.map(({ filter, statuses }) => (
            <details key={filter.id} open className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 bg-white px-5 py-4 font-semibold text-slate-950 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                <span>{filter.label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">{statuses.length} {message(statuses.length === 1 ? "status.status" : "status.statuses")}</span>
                  <DisclosureChevron />
                </span>
              </summary>
              <ViewModeItems
                mode={viewMode}
                gridClassName="grid min-w-0 grid-cols-1 gap-6 border-t border-slate-200 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-3"
                listContainerClassName="border-t border-slate-200 bg-slate-50 p-5"
                items={statuses.map((residenceStatus) => ({
                  key: residenceStatus.id,
                  node: <ResidenceStatusCard residenceStatus={residenceStatus} translation={translationsById.get(residenceStatus.id)} categoryLabel={filter.label} variant={rowVariant} showCategory={false} />,
                }))}
              />
            </details>
          ))}
        </div>
      ) : (
        <ViewModeItems
          mode={viewMode}
          gridClassName="mt-6 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          listContainerClassName="mt-6"
          items={visibleStatuses.map((residenceStatus) => ({
            key: residenceStatus.id,
            node: <ResidenceStatusCard residenceStatus={residenceStatus} translation={translationsById.get(residenceStatus.id)} categoryLabel={locale === "ja" ? japaneseTaxonomyLabels.residenceStatusCategory[residenceStatus.category] : residenceStatusCategoryLabels[residenceStatus.category]} returnTo={returnTo} variant={rowVariant} />,
          }))}
        />
      )}
    </div>
  );
}
