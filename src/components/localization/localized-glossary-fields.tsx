"use client";

import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";
import Link from "next/link";
import type { TopicId, JourneyStageId } from "@/domain/taxonomy/taxonomy";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import { journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";
import { LocalizedTermGloss } from "@/components/glossary/localized-term-gloss";

function activeTranslation(term: JapaneseTerm, translation?: GlossarySearchTranslation, locale = "en") {
  return translation?.contentId === term.id && translation.targetLocale === locale ? translation : undefined;
}

export function LocalizedGlossarySummary({ term, translation }: Readonly<{
  term: JapaneseTerm;
  translation?: GlossarySearchTranslation;
}>) {
  const { locale } = useContentLocale();
  const active = activeTranslation(term, translation, locale);
  return (
    <div>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 empty:hidden"><LocalizedTermGloss term={term} variant="name" /></p>
      <p lang={active ? "ja" : "en"} className="mt-4 text-lg leading-8 text-slate-600">{active?.shortDefinition ?? term.shortDefinition}</p>
    </div>
  );
}

export function LocalizedGlossaryExplanation({ term, translation }: Readonly<{
  term: JapaneseTerm;
  translation?: GlossarySearchTranslation;
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const active = activeTranslation(term, translation, locale);
  return (
    <section lang={active ? "ja" : "en"} className="mt-8" aria-labelledby="meaning-heading">
      <h2 id="meaning-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("glossary.whatItMeans")}</h2>
      <p className="mt-4 leading-8 text-slate-700">{active?.detailedExplanation ?? term.detailedExplanation}</p>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">{message("glossary.whereEncountered")}</h2>
      <p className="mt-4 leading-8 text-slate-700">{active?.commonContext ?? term.commonContext}</p>
    </section>
  );
}

type GlossaryDetailDocument = Readonly<{ id: string; title: string; japaneseTitle?: string; href: string }>;
type GlossaryDetailArticle = Readonly<{ id: string; title: string; slug: string }>;

export function LocalizedGlossaryDetailSections({
  journeyStageIds,
  documents,
  articles,
  japaneseArticleTitles,
}: Readonly<{
  journeyStageIds: readonly JourneyStageId[];
  documents: readonly GlossaryDetailDocument[];
  articles: readonly GlossaryDetailArticle[];
  japaneseArticleTitles: Readonly<Record<string, string>>;
}>) {
  const { locale, message } = useInterfaceMessages();
  return <>
    {journeyStageIds.length > 0 && <p className="mt-6 text-sm text-slate-500">{message("glossary.journeyStages")} {journeyStageIds.map((id) => locale === "ja" ? japaneseTaxonomyLabels.journeyStage[id] : journeyStages.find((stage) => stage.id === id)?.label ?? id).join(locale === "ja" ? "、" : ", ")}</p>}
    {documents.length > 0 && <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="document-example-heading">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{message("glossary.visualReference")}</p>
      <h2 id="document-example-heading" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{message("glossary.annotatedDocumentExample")}</h2>
      <p className="mt-3 leading-7 text-slate-600">{message("glossary.annotatedDocumentIntro")}</p>
      <ul className="mt-4 space-y-3">{documents.map(({ id, title, japaneseTitle, href }) => <li key={id}><Link href={href} className="inline-flex min-h-11 items-center rounded-full border border-brand-300 bg-white px-4 text-sm font-semibold text-brand-link hover:border-brand-600 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("glossary.viewDocumentExample").replace("{title}", locale === "ja" ? japaneseTitle ?? title : title)}</Link></li>)}</ul>
    </section>}
    {articles.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="term-articles-heading">
      <h2 id="term-articles-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("glossary.guidesUsingTerm")}</h2>
      <ul className="mt-4 space-y-3">{articles.map(({ id, title, slug }) => <li key={id}><Link href={`/articles/${slug}`} className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{locale === "ja" ? japaneseArticleTitles[id] ?? title : title}</Link></li>)}</ul>
    </section>}
  </>;
}

export function LocalizedGlossaryTopics({ topicIds }: Readonly<{ topicIds: readonly TopicId[] }>) {
  const { locale } = useInterfaceMessages();
  return <div className="flex flex-wrap gap-2 pr-14 text-xs font-semibold uppercase tracking-wide">
    {topicIds.map((id) => <span key={id} className="rounded-full bg-brand-soft px-3 py-1 text-brand-link">{locale === "ja" ? japaneseTaxonomyLabels.topic[id] : topics.find((topic) => topic.id === id)?.label ?? id}</span>)}
  </div>;
}
