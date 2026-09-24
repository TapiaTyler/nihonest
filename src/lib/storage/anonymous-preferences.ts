import {
  anonymousPreferencesSchema,
  defaultAnonymousPreferences,
  type AnonymousPreferences,
} from "@/domain/personalization/preferences";
import { parseStoredJson, storedValue, type KeyValueStore } from "./key-value-store";

export const anonymousPreferencesStorageKey = "nihonest:anonymous-preferences:v2";
const anonymousPreferences = storedValue(anonymousPreferencesStorageKey);

export function readAnonymousPreferences(storage: KeyValueStore | undefined = anonymousPreferences.store()): AnonymousPreferences {
  return parseStoredJson(anonymousPreferences.read(storage), anonymousPreferencesSchema) ?? defaultAnonymousPreferences;
}

export const getAnonymousPreferencesSnapshot = (): string => anonymousPreferences.snapshot();
export const subscribeToAnonymousPreferences = anonymousPreferences.subscribe;

export function writeAnonymousPreferences(preferences: AnonymousPreferences, storage: KeyValueStore | undefined = anonymousPreferences.store()): void {
  anonymousPreferences.write(JSON.stringify(preferences), storage);
}
