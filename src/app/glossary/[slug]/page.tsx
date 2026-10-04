import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { BackToGlossaryLink } from "@/components/navigation/back-to-glossary-link";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import { getSourceById } from "@/data/sources";
import { getArticleById } from "@/lib/content/article-metadata";
import { getAllGlossaryTerms, getGlossaryTermById, getGlossaryTermBySlug } from "@/lib/content/glossary";
import { PronunciationButton } from "@/components/glossary/pronunciation-button";
import { JapaneseReading } from "@/components/localization/japanese-reading";
import { LocalizedTermGloss } from "@/components/glossary/localized-term-gloss";
import { InterfaceText } from "@/components/localization/interface-text";
import { getAnnotatedDocumentsForGlossaryTerm } from "@/lib/content/annotated-documents";
import { getArticleSearchTranslations, getGlossarySearchTranslations } from "@/lib/content/translations";
import { LocalizedGlossaryDetailSections, LocalizedGlossaryExplanation, LocalizedGlossarySummary, LocalizedGlossaryTopics } from "@/components/localization/localized-glossary-fields";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { formatInterfaceMessage } from "@/domain/localization/interface-messages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGlossaryTerms().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  return term ? { title: `${term.japanese} — ${term.englishName} | Nihonest`, description: term.shortDefinition } : {};
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
  const documentExamples = getAnnotatedDocumentsForGlossaryTerm(term.id);
  const translation = getGlossarySearchTranslations().find(({ contentId }) => contentId === term.id);
  const relatedArticleIds = new Set(relatedArticles.map(({ id }) => id));
  const japaneseArticleTitles = Object.fromEntries(getArticleSearchTranslations()
    .filter(({ contentId }) => relatedArticleIds.has(contentId))
    .map(({ contentId, title }) => [contentId, title]));
  const localizedDocuments = documentExamples.flatMap((family) => {
    const article = getArticleById(family.articleId);
    return article ? [{ id: family.id, title: family.title, japaneseTitle: family.japaneseName, href: `/articles/${article.metadata.slug}#document-${family.id}` }] : [];
  });

  return (
    <article className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={formatInterfaceMessage("ja", "pageTitle.glossaryTerm", { term: term.japanese, english: term.englishName })} />
      <div className="mx-auto max-w-3xl">
        <BackToGlossaryLink />
        <header className="relative mt-8 border-b border-slate-200 pb-8">
          <div className="absolute right-0 top-0"><SaveContentButton kind="glossary-term" contentId={term.id} /></div>
          <LocalizedGlossaryTopics topicIds={term.topicIds} />
          <h1 lang="ja" className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">{term.japanese}</h1>
          <p className="mt-4 text-lg text-slate-500">
            <JapaneseReading kana={term.kana} romaji={term.romaji} />
          </p>
          <PronunciationButton japanese={term.japanese} kana={term.kana} englishName={term.englishName} />
          <LocalizedGlossarySummary term={term} translation={translation} />
        </header>

        <LocalizedGlossaryExplanation term={term} translation={translation} />
        <LocalizedGlossaryDetailSections journeyStageIds={term.journeyStageIds} documents={localizedDocuments} articles={relatedArticles} japaneseArticleTitles={japaneseArticleTitles} />

        {relatedTerms.length > 0 && (
          <section className="mt-10" aria-labelledby="related-terms-heading">
            <h2 id="related-terms-heading" className="text-xl font-semibold tracking-tight text-slate-950"><InterfaceText id="glossary.relatedTerms" /></h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {relatedTerms.map((relatedTerm) => (
                <li key={relatedTerm.id}><Link href={`/glossary/${relatedTerm.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:border-teal-600 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"><span lang="ja">{relatedTerm.japanese}</span><LocalizedTermGloss term={relatedTerm} className="ml-2 text-slate-500" /></Link></li>
              ))}
            </ul>
          </section>
        )}

        <OfficialSourceList sources={termSources} />
      </div>
    </article>
  );
}
