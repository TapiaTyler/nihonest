"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { defaultThemePreference, themePreferenceSchema, type ThemePreference } from "@/domain/theme/theme";
import { getThemeSnapshot, subscribeToTheme, writeThemePreference } from "@/lib/storage/theme";

/**
 * The saved theme choice. Every consumer reads the store itself, with "system" as the server snapshot, so a
 * component that hydrates late still matches the server HTML (the same approach as the language setting).
 */
export function useThemePreference() {
  const snapshot = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => defaultThemePreference);
  const preference = useMemo<ThemePreference>(() => {
    const parsed = themePreferenceSchema.safeParse(snapshot);
    return parsed.success ? parsed.data : defaultThemePreference;
  }, [snapshot]);
  const setPreference = useCallback((next: ThemePreference) => writeThemePreference(next), []);
  return { preference, setPreference };
}
