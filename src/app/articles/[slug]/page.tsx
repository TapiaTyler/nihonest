import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTerminology } from "@/components/content/article-terminology";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToExploreLink } from "@/components/navigation/back-to-explore-link";
import { articleStatusLabels, type ArticleMetadata } from "@/domain/article/article";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { getSourceById } from "@/data/sources";
import { getAllArticles, getArticleById, getArticleBySlug, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/articles";
import { getGlossaryTermById } from "@/lib/content/glossary";

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
  "next-step": "Next step",
} as const;

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { Content, metadata } = article;
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
  const continueGuides = new Map<string, { article: ArticleMetadata; label: string }>(
    relatedArticles.map(({ relationship, article: relatedArticle }) => [
      relatedArticle.id,
      { article: relatedArticle, label: relationshipLabels[relationship.type] },
    ]),
  );

  for (const journey of relatedJourneys) {
    const currentIndex = journey.steps.findIndex(({ articleId }) => articleId === metadata.id);
    const nextStep = journey.steps[currentIndex + 1];
    if (!nextStep) continue;
    const nextArticle = getArticleById(nextStep.articleId)?.metadata;
    if (nextArticle && !continueGuides.has(nextArticle.id)) {
      continueGuides.set(nextArticle.id, { article: nextArticle, label: `Next in ${journey.title}` });
    }
  }

  return (
    <article className="page-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <BackToExploreLink />
        <header className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
              {articleStatusLabels[metadata.status]}
            </span>
            {metadata.topicIds.map((topicId) => (
              <span key={topicId} className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
                {labelFor(topicId, topics)}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {metadata.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{metadata.description}</p>
          <p className="mt-5 text-sm text-slate-500">
            Journey stages: {metadata.journeyStageIds.map((id) => labelFor(id, journeyStages)).join(", ")}
          </p>
        </header>

        <div className="mt-8">
          <Content />
        </div>

        <div className="mt-12">
          <ArticleTerminology terms={glossaryTerms} />
        </div>

        {(relatedGroups.length > 0 || relatedJourneys.length > 0 || continueGuides.size > 0) && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Continue exploring
            </h2>
            <p className="mt-3 leading-7 text-slate-600">Continue with an ordered journey, browse the wider subject, or move to the next connected guide.</p>
            {(relatedJourneys.length > 0 || relatedGroups.length > 0) && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedJourneys.map((journey) => (
                  <Link
                    key={`journey-${journey.id}`}
                    href={`/explore/journeys/${journey.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Guided journey</span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{journey.title} →</span>
                  </Link>
                ))}
                {relatedGroups.map((group) => (
                  <Link
                    key={`group-${group.id}`}
                    href={`/explore/${group.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Content group</span>
                    <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{group.title} →</span>
                  </Link>
                ))}
              </div>
            )}
            {continueGuides.size > 0 && (
              <ul className="mt-6 space-y-3">
                {[...continueGuides.values()].map(({ article: relatedArticle, label }) => (
                  <li key={relatedArticle.id}>
                    <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{label}:</span>
                    <Link href={`/articles/${relatedArticle.slug}`} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      {relatedArticle.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <OfficialSourceList sources={articleSources} />
      </div>
    </article>
  );
}
