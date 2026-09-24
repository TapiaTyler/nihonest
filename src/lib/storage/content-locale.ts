import {
  contentLocalePreferenceSchema,
  defaultContentLocale,
  type ContentLocalePreference,
} from "@/domain/localization/content-locale";
import { storedValue, type KeyValueStore } from "./key-value-store";

export const contentLocaleStorageKey = "nihonest:content-locale:v1";
const contentLocale = storedValue(contentLocaleStorageKey);

export function readContentLocale(storage: KeyValueStore | undefined = contentLocale.store()): ContentLocalePreference {
  const parsed = contentLocalePreferenceSchema.safeParse(contentLocale.read(storage));
  return parsed.success ? parsed.data : defaultContentLocale;
}

export const getContentLocaleSnapshot = (): string => contentLocale.snapshot(defaultContentLocale);
export const subscribeToContentLocale = contentLocale.subscribe;

/** Invalid locales are ignored; canonical English remains available when storage is unavailable. */
export function writeContentLocale(locale: ContentLocalePreference, storage: KeyValueStore | undefined = contentLocale.store()): void {
  const parsed = contentLocalePreferenceSchema.safeParse(locale);
  if (parsed.success) contentLocale.write(parsed.data, storage);
}
