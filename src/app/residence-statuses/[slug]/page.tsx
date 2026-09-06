import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { InlineGlossaryTerm } from "@/components/glossary/inline-glossary-term";
import { getArticleById, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/articles";
import { getResidenceStatusBySlug, residenceStatuses } from "@/data/residence-statuses";
import { getSourceById } from "@/data/sources";
import { residenceStatusCategoryLabels } from "@/domain/residence-status/residence-status";
import { getGlossaryTermById } from "@/lib/content/glossary";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return residenceStatuses.map((status) => ({ slug: status.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/residence-statuses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const residenceStatus = getResidenceStatusBySlug(slug);

  if (!residenceStatus) {
    return {};
  }

  return {
    title: `${residenceStatus.englishName} | Nihonest`,
    description: residenceStatus.summary,
  };
}

export default async function ResidenceStatusPage({
  params,
}: PageProps<"/residence-statuses/[slug]">) {
  const { slug } = await params;
  const residenceStatus = getResidenceStatusBySlug(slug);

  if (!residenceStatus) {
    notFound();
  }

  const statusSources = residenceStatus.sourceIds.flatMap((sourceId) => {
    const source = getSourceById(sourceId);
    return source ? [source] : [];
  });
  const relatedArticles = residenceStatus.relatedArticleIds.flatMap((articleId) => {
    const article = getArticleById(articleId);
    return article ? [article.metadata] : [];
  });
  const relatedGroups = getArticleGroupsByArticleIds(residenceStatus.relatedArticleIds);
  const relatedJourneys = getGuidedJourneysByArticleIds(residenceStatus.relatedArticleIds);
  const glossaryTerm = getGlossaryTermById(residenceStatus.glossaryTermId);
  if (!glossaryTerm) notFound();

  return (
    <article className="page-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/residence-statuses"
          className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          ← Back to residence statuses
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Draft
            </span>
            <span className="text-sm text-slate-500">{residenceStatusCategoryLabels[residenceStatus.category]}</span>
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {residenceStatus.englishName}
          </h1>
          <p className="mt-3 text-2xl text-slate-600">
            <InlineGlossaryTerm term={glossaryTerm}>
              <span lang="ja">{residenceStatus.japaneseName}</span>
            </InlineGlossaryTerm>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            <span lang="ja">{residenceStatus.japaneseKana}</span> · {residenceStatus.romaji}
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-600">{residenceStatus.summary}</p>
        </header>

        <section className="mt-10" aria-labelledby="purpose-heading">
          <h2 id="purpose-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
            General purpose
          </h2>
          <p className="mt-4 leading-8 text-slate-700">{residenceStatus.purpose}</p>
        </section>

        <section className="mt-10" aria-labelledby="activities-heading">
          <h2 id="activities-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
            Typical activities
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-700">
            {residenceStatus.typicalActivities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
          {residenceStatus.examples.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Examples in official summaries
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {residenceStatus.examples.map((example) => (
                  <li key={example} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6" aria-labelledby="verify-heading">
          <h2 id="verify-heading" className="text-xl font-semibold tracking-tight text-amber-950">
            What to verify
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-amber-950">
            {residenceStatus.considerations.map((consideration) => (
              <li key={consideration}>{consideration}</li>
            ))}
          </ul>
        </section>

        {(relatedGroups.length > 0 || relatedJourneys.length > 0) && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="explore-paths-heading">
            <h2 id="explore-paths-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Explore this status in context
            </h2>
            <p className="mt-3 leading-7 text-slate-600">Browse the wider subject group or follow a mapped journey that includes this status.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedGroups.map((group) => (
                <ContextLink key={`group-${group.id}`} href={`/explore/${group.id}`} eyebrow="Content group" title={group.title} />
              ))}
              {relatedJourneys.map((journey) => (
                <ContextLink key={`journey-${journey.id}`} href={`/explore/journeys/${journey.id}`} eyebrow="Guided journey" title={journey.title} />
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-guidance-heading">
            <h2 id="related-guidance-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
              Related guidance
            </h2>
            <ul className="mt-4 space-y-3">
              {relatedArticles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-sm text-slate-500">
          Last reviewed:{" "}
          <time dateTime={residenceStatus.lastReviewedAt}>
            {dateFormatter.format(new Date(`${residenceStatus.lastReviewedAt}T00:00:00Z`))}
          </time>
        </p>
        <OfficialSourceList sources={statusSources} />
      </div>
    </article>
  );
}

function ContextLink({ href, eyebrow, title }: Readonly<{ href: string; eyebrow: string; title: string }>) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{eyebrow}</span>
      <span className="mt-2 block font-semibold text-slate-950 group-hover:text-teal-700">{title} →</span>
    </Link>
  );
}
