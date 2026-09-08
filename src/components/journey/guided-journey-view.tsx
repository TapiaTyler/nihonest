import Link from "next/link";
import { ArticleCard } from "@/components/content/article-card";
import { JourneyRouteLink } from "@/components/personalization/journey-route-link";
import { JourneyChecklistControl } from "@/components/roadmap/journey-checklist-control";
import { JourneyProgressSummary } from "@/components/roadmap/journey-progress-summary";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup, GuidedJourney, JourneyRoute, ResolvedJourneyStep } from "@/domain/discovery/discovery";
import { articleJourneyHref, journeyHref } from "@/lib/navigation/journey-context";

export type JourneyViewStep = Readonly<{ step: ResolvedJourneyStep; article: ArticleMetadata }>;

export function GuidedJourneyView({
  journey,
  group,
  selectedRoute,
  requestedRouteId,
  steps,
  mode = "catalog",
}: Readonly<{
  journey: GuidedJourney;
  group: ArticleGroup;
  selectedRoute?: JourneyRoute;
  requestedRouteId?: string;
  steps: readonly JourneyViewStep[];
  mode?: "catalog" | "personal";
}>) {
  const requiredStepNumbers = new Map(
    steps.filter(({ step }) => step.requiredness === "required").map(({ article }, index) => [article.id, index + 1]),
  );
  const checklistIds = steps.map(({ article }) => article.id);
  const changeRouteHref = mode === "personal" ? "/my-journey?changeRoute=1" : journeyHref(journey.id);

  return (
    <>
      <Link href={mode === "personal" ? "/" : `/explore/${group.id}`} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        ← Back to {mode === "personal" ? "Home" : group.title}
      </Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">{mode === "personal" ? "My Journey" : "Guided journey"}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{journey.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{journey.description}</p>
        <p className="mt-4 leading-7 text-slate-600">{journey.introduction}</p>
      </header>

      {requestedRouteId && !selectedRoute && mode === "catalog" && (
        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">That route is not part of this journey. Choose one of the available routes below.</p>
      )}

      <nav className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="journey-outline-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Journey outline</p>
            <h2 id="journey-outline-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{selectedRoute ? `${selectedRoute.title} route` : "Your focused path"}</h2>
          </div>
          {selectedRoute && <Link href={changeRouteHref} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Change route</Link>}
        </div>
        {!selectedRoute && journey.routes.length > 0 && <p className="mt-3 text-sm leading-6 text-slate-600">Choose a route to replace the comparison point with one relevant guide. Unselected alternatives will not appear as later steps.</p>}
        <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {journey.phases.map((phase, index) => (
            <li key={phase.id}>
              <a href={`#phase-${phase.id}`} className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-800 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                <span className="text-sm font-semibold text-teal-700">{index + 1}</span><span>{phase.title}</span>
              </a>
            </li>
          ))}
        </ol>
        {checklistIds.length > 0 && <JourneyProgressSummary checklistIds={checklistIds} />}
      </nav>

      <div className="mt-12 space-y-14">
        {journey.phases.map((phase) => {
          const phaseSteps = steps.filter(({ step }) => step.phaseId === phase.id);
          const containsRouteChoice = phase.steps.some(({ type }) => type === "route-choice");
          if (phaseSteps.length === 0 && !containsRouteChoice) return null;

          return (
            <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-8" aria-labelledby={`phase-${phase.id}-heading`}>
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Journey phase</p>
                <h2 id={`phase-${phase.id}-heading`} className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{phase.title}</h2>
                {phase.description && <p className="mt-3 leading-7 text-slate-600">{phase.description}</p>}
              </div>

              {containsRouteChoice && !selectedRoute && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {journey.routes.map((route) => (
                    <JourneyRouteLink key={route.id} href={mode === "personal" ? "/my-journey" : journeyHref(journey.id, route.id)} journeyId={journey.id} routeId={route.id} focusedArticleId={route.articleId} className="group rounded-2xl border border-teal-200 bg-teal-50/50 p-6 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Choose this route</span>
                      <span className="mt-2 block text-xl font-semibold text-slate-950 group-hover:text-teal-800">{route.title}</span>
                      <span className="mt-3 block leading-7 text-slate-600">{route.description}</span>
                    </JourneyRouteLink>
                  ))}
                </div>
              )}

              {phaseSteps.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {phaseSteps.map(({ article, step }) => (
                    <div key={article.id} className={`relative h-full ${step.requiredness === "required" ? "pt-5" : ""}`}>
                      {step.requiredness === "required" && <div className="pointer-events-none absolute left-5 top-0 z-10"><span className="rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white">Step {requiredStepNumbers.get(article.id)}</span></div>}
                      <ArticleCard
                        article={article}
                        href={articleJourneyHref(article.slug, journey.id, selectedRoute?.id, mode === "personal" ? "/my-journey" : undefined)}
                        notice={step.requiredness === "conditional" ? `May apply: ${step.conditionLabel}` : undefined}
                        headerAction={<JourneyChecklistControl checklistId={article.id} />}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
