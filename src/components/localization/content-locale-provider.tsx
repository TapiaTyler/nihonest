"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  contentLocaleOptions,
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

/**
 * The selected locale, read from the store by each consumer rather than passed down through context. React reads the
 * server snapshot (English) while a component hydrates, so a Suspense boundary that hydrates after the provider has
 * already switched to Japanese still matches the server HTML instead of raising a hydration mismatch.
 */
function useLocaleSnapshot(): ContentLocalePreference {
  const snapshot = useSyncExternalStore(
    subscribeToContentLocale,
    getContentLocaleSnapshot,
    () => defaultContentLocale,
  );
  return useMemo(() => {
    const parsed = contentLocalePreferenceSchema.safeParse(snapshot);
    return parsed.success ? parsed.data : readContentLocale();
  }, [snapshot]);
}

export function ContentLocaleProvider({ children }: Readonly<{ children: ReactNode }>) {
  const locale = useLocaleSnapshot();
  const setLocale = useCallback((nextLocale: ContentLocalePreference) => writeContentLocale(nextLocale), []);

  // The root layout renders `lang="en"`, so keep the document language in step with the selected language. Japanese
  // line breaking and typography key off `:lang(ja)`, and screen readers choose their voice from it.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Follow the shared locale order and leave text-entry shortcuts alone.
  useEffect(() => {
    function handleLanguageShortcut(event: KeyboardEvent) {
      const target = event.target;
      const isEditableTarget = target instanceof HTMLElement && (
        target.isContentEditable
        || target.matches("input, textarea, select, [role='textbox']")
        || target.closest("[contenteditable='true'], [role='textbox']") !== null
      );

      if (
        event.defaultPrevented
        || event.repeat
        || event.isComposing
        || isEditableTarget
        || !event.altKey
        || !event.shiftKey
        || event.ctrlKey
        || event.metaKey
        || (event.code ? event.code !== "KeyG" : event.key.toLowerCase() !== "g")
      ) return;

      const currentIndex = contentLocaleOptions.findIndex((option) => option.id === locale);
      const nextIndex = (currentIndex + 1) % contentLocaleOptions.length;
      const nextLocale = contentLocaleOptions[nextIndex];
      if (!nextLocale) return;

      event.preventDefault();
      setLocale(nextLocale.id);
    }

    window.addEventListener("keydown", handleLanguageShortcut);
    return () => window.removeEventListener("keydown", handleLanguageShortcut);
  }, [locale, setLocale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <ContentLocaleContext.Provider value={value}>{children}</ContentLocaleContext.Provider>;
}

export function useContentLocale(): ContentLocaleContextValue {
  const context = useContext(ContentLocaleContext);
  const locale = useLocaleSnapshot();
  if (!context) throw new Error("useContentLocale must be used within ContentLocaleProvider.");
  return useMemo(() => ({ locale, setLocale: context.setLocale }), [locale, context.setLocale]);
}

/** Allows small reusable UI labels to retain canonical English in isolated renders and tests. */
export function useOptionalContentLocale(): ContentLocaleContextValue | undefined {
  const context = useContext(ContentLocaleContext);
  const locale = useLocaleSnapshot();
  const setLocale = context?.setLocale;
  return useMemo(() => setLocale ? { locale, setLocale } : undefined, [locale, setLocale]);
}
