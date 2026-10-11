"use client";

import { useId } from "react";
import type { ArticleMetadata } from "@/domain/article/article";
import type { JourneySearchResult } from "@/domain/personalization/journey-search";
import { useInterfaceMessages } from "@/components/localization/interface-text";

export function OnboardingJourneySelector({
  query,
  results,
  focusedGuideResults,
  selectedJourneyId,
  selectedFocusedArticleId,
  onQueryChange,
  onSelectJourney,
  onSelectFocusedGuide,
  onUseStageOnly,
}: Readonly<{
  query: string;
  results: readonly JourneySearchResult[];
  focusedGuideResults: readonly ArticleMetadata[];
  selectedJourneyId: string | undefined;
  selectedFocusedArticleId: string | undefined;
  onQueryChange: (query: string) => void;
  onSelectJourney: (result: JourneySearchResult) => void;
  onSelectFocusedGuide: (article: ArticleMetadata) => void;
  onUseStageOnly: () => void;
}>) {
  const searchId = useId();
  const { locale, message } = useInterfaceMessages();

  return (
    <fieldset>
      <legend className="text-xl font-semibold text-slate-950">{message("onboarding.journeyLegend")}</legend>
      <p className="mt-2 max-w-3xl leading-7 text-slate-600">{message("onboarding.journeyHelp")}</p>
      <label htmlFor={searchId} className="mt-5 block text-sm font-semibold text-slate-900">{message("onboarding.searchLabel")}</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id={searchId} type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={message("onboarding.searchPlaceholder")} className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20" />
        {query && <button type="button" onClick={() => onQueryChange("")} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("onboarding.clearSearch")}</button>}
      </div>
      <p className="mt-4 text-sm text-slate-500" aria-live="polite">{locale === "ja" ? `${results.length}件のジャーニーを表示` : `${results.length} ${results.length === 1 ? "journey" : "journeys"} shown`}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {results.map((result) => (
          <label key={result.journey.id} className="has-checked:border-brand-accent has-checked:bg-brand-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-colors hover:border-brand-500">
            <input type="radio" name="guided-journey" value={result.journey.id} checked={selectedJourneyId === result.journey.id} onChange={() => onSelectJourney(result)} className="mt-1 size-5 shrink-0 accent-brand" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-brand-accent">{result.groupTitle}</span>
              <span className="mt-2 block text-lg font-semibold text-slate-950">{result.journey.title}</span>
              <span className="mt-2 block leading-7 text-slate-600">{result.journey.description}</span>
              {result.matchingArticles.length > 0 && (
                <span className="mt-3 block text-sm font-semibold text-brand-link">{locale === "ja" ? `一致する経路（${result.matchingArticles.length}件）` : `Matching ${result.matchingArticles.length === 1 ? "route" : "routes"}`}: {result.matchingArticles.map(({ title }) => title).join(" · ")}</span>
              )}
            </span>
          </label>
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="font-semibold text-slate-950">{message("onboarding.noMatches")}</p>
          <p className="mt-2 text-slate-600">{message("onboarding.noMatchesHelp")}</p>
        </div>
      )}

      {focusedGuideResults.length > 0 && (
        <section className="mt-8" aria-labelledby="matching-guides-heading">
          <h3 id="matching-guides-heading" className="text-lg font-semibold text-slate-950">{message("onboarding.matchingGuides")}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message("onboarding.matchingGuidesHelp")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {focusedGuideResults.map((article) => (
              <button key={article.id} type="button" aria-pressed={selectedFocusedArticleId === article.id} onClick={() => onSelectFocusedGuide(article)} className="min-h-20 rounded-xl border border-slate-300 bg-white p-4 text-left hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:border-brand-accent aria-pressed:bg-brand-soft">
                <span className="block font-semibold text-slate-950">{article.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">{message("onboarding.useFocusedGuide")}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 font-semibold text-slate-700 hover:bg-slate-100">
        <input type="radio" name="guided-journey" checked={!selectedJourneyId} onChange={onUseStageOnly} className="size-5 accent-brand" />
        {message("onboarding.stageOnly")}
      </label>
    </fieldset>
  );
}
