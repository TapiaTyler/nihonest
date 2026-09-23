"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ArticleMetadata } from "@/domain/article/article";
import { JapaneseReading } from "@/components/localization/japanese-reading";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { visibleSavedContent } from "@/domain/saved-content/saved-content";
import { SaveContentButton } from "./save-content-button";
import { useSavedContent } from "./saved-content-provider";
import { GlossaryStudyPanel } from "@/components/glossary-study/glossary-study-panel";
import { InterfaceText, useInterfaceMessages } from "@/components/localization/interface-text";
import type { ResidenceStatusTranslation } from "@/lib/content/translations";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";

/** Current Japanese fields for saved items; any item without one keeps canonical English. */
type SavedContentTranslations = Readonly<{
  articles?: readonly ArticleSearchTranslation[];
  statuses?: readonly ResidenceStatusTranslation[];
  terms?: readonly GlossarySearchTranslation[];
}>;

export function SavedContentLibrary({ articles, residenceStatuses, terms, translations = {} }: Readonly<{
  articles: readonly ArticleMetadata[];
  residenceStatuses: readonly ResidenceStatus[];
  terms: readonly JapaneseTerm[];
  translations?: SavedContentTranslations;
}>) {
  const { locale, message } = useInterfaceMessages();
  const japanese = locale === "ja";
  const articleTranslation = (id: string) => japanese ? translations.articles?.find(({ contentId }) => contentId === id) : undefined;
  const statusTranslation = (id: string) => japanese ? translations.statuses?.find(({ contentId }) => contentId === id) : undefined;
  const termTranslation = (id: string) => japanese ? translations.terms?.find(({ contentId }) => contentId === id) : undefined;
  const [studyOpen, setStudyOpen] = useState(false);
  const { isReady, records } = useSavedContent();

  // Deep links from the Roadmap reveal the otherwise-collapsed review on arrival.
  useEffect(() => {
    // The hash only exists in the browser, so this one-time post-hydration synchronization is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.location.hash === "#saved-glossary-review") setStudyOpen(true);
  }, []);

  const visibleRecords = visibleSavedContent(records);
  const savedArticleIds = new Set(visibleRecords.filter(({ kind }) => kind === "article").map(({ contentId }) => contentId));
  const savedTermIds = new Set(visibleRecords.filter(({ kind }) => kind === "glossary-term").map(({ contentId }) => contentId));
  const savedStatusIds = new Set(visibleRecords.filter(({ kind }) => kind === "residence-status").map(({ contentId }) => contentId));
  const savedArticles = articles.filter(({ id }) => savedArticleIds.has(id)).sort((left, right) => left.title.localeCompare(right.title));
  const savedTerms = terms.filter(({ id }) => savedTermIds.has(id)).sort((left, right) => left.englishName.localeCompare(right.englishName));
  const savedStatuses = residenceStatuses.filter(({ id }) => savedStatusIds.has(id)).sort((left, right) => left.englishName.localeCompare(right.englishName));

  // Saved records load after hydration, so repeat the anchor scroll once its target exists.
  useEffect(() => {
    if (!isReady || !studyOpen || window.location.hash !== "#saved-glossary-review") return;
    document.getElementById("saved-glossary-review")?.scrollIntoView({ block: "start" });
  }, [isReady, savedTerms.length, studyOpen]);

  if (!isReady) return <p className="mt-10 text-slate-600">{message("saved.loading")}</p>;
  if (!savedArticles.length && !savedStatuses.length && !savedTerms.length) {
    return (
      <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-7 sm:p-10" aria-labelledby="saved-empty-heading">
        <h2 id="saved-empty-heading" className="text-2xl font-semibold text-slate-950">{message("saved.emptyHeading")}</h2>
        <p className="mt-3 leading-7 text-slate-600">{message("saved.emptyBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/explore" className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("saved.explore")}</Link>
          <Link href="/glossary" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message("saved.browseGlossary")}</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-10 space-y-12">
      {savedArticles.length > 0 && (
        <section aria-labelledby="saved-guides-heading">
          <h2 id="saved-guides-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("saved.guides")}</h2>
          <ul className="mt-5 space-y-3">
            {savedArticles.map((article) => {
              const translated = articleTranslation(article.id);
              return (
              <li key={article.id} className="relative" lang={translated ? "ja" : "en"}>
                <Link href={{ pathname: `/articles/${article.slug}`, query: { returnTo: "/saved" } }} aria-label={translated?.title ?? article.title} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-lg font-semibold text-slate-950 group-hover:text-teal-700">{translated?.title ?? article.title}</span>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{translated?.description ?? article.description}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800"><InterfaceText id="content.readGuide" /></span>
                </Link>
                <span className="absolute right-4 top-4 z-10"><SaveContentButton kind="article" contentId={article.id} deferRemoval /></span>
              </li>
              );
            })}
          </ul>
        </section>
      )}

      {savedStatuses.length > 0 && (
        <section aria-labelledby="saved-statuses-heading">
          <h2 id="saved-statuses-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("saved.statuses")}</h2>
          <ul className="mt-5 space-y-3">
            {savedStatuses.map((status) => {
              const translated = statusTranslation(status.id);
              // Japanese leads with the official Japanese name, matching the status detail page.
              const primaryName = japanese ? status.japaneseName : status.englishName;
              return (
              <li key={status.id} className="relative">
                <Link href={{ pathname: `/residence-statuses/${status.slug}`, query: { returnTo: "/saved" } }} aria-label={primaryName} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span lang={japanese ? "ja" : "en"} className="text-lg font-semibold text-slate-950 group-hover:text-teal-700">{primaryName}</span>
                  <p className="mt-1 text-sm text-slate-500"><span lang={japanese ? "en" : "ja"}>{japanese ? status.englishName : status.japaneseName}</span> · <JapaneseReading kana={status.japaneseKana} romaji={status.romaji} /></p>
                  <p lang={translated ? "ja" : "en"} className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{translated?.summary ?? status.summary}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800"><InterfaceText id="content.viewStatus" /></span>
                </Link>
                <span className="absolute right-4 top-4 z-10"><SaveContentButton kind="residence-status" contentId={status.id} deferRemoval /></span>
              </li>
              );
            })}
          </ul>
        </section>
      )}

      {savedTerms.length > 0 && (
        <section id="saved-glossary-review" aria-labelledby="saved-terms-heading" className="scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="saved-terms-heading" className="text-2xl font-semibold tracking-tight text-slate-950"><InterfaceText id="saved.glossaryHeading" /></h2>
            <button type="button" aria-expanded={studyOpen} aria-controls="saved-glossary-review-panel" onClick={() => setStudyOpen((open) => !open)} className="inline-flex min-h-11 items-center rounded-full border border-teal-700 bg-white px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              <InterfaceText id={studyOpen ? "saved.hideReview" : "saved.reviewTerms"} />
            </button>
          </div>
          {studyOpen && <div id="saved-glossary-review-panel"><GlossaryStudyPanel terms={savedTerms} /></div>}
          <ul className="mt-5 space-y-3">
            {savedTerms.map((term) => (
              <li key={term.id} className="relative">
                <Link href={{ pathname: `/glossary/${term.slug}`, query: { returnTo: "/saved" } }} aria-label={`${term.japanese} — ${term.englishName}`} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-lg font-semibold text-slate-950 group-hover:text-teal-700"><span lang="ja">{term.japanese}</span> — {term.englishName}</span>
                  <p lang={termTranslation(term.id) ? "ja" : "en"} className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{termTranslation(term.id)?.shortDefinition ?? term.shortDefinition}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800"><InterfaceText id="content.viewTerm" /></span>
                </Link>
                <span className="absolute right-4 top-4 z-10"><SaveContentButton kind="glossary-term" contentId={term.id} deferRemoval /></span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
