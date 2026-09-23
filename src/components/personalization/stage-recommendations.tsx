"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/content/article-card";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { recommendationsForStage } from "@/domain/personalization/preferences";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { usePersonalization } from "./personalization-provider";
import { articleJourneyHref, journeyHref } from "@/lib/navigation/journey-context";

export function StageRecommendations({
  articles,
  journeys,
  location,
}: Readonly<{
  articles: readonly ArticleMetadata[];
  journeys: readonly GuidedJourney[];
  location: "home" | "explore";
}>) {
  const { preferences, isReady } = usePersonalization();
  const { locale, message } = useInterfaceMessages();
  const stage = preferences.journeyStage;
  if (!isReady || !stage) return null;

  const stageLabel = locale === "ja"
    ? japaneseTaxonomyLabels.journeyStage[stage]
    : journeyStages.find(({ id }) => id === stage)?.label ?? stage;
  const journey = journeys.find(({ id }) => id === preferences.journeyId);
  const route = journey?.routes.find(({ id }) => id === preferences.routeId);
  const focusedArticle = articles.find(({ id }) => id === preferences.focusedArticleId);
  const recommendations = recommendationsForStage(
    stage,
    articles,
    journeys,
    preferences.journeyId,
    preferences.routeId,
    preferences.focusedArticleId,
  );
  if (recommendations.length === 0) return null;

  return (
    <section
      className={location === "home" ? "border-b border-slate-200 bg-white" : "mt-10"}
      aria-labelledby={`${location}-recommendations-heading`}
    >
      <div className={location === "home" ? "page-shell py-14 sm:py-18" : "rounded-3xl border border-teal-200 bg-teal-50/70 p-5 sm:p-7"}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{message("home.recommendationsEyebrow")}</p>
            <h2 id={`${location}-recommendations-heading`} className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {journey
                ? message("home.recommendationsForJourney").replace("{title}", journey.title)
                : focusedArticle
                  ? message("home.recommendationsForGuide").replace("{title}", focusedArticle.title)
                  : message("home.recommendationsForStage").replace("{stage}", stageLabel.toLowerCase())}
            </h2>
          </div>
          <Link href="/onboarding" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            {message("home.adjustStartingPoint")}
          </Link>
        </div>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          {journey
            ? message("home.recommendationsJourneyNote").replace("{stage}", stageLabel)
            : message("home.recommendationsGeneralNote")}
        </p>
        {(journey || focusedArticle) && (
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {journey && (
              <Link href={journeyHref(journey.id, route?.id)} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-4 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                {message("home.openFullJourney")}
              </Link>
            )}
            {focusedArticle && (
              <Link href={journey ? articleJourneyHref(focusedArticle.slug, journey.id, route?.id) : `/articles/${focusedArticle.slug}`} className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                {message("home.focusedRouteLink").replace("{title}", focusedArticle.title)}
              </Link>
            )}
          </div>
        )}
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              returnTo={location === "explore" ? "/explore" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
