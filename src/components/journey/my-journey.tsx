"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { usePersonalization } from "@/components/personalization/personalization-provider";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup, GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyRouteById, resolveJourneySteps } from "@/domain/discovery/discovery";
import { recommendationsForStage } from "@/domain/personalization/preferences";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { GuidedJourneyView } from "./guided-journey-view";

export function MyJourney({ journeys, groups, articles }: Readonly<{
  journeys: readonly GuidedJourney[];
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
}>) {
  const searchParams = useSearchParams();
  const { isReady, preferences } = usePersonalization();
  if (!isReady) return <div className="page-shell py-12 sm:py-20"><p className="text-slate-600">Loading your journey…</p></div>;

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
        <GuidedJourneyView journey={journey} group={group} selectedRoute={selectedRoute} steps={steps} mode="personal" />
      </div>
    );
  }

  const stage = preferences.journeyStage;
  const stageLabel = journeyStages.find(({ id }) => id === stage)?.label;
  const startingPoints = stage ? recommendationsForStage(stage, articles) : [];

  return (
    <div className="page-shell py-12 sm:py-20">
      <Link href="/" className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">← Back to Home</Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">My Journey</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{stageLabel ? `Starting points for ${stageLabel.toLowerCase()}` : "Choose your journey through Japan."}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{stageLabel ? "You have selected a stage but not a complete guided journey. These broad starting points remain useful while you compare routes." : "Choose a stage and, when useful, a route-aware guided journey. All public guidance remains available without personalization."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={{ pathname: "/onboarding", query: { returnTo: "/my-journey" } }} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{stageLabel ? "Choose a guided journey" : "Find my starting point"}</Link>
          <Link href="/explore" className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Explore all guidance</Link>
        </div>
      </header>
      {startingPoints.length > 0 && (
        <section className="mt-12" aria-labelledby="stage-starting-points-heading">
          <h2 id="stage-starting-points-heading" className="text-3xl font-semibold tracking-tight text-slate-950">Suggested starting points</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {startingPoints.map((article) => <ArticleCard key={article.id} article={article} returnTo="/my-journey" />)}
          </div>
        </section>
      )}
    </div>
  );
}
