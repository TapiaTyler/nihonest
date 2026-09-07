import {
  anonymousPreferencesSchema,
  defaultAnonymousPreferences,
  type AnonymousPreferences,
} from "@/domain/personalization/preferences";

export const anonymousPreferencesStorageKey = "nihonest:anonymous-preferences:v2";
const anonymousPreferencesChangedEvent = "nihonest:anonymous-preferences-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function readAnonymousPreferences(
  storage: StorageAdapter | undefined = availableStorage(),
): AnonymousPreferences {
  if (!storage) return defaultAnonymousPreferences;

  try {
    const stored = storage.getItem(anonymousPreferencesStorageKey);
    if (!stored) return defaultAnonymousPreferences;
    const parsed = anonymousPreferencesSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : defaultAnonymousPreferences;
  } catch {
    return defaultAnonymousPreferences;
  }
}

export function getAnonymousPreferencesSnapshot(): string {
  try {
    return availableStorage()?.getItem(anonymousPreferencesStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToAnonymousPreferences(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  function handleStorage(event: StorageEvent) {
    if (event.key === anonymousPreferencesStorageKey || event.key === null) onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(anonymousPreferencesChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(anonymousPreferencesChangedEvent, onStoreChange);
  };
}

export function writeAnonymousPreferences(
  preferences: AnonymousPreferences,
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;

  try {
    storage.setItem(anonymousPreferencesStorageKey, JSON.stringify(preferences));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(anonymousPreferencesChangedEvent));
    }
  } catch {
    // The public experience remains usable when browser storage is unavailable.
  }
}
