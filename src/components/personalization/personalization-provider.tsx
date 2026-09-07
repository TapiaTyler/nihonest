"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  defaultAnonymousPreferences,
  type AnonymousPreferences,
} from "@/domain/personalization/preferences";
import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
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

  const value = useMemo<PersonalizationContextValue>(() => ({
    preferences,
    isReady,
    saveStartingPoint: ({ journeyStage, journeyId, routeId, focusedArticleId }) => writeAnonymousPreferences({
      version: 2,
      journeyStage,
      journeyId,
      routeId,
      focusedArticleId,
      onboardingCompleted: true,
    }),
    saveJourneyRoute: ({ journeyId, routeId, focusedArticleId }) => writeAnonymousPreferences({
      ...preferences,
      version: 2,
      journeyId,
      routeId,
      focusedArticleId,
    }),
    chooseGeneralExperience: () => writeAnonymousPreferences({ version: 2, onboardingCompleted: true }),
  }), [isReady, preferences]);

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export function usePersonalization(): PersonalizationContextValue {
  const context = useContext(PersonalizationContext);
  if (!context) throw new Error("usePersonalization must be used within PersonalizationProvider.");
  return context;
}
