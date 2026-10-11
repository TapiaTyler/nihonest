import { defaultThemePreference, themePreferenceSchema, type ThemePreference } from "@/domain/theme/theme";
import { storedValue, type KeyValueStore } from "./key-value-store";

/** Also read by the inline script in the root layout, which applies the choice before the first paint. */
export const themeStorageKey = "nihonest:theme:v1";
const theme = storedValue(themeStorageKey);

export function readThemePreference(storage: KeyValueStore | undefined = theme.store()): ThemePreference {
  const parsed = themePreferenceSchema.safeParse(theme.read(storage));
  return parsed.success ? parsed.data : defaultThemePreference;
}

export const getThemeSnapshot = (): string => theme.snapshot(defaultThemePreference);
export const subscribeToTheme = theme.subscribe;

/** An invalid value is ignored; "system" removes the key so the default needs no storage. */
export function writeThemePreference(preference: ThemePreference, storage: KeyValueStore | undefined = theme.store()): void {
  const parsed = themePreferenceSchema.safeParse(preference);
  if (!parsed.success) return;
  theme.write(parsed.data === defaultThemePreference ? null : parsed.data, storage);
}
