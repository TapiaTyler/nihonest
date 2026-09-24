import { checklistProgressSchema, type ChecklistProgress } from "@/domain/roadmap/personalized-roadmap";
import { parseStoredJson, storedValue, type KeyValueStore } from "./key-value-store";

export const checklistProgressStorageKey = "nihonest:checklist-progress:v1";
const checklistProgress = storedValue(checklistProgressStorageKey);

export function readChecklistProgress(storage: KeyValueStore | undefined = checklistProgress.store()): readonly ChecklistProgress[] {
  return parseStoredJson(checklistProgress.read(storage), checklistProgressSchema.array()) ?? [];
}

export const getChecklistProgressSnapshot = (): string => checklistProgress.snapshot();
export const subscribeToChecklistProgress = checklistProgress.subscribe;

export function writeChecklistProgress(records: readonly ChecklistProgress[], storage: KeyValueStore | undefined = checklistProgress.store()): void {
  checklistProgress.write(JSON.stringify(records), storage);
}
