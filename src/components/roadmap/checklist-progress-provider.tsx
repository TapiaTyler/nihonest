"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { createChecklistProgress, updateChecklistProgress, type ChecklistProgress } from "@/domain/roadmap/personalized-roadmap";
import { getChecklistProgressSnapshot, readChecklistProgress, subscribeToChecklistProgress, writeChecklistProgress } from "@/lib/storage/checklist-progress";

type ChecklistProgressContextValue = Readonly<{
  isReady: boolean;
  records: readonly ChecklistProgress[];
  setProgress: (checklistId: string, state: ChecklistProgress["state"]) => void;
}>;

const ChecklistProgressContext = createContext<ChecklistProgressContextValue | undefined>(undefined);

export function ChecklistProgressProvider({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = useSyncExternalStore(subscribeToChecklistProgress, getChecklistProgressSnapshot, () => null);
  const records = useMemo(() => snapshot === null ? [] : readChecklistProgress(), [snapshot]);

  const setProgress = useCallback((checklistId: string, state: ChecklistProgress["state"]) => {
    // Read on interaction so another tab's newer checklist update is not overwritten.
    const currentRecords = readChecklistProgress();
    const updatedAt = new Date().toISOString();
    writeChecklistProgress(updateChecklistProgress(
      currentRecords,
      createChecklistProgress(checklistId, state, updatedAt),
    ));
  }, []);

  const value = useMemo<ChecklistProgressContextValue>(() => ({
    isReady: snapshot !== null,
    records,
    setProgress,
  }), [records, setProgress, snapshot]);

  return <ChecklistProgressContext.Provider value={value}>{children}</ChecklistProgressContext.Provider>;
}

export function useChecklistProgress(): ChecklistProgressContextValue {
  const context = useContext(ChecklistProgressContext);
  if (!context) throw new Error("useChecklistProgress must be used within ChecklistProgressProvider.");
  return context;
}
