import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { guidedJourneys } from "@/data/discovery";
import { journeyApplicabilityLabels, journeyStepRoleLabels } from "@/domain/discovery/discovery";
import { getArticleGroupById, getGuidedJourneyById, getJourneySteps } from "@/lib/content/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return guidedJourneys.map(({ id }) => ({ journeyId: id }));
}

export async function generateMetadata({ params }: PageProps<"/explore/journeys/[journeyId]">): Promise<Metadata> {
  const { journeyId } = await params;
  const journey = getGuidedJourneyById(journeyId);
  return journey ? { title: `${journey.title} | Nihonest`, description: journey.description } : {};
}

export default async function GuidedJourneyPage({ params }: PageProps<"/explore/journeys/[journeyId]">) {
  const { journeyId } = await params;
  const journey = getGuidedJourneyById(journeyId);
  if (!journey) notFound();
  const group = getArticleGroupById(journey.groupId);
  if (!group) notFound();
  const steps = getJourneySteps(journey.id);

  return (
    <div className="page-shell py-12 sm:py-20">
      <Link href={`/explore/${group.id}`} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        ← Back to {group.title}
      </Link>
      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">Guided journey</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{journey.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{journey.description}</p>
        <p className="mt-4 leading-7 text-slate-600">{journey.introduction}</p>
      </header>

      <section className="mt-10" aria-labelledby="journey-steps-heading">
        <h2 id="journey-steps-heading" className="sr-only">Journey steps</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map(({ article, step }, index) => {
            const coreStepNumber = steps.slice(0, index + 1).filter(({ step: candidate }) => candidate.role === "core").length;
            return (
            <div key={article.metadata.id} className="relative pt-5">
              <div className="pointer-events-none absolute left-5 top-0 z-10 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white">
                  {step.role === "core" ? `Step ${coreStepNumber}` : journeyStepRoleLabels[step.role]}
                </span>
                {step.applicability.map((scope) => (
                  <span key={scope} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">{journeyApplicabilityLabels[scope]}</span>
                ))}
              </div>
              <ArticleCard article={article.metadata} />
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
