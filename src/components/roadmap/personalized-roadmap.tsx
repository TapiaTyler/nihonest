"use client";

import Link from "next/link";
import { usePersonalization } from "@/components/personalization/personalization-provider";
import { useSavedContent } from "@/components/saved-content/saved-content-provider";
import { useGlossaryStudy } from "@/components/glossary-study/glossary-study-provider";
import { ReminderLink } from "@/components/notifications/reminder-link";
import type { ArticleMetadata } from "@/domain/article/article";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { getJourneyRouteById, resolveJourneySteps } from "@/domain/discovery/discovery";
import { resolvePersonalizedRoadmap, selectRoadmapRules, type ChecklistDefinition, type RoadmapRecommendationRule } from "@/domain/roadmap/personalized-roadmap";
import { visibleSavedContent } from "@/domain/saved-content/saved-content";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { localizeJourney, type JourneyTranslation } from "@/domain/localization/journey-presentation";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import { useChecklistProgress } from "./checklist-progress-provider";

type PhaseSummary = Readonly<{
  id: string;
  title: string;
  total: number;
  complete: number;
  inProgress: number;
}>;

export function PersonalizedRoadmap({ definitions, rules, articles, journeys, journeyTranslations = [], articleTranslations = [] }: Readonly<{
  definitions: readonly ChecklistDefinition[];
  rules: readonly RoadmapRecommendationRule[];
  articles: readonly ArticleMetadata[];
  journeys: readonly GuidedJourney[];
  journeyTranslations?: readonly JourneyTranslation[];
  articleTranslations?: readonly ArticleSearchTranslation[];
}>) {
  const { locale, message, format } = useInterfaceMessages();
  const japanese = locale === "ja";
  /** Current Japanese title and description for an article, or the canonical English fields. */
  const articleText = (article: ArticleMetadata) => {
    const translated = japanese ? articleTranslations.find(({ contentId }) => contentId === article.id) : undefined;
    return { title: translated?.title ?? article.title, description: translated?.description ?? article.description };
  };
  const { isReady, preferences } = usePersonalization();
  const { records: checklistProgress } = useChecklistProgress();
  const { records: savedRecords } = useSavedContent();
  const { records: studyProgress } = useGlossaryStudy();
  if (!isReady) return <p className="mt-10 text-slate-600">{message("roadmap.loading")}</p>;

  const canonicalJourney = journeys.find(({ id }) => id === preferences.journeyId);
  // Stable IDs drive progress, so only titles, phases, routes, and condition labels are overlaid.
  const journey = canonicalJourney && japanese
    ? localizeJourney(canonicalJourney, journeyTranslations.find(({ contentId }) => contentId === canonicalJourney.id))
    : canonicalJourney;
  const route = journey ? getJourneyRouteById(journey, preferences.routeId) : undefined;
  const stageLabel = preferences.journeyStage && japanese
    ? japaneseTaxonomyLabels.journeyStage[preferences.journeyStage]
    : journeyStages.find(({ id }) => id === preferences.journeyStage)?.label;
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
        <h2 className="text-2xl font-semibold text-slate-950">{message("roadmap.emptyHeading")}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">{message("roadmap.emptyBody")}</p>
        <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("roadmap.findStart")}</Link>
      </section>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      <section className="rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7" aria-labelledby="roadmap-overview-heading">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">{message("roadmap.currentDirection")}</p>
            <h2 id="roadmap-overview-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{journey?.title ?? format("roadmap.stageStartingPoints", { stage: stageLabel ?? message("roadmap.selectedStage") })}</h2>
            <p className="mt-3 text-slate-600">{[stageLabel, route ? format("roadmap.routeSuffix", { route: route.title }) : undefined].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {journey && <Link href="/my-journey" className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("roadmap.openMyJourney")}</Link>}
            <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("roadmap.adjustStart")}</Link>
          </div>
        </div>
        {journey && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600"><span>{format("roadmap.stepsComplete", { complete: completeCount, total: resolvedSteps.length })}</span><span className="font-semibold text-teal-800">{completionPercentage}%</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label={message("roadmap.overallCompletion")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionPercentage}><div className="h-full rounded-full bg-teal-700 transition-[width]" style={{ width: `${completionPercentage}%` }} /></div>
          </div>
        )}
        {journey?.routes.length && !route ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{message("roadmap.chooseRouteNotice")}</p> : null}
      </section>

      {journey && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="phase-roadmap-heading">
            <h2 id="phase-roadmap-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("roadmap.phasesHeading")}</h2>
            <p className="mt-2 leading-7 text-slate-600">{message("roadmap.phasesIntro")}</p>
            <ol className="mt-6 space-y-3">
              {phaseSummaries.map((phase, index) => {
                const phaseComplete = phase.complete === phase.total;
                return (
                  <li key={phase.id}>
                    <Link href={`/my-journey#phase-${phase.id}`} className="group flex min-h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${phaseComplete ? "bg-teal-700 text-white" : "bg-white text-teal-800"}`}>{phaseComplete ? "✓" : index + 1}</span>
                      <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-950 group-hover:text-teal-800">{phase.title}</span><span className="mt-1 block text-sm text-slate-500">{format("roadmap.phaseProgress", { complete: phase.complete, total: phase.total })}{phase.inProgress ? format("roadmap.inProgressSuffix", { count: phase.inProgress }) : ""}</span></span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="roadmap-next-action" className="self-start scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="next-action-heading">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{message("roadmap.nextAction")}</p>
                <h2 id="next-action-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{nextArticle ? articleText(nextArticle).title : message("roadmap.stepsDone")}</h2>
              </div>
              {nextArticle && <ReminderLink targetId={nextArticle.id} title={articleText(nextArticle).title} returnTo="/roadmap#roadmap-next-action" />}
            </div>
            {nextArticle ? (
              <><p className="mt-3 leading-7 text-slate-600">{articleText(nextArticle).description}</p>{nextStep?.requiredness === "conditional" && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{format("roadmap.mayApply", { label: nextStep.conditionLabel ?? "" })}</p>}<Link href={`/my-journey#phase-${nextStep?.phaseId}`} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("roadmap.continue")}</Link></>
            ) : <p className="mt-3 leading-7 text-slate-600">{message("roadmap.allComplete")}</p>}
          </section>
        </div>
      )}

      {!journey && stageItems.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="stage-roadmap-heading">
          <h2 id="stage-roadmap-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("roadmap.suggested")}</h2>
          <p className="mt-2 leading-7 text-slate-600">{message("roadmap.suggestedIntro")}</p>
          <ul className="mt-5 divide-y divide-slate-200">
            {stageItems.flatMap(({ definition, progressState }) => {
              const article = articlesById.get(definition.relatedArticleIds[0]);
              return article ? [<li key={definition.id}><Link href={{ pathname: `/articles/${article.slug}`, query: { returnTo: "/roadmap" } }} className="flex min-h-16 items-center justify-between gap-4 py-3 font-semibold text-slate-900 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><span>{japanese ? articleText(article).title : definition.title}</span><span className="shrink-0 text-sm font-medium text-slate-500">{message(`progress.${progressState}`)}</span></Link></li>] : [];
            })}
          </ul>
          <Link href={{ pathname: "/onboarding", query: { returnTo: "/roadmap" } }} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700">{message("roadmap.chooseJourney")}</Link>
        </section>
      )}

      <section aria-labelledby="supporting-tools-heading">
        <h2 id="supporting-tools-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("roadmap.tools")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link href="/saved" className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{message("roadmap.savedContent")}</span><span className="mt-2 block text-xl font-semibold text-slate-950 group-hover:text-teal-700">{format("roadmap.savedCounts", savedCounts)}</span><span className="mt-4 block text-sm font-semibold text-teal-800">{message("roadmap.openSaved")}</span>
          </Link>
          <Link href="/saved#saved-glossary-review" className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{message("roadmap.glossaryReview")}</span><span className="mt-2 block text-xl font-semibold text-slate-950 group-hover:text-teal-700">{format("roadmap.reviewCounts", { reviewed: reviewedTermCount, learning: learningTermCount })}</span><span className="mt-4 block text-sm font-semibold text-teal-800">{message("roadmap.reviewSaved")}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
