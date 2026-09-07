"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup, GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyArticleIds, getJourneyRouteForArticle } from "@/domain/discovery/discovery";
import {
  routeOptionsForJourney,
  searchFocusedGuides,
  searchJourneyOptions,
  type JourneySearchResult,
} from "@/domain/personalization/journey-search";
import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { usePersonalization } from "./personalization-provider";
import { useUnsavedChangesWarning } from "./use-unsaved-changes-warning";

const stageDescriptions: Record<JourneyStageId, string> = {
  planning: "I am researching whether and how to move to Japan.",
  preparing: "I am actively arranging my move or upcoming stay.",
  "recently-arrived": "I have arrived and am working through initial procedures.",
  "living-in-japan": "I am established in Japan and managing ongoing responsibilities.",
};

export function OnboardingForm({
  journeys,
  groups,
  articles,
}: Readonly<{
  journeys: readonly GuidedJourney[];
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
}>) {
  const router = useRouter();
  const searchId = useId();
  const { preferences, isReady, saveStartingPoint, chooseGeneralExperience } = usePersonalization();
  const [stageSelection, setStageSelection] = useState<JourneyStageId>();
  const [journeySelection, setJourneySelection] = useState<string | null>();
  const [routeSelection, setRouteSelection] = useState<string | null>();
  const [focusedArticleSelection, setFocusedArticleSelection] = useState<string | null>();
  const [query, setQuery] = useState("");

  const selectedStage = stageSelection ?? (isReady ? preferences.journeyStage : undefined);
  const selectedJourneyId = journeySelection === undefined
    ? preferences.journeyId
    : journeySelection ?? undefined;
  const selectedJourney = journeys.find(({ id }) => id === selectedJourneyId);
  const selectedRouteId = routeSelection === undefined && preferences.journeyId === selectedJourneyId
    ? preferences.routeId
    : routeSelection ?? undefined;
  const selectedFocusedArticleId = focusedArticleSelection === undefined
    ? preferences.focusedArticleId
    : focusedArticleSelection ?? undefined;
  const results = useMemo(
    () => searchJourneyOptions(query, journeys, groups, articles),
    [articles, groups, journeys, query],
  );
  const routeOptions = routeOptionsForJourney(selectedJourney, articles);
  const focusedGuideResults = useMemo(() => searchFocusedGuides(query, articles), [articles, query]);
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
    const containingJourneys = journeys.filter((journey) =>
      getJourneyArticleIds(journey).includes(article.id));
    const containingJourney = containingJourneys.length === 1
      ? containingJourneys[0]
      : containingJourneys.find((journey) => getJourneyRouteForArticle(journey, article.id));
    const route = containingJourney ? getJourneyRouteForArticle(containingJourney, article.id) : undefined;
    setJourneySelection(containingJourney?.id ?? null);
    setRouteSelection(route?.id ?? null);
    setFocusedArticleSelection(article.id);
  }

  function save() {
    if (!selectedStage) return;
    allowNavigation();
    saveStartingPoint({
      journeyStage: selectedStage,
      journeyId: selectedJourneyId,
      routeId: selectedRouteId,
      focusedArticleId: selectedFocusedArticleId,
    });
    router.push("/");
  }

  function clearOrSkip() {
    allowNavigation();
    chooseGeneralExperience();
    router.push(preferences.journeyStage || preferences.journeyId ? "/" : "/explore");
  }

  return (
    <div className="mt-10 space-y-12">
      <fieldset>
        <legend className="text-xl font-semibold text-slate-950">1. Where are you now?</legend>
        <p className="mt-2 leading-7 text-slate-600">This controls which point in a journey Nihonest emphasizes.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {journeyStages.map((stage) => (
            <label
              key={stage.id}
              className="has-checked:border-teal-700 has-checked:bg-teal-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal-700 flex min-h-32 cursor-pointer items-start gap-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-colors hover:border-teal-500"
            >
              <input
                type="radio"
                name="journey-stage"
                value={stage.id}
                checked={selectedStage === stage.id}
                onChange={() => setStageSelection(stage.id)}
                className="mt-1 size-5 shrink-0 accent-teal-800"
              />
              <span>
                <span className="block text-lg font-semibold text-slate-950">{stage.label}</span>
                <span className="mt-2 block leading-7 text-slate-600">{stageDescriptions[stage.id]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-semibold text-slate-950">2. What brings you to Japan?</legend>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          Choose a guided journey, or search for a visa, residence status, program, or goal. This is a navigation preference—not an eligibility assessment.
        </p>
        <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-slate-900">
          Search journeys and routes
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Student, Business Manager, engineer, family, or working holiday"
            className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              Clear search
            </button>
          )}
        </div>
        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          {results.length} {results.length === 1 ? "journey" : "journeys"} shown
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {results.map((result) => (
            <label
              key={result.journey.id}
              className="has-checked:border-teal-700 has-checked:bg-teal-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal-700 flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-colors hover:border-teal-500"
            >
              <input
                type="radio"
                name="guided-journey"
                value={result.journey.id}
                checked={selectedJourneyId === result.journey.id}
                onChange={() => selectJourney(result)}
                className="mt-1 size-5 shrink-0 accent-teal-800"
              />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-teal-700">{result.groupTitle}</span>
                <span className="mt-2 block text-lg font-semibold text-slate-950">{result.journey.title}</span>
                <span className="mt-2 block leading-7 text-slate-600">{result.journey.description}</span>
                {result.matchingArticles.length > 0 && (
                  <span className="mt-3 block text-sm font-semibold text-teal-800">
                    Matching {result.matchingArticles.length === 1 ? "route" : "routes"}: {result.matchingArticles.map(({ title }) => title).join(" · ")}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="font-semibold text-slate-950">No journey matches that search yet.</p>
            <p className="mt-2 text-slate-600">Try a broader term, or keep only your stage and search the full knowledgebase later.</p>
          </div>
        )}

        {focusedGuideResults.length > 0 && (
          <section className="mt-8" aria-labelledby="matching-guides-heading">
            <h3 id="matching-guides-heading" className="text-lg font-semibold text-slate-950">Matching specific guides</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Choose one directly if you already recognize the visa, status, or program you need.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {focusedGuideResults.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  aria-pressed={selectedFocusedArticleId === article.id}
                  onClick={() => selectFocusedGuide(article)}
                  className="min-h-20 rounded-xl border border-slate-300 bg-white p-4 text-left hover:border-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-700 aria-pressed:bg-teal-50"
                >
                  <span className="block font-semibold text-slate-950">{article.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">Use this as my focused guide</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 font-semibold text-slate-700 hover:bg-slate-100">
          <input
            type="radio"
            name="guided-journey"
            checked={!selectedJourneyId}
            onChange={() => {
              setJourneySelection(null);
              setRouteSelection(null);
              setFocusedArticleSelection(null);
            }}
            className="size-5 accent-teal-800"
          />
          I am not sure yet—use only my journey stage
        </label>
      </fieldset>

      {selectedJourney && routeOptions.length > 0 && (
        <fieldset className="rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7">
          <legend className="px-2 text-xl font-semibold text-slate-950">3. Narrow the route, if you know it</legend>
          <p className="mt-1 leading-7 text-slate-600">
            These are alternatives within {selectedJourney.title}. Leave this open if you still need to compare them.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {routeOptions.map(({ route, article }) => (
              <label key={route.id} className="has-checked:border-teal-700 has-checked:bg-white flex cursor-pointer items-start gap-3 rounded-xl border border-teal-200 p-4 hover:border-teal-500">
                <input
                  type="radio"
                  name="journey-route"
                  checked={selectedRouteId === route.id}
                  onChange={() => {
                    setRouteSelection(route.id);
                    setFocusedArticleSelection(article.id);
                  }}
                  className="mt-1 size-5 shrink-0 accent-teal-800"
                />
                <span>
                  <span className="block font-semibold text-slate-950">{route.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{route.description}</span>
                </span>
              </label>
            ))}
          </div>
          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-teal-900">
            <input
              type="radio"
              name="journey-route"
              checked={!selectedRouteId}
              onChange={() => {
                setRouteSelection(null);
                setFocusedArticleSelection(null);
              }}
              className="size-5 accent-teal-800"
            />
            I still need to compare these routes
          </label>
        </fieldset>
      )}

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!selectedStage}
            onClick={save}
            className="min-h-12 rounded-full bg-teal-800 px-6 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            Save my starting point
          </button>
          <button
            type="button"
            onClick={clearOrSkip}
            className="min-h-12 rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {preferences.journeyStage || preferences.journeyId ? "Remove personalization" : "Skip and browse everything"}
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          <p className="font-semibold text-slate-900">Private by default</p>
          <p className="mt-2">
            Nihonest stores these broad preferences only in this browser. They do not require an account and may disappear if you clear browser data.
          </p>
        </div>
      </div>
    </div>
  );
}
