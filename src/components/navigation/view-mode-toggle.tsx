"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { getViewModeSnapshot, subscribeToViewMode, writeViewMode, type ViewMode, type ViewModePage } from "@/lib/storage/view-mode";

/**
 * The page's remembered presentation. Prebuilt HTML always shows cards (the server snapshot); a stored choice of
 * list applies right after hydration.
 */
export function useViewMode(page: ViewModePage): readonly [ViewMode, (mode: ViewMode) => void] {
  const subscribe = useCallback((onChange: () => void) => subscribeToViewMode(page, onChange), [page]);
  const raw = useSyncExternalStore(subscribe, () => getViewModeSnapshot(page), () => "cards");
  const setMode = useCallback((mode: ViewMode) => writeViewMode(page, mode), [page]);
  return [raw === "list" ? "list" : "cards", setMode] as const;
}

function CardsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" /><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" /><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
      <rect x="1.5" y="2" width="13" height="2.5" rx="1" /><rect x="1.5" y="6.75" width="13" height="2.5" rx="1" />
      <rect x="1.5" y="11.5" width="13" height="2.5" rx="1" />
    </svg>
  );
}

/** Two pressed-state buttons; the choice changes only presentation, never results, order, or filters. */
export function ViewModeToggle({ mode, onChange }: Readonly<{ mode: ViewMode; onChange: (mode: ViewMode) => void }>) {
  const { message } = useInterfaceMessages();
  const option = (value: ViewMode, label: string, icon: ReactNode) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => onChange(value)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-body transition-colors hover:text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:bg-brand aria-pressed:text-on-brand"
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={message("view.label")} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-strong bg-surface p-1">
      {option("cards", message("view.cards"), <CardsIcon />)}
      {option("list", message("view.list"), <ListIcon />)}
    </div>
  );
}
