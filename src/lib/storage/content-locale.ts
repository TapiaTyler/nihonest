import {
  contentLocalePreferenceSchema,
  defaultContentLocale,
  type ContentLocalePreference,
} from "@/domain/localization/content-locale";

export const contentLocaleStorageKey = "nihonest:content-locale:v1";
const contentLocaleChangedEvent = "nihonest:content-locale-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function readContentLocale(storage: StorageAdapter | undefined = availableStorage()): ContentLocalePreference {
  if (!storage) return defaultContentLocale;

  try {
    const parsed = contentLocalePreferenceSchema.safeParse(storage.getItem(contentLocaleStorageKey));
    return parsed.success ? parsed.data : defaultContentLocale;
  } catch {
    return defaultContentLocale;
  }
}

export function getContentLocaleSnapshot(): string {
  try {
    return availableStorage()?.getItem(contentLocaleStorageKey) ?? defaultContentLocale;
  } catch {
    return defaultContentLocale;
  }
}

export function subscribeToContentLocale(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  function handleStorage(event: StorageEvent) {
    if (event.key === contentLocaleStorageKey || event.key === null) onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(contentLocaleChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(contentLocaleChangedEvent, onStoreChange);
  };
}

export function writeContentLocale(
  locale: ContentLocalePreference,
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;

  try {
    storage.setItem(contentLocaleStorageKey, contentLocalePreferenceSchema.parse(locale));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(contentLocaleChangedEvent));
    }
  } catch {
    // Canonical English remains available when browser storage is unavailable.
  }
}
