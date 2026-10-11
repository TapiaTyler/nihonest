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
import { stageSentenceMessageIds } from "@/domain/taxonomy/stage-sentence-messages";
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
      className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      {message("home.findStartingPoint")}
    </Link>
  );

  return (
    <section className="page-shell grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="max-w-3xl" lang={locale}>
        <p className="eyebrow">{message("home.eyebrow")}</p>
        <h1 className="hero-title mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
          {message("home.title")}
        </h1>
        <p className="hero-lede mt-7 max-w-2xl text-pretty text-lg leading-8 text-ink-muted sm:text-xl">
          {message("home.description")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!isReady ? (
            <>
              {/* Holds the button's space until saved preferences load, so a returning visitor never sees the generic button swap out. */}
              <span className="h-12 w-60 max-w-full" aria-hidden="true" />
              <noscript>{findStartingPointLink}</noscript>
            </>
          ) : stage && stageLabel ? (
            <>
              <Link
                href={journey ? journeyHref(journey.id, route?.id) : focusedArticle ? `/articles/${focusedArticle.slug}` : `/explore?stage=${stage}`}
                className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                {journey
                  ? message("home.continueJourney")
                  : focusedArticle
                    ? message("home.openFocusedGuide")
                    : message("home.exploreForStage").replace("{stage}", message(stageSentenceMessageIds[stage]))}
              </Link>
              <Link href="/onboarding" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                {message("home.adjustStartingPoint")}
              </Link>
            </>
          ) : (
            findStartingPointLink
          )}
        </div>
          {/* Below the two-column layout one quiet line stands in for the card: stacked, the card would be a wide block with nothing beside it. */}
        <p lang={locale} className={`ja-prose mt-6 max-w-2xl lg:hidden text-sm leading-6 text-ink-muted ${isReady ? "" : "home-pending invisible"}`}>
          {stageLabel ? (
            <>
              <strong className="font-semibold text-ink-firm">{message("home.yourStartingPoint")}</strong>{" "}
              {format("home.stageSavedSummary", {
                stage: stageLabel,
                focus: route
                  ? format("home.route", { title: routeTitle })
                  : focusedArticle
                    ? format("home.focusedRoute", { title: focusedArticleTitle })
                    : "",
              })}
            </>
          ) : message("home.optionalNote")}
        </p>
        {!isReady && <span className="sr-only" aria-live="polite">{message("home.loadingPreferences")}</span>}
      </div>


      {/* The full card only appears where it sits beside the heading, from lg (1024px) up. */}
      <aside lang={locale} className={`hidden rounded-3xl border border-hero-card-line/10 bg-hero-card p-7 text-on-hero-card-soft shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)] sm:p-9 lg:block ${isReady ? "" : "home-pending invisible"}`} aria-labelledby="foundation-status">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-on-hero-card-eyebrow">
          {stageLabel ? message("home.yourStartingPoint") : message("home.builtPublicFirst")}
        </p>
        <h2 id="foundation-status" className="mt-4 text-2xl font-semibold tracking-tight text-on-hero-card">
          {journeyTitle ?? stageLabel ?? message("home.personalizationOptional")}
        </h2>
        <p className="mt-4 leading-7 text-on-hero-card-body/80">
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
