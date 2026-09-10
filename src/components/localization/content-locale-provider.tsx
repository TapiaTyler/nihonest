"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  contentLocalePreferenceSchema,
  defaultContentLocale,
  type ContentLocalePreference,
} from "@/domain/localization/content-locale";
import {
  getContentLocaleSnapshot,
  readContentLocale,
  subscribeToContentLocale,
  writeContentLocale,
} from "@/lib/storage/content-locale";

type ContentLocaleContextValue = Readonly<{
  locale: ContentLocalePreference;
  setLocale: (locale: ContentLocalePreference) => void;
}>;

const ContentLocaleContext = createContext<ContentLocaleContextValue | undefined>(undefined);

export function ContentLocaleProvider({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = useSyncExternalStore(
    subscribeToContentLocale,
    getContentLocaleSnapshot,
    () => defaultContentLocale,
  );
  const locale = useMemo(() => {
    const parsed = contentLocalePreferenceSchema.safeParse(snapshot);
    return parsed.success ? parsed.data : readContentLocale();
  }, [snapshot]);
  const setLocale = useCallback((nextLocale: ContentLocalePreference) => writeContentLocale(nextLocale), []);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <ContentLocaleContext.Provider value={value}>{children}</ContentLocaleContext.Provider>;
}

export function useContentLocale(): ContentLocaleContextValue {
  const context = useContext(ContentLocaleContext);
  if (!context) throw new Error("useContentLocale must be used within ContentLocaleProvider.");
  return context;
}
