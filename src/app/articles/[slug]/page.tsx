import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTerminology } from "@/components/content/article-terminology";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import { articleStatusLabels, type ArticleMetadata } from "@/domain/article/article";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { getSourceById } from "@/data/sources";
import { getAllArticles, getArticleById, getArticleBySlug, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/articles";
import { getJourneySteps } from "@/lib/content/articles";
import { getGlossaryTermById } from "@/lib/content/glossary";
import { getJourneyRouteById, getJourneyRouteForArticle } from "@/domain/discovery/discovery";
import { articleJourneyHref, journeyHref } from "@/lib/navigation/journey-context";
import {
  ArticleTranslationNotice,
  LocalizedArticleBody,
  LocalizedArticleHeading,
} from "@/components/localization/localized-article";
import { getJapanesePilotArticleTranslation } from "@/lib/content/translations";
import { ContinueExploringList } from "@/components/content/continue-exploring-list";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map(({ metadata }) => ({ slug: metadata.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.metadata.title} | Nihonest`,
    description: article.metadata.description,
  };
}

function labelFor(id: string, options: readonly { id: string; label: string }[]) {
  return options.find((option) => option.id === id)?.label ?? id;
}

const relationshipLabels = {
  related: "Related guide",
  prerequisite: "Read first",
  "next-step": "Suggested follow-up",
} as const;

export default async function ArticlePage({ params, searchParams }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { Content, metadata } = article;
  const japaneseTranslation = getJapanesePilotArticleTranslation(metadata.id);
  const articleSources = metadata.sourceIds.flatMap((sourceId) => {
    const source = getSourceById(sourceId);
    return source ? [source] : [];
  });
  const relatedArticles = metadata.relationships.flatMap((relationship) => {
    const relatedArticle = getArticleById(relationship.articleId);
    return relatedArticle ? [{ relationship, article: relatedArticle.metadata }] : [];
  });
  const glossaryTerms = metadata.termIds.flatMap((termId) => {
    const term = getGlossaryTermById(termId);
    return term ? [term] : [];
  });
  const relatedGroups = getArticleGroupsByArticleIds([metadata.id]);
  const relatedJourneys = getGuidedJourneysByArticleIds([metadata.id]);
  const requestedJourneyId = typeof query.journey === "string" ? query.journey : undefined;
  const requestedRouteId = typeof query.route === "string" ? query.route : undefined;
  const contextualJourney = relatedJourneys.find(({ id }) => id === requestedJourneyId);
  const contextualRoute = contextualJourney ? getJourneyRouteById(contextualJourney, requestedRouteId) : undefined;
  const contextualSteps = contextualJourney ? getJourneySteps(contextualJourney.id, contextualRoute?.id) : [];
  const contextualIndex = contextualSteps.findIndex(({ article: contextualArticle }) => contextualArticle.metadata.id === metadata.id);
  const journeyContext = contextualJourney && contextualIndex >= 0 ? {
    journey: contextualJourney,
    route: contextualRoute,
    steps: contextualSteps,
    index: contextualIndex,
  } : undefined;
  const continueGuides = new Map<string, { article: ArticleMetadata; label: string }>(
    relatedArticles.map(({ relationship, article: relatedArticle }) => [
      relatedArticle.id,
      { article: relatedArticle, label: relationshipLabels[relationship.type] },
    ]),
  );

  return (
    <article className="page-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {query.returnTo === "/roadmap" || query.returnTo === "/my-journey" ? (
          <Link href={query.returnTo} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            ← Back to {query.returnTo === "/roadmap" ? "Roadmap" : "My Journey"}
          </Link>
        ) : journeyContext ? (
          <Link href={journeyHref(journeyContext.journey.id, journeyContext.route?.id)} className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            ← Back to {journeyContext.journey.title}
          </Link>
        ) : <BackToExploreLink />}
        <ArticleTranslationNotice translation={japaneseTranslation} />
        <header className="relative mt-8 border-b border-slate-200 pb-8">
          <div className="absolute right-0 top-0"><SaveContentButton kind="article" contentId={metadata.id} /></div>
          <div className="flex flex-wrap gap-2 pr-14 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
              {articleStatusLabels[metadata.status]}
            </span>
            {metadata.topicIds.map((topicId) => (
              <span key={topicId} className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
                {labelFor(topicId, topics)}
              </span>
            ))}
          </div>
          <LocalizedArticleHeading
            canonicalTitle={metadata.title}
            canonicalDescription={metadata.description}
            translation={japaneseTranslation}
          />
          <p className="mt-5 text-sm text-slate-500">
            Journey stages: {metadata.journeyStageIds.map((id) => labelFor(id, journeyStages)).join(", ")}
          </p>
        </header>

        <div className="mt-8">
          <LocalizedArticleBody translation={japaneseTranslation}>
            <Content />
          </LocalizedArticleBody>
        </div>

        <div className="mt-12">
          <ArticleTerminology terms={glossaryTerms} />
        </div>

        {journeyContext && (
          <section className="mt-12 rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7" aria-labelledby="your-journey-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Your journey</p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="your-journey-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{journeyContext.journey.title}</h2>
                {journeyContext.route && <p className="mt-2 font-medium text-teal-900">{journeyContext.route.title} route</p>}
              </div>
              <Link href={journeyHref(journeyContext.journey.id, journeyContext.route?.id)} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">View journey outline</Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {journeyContext.steps[journeyContext.index - 1] ? (
                <Link href={articleJourneyHref(journeyContext.steps[journeyContext.index - 1].article.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="group rounded-2xl border border-teal-200 bg-white p-5 hover:border-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Previous</span>
                  <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">← {journeyContext.steps[journeyContext.index - 1].article.metadata.title}</span>
                </Link>
              ) : <div className="rounded-2xl border border-dashed border-teal-200 p-5 text-sm text-slate-600">This is the first guide in your selected path.</div>}
              {journeyContext.steps[journeyContext.index + 1] ? (
                <Link href={articleJourneyHref(journeyContext.steps[journeyContext.index + 1].article.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="group rounded-2xl border border-teal-200 bg-white p-5 hover:border-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next</span>
                  <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{journeyContext.steps[journeyContext.index + 1].article.metadata.title} →</span>
                </Link>
              ) : <div className="rounded-2xl border border-dashed border-teal-200 p-5 text-sm text-slate-600">This is the final guide in your selected path.</div>}
            </div>
            <details className="mt-5 rounded-2xl border border-teal-200 bg-white p-5">
              <summary className="cursor-pointer font-semibold text-teal-900">Show this journey’s table of contents</summary>
              <ol className="mt-4 space-y-3">
                {journeyContext.steps.map(({ article: outlineArticle, step }, index) => (
                  <li key={outlineArticle.metadata.id} className="flex gap-3 text-sm leading-6">
                    <span className="shrink-0 font-semibold text-teal-700">{index + 1}.</span>
                    {index === journeyContext.index ? (
                      <span aria-current="step" className="font-semibold text-slate-950">{outlineArticle.metadata.title} <span className="text-teal-700">(current)</span></span>
                    ) : (
                      <Link href={articleJourneyHref(outlineArticle.metadata.slug, journeyContext.journey.id, journeyContext.route?.id)} className="text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600">{outlineArticle.metadata.title}{step.requiredness === "conditional" ? ` — ${step.conditionLabel}` : ""}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        )}

        {(relatedGroups.length > 0 || relatedJourneys.length > 0 || continueGuides.size > 0) && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Continue exploring
            </h2>
            <p className="mt-3 leading-7 text-slate-600">Continue with an ordered journey, browse the wider subject, or move to the next connected guide.</p>
            <ContinueExploringList
              key={metadata.id}
              cards={[
                ...relatedJourneys.map((journey) => (
                  <Link
                    key={`journey-${journey.id}`}
                    href={journeyHref(journey.id, journeyContext?.journey.id === journey.id ? journeyContext.route?.id : getJourneyRouteForArticle(journey, metadata.id)?.id)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Guided journey</span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{journey.title} →</span>
                  </Link>
                )),
                ...relatedGroups.map((group) => (
                  <Link
                    key={`group-${group.id}`}
                    href={`/explore/${group.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Content group</span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{group.title} →</span>
                  </Link>
                )),
              ]}
              guides={[...continueGuides.values()].map(({ article: relatedArticle, label }) => (
                  <li key={relatedArticle.id}>
                    <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{label}:</span>
                    <Link href={`/articles/${relatedArticle.slug}`} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      {relatedArticle.title}
                    </Link>
                  </li>
                ))}
            />
          </section>
        )}

        <OfficialSourceList sources={articleSources} />
      </div>
    </article>
  );
}
