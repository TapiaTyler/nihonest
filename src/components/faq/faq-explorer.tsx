"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { FaqResult } from "./faq-result";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { FAQ_BROWSE_GROUP_IDS, faqBrowseGroupLabels } from "@/domain/faq/faq";
import type { FaqEntry } from "@/lib/content/faqs";
import { searchFaqs } from "@/lib/search/faq-search";

export function FaqExplorer({ entries }: Readonly<{ entries: readonly FaqEntry[] }>) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const hasQuery = Boolean(query.trim());
  const results = useMemo(() => {
    const matches = searchFaqs(entries.map(({ faq }) => faq), query);
    return matches.flatMap((faq) => {
      const entry = entries.find((candidate) => candidate.faq.id === faq.id);
      return entry ? [entry] : [];
    });
  }, [entries, query]);
  const browseGroups = FAQ_BROWSE_GROUP_IDS.flatMap((groupId) => {
    const groupedEntries = results
      .filter(({ faq }) => faq.primaryBrowseGroupId === groupId)
      .sort((left, right) => left.faq.question.localeCompare(right.faq.question));
    return groupedEntries.length > 0 ? [{ groupId, entries: groupedEntries }] : [];
  });

  // URL-backed state makes cross-search handoffs, refresh, and browser Back reproduce the same question.
  useEffect(() => {
    function restoreFromUrl() {
      const restoredQuery = new URLSearchParams(window.location.search).get("q") ?? "";
      setQuery(restoredQuery);
    }
    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery);
    window.history.replaceState(null, "", params.size ? `/faq?${params}` : "/faq");
  }

  return (
    <div className="mt-10">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="faq-search-heading">
        <h2 id="faq-search-heading" className="text-xl font-semibold tracking-tight text-slate-950">Search questions</h2>
        <label htmlFor={searchId} className="mt-4 block text-sm font-semibold text-slate-900">What would you like to understand?</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id={searchId} type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Try bank needs address, part-time work, or developer visa" className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
          {query && <button type="button" onClick={() => updateQuery("")} className="min-h-12 rounded-xl px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Clear search</button>}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-results-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">FAQ knowledgebase</p>
            <h2 id="faq-results-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{query ? "Matching questions" : "Browse common questions"}</h2>
          </div>
          <p className="text-sm text-slate-500" aria-live="polite">{results.length} {results.length === 1 ? "question" : "questions"}</p>
        </div>
        {results.length > 0 && hasQuery ? (
          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {results.map((entry) => <FaqResult key={entry.faq.id} entry={entry} headingLevel={3} />)}
          </div>
        ) : results.length > 0 ? (
          <div className="mt-7 space-y-4">
            {browseGroups.map(({ groupId, entries: groupedEntries }) => (
              <details key={groupId} open className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 bg-white px-5 py-4 font-semibold text-slate-950 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                  <span>{faqBrowseGroupLabels[groupId]}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">{groupedEntries.length} {groupedEntries.length === 1 ? "question" : "questions"}</span>
                    <DisclosureChevron />
                  </span>
                </summary>
                <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-5">
                  {groupedEntries.map((entry) => (
                    <div key={entry.faq.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <FaqResult entry={entry} headingLevel={3} />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-950">No matching FAQ found</h3>
            <p className="mt-2 text-slate-600">Try fewer words, browse all questions, or search the complete guidance catalog with the same wording.</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Link href={{ pathname: "/explore", query: { q: query } }} className="inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                Search all guidance for this question →
              </Link>
              <button type="button" onClick={() => updateQuery("")} className="min-h-11 rounded-full px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Browse all questions</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
