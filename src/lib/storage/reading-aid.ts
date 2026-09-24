import {
  defaultReadingAidPreference,
  readingAidPreferenceSchema,
  type ReadingAidPreference,
} from "@/domain/localization/reading-aid";
import { storedValue, type KeyValueStore } from "./key-value-store";

export const readingAidStorageKey = "nihonest:reading-aid:v1";
const readingAid = storedValue(readingAidStorageKey);

export function readReadingAid(storage: KeyValueStore | undefined = readingAid.store()): ReadingAidPreference {
  const parsed = readingAidPreferenceSchema.safeParse(readingAid.read(storage));
  return parsed.success ? parsed.data : defaultReadingAidPreference;
}

export const getReadingAidSnapshot = (): string => readingAid.snapshot(defaultReadingAidPreference);
export const subscribeToReadingAid = readingAid.subscribe;

/** Invalid preferences are ignored; both readings remain visible when storage is unavailable. */
export function writeReadingAid(preference: ReadingAidPreference, storage: KeyValueStore | undefined = readingAid.store()): void {
  const parsed = readingAidPreferenceSchema.safeParse(preference);
  if (parsed.success) readingAid.write(parsed.data, storage);
}
