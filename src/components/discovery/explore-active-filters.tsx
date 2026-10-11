"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";

export type ActiveExploreFilter = Readonly<{ key: string; label: string; valueLabel: string; remove: () => void }>;

/**
 * The advanced filters that are narrowing Explore, each removable on its own. They live in a collapsible panel, so
 * without these a visitor arriving from a link such as `/explore?stage=planning` could not see why results were limited.
 */
export function ExploreActiveFilters({ filters }: Readonly<{ filters: readonly ActiveExploreFilter[] }>) {
  const { message, format } = useInterfaceMessages();
  if (filters.length === 0) return null;

  return (
    <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label={message("explore.activeFilters")}>
      {filters.map(({ key, label, valueLabel, remove }) => (
        <li key={key}>
          <button
            type="button"
            onClick={remove}
            aria-label={format("explore.removeFilter", { filter: label, value: valueLabel })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-300 bg-teal-50 pl-4 pr-3 text-sm font-semibold text-teal-950 hover:border-teal-600 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {format("explore.activeFilterLabel", { filter: label, value: valueLabel })}
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0 text-teal-700">
              <path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
