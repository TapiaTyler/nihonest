"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { createGlossaryStudyProgress, recordGlossaryReview, setGlossaryReviewState, updateGlossaryStudyProgress, type GlossaryReviewOutcome, type GlossaryStudyProgress } from "@/domain/glossary-study/glossary-study";
import { getGlossaryStudySnapshot, readGlossaryStudyProgress, subscribeToGlossaryStudy, writeGlossaryStudyProgress } from "@/lib/storage/glossary-study";

type GlossaryStudyContextValue = Readonly<{
  isReady: boolean;
  records: readonly GlossaryStudyProgress[];
  recordReview: (termId: string, outcome: GlossaryReviewOutcome) => void;
  setReviewState: (termId: string, state: GlossaryStudyProgress["state"]) => void;
}>;

const GlossaryStudyContext = createContext<GlossaryStudyContextValue | undefined>(undefined);

export function GlossaryStudyProvider({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = useSyncExternalStore(subscribeToGlossaryStudy, getGlossaryStudySnapshot, () => null);
  const records = useMemo(() => snapshot === null ? [] : readGlossaryStudyProgress(), [snapshot]);

  const recordReviewForTerm = useCallback((termId: string, outcome: GlossaryReviewOutcome) => {
    // Read at interaction time to avoid overwriting newer progress from another tab.
    const currentRecords = readGlossaryStudyProgress();
    const reviewedAt = new Date().toISOString();
    const current = currentRecords.find((record) => record.termId === termId)
      ?? createGlossaryStudyProgress(termId, reviewedAt);
    writeGlossaryStudyProgress(updateGlossaryStudyProgress(
      currentRecords,
      recordGlossaryReview(current, outcome, reviewedAt),
    ));
  }, []);

  const setReviewStateForTerm = useCallback((termId: string, state: GlossaryStudyProgress["state"]) => {
    const currentRecords = readGlossaryStudyProgress();
    const updatedAt = new Date().toISOString();
    const current = currentRecords.find((record) => record.termId === termId)
      ?? createGlossaryStudyProgress(termId, updatedAt);
    writeGlossaryStudyProgress(updateGlossaryStudyProgress(
      currentRecords,
      setGlossaryReviewState(current, state, updatedAt),
    ));
  }, []);

  const value = useMemo<GlossaryStudyContextValue>(() => ({
    isReady: snapshot !== null,
    records,
    recordReview: recordReviewForTerm,
    setReviewState: setReviewStateForTerm,
  }), [recordReviewForTerm, records, setReviewStateForTerm, snapshot]);

  return <GlossaryStudyContext.Provider value={value}>{children}</GlossaryStudyContext.Provider>;
}

export function useGlossaryStudy(): GlossaryStudyContextValue {
  const context = useContext(GlossaryStudyContext);
  if (!context) throw new Error("useGlossaryStudy must be used within GlossaryStudyProvider.");
  return context;
}
