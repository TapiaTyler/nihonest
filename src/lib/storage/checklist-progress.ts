import { checklistProgressSchema, type ChecklistProgress } from "@/domain/roadmap/personalized-roadmap";

export const checklistProgressStorageKey = "nihonest:checklist-progress:v1";
const checklistProgressChangedEvent = "nihonest:checklist-progress-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function readChecklistProgress(storage: StorageAdapter | undefined = availableStorage()): readonly ChecklistProgress[] {
  if (!storage) return [];
  try {
    const stored = storage.getItem(checklistProgressStorageKey);
    if (!stored) return [];
    const parsed = checklistProgressSchema.array().safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function getChecklistProgressSnapshot(): string {
  try {
    return availableStorage()?.getItem(checklistProgressStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToChecklistProgress(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handleStorage = (event: StorageEvent) => {
    if (event.key === checklistProgressStorageKey || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(checklistProgressChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(checklistProgressChangedEvent, onStoreChange);
  };
}

export function writeChecklistProgress(
  records: readonly ChecklistProgress[],
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(checklistProgressStorageKey, JSON.stringify(records));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(checklistProgressChangedEvent));
    }
  } catch {
    // Checklist progress remains optional when browser storage is unavailable or full.
  }
}
