"use client";

import { useEffect, useState } from "react";
import type {
  ResidenceStatus,
  ResidenceStatusCategory,
} from "@/domain/residence-status/residence-status";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { ResidenceStatusCard } from "./residence-status-card";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";

const filters: readonly { id: "all" | ResidenceStatusCategory; label: string }[] = [
  { id: "all", label: "All statuses" },
  ...RESIDENCE_STATUS_CATEGORY_IDS
    .map((id) => ({ id, label: residenceStatusCategoryLabels[id] }))
    .sort((left, right) => left.label.localeCompare(right.label)),
];

type ResidenceStatusExplorerProps = Readonly<{
  residenceStatuses: readonly ResidenceStatus[];
}>;

export function ResidenceStatusExplorer({ residenceStatuses }: ResidenceStatusExplorerProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | ResidenceStatusCategory>("all");
  const returnTo = activeFilter === "all" ? "/residence-statuses" : `/residence-statuses?category=${activeFilter}`;
  const visibleStatuses = residenceStatuses
    .filter((status) => activeFilter === "all" || status.category === activeFilter)
    .sort((left, right) => left.englishName.localeCompare(right.englishName));
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
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter residence statuses by category">
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

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">
        Showing {visibleStatuses.length} of {residenceStatuses.length} draft statuses
      </p>

      {activeFilter === "all" ? (
        <div className="mt-6 space-y-4">
          {statusGroups.map(({ filter, statuses }) => (
            <details key={filter.id} open className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 bg-white px-5 py-4 font-semibold text-slate-950 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                <span>{filter.label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">{statuses.length} {statuses.length === 1 ? "status" : "statuses"}</span>
                  <DisclosureChevron />
                </span>
              </summary>
              <div className="grid min-w-0 grid-cols-1 gap-6 border-t border-slate-200 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-3">
                {statuses.map((residenceStatus) => <ResidenceStatusCard key={residenceStatus.id} residenceStatus={residenceStatus} />)}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleStatuses.map((residenceStatus) => <ResidenceStatusCard key={residenceStatus.id} residenceStatus={residenceStatus} returnTo={returnTo} />)}
        </div>
      )}
    </div>
  );
}
