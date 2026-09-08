import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToGlossaryLink } from "@/components/navigation/back-to-glossary-link";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import { getSourceById } from "@/data/sources";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { getArticleById } from "@/lib/content/articles";
import { getAllGlossaryTerms, getGlossaryTermById, getGlossaryTermBySlug } from "@/lib/content/glossary";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGlossaryTerms().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  return term ? { title: `${term.japanese} — ${term.englishName} | Nihonest`, description: term.shortDefinition } : {};
}

function labelFor(id: string, options: readonly { id: string; label: string }[]) {
  return options.find((option) => option.id === id)?.label ?? id;
}

export default async function GlossaryTermPage({ params }: PageProps<"/glossary/[slug]">) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) notFound();

  const relatedArticles = term.relatedArticleIds.flatMap((id) => {
    const article = getArticleById(id);
    return article ? [article.metadata] : [];
  });
  const relatedTerms = term.relatedTermIds.flatMap((id) => {
    const relatedTerm = getGlossaryTermById(id);
    return relatedTerm ? [relatedTerm] : [];
  });
  const termSources = term.sourceIds.flatMap((id) => {
    const source = getSourceById(id);
    return source ? [source] : [];
  });

  return (
    <article className="page-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <BackToGlossaryLink />
        <header className="relative mt-8 border-b border-slate-200 pb-8">
          <div className="absolute right-0 top-0"><SaveContentButton kind="glossary-term" contentId={term.id} /></div>
          <div className="flex flex-wrap gap-2 pr-14 text-xs font-semibold uppercase tracking-wide">
            {term.topicIds.map((topicId) => (
              <span key={topicId} className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">{labelFor(topicId, topics)}</span>
            ))}
          </div>
          <h1 lang="ja" className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">{term.japanese}</h1>
          <p className="mt-4 text-lg text-slate-500">
            {term.kana && <span lang="ja">{term.kana}</span>}
            {term.kana && term.romaji && <span> · </span>}
            {term.romaji}
          </p>
          <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{term.englishName}</p>
          <p className="mt-4 text-lg leading-8 text-slate-600">{term.shortDefinition}</p>
        </header>

        <section className="mt-8" aria-labelledby="meaning-heading">
          <h2 id="meaning-heading" className="text-2xl font-semibold tracking-tight text-slate-950">What it means</h2>
          <p className="mt-4 leading-8 text-slate-700">{term.detailedExplanation}</p>
          <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">Where you may encounter it</h2>
          <p className="mt-4 leading-8 text-slate-700">{term.commonContext}</p>
          {term.journeyStageIds.length > 0 && (
            <p className="mt-6 text-sm text-slate-500">Journey stages: {term.journeyStageIds.map((id) => labelFor(id, journeyStages)).join(", ")}</p>
          )}
        </section>

        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="term-articles-heading">
            <h2 id="term-articles-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Guides using this term</h2>
            <ul className="mt-4 space-y-3">
              {relatedArticles.map((article) => (
                <li key={article.id}><Link href={`/articles/${article.slug}`} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{article.title}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {relatedTerms.length > 0 && (
          <section className="mt-10" aria-labelledby="related-terms-heading">
            <h2 id="related-terms-heading" className="text-xl font-semibold tracking-tight text-slate-950">Related terms</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {relatedTerms.map((relatedTerm) => (
                <li key={relatedTerm.id}><Link href={`/glossary/${relatedTerm.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><span lang="ja">{relatedTerm.japanese}</span><span className="ml-2 text-slate-500">{relatedTerm.englishName}</span></Link></li>
              ))}
            </ul>
          </section>
        )}

        <OfficialSourceList sources={termSources} />
      </div>
    </article>
  );
}
