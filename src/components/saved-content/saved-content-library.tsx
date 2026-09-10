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

export function SavedContentLibrary({ articles, residenceStatuses, terms }: Readonly<{
  articles: readonly ArticleMetadata[];
  residenceStatuses: readonly ResidenceStatus[];
  terms: readonly JapaneseTerm[];
}>) {
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

  if (!isReady) return <p className="mt-10 text-slate-600">Loading saved content…</p>;
  if (!savedArticles.length && !savedStatuses.length && !savedTerms.length) {
    return (
      <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-7 sm:p-10" aria-labelledby="saved-empty-heading">
        <h2 id="saved-empty-heading" className="text-2xl font-semibold text-slate-950">Nothing saved yet</h2>
        <p className="mt-3 leading-7 text-slate-600">Save useful guides, residence statuses, and Japanese terms as you browse. They stay on this device without requiring an account.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/explore" className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Explore guidance</Link>
          <Link href="/glossary" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Browse glossary</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-10 space-y-12">
      {savedArticles.length > 0 && (
        <section aria-labelledby="saved-guides-heading">
          <h2 id="saved-guides-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Saved guides</h2>
          <ul className="mt-5 space-y-3">
            {savedArticles.map((article) => (
              <li key={article.id} className="relative">
                <Link href={{ pathname: `/articles/${article.slug}`, query: { returnTo: "/saved" } }} aria-label={article.title} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-lg font-semibold text-slate-950 group-hover:text-teal-700">{article.title}</span>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{article.description}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800">Read guide →</span>
                </Link>
                <span className="absolute right-4 top-4 z-10"><SaveContentButton kind="article" contentId={article.id} deferRemoval /></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {savedStatuses.length > 0 && (
        <section aria-labelledby="saved-statuses-heading">
          <h2 id="saved-statuses-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Saved residence statuses</h2>
          <ul className="mt-5 space-y-3">
            {savedStatuses.map((status) => (
              <li key={status.id} className="relative">
                <Link href={{ pathname: `/residence-statuses/${status.slug}`, query: { returnTo: "/saved" } }} aria-label={status.englishName} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-lg font-semibold text-slate-950 group-hover:text-teal-700">{status.englishName}</span>
                  <p className="mt-1 text-sm text-slate-500"><span lang="ja">{status.japaneseName}</span> · <JapaneseReading kana={status.japaneseKana} romaji={status.romaji} /></p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{status.summary}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800">View status and related guidance →</span>
                </Link>
                <span className="absolute right-4 top-4 z-10"><SaveContentButton kind="residence-status" contentId={status.id} deferRemoval /></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {savedTerms.length > 0 && (
        <section id="saved-glossary-review" aria-labelledby="saved-terms-heading" className="scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="saved-terms-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Saved glossary terms</h2>
            <button type="button" aria-expanded={studyOpen} aria-controls="saved-glossary-review-panel" onClick={() => setStudyOpen((open) => !open)} className="inline-flex min-h-11 items-center rounded-full border border-teal-700 bg-white px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              {studyOpen ? "Hide review" : "Review saved terms"}
            </button>
          </div>
          {studyOpen && <div id="saved-glossary-review-panel"><GlossaryStudyPanel terms={savedTerms} /></div>}
          <ul className="mt-5 space-y-3">
            {savedTerms.map((term) => (
              <li key={term.id} className="relative">
                <Link href={{ pathname: `/glossary/${term.slug}`, query: { returnTo: "/saved" } }} aria-label={`${term.japanese} — ${term.englishName}`} className="group block rounded-2xl border border-slate-200 bg-white p-5 pr-20 shadow-sm transition-colors hover:border-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                  <span className="text-lg font-semibold text-slate-950 group-hover:text-teal-700"><span lang="ja">{term.japanese}</span> — {term.englishName}</span>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{term.shortDefinition}</p>
                  <span className="mt-4 block text-sm font-semibold text-teal-800">View term and context →</span>
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
