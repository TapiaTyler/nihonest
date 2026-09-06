import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleById, getArticleBySlug } from "@/lib/content/articles";
import { getSourceById } from "@/data/sources";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { OfficialSourceList } from "@/components/content/official-source-list";

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

  return (
    <article className="page-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/explore"
          className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          ← Back to Explore
        </Link>
        <header className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">Draft sample</span>
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

        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Continue exploring
            </h2>
            <ul className="mt-4 space-y-3">
              {relatedArticles.map(({ relationship, article: relatedArticle }) => (
                <li key={`${relationship.type}-${relatedArticle.id}`}>
                  <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {relationshipLabels[relationship.type]}:
                  </span>
                  <Link
                    href={`/articles/${relatedArticle.slug}`}
                    className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    {relatedArticle.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <OfficialSourceList sources={articleSources} />
      </div>
    </article>
  );
}
