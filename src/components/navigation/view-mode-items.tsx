import { Fragment, type ReactNode } from "react";
import type { ViewMode } from "@/lib/storage/view-mode";

/**
 * Shared list styling so every list view scans the same way. From the small breakpoint each row is two fixed
 * columns (text, and a narrower details column for status, topics, or counts), so rows line up no matter how much
 * text they carry. Every row renders exactly those two children. No arrows: the whole row is the link.
 */
export const listRowClassName = "group relative grid min-w-0 gap-2 px-5 py-4 transition-colors hover:bg-teal-50/60 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center sm:gap-6";
export const listRowFocusClassName = "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700";
// Right-aligned so short details (one badge) meet the row edge instead of leaving an empty strip.
export const listRowDetailsClassName = "flex min-w-0 flex-wrap items-center gap-2 text-sm sm:flex-col sm:items-end sm:gap-1.5 sm:text-right";

/** The same items as a card grid or a compact list; order and content never differ between the two. */
export function ViewModeItems({ mode, gridClassName, listContainerClassName, items, label }: Readonly<{
  mode: ViewMode;
  gridClassName: string;
  /** Spacing around the list where the grid carried its own padding or borders. */
  listContainerClassName?: string;
  items: readonly Readonly<{ key: string; node: ReactNode }>[];
  /** Accessible name for the list, when the surrounding heading does not already name it. */
  label?: string;
}>) {
  // Cards render exactly as before the toggle existed: the grid's direct children are the cards.
  if (mode === "cards") return <div className={gridClassName}>{items.map(({ key, node }) => <Fragment key={key}>{node}</Fragment>)}</div>;
  const list = (
    <ul aria-label={label} className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {items.map(({ key, node }) => <li key={key} className="min-w-0">{node}</li>)}
    </ul>
  );
  return listContainerClassName ? <div className={listContainerClassName}>{list}</div> : list;
}
