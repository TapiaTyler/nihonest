"use client";

import Link from "next/link";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { usePersonalization } from "./personalization-provider";
import { journeyHref } from "@/lib/navigation/journey-context";

export function HomeHero({ journeys, articles }: Readonly<{
  journeys: readonly GuidedJourney[];
  articles: readonly ArticleMetadata[];
}>) {
  const { preferences, isReady } = usePersonalization();
  const stage = preferences.journeyStage;
  const stageLabel = journeyStages.find(({ id }) => id === stage)?.label;
  const journey = journeys.find(({ id }) => id === preferences.journeyId);
  const route = journey?.routes.find(({ id }) => id === preferences.routeId);
  const focusedArticle = articles.find(({ id }) => id === preferences.focusedArticleId);

  return (
    <section className="page-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
      <div className="max-w-3xl">
        <p className="eyebrow">A clearer path through life in Japan</p>
        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
          Find your place in Japan.
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
          Nihonest is becoming a calm, practical knowledgebase for people preparing to move to Japan and those already building a life there.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {stage && stageLabel ? (
            <>
              <Link
                href={journey ? journeyHref(journey.id, route?.id) : focusedArticle ? `/articles/${focusedArticle.slug}` : `/explore?stage=${stage}`}
                className="inline-flex min-h-12 items-center rounded-full bg-teal-800 px-6 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
              >
                {journey ? "Continue my journey" : focusedArticle ? "Open my focused guide" : `Explore guidance for ${stageLabel.toLowerCase()}`}
              </Link>
              <Link href="/onboarding" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                Adjust my starting point
              </Link>
            </>
          ) : (
            <Link
              href="/onboarding"
              className="inline-flex min-h-12 items-center rounded-full bg-teal-800 px-6 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
            >
              Find my starting point
            </Link>
          )}
        </div>
        {!isReady && <span className="sr-only" aria-live="polite">Loading saved preferences</span>}
      </div>

      <aside className="rounded-3xl border border-teal-900/10 bg-teal-950 p-7 text-teal-50 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)] sm:p-9" aria-labelledby="foundation-status">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">
          {stageLabel ? "Your starting point" : "Built public first"}
        </p>
        <h2 id="foundation-status" className="mt-4 text-2xl font-semibold tracking-tight text-white">
          {journey?.title ?? stageLabel ?? "Personalization is optional."}
        </h2>
        <p className="mt-4 leading-7 text-teal-100/80">
          {stageLabel
            ? `${stageLabel}${route ? ` · ${route.title} route` : focusedArticle ? ` · Focused on ${focusedArticle.title}` : ""}. Saved only in this browser without hiding the rest of the knowledgebase.`
            : "Choose your stage and an optional route-aware journey, or browse every public guide without answering any questions."}
        </p>
      </aside>
    </section>
  );
}
