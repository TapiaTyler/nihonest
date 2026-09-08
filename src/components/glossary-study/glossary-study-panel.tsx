"use client";

import { useMemo, useState } from "react";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { GlossaryReviewOutcome } from "@/domain/glossary-study/glossary-study";
import { useGlossaryStudy } from "./glossary-study-provider";

const stateLabels = { new: "New", learning: "Learning", reviewed: "Reviewed" } as const;
const promptModeLabels = {
  japanese: "Japanese → English",
  kana: "Kana → Japanese and English",
  english: "English → Japanese",
} as const;
type PromptMode = keyof typeof promptModeLabels;
const promptModeStorageKey = "nihonest:glossary-review-prompt-mode";

function preferredPromptMode(): PromptMode {
  if (typeof window === "undefined") return "japanese";
  try {
    const stored = window.localStorage.getItem(promptModeStorageKey);
    return stored && stored in promptModeLabels ? stored as PromptMode : "japanese";
  } catch {
    return "japanese";
  }
}

function termPromptLabel(term: JapaneseTerm, mode: PromptMode): string {
  if (mode === "english") return `${term.englishName} — ${term.japanese}`;
  if (mode === "kana") return `${term.kana ?? term.japanese} — ${term.englishName}`;
  return `${term.japanese} — ${term.englishName}`;
}

export function GlossaryStudyPanel({ terms }: Readonly<{ terms: readonly JapaneseTerm[] }>) {
  const { isReady, records, recordReview, setReviewState } = useGlossaryStudy();
  const [activeTermId, setActiveTermId] = useState<string>();
  const [promptMode, setPromptMode] = useState<PromptMode>(preferredPromptMode);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showKana, setShowKana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const orderedTerms = useMemo(() => [...terms].sort((left, right) => (
    termPromptLabel(left, promptMode).localeCompare(termPromptLabel(right, promptMode), promptMode === "english" ? "en" : "ja")
  )), [promptMode, terms]);
  const requestedIndex = orderedTerms.findIndex(({ id }) => id === activeTermId);
  const currentIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const activeTerm = orderedTerms[currentIndex];
  const progressByTerm = useMemo(() => new Map(records.map((record) => [record.termId, record])), [records]);
  const counts = terms.reduce((result, term) => {
    const state = progressByTerm.get(term.id)?.state ?? "new";
    result[state] += 1;
    return result;
  }, { new: 0, learning: 0, reviewed: 0 });

  if (!activeTerm) return null;
  const activeState = progressByTerm.get(activeTerm.id)?.state ?? "new";

  function move(offset: number) {
    setActiveTermId(orderedTerms[(currentIndex + offset + orderedTerms.length) % orderedTerms.length].id);
    setAnswerVisible(false);
    setAnnouncement("");
  }

  function completeReview(outcome: GlossaryReviewOutcome) {
    recordReview(activeTerm.id, outcome);
    setAnnouncement(outcome === "understood" ? "Marked as reviewed." : "Kept in learning for another review.");
    setAnswerVisible(false);
    if (orderedTerms.length > 1) setActiveTermId(orderedTerms[(currentIndex + 1) % orderedTerms.length].id);
  }

  function changePromptMode(nextMode: PromptMode) {
    setPromptMode(nextMode);
    try {
      window.localStorage.setItem(promptModeStorageKey, nextMode);
    } catch {
      // The selected mode still works for this session when storage is unavailable.
    }
    setAnswerVisible(false);
    setAnnouncement("");
  }

  return (
    <section className="mt-5 rounded-3xl border border-teal-200 bg-teal-50/60 p-5 sm:p-7" aria-labelledby="glossary-study-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Optional review</p>
          <h3 id="glossary-study-heading" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Review your saved terms</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Use this lightweight check to remember administrative vocabulary. It does not schedule lessons or score proficiency.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white px-3 py-2 text-slate-700">New {counts.new}</span>
          <span className="rounded-full bg-white px-3 py-2 text-amber-800">Learning {counts.learning}</span>
          <span className="rounded-full bg-white px-3 py-2 text-teal-800">Reviewed {counts.reviewed}</span>
        </div>
      </div>

      <fieldset className="mt-5 flex flex-wrap gap-x-6 gap-y-3 rounded-2xl border border-teal-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-slate-900">Reading aids</legend>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={showKana} onChange={(event) => setShowKana(event.target.checked)} className="size-4 accent-teal-700" />
          Show kana
        </label>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={showRomaji} onChange={(event) => setShowRomaji(event.target.checked)} className="size-4 accent-teal-700" />
          Show romaji
        </label>
      </fieldset>

      <div className="mt-4 grid gap-4 rounded-2xl border border-teal-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Prompt side
          <select value={promptMode} onChange={(event) => changePromptMode(event.target.value as PromptMode)} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
            {Object.entries(promptModeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Jump to term
          <select value={activeTerm.id} onChange={(event) => { setActiveTermId(event.target.value); setAnswerVisible(false); setAnnouncement(""); }} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
            {orderedTerms.map((term) => <option key={term.id} value={term.id}>{termPromptLabel(term, promptMode)}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-teal-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <span>Term {currentIndex + 1} of {terms.length}</span>
          <label className="flex items-center gap-2 font-semibold text-slate-700">
            Progress status
            <select
              value={activeState}
              disabled={!isReady}
              onChange={(event) => setReviewState(activeTerm.id, event.target.value as keyof typeof stateLabels)}
              className="app-select min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700 disabled:cursor-wait disabled:opacity-50"
            >
              {Object.entries(stateLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        {promptMode === "english" ? (
          <p className="mt-6 text-center text-3xl font-semibold text-slate-950">{activeTerm.englishName}</p>
        ) : (
          <p lang="ja" className="mt-6 text-center text-4xl font-semibold text-slate-950">{promptMode === "kana" ? activeTerm.kana ?? activeTerm.japanese : activeTerm.japanese}</p>
        )}
        {promptMode !== "english" && (promptMode === "japanese" ? showKana || showRomaji : showRomaji) && (
          <p className="mt-3 text-center text-sm text-slate-500">
            {promptMode === "japanese" && showKana && activeTerm.kana && <span lang="ja">{activeTerm.kana}</span>}
            {promptMode === "japanese" && showKana && activeTerm.kana && showRomaji && activeTerm.romaji && " · "}
            {showRomaji && activeTerm.romaji}
          </p>
        )}

        {answerVisible ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            {promptMode !== "japanese" && <p lang="ja" className="text-2xl font-semibold text-slate-950">{activeTerm.japanese}</p>}
            {promptMode === "english" && (showKana || showRomaji) && (
              <p className="mt-2 text-sm text-slate-500">
                {showKana && activeTerm.kana && <span lang="ja">{activeTerm.kana}</span>}
                {showKana && activeTerm.kana && showRomaji && activeTerm.romaji && " · "}
                {showRomaji && activeTerm.romaji}
              </p>
            )}
            {promptMode !== "english" && <p className="mt-2 text-lg font-semibold text-slate-950">{activeTerm.englishName}</p>}
            <p className="mt-2 leading-7 text-slate-600">{activeTerm.shortDefinition}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={!isReady} onClick={() => completeReview("again")} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:border-amber-500 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-wait disabled:opacity-50">Review again</button>
              <button type="button" disabled={!isReady} onClick={() => completeReview("understood")} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-50">I understand this</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAnswerVisible(true)} className="mx-auto mt-6 flex min-h-11 items-center justify-center rounded-full bg-teal-800 px-6 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Show meaning</button>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={() => move(-1)} disabled={orderedTerms.length < 2} className="min-h-11 rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40">← Previous</button>
          <button type="button" onClick={() => move(1)} disabled={orderedTerms.length < 2} className="min-h-11 rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40">Next →</button>
        </div>
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </section>
  );
}
