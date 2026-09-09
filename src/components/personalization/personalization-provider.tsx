"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  defaultAnonymousPreferences,
  type AnonymousPreferences,
} from "@/domain/personalization/preferences";
import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import {
  loadSignedInPreferences,
  saveSignedInPreferences,
} from "@/lib/accounts/client-account-service";
import {
  getAnonymousPreferencesSnapshot,
  readAnonymousPreferences,
  subscribeToAnonymousPreferences,
  writeAnonymousPreferences,
} from "@/lib/storage/anonymous-preferences";

type PersonalizationContextValue = Readonly<{
  preferences: AnonymousPreferences;
  isReady: boolean;
  saveStartingPoint: (selection: Readonly<{
    journeyStage: JourneyStageId;
    journeyId?: string;
    routeId?: string;
    focusedArticleId?: string;
  }>) => void;
  saveJourneyRoute: (selection: Readonly<{
    journeyId: string;
    routeId: string;
    focusedArticleId: string;
  }>) => void;
  chooseGeneralExperience: () => void;
}>;

const PersonalizationContext = createContext<PersonalizationContextValue | undefined>(undefined);

export function PersonalizationProvider({ children }: Readonly<{ children: ReactNode }>) {
  // useSyncExternalStore keeps same-tab custom events and cross-tab storage events on one hydration-safe subscription path.
  const snapshot = useSyncExternalStore(
    subscribeToAnonymousPreferences,
    getAnonymousPreferencesSnapshot,
    () => null,
  );
  const preferences = useMemo(
    () => snapshot === null ? defaultAnonymousPreferences : readAnonymousPreferences(),
    [snapshot],
  );
  const isReady = snapshot !== null;

  useEffect(() => {
    const localSnapshotAtStart = getAnonymousPreferencesSnapshot();
    void loadSignedInPreferences().then((accountPreferences) => {
      // Do not replace a choice made while the account request was in flight.
      if (accountPreferences && getAnonymousPreferencesSnapshot() === localSnapshotAtStart) {
        writeAnonymousPreferences(accountPreferences);
      }
    });
  }, []);

  const persistPreferences = useCallback((nextPreferences: AnonymousPreferences) => {
    writeAnonymousPreferences(nextPreferences);
    void saveSignedInPreferences(nextPreferences);
  }, []);

  const value = useMemo<PersonalizationContextValue>(() => ({
    preferences,
    isReady,
    saveStartingPoint: ({ journeyStage, journeyId, routeId, focusedArticleId }) => persistPreferences({
      version: 2,
      journeyStage,
      journeyId,
      routeId,
      focusedArticleId,
      onboardingCompleted: true,
    }),
    saveJourneyRoute: ({ journeyId, routeId, focusedArticleId }) => persistPreferences({
      ...preferences,
      version: 2,
      journeyId,
      routeId,
      focusedArticleId,
    }),
    chooseGeneralExperience: () => persistPreferences({ version: 2, onboardingCompleted: true }),
  }), [isReady, persistPreferences, preferences]);

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export function usePersonalization(): PersonalizationContextValue {
  const context = useContext(PersonalizationContext);
  if (!context) throw new Error("usePersonalization must be used within PersonalizationProvider.");
  return context;
}
