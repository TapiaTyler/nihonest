import { storedValue, type KeyValueStore } from "./key-value-store";

/** How a page presents its items. Cards are the default; only a choice of list is stored. */
export type ViewMode = "cards" | "list";

/** Pages that offer the toggle. Each remembers its own choice. */
export const viewModePages = ["explore", "residence-statuses", "faq"] as const;
export type ViewModePage = (typeof viewModePages)[number];

export const viewModeStorageKey = (page: ViewModePage) => `nihonest:view-mode:${page}:v1`;

const storedViewModes = new Map(viewModePages.map((page) => [page, storedValue(viewModeStorageKey(page))]));
const stored = (page: ViewModePage) => storedViewModes.get(page)!;

export function readViewMode(page: ViewModePage, storage: KeyValueStore | undefined = stored(page).store()): ViewMode {
  return stored(page).read(storage) === "list" ? "list" : "cards";
}

/** Raw snapshot for `useSyncExternalStore`; anything other than "list" means cards. */
export const getViewModeSnapshot = (page: ViewModePage): string => stored(page).snapshot("cards");
export const subscribeToViewMode = (page: ViewModePage, onChange: () => void) => stored(page).subscribe(onChange);

export function writeViewMode(page: ViewModePage, mode: ViewMode, storage: KeyValueStore | undefined = stored(page).store()): void {
  stored(page).write(mode === "list" ? "list" : null, storage);
}
