"use client";

import { useState } from "react";
import type {
  ResidenceStatus,
  ResidenceStatusCategory,
} from "@/domain/residence-status/residence-status";
import { RESIDENCE_STATUS_CATEGORY_IDS, residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { ResidenceStatusCard } from "./residence-status-card";

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
  const visibleStatuses = residenceStatuses
    .filter((status) => activeFilter === "all" || status.category === activeFilter)
    .sort((left, right) => left.englishName.localeCompare(right.englishName));

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter residence statuses by category">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-500" aria-live="polite">
        Showing {visibleStatuses.length} of {residenceStatuses.length} draft statuses
      </p>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleStatuses.map((residenceStatus) => (
          <ResidenceStatusCard key={residenceStatus.id} residenceStatus={residenceStatus} />
        ))}
      </div>
    </div>
  );
}
