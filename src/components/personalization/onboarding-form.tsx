"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingActions } from "@/components/personalization/onboarding-actions";
import { OnboardingJourneySelector } from "@/components/personalization/onboarding-journey-selector";
import { OnboardingRouteSelector } from "@/components/personalization/onboarding-route-selector";
import { OnboardingStageSelector } from "@/components/personalization/onboarding-stage-selector";
import { useOptionalContentLocale } from "@/components/localization/content-locale-provider";
import { usePersonalization } from "@/components/personalization/personalization-provider";
import { useUnsavedChangesWarning } from "@/components/personalization/use-unsaved-changes-warning";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup, GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyArticleIds, getJourneyRouteForArticle } from "@/domain/discovery/discovery";
import { routeOptionsForJourney, searchFocusedGuides, searchJourneyOptions, type JourneySearchResult } from "@/domain/personalization/journey-search";
import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import { queueJourneyUpdateNotice } from "@/lib/storage/journey-update-notice";
import { localizeJourney, type JourneyTranslation } from "@/domain/localization/journey-presentation";
import type { ArticleGroupSearchTranslation } from "@/lib/search/knowledgebase-search";

/** Owns onboarding selection derivation, persistence, warnings, and return routing. */
export function OnboardingForm({
  journeys,
  groups,
  articles,
  returnTo,
  journeyTranslations = [],
  groupTranslations = [],
}: Readonly<{
  journeys: readonly GuidedJourney[];
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
  returnTo: "/" | "/roadmap" | "/my-journey";
  journeyTranslations?: readonly JourneyTranslation[];
  groupTranslations?: readonly ArticleGroupSearchTranslation[];
}>) {
  const router = useRouter();
  const locale = useOptionalContentLocale()?.locale ?? "en";
  const { preferences, isReady, saveStartingPoint, chooseGeneralExperience } = usePersonalization();
  const [stageSelection, setStageSelection] = useState<JourneyStageId>();
  const [journeySelection, setJourneySelection] = useState<string | null>();
  const [routeSelection, setRouteSelection] = useState<string | null>();
  const [focusedArticleSelection, setFocusedArticleSelection] = useState<string | null>();
  const [query, setQuery] = useState("");

  const selectedStage = stageSelection ?? (isReady ? preferences.journeyStage : undefined);
  const selectedJourneyId = journeySelection === undefined ? preferences.journeyId : journeySelection ?? undefined;
  const presentedJourneys = useMemo(() => locale === "ja"
    ? journeys.map((journey) => localizeJourney(journey, journeyTranslations.find(({ contentId }) => contentId === journey.id)))
    : journeys, [journeyTranslations, journeys, locale]);
  const presentedGroups = useMemo(() => locale === "ja" ? groups.map((group) => {
    const translation = groupTranslations.find(({ contentId, targetLocale }) => contentId === group.id && targetLocale === "ja");
    return translation ? { ...group, title: translation.title, description: translation.description } : group;
  }) : groups, [groupTranslations, groups, locale]);
  const selectedJourney = presentedJourneys.find(({ id }) => id === selectedJourneyId);
  const selectedRouteId = routeSelection === undefined && preferences.journeyId === selectedJourneyId
    ? preferences.routeId
    : routeSelection ?? undefined;
  const selectedFocusedArticleId = focusedArticleSelection === undefined
    ? preferences.focusedArticleId
    : focusedArticleSelection ?? undefined;
  const journeyResults = useMemo(
    () => searchJourneyOptions(query, presentedJourneys, presentedGroups, articles, { fallbackJourneys: journeys, fallbackGroups: groups }),
    [articles, groups, journeys, presentedGroups, presentedJourneys, query],
  );
  const focusedGuideResults = useMemo(() => searchFocusedGuides(query, articles), [articles, query]);
  const routeOptions = routeOptionsForJourney(selectedJourney, articles);
  const hasUnsavedChanges = isReady && (
    selectedStage !== preferences.journeyStage
    || selectedJourneyId !== preferences.journeyId
    || selectedRouteId !== preferences.routeId
    || selectedFocusedArticleId !== preferences.focusedArticleId
  );
  const allowNavigation = useUnsavedChangesWarning(hasUnsavedChanges);

  function selectJourney(result: JourneySearchResult) {
    setJourneySelection(result.journey.id);
    const matchingArticle = result.matchingArticles.find(({ id }) => getJourneyRouteForArticle(result.journey, id));
    const matchingRoute = matchingArticle ? getJourneyRouteForArticle(result.journey, matchingArticle.id) : undefined;
    setRouteSelection(matchingRoute?.id ?? null);
    setFocusedArticleSelection(matchingArticle?.id ?? null);
  }

  function selectFocusedGuide(article: ArticleMetadata) {
    const containingJourneys = presentedJourneys.filter((journey) => getJourneyArticleIds(journey).includes(article.id));
    const containingJourney = containingJourneys.length === 1
      ? containingJourneys[0]
      : containingJourneys.find((journey) => getJourneyRouteForArticle(journey, article.id));
    const route = containingJourney ? getJourneyRouteForArticle(containingJourney, article.id) : undefined;
    setJourneySelection(containingJourney?.id ?? null);
    setRouteSelection(route?.id ?? null);
    setFocusedArticleSelection(article.id);
  }

  function useStageOnly() {
    setJourneySelection(null);
    setRouteSelection(null);
    setFocusedArticleSelection(null);
  }

  function save() {
    if (!selectedStage) return;
    const routeChanged = Boolean(preferences.journeyId || preferences.routeId)
      && (selectedJourneyId !== preferences.journeyId || selectedRouteId !== preferences.routeId);
    allowNavigation();
    saveStartingPoint({
      journeyStage: selectedStage,
      journeyId: selectedJourneyId,
      routeId: selectedRouteId,
      focusedArticleId: selectedFocusedArticleId,
    });
    if (routeChanged) queueJourneyUpdateNotice();
    router.push(returnTo);
  }

  function clearOrSkip() {
    allowNavigation();
    chooseGeneralExperience();
    router.push(returnTo !== "/" ? returnTo : preferences.journeyStage || preferences.journeyId ? "/" : "/explore");
  }

  return (
    <div className="mt-10 space-y-12">
      <OnboardingStageSelector selectedStage={selectedStage} onSelect={setStageSelection} />
      <OnboardingJourneySelector
        query={query}
        results={journeyResults}
        focusedGuideResults={focusedGuideResults}
        selectedJourneyId={selectedJourneyId}
        selectedFocusedArticleId={selectedFocusedArticleId}
        onQueryChange={setQuery}
        onSelectJourney={selectJourney}
        onSelectFocusedGuide={selectFocusedGuide}
        onUseStageOnly={useStageOnly}
      />
      {selectedJourney && routeOptions.length > 0 && (
        <OnboardingRouteSelector
          journey={selectedJourney}
          options={routeOptions}
          selectedRouteId={selectedRouteId}
          onSelect={({ route, article }) => {
            setRouteSelection(route.id);
            setFocusedArticleSelection(article.id);
          }}
          onClear={() => {
            setRouteSelection(null);
            setFocusedArticleSelection(null);
          }}
        />
      )}
      <OnboardingActions
        canSave={Boolean(selectedStage)}
        hasPersonalization={Boolean(preferences.journeyStage || preferences.journeyId)}
        onSave={save}
        onClearOrSkip={clearOrSkip}
      />
    </div>
  );
}
