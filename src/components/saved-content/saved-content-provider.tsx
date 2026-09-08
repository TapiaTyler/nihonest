"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { savedContentKey, updateSavedContent, type SavedContentReference } from "@/domain/saved-content/saved-content";
import { getSavedContentSnapshot, readSavedContent, subscribeToSavedContent, writeSavedContent } from "@/lib/storage/saved-content";

type SavedContentContextValue = Readonly<{
  isReady: boolean;
  records: ReturnType<typeof readSavedContent>;
  isSaved: (reference: SavedContentReference) => boolean;
  setSaved: (reference: SavedContentReference, shouldSave: boolean) => void;
}>;

const SavedContentContext = createContext<SavedContentContextValue | undefined>(undefined);

export function SavedContentProvider({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = useSyncExternalStore(subscribeToSavedContent, getSavedContentSnapshot, () => null);
  const records = useMemo(() => snapshot === null ? [] : readSavedContent(), [snapshot]);

  const isSaved = useCallback((reference: SavedContentReference) => (
    records.find((record) => savedContentKey(record) === savedContentKey(reference))?.state === "saved"
  ), [records]);

  const setSaved = useCallback((reference: SavedContentReference, shouldSave: boolean) => {
    // Read at interaction time so rapid changes and other tabs cannot be overwritten by a stale render.
    const currentRecords = readSavedContent();
    writeSavedContent(updateSavedContent(currentRecords, reference, shouldSave ? "saved" : "removed", new Date().toISOString()));
  }, []);

  const value = useMemo<SavedContentContextValue>(() => ({
    isReady: snapshot !== null,
    records,
    isSaved,
    setSaved,
  }), [isSaved, records, setSaved, snapshot]);

  return <SavedContentContext.Provider value={value}>{children}</SavedContentContext.Provider>;
}

export function useSavedContent(): SavedContentContextValue {
  const context = useContext(SavedContentContext);
  if (!context) throw new Error("useSavedContent must be used within SavedContentProvider.");
  return context;
}

