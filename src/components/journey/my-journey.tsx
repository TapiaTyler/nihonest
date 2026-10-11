"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LocalizedArticleCard } from "@/components/localization/localized-article-card";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import { usePersonalization } from "@/components/personalization/personalization-provider";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup, GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyRouteById, resolveJourneySteps } from "@/domain/discovery/discovery";
import { recommendationsForStage } from "@/domain/personalization/preferences";
import { stageSentenceMessageIds } from "@/domain/taxonomy/stage-sentence-messages";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { GuidedJourneyView } from "./guided-journey-view";
import type { JourneyTranslation } from "@/domain/localization/journey-presentation";
import type { ArticleGroupSearchTranslation } from "@/lib/search/knowledgebase-search";

export function MyJourney({ journeys, groups, articles, translations = [], groupTranslations = [], articleTranslations = [] }: Readonly<{
  journeys: readonly GuidedJourney[];
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
  translations?: readonly JourneyTranslation[];
  groupTranslations?: readonly ArticleGroupSearchTranslation[];
  articleTranslations?: readonly ArticleSearchTranslation[];
}>) {
  const searchParams = useSearchParams();
  const { isReady, preferences } = usePersonalization();
  const { message, format } = useInterfaceMessages();
  if (!isReady) return <div className="page-shell py-12 sm:py-20"><p className="text-slate-600">{message("myJourney.loading")}</p></div>;

  const journey = journeys.find(({ id }) => id === preferences.journeyId);
  const group = journey ? groups.find(({ id }) => id === journey.groupId) : undefined;
  const comparingRoutes = searchParams.get("changeRoute") === "1";
  const selectedRoute = journey && !comparingRoutes ? getJourneyRouteById(journey, preferences.routeId) : undefined;
  const articlesById = new Map(articles.map((article) => [article.id, article]));

  if (journey && group) {
    const steps = resolveJourneySteps(journey, selectedRoute?.id).flatMap((step) => {
      const article = articlesById.get(step.articleId);
      return article ? [{ step, article }] : [];
    });
    return (
      <div className="page-shell py-12 sm:py-20">
        <GuidedJourneyView journey={journey} group={group} selectedRoute={selectedRoute} steps={steps} translation={translations.find(({ contentId }) => contentId === journey.id)} groupTranslation={groupTranslations.find(({ contentId }) => contentId === group.id)} articleTranslations={articleTranslations} mode="personal" />
      </div>
    );
  }

  const stage = preferences.journeyStage;
  const stageLabel = stage ? message(stageSentenceMessageIds[stage]) : undefined;
  const startingPoints = stage ? recommendationsForStage(stage, articles) : [];

  return (
    <div className="page-shell py-12 sm:py-20">
      <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-brand-link hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{message("onboarding.backHome")}</Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">{message("journey.myJourney")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{stageLabel ? format("myJourney.stageHeading", { stage: stageLabel }) : message("myJourney.chooseHeading")}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{message(stageLabel ? "myJourney.stageIntro" : "myJourney.chooseIntro")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={{ pathname: "/onboarding", query: { returnTo: "/my-journey" } }} className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message(stageLabel ? "roadmap.chooseJourney" : "roadmap.findStart")}</Link>
          <Link href="/explore" className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("myJourney.exploreAll")}</Link>
        </div>
      </header>
      {startingPoints.length > 0 && (
        <section className="mt-12" aria-labelledby="stage-starting-points-heading">
          <h2 id="stage-starting-points-heading" className="text-3xl font-semibold tracking-tight text-slate-950">{message("roadmap.suggested")}</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {startingPoints.map((article) => <LocalizedArticleCard key={article.id} article={article} returnTo="/my-journey" translations={articleTranslations} />)}
          </div>
        </section>
      )}
    </div>
  );
}
