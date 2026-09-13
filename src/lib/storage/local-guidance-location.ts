export const localGuidanceLocationStorageKey = "nihonest:local-guidance-location:v1";
const localGuidanceLocationChangedEvent = "nihonest:local-guidance-location-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function getLocalGuidanceLocationSnapshot(): string {
  try {
    return availableStorage()?.getItem(localGuidanceLocationStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToLocalGuidanceLocation(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === localGuidanceLocationStorageKey || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(localGuidanceLocationChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(localGuidanceLocationChangedEvent, onStoreChange);
  };
}

export function writeLocalGuidanceLocation(value: string, storage = availableStorage()): void {
  if (!storage) return;
  try {
    if (value) storage.setItem(localGuidanceLocationStorageKey, value);
    else storage.removeItem(localGuidanceLocationStorageKey);
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(localGuidanceLocationChangedEvent));
    }
  } catch {
    // Local guidance remains optional when browser storage is unavailable.
  }
}
