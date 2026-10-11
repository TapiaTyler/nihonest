"use client";

import Link from "next/link";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import type { JourneyTitleTranslation } from "@/domain/localization/journey-presentation";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { usePersonalization } from "./personalization-provider";
import { journeyHref } from "@/lib/navigation/journey-context";

export function HomeHero({ journeys, articles, articleTranslations = [], journeyTitles = [] }: Readonly<{
  journeys: readonly GuidedJourney[];
  articles: readonly ArticleMetadata[];
  articleTranslations?: readonly ArticleSearchTranslation[];
  journeyTitles?: readonly JourneyTitleTranslation[];
}>) {
  const { preferences, isReady } = usePersonalization();
  const { locale, message, format } = useInterfaceMessages();
  const stage = preferences.journeyStage;
  const stageLabel = stage
    ? locale === "ja"
      ? japaneseTaxonomyLabels.journeyStage[stage]
      : journeyStages.find(({ id }) => id === stage)?.label
    : undefined;
  const journey = journeys.find(({ id }) => id === preferences.journeyId);
  const route = journey?.routes.find(({ id }) => id === preferences.routeId);
  const focusedArticle = articles.find(({ id }) => id === preferences.focusedArticleId);
  const japaneseJourney = locale === "ja" ? journeyTitles.find(({ contentId }) => contentId === journey?.id) : undefined;
  const journeyTitle = japaneseJourney?.title ?? journey?.title;
  const routeTitle = japaneseJourney?.routes.find(({ id }) => id === route?.id)?.title ?? route?.title ?? "";
  const focusedArticleTitle = (locale === "ja"
    ? articleTranslations.find(({ contentId }) => contentId === focusedArticle?.id)?.title
    : undefined) ?? focusedArticle?.title ?? "";

  const findStartingPointLink = (
    <Link
      href="/onboarding"
      className="inline-flex min-h-12 items-center rounded-full bg-teal-800 px-6 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
    >
      {message("home.findStartingPoint")}
    </Link>
  );

  return (
    <section className="page-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
      <div className="max-w-3xl" lang={locale}>
        <p className="eyebrow">{message("home.eyebrow")}</p>
        <h1 className="hero-title mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
          {message("home.title")}
        </h1>
        <p className="hero-lede mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
          {message("home.description")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!isReady ? (
            <>
              {/* Holds the button's space until saved preferences load, so a returning visitor never sees the generic button swap out. */}
              <span className="h-12 w-60 max-w-full rounded-full bg-slate-200" aria-hidden="true" />
              <noscript>{findStartingPointLink}</noscript>
            </>
          ) : stage && stageLabel ? (
            <>
              <Link
                href={journey ? journeyHref(journey.id, route?.id) : focusedArticle ? `/articles/${focusedArticle.slug}` : `/explore?stage=${stage}`}
                className="inline-flex min-h-12 items-center rounded-full bg-teal-800 px-6 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
              >
                {journey
                  ? message("home.continueJourney")
                  : focusedArticle
                    ? message("home.openFocusedGuide")
                    : message("home.exploreForStage").replace("{stage}", stageLabel.toLowerCase())}
              </Link>
              <Link href="/onboarding" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                {message("home.adjustStartingPoint")}
              </Link>
            </>
          ) : (
            findStartingPointLink
          )}
        </div>
        {!isReady && <span className="sr-only" aria-live="polite">{message("home.loadingPreferences")}</span>}
      </div>

      <aside lang={locale} className={`rounded-3xl border border-teal-900/10 bg-teal-950 p-7 text-teal-50 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)] sm:p-9${isReady ? "" : " home-pending invisible"}`} aria-labelledby="foundation-status">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">
          {stageLabel ? message("home.yourStartingPoint") : message("home.builtPublicFirst")}
        </p>
        <h2 id="foundation-status" className="mt-4 text-2xl font-semibold tracking-tight text-white">
          {journeyTitle ?? stageLabel ?? message("home.personalizationOptional")}
        </h2>
        <p className="mt-4 leading-7 text-teal-100/80">
          {stageLabel
            ? format("home.stageSavedSummary", {
                stage: stageLabel,
                focus: route
                  ? format("home.route", { title: routeTitle })
                  : focusedArticle
                    ? format("home.focusedRoute", { title: focusedArticleTitle })
                    : "",
              })
            : message("home.publicSummary")}
        </p>
      </aside>
      {!isReady && <noscript><style>{".home-pending{visibility:visible !important}"}</style></noscript>}
    </section>
  );
}
