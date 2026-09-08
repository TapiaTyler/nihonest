import { glossaryStudyProgressSchema, type GlossaryStudyProgress } from "@/domain/glossary-study/glossary-study";

export const glossaryStudyStorageKey = "nihonest:glossary-study:v1";
const glossaryStudyChangedEvent = "nihonest:glossary-study-changed";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function readGlossaryStudyProgress(storage: StorageAdapter | undefined = availableStorage()): readonly GlossaryStudyProgress[] {
  if (!storage) return [];
  try {
    const stored = storage.getItem(glossaryStudyStorageKey);
    if (!stored) return [];
    const parsed = glossaryStudyProgressSchema.array().safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function getGlossaryStudySnapshot(): string {
  try {
    return availableStorage()?.getItem(glossaryStudyStorageKey) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToGlossaryStudy(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handleStorage = (event: StorageEvent) => {
    if (event.key === glossaryStudyStorageKey || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(glossaryStudyChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(glossaryStudyChangedEvent, onStoreChange);
  };
}

export function writeGlossaryStudyProgress(
  records: readonly GlossaryStudyProgress[],
  storage: StorageAdapter | undefined = availableStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(glossaryStudyStorageKey, JSON.stringify(records));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(glossaryStudyChangedEvent));
    }
  } catch {
    // Review remains optional when browser storage is unavailable or full.
  }
}
