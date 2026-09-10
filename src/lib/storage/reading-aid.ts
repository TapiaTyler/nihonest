import {
  defaultReadingAidPreference,
  readingAidPreferenceSchema,
  type ReadingAidPreference,
} from "@/domain/localization/reading-aid";

export const readingAidStorageKey = "nihonest:reading-aid:v1";
const readingAidChangedEvent = "nihonest:reading-aid-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function readReadingAid(storage: StorageAdapter | undefined = availableStorage()): ReadingAidPreference {
  if (!storage) return defaultReadingAidPreference;
  try {
    const parsed = readingAidPreferenceSchema.safeParse(storage.getItem(readingAidStorageKey));
    return parsed.success ? parsed.data : defaultReadingAidPreference;
  } catch {
    return defaultReadingAidPreference;
  }
}

export function getReadingAidSnapshot(): string {
  try {
    return availableStorage()?.getItem(readingAidStorageKey) ?? defaultReadingAidPreference;
  } catch {
    return defaultReadingAidPreference;
  }
}

export function subscribeToReadingAid(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  function handleStorage(event: StorageEvent) {
    if (event.key === readingAidStorageKey || event.key === null) onStoreChange();
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(readingAidChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(readingAidChangedEvent, onStoreChange);
  };
}

export function writeReadingAid(
  preference: ReadingAidPreference,
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(readingAidStorageKey, readingAidPreferenceSchema.parse(preference));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(readingAidChangedEvent));
    }
  } catch {
    // Both readings remain visible when browser storage is unavailable.
  }
}
