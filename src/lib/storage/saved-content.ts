import { savedContentRecordSchema, type SavedContentRecord } from "@/domain/saved-content/saved-content";

export const savedContentStorageKey = "nihonest:saved-content:v1";
const savedContentChangedEvent = "nihonest:saved-content-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function readSavedContent(storage: StorageAdapter | undefined = availableStorage()): readonly SavedContentRecord[] {
  if (!storage) return [];
  try {
    const stored = storage.getItem(savedContentStorageKey);
    if (!stored) return [];
    const parsed = savedContentRecordSchema.array().safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function getSavedContentSnapshot(): string {
  try {
    return availableStorage()?.getItem(savedContentStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToSavedContent(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  function handleStorage(event: StorageEvent) {
    if (event.key === savedContentStorageKey || event.key === null) onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(savedContentChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(savedContentChangedEvent, onStoreChange);
  };
}

export function writeSavedContent(
  records: readonly SavedContentRecord[],
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(savedContentStorageKey, JSON.stringify(records));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(savedContentChangedEvent));
    }
  } catch {
    // Saving remains optional when browser storage is unavailable or full.
  }
}

