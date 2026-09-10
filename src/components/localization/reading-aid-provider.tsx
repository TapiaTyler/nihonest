"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  defaultReadingAidPreference,
  readingAidPreferenceSchema,
  type ReadingAidPreference,
} from "@/domain/localization/reading-aid";
import {
  getReadingAidSnapshot,
  readReadingAid,
  subscribeToReadingAid,
  writeReadingAid,
} from "@/lib/storage/reading-aid";

type ReadingAidContextValue = Readonly<{
  readingAid: ReadingAidPreference;
  setReadingAid: (preference: ReadingAidPreference) => void;
}>;

const ReadingAidContext = createContext<ReadingAidContextValue | undefined>(undefined);

export function ReadingAidProvider({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = useSyncExternalStore(subscribeToReadingAid, getReadingAidSnapshot, () => defaultReadingAidPreference);
  const readingAid = useMemo(() => {
    const parsed = readingAidPreferenceSchema.safeParse(snapshot);
    return parsed.success ? parsed.data : readReadingAid();
  }, [snapshot]);
  const setReadingAid = useCallback((preference: ReadingAidPreference) => writeReadingAid(preference), []);
  const value = useMemo(() => ({ readingAid, setReadingAid }), [readingAid, setReadingAid]);

  // A root attribute lets server-rendered term cards respond without turning every display into client state.
  useEffect(() => {
    document.documentElement.dataset.readingAid = readingAid;
    return () => {
      delete document.documentElement.dataset.readingAid;
    };
  }, [readingAid]);

  return <ReadingAidContext.Provider value={value}>{children}</ReadingAidContext.Provider>;
}

export function useReadingAid(): ReadingAidContextValue {
  const context = useContext(ReadingAidContext);
  if (!context) throw new Error("useReadingAid must be used within ReadingAidProvider.");
  return context;
}
