"use client";

import Link from "next/link";
import { usePersonalization } from "@/components/personalization/personalization-provider";
import { useSavedContent } from "@/components/saved-content/saved-content-provider";
import { useGlossaryStudy } from "@/components/glossary-study/glossary-study-provider";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyRouteById, resolveJourneySteps } from "@/domain/discovery/discovery";
import { resolvePersonalizedRoadmap, selectRoadmapRules, type ChecklistDefinition, type RoadmapRecommendationRule } from "@/domain/roadmap/personalized-roadmap";
import { visibleSavedContent } from "@/domain/saved-content/saved-content";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { useChecklistProgress } from "./checklist-progress-provider";

type PhaseSummary = Readonly<{
  id: string;
  title: string;
  total: number;
  complete: number;
  inProgress: number;
}>;

export function PersonalizedRoadmap({ definitions, rules, articles, journeys }: Readonly<{
  definitions: readonly ChecklistDefinition[];
  rules: readonly RoadmapRecommendationRule[];
  articles: readonly ArticleMetadata[];
  journeys: readonly GuidedJourney[];
}>) {
  const { isReady, preferences } = usePersonalization();
  const { records: checklistProgress } = useChecklistProgress();
  const { records: savedRecords } = useSavedContent();
  const { records: studyProgress } = useGlossaryStudy();
  if (!isReady) return <p className="mt-10 text-slate-600">Loading your roadmap…</p>;

  const journey = journeys.find(({ id }) => id === preferences.journeyId);
  const route = journey ? getJourneyRouteById(journey, preferences.routeId) : undefined;
  const stageLabel = journeyStages.find(({ id }) => id === preferences.journeyStage)?.label;
  const articlesById = new Map(articles.map((article) => [article.id, article]));
  const progressById = new Map(checklistProgress.map((progress) => [progress.checklistId, progress.state]));
  const resolvedSteps = journey ? resolveJourneySteps(journey, route?.id) : [];
  const phaseSummaries: readonly PhaseSummary[] = journey ? journey.phases.flatMap((phase) => {
    const phaseSteps = resolvedSteps.filter((step) => step.phaseId === phase.id);
    if (!phaseSteps.length) return [];
    return [{
      id: phase.id,
      title: phase.title,
      total: phaseSteps.length,
      complete: phaseSteps.filter(({ articleId }) => progressById.get(articleId) === "complete").length,
      inProgress: phaseSteps.filter(({ articleId }) => progressById.get(articleId) === "in-progress").length,
    }];
  }) : [];
  const completeCount = resolvedSteps.filter(({ articleId }) => progressById.get(articleId) === "complete").length;
  const completionPercentage = resolvedSteps.length ? Math.round((completeCount / resolvedSteps.length) * 100) : 0;
  const nextStep = resolvedSteps.find((step) => step.requiredness === "required" && progressById.get(step.articleId) !== "complete")
    ?? resolvedSteps.find((step) => progressById.get(step.articleId) !== "complete");
  const nextArticle = nextStep ? articlesById.get(nextStep.articleId) : undefined;

  const visibleSaved = visibleSavedContent(savedRecords);
  const savedCounts = {
    guides: visibleSaved.filter(({ kind }) => kind === "article").length,
    statuses: visibleSaved.filter(({ kind }) => kind === "residence-status").length,
    terms: visibleSaved.filter(({ kind }) => kind === "glossary-term").length,
  };
  const savedTermIds = new Set(visibleSaved.filter(({ kind }) => kind === "glossary-term").map(({ contentId }) => contentId));
  const reviewedTermCount = studyProgress.filter(({ termId, state }) => savedTermIds.has(termId) && state === "reviewed").length;
  const learningTermCount = studyProgress.filter(({ termId, state }) => savedTermIds.has(termId) && state === "learning").length;

  const stageItems = !journey && preferences.journeyStage ? resolvePersonalizedRoadmap(
    definitions,
    selectRoadmapRules(rules, { journeyStageId: preferences.journeyStage, audienceIds: [] }),
    checklistProgress,
    { journeyStageId: preferences.journeyStage, audienceIds: [] },
  ) : [];

  if (!preferences.journeyStage && !journey) {
    return (
      <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-7 sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-950">Build your roadmap from a starting point</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Choose where you are now and, optionally, a guided journey. Nihonest will summarize progress without restricting access to any public guidance.</p>
        <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Find my starting point</Link>
      </section>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      <section className="rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7" aria-labelledby="roadmap-overview-heading">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">Current direction</p>
            <h2 id="roadmap-overview-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{journey?.title ?? `${stageLabel ?? "Selected stage"} starting points`}</h2>
            <p className="mt-3 text-slate-600">{[stageLabel, route ? `${route.title} route` : undefined].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {journey && <Link href="/my-journey" className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Open My Journey</Link>}
            <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Adjust starting point</Link>
          </div>
        </div>
        {journey && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600"><span>{completeCount} of {resolvedSteps.length} steps complete</span><span className="font-semibold text-teal-800">{completionPercentage}%</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Overall journey completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionPercentage}><div className="h-full rounded-full bg-teal-700 transition-[width]" style={{ width: `${completionPercentage}%` }} /></div>
          </div>
        )}
        {journey?.routes.length && !route ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Choose a route in My Journey to make this overview route-specific. Until then, shared phases and steps remain visible.</p> : null}
      </section>

      {journey && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="phase-roadmap-heading">
            <h2 id="phase-roadmap-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Journey phases</h2>
            <p className="mt-2 leading-7 text-slate-600">Use this overview to see where progress is concentrated, then open My Journey for the complete steps.</p>
            <ol className="mt-6 space-y-3">
              {phaseSummaries.map((phase, index) => {
                const phaseComplete = phase.complete === phase.total;
                return (
                  <li key={phase.id}>
                    <Link href={`/my-journey#phase-${phase.id}`} className="group flex min-h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${phaseComplete ? "bg-teal-700 text-white" : "bg-white text-teal-800"}`}>{phaseComplete ? "✓" : index + 1}</span>
                      <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-950 group-hover:text-teal-800">{phase.title}</span><span className="mt-1 block text-sm text-slate-500">{phase.complete} of {phase.total} complete{phase.inProgress ? ` · ${phase.inProgress} in progress` : ""}</span></span>
                      <span aria-hidden="true" className="font-semibold text-teal-800">→</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="next-action-heading">
            <p className="eyebrow">Next action</p>
            <h2 id="next-action-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{nextArticle?.title ?? "Journey steps complete"}</h2>
            {nextArticle ? (
              <><p className="mt-3 leading-7 text-slate-600">{nextArticle.description}</p>{nextStep?.requiredness === "conditional" && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">May apply: {nextStep.conditionLabel}</p>}<Link href={`/my-journey#phase-${nextStep?.phaseId}`} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Continue in My Journey →</Link></>
            ) : <p className="mt-3 leading-7 text-slate-600">Every currently applicable step is marked complete. You can still revisit the full journey and its public guidance.</p>}
          </section>
        </div>
      )}

      {!journey && stageItems.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="stage-roadmap-heading">
          <h2 id="stage-roadmap-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Suggested starting points</h2>
          <p className="mt-2 leading-7 text-slate-600">These remain broad until you choose a guided journey.</p>
          <ul className="mt-5 divide-y divide-slate-200">
            {stageItems.flatMap(({ definition, progressState }) => {
              const article = articlesById.get(definition.relatedArticleIds[0]);
              return article ? [<li key={definition.id}><Link href={{ pathname: `/articles/${article.slug}`, query: { returnTo: "/roadmap" } }} className="flex min-h-16 items-center justify-between gap-4 py-3 font-semibold text-slate-900 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><span>{definition.title}</span><span className="shrink-0 text-sm font-medium capitalize text-slate-500">{progressState.replaceAll("-", " ")} →</span></Link></li>] : [];
            })}
          </ul>
          <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700">Choose a guided journey</Link>
        </section>
      )}

      <section aria-labelledby="supporting-tools-heading">
        <h2 id="supporting-tools-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Supporting tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link href="/saved" className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Saved content</span><span className="mt-2 block text-xl font-semibold text-slate-950 group-hover:text-teal-700">{savedCounts.guides} guides · {savedCounts.statuses} statuses · {savedCounts.terms} terms</span><span className="mt-4 block text-sm font-semibold text-teal-800">Open saved content →</span>
          </Link>
          <Link href="/saved#saved-glossary-review" className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Glossary review</span><span className="mt-2 block text-xl font-semibold text-slate-950 group-hover:text-teal-700">{reviewedTermCount} reviewed · {learningTermCount} learning</span><span className="mt-4 block text-sm font-semibold text-teal-800">Review saved terms →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
