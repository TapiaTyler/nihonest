import { savedContentRecordSchema, type SavedContentRecord } from "@/domain/saved-content/saved-content";
import { parseStoredJson, storedValue, type KeyValueStore } from "./key-value-store";

export const savedContentStorageKey = "nihonest:saved-content:v1";
const savedContent = storedValue(savedContentStorageKey);

export function readSavedContent(storage: KeyValueStore | undefined = savedContent.store()): readonly SavedContentRecord[] {
  return parseStoredJson(savedContent.read(storage), savedContentRecordSchema.array()) ?? [];
}

export const getSavedContentSnapshot = (): string => savedContent.snapshot();
export const subscribeToSavedContent = savedContent.subscribe;

export function writeSavedContent(records: readonly SavedContentRecord[], storage: KeyValueStore | undefined = savedContent.store()): void {
  savedContent.write(JSON.stringify(records), storage);
}
