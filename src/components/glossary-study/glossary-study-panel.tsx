"use client";

import { useMemo, useState } from "react";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { GlossaryReviewOutcome } from "@/domain/glossary-study/glossary-study";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { useGlossaryStudy } from "./glossary-study-provider";

const reviewStates = ["new", "learning", "reviewed"] as const;
const reviewStateMessageIds = {
  new: "glossaryStudy.stateNew",
  learning: "glossaryStudy.stateLearning",
  reviewed: "glossaryStudy.stateReviewed",
} as const;
const promptModes = ["japanese", "kana", "english"] as const;
const promptModeMessageIds = {
  japanese: "glossaryStudy.promptJapanese",
  kana: "glossaryStudy.promptKana",
  english: "glossaryStudy.promptEnglish",
} as const;
type PromptMode = typeof promptModes[number];
const promptModeStorageKey = "nihonest:glossary-review-prompt-mode";

function preferredPromptMode(): PromptMode {
  if (typeof window === "undefined") return "japanese";
  try {
    const stored = window.localStorage.getItem(promptModeStorageKey);
    return stored && stored in promptModeMessageIds ? stored as PromptMode : "japanese";
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
  const { message } = useInterfaceMessages();
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
    setAnnouncement(outcome === "understood" ? message("glossaryStudy.announcementUnderstood") : message("glossaryStudy.announcementAgain"));
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
    <section className="mt-8" aria-labelledby="glossary-study-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{message("glossaryStudy.eyebrow")}</p>
          <h3 id="glossary-study-heading" className="mt-2 text-xl font-semibold tracking-tight text-ink">{message("glossaryStudy.heading")}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{message("glossaryStudy.description")}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-surface px-3 py-2 text-ink-body">{message("glossaryStudy.stateNew")} {counts.new}</span>
          <span className="rounded-full bg-surface px-3 py-2 text-caution-text">{message("glossaryStudy.stateLearning")} {counts.learning}</span>
          <span className="rounded-full bg-surface px-3 py-2 text-brand-link">{message("glossaryStudy.stateReviewed")} {counts.reviewed}</span>
        </div>
      </div>

      <fieldset className="mt-5 flex flex-wrap gap-x-6 gap-y-3 rounded-2xl border border-brand-line bg-surface px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-ink-strong">{message("glossaryStudy.readingAids")}</legend>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink-body">
          <input type="checkbox" checked={showKana} onChange={(event) => setShowKana(event.target.checked)} className="size-4 accent-brand-accent" />
          {message("glossaryStudy.showKana")}
        </label>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink-body">
          <input type="checkbox" checked={showRomaji} onChange={(event) => setShowRomaji(event.target.checked)} className="size-4 accent-brand-accent" />
          {message("glossaryStudy.showRomaji")}
        </label>
      </fieldset>

      <div className="mt-4 grid gap-4 rounded-2xl border border-brand-line bg-surface p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink-strong">
          {message("glossaryStudy.promptSide")}
          <select value={promptMode} onChange={(event) => changePromptMode(event.target.value as PromptMode)} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-field bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus">
            {promptModes.map((value) => <option key={value} value={value}>{message(promptModeMessageIds[value])}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink-strong">
          {message("glossaryStudy.jumpToTerm")}
          <select value={activeTerm.id} onChange={(event) => { setActiveTermId(event.target.value); setAnswerVisible(false); setAnnouncement(""); }} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-field bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus">
            {orderedTerms.map((term) => <option key={term.id} value={term.id}>{termPromptLabel(term, promptMode)}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-ink-subtle">
          <span>{message("glossaryStudy.termPosition").replace("{current}", String(currentIndex + 1)).replace("{total}", String(terms.length))}</span>
          <label className="flex items-center gap-2 font-semibold text-ink-body">
            {message("glossaryStudy.progressStatus")}
            <select
              value={activeState}
              disabled={!isReady}
              onChange={(event) => setReviewState(activeTerm.id, event.target.value as typeof reviewStates[number])}
              className="app-select min-h-11 rounded-xl border border-field bg-surface px-3 text-sm text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus disabled:cursor-wait disabled:opacity-50"
            >
              {reviewStates.map((value) => <option key={value} value={value}>{message(reviewStateMessageIds[value])}</option>)}
            </select>
          </label>
        </div>
        {promptMode === "english" ? (
          <p className="mt-6 text-center text-3xl font-semibold text-ink">{activeTerm.englishName}</p>
        ) : (
          <p lang="ja" className="mt-6 text-center text-4xl font-semibold text-ink">{promptMode === "kana" ? activeTerm.kana ?? activeTerm.japanese : activeTerm.japanese}</p>
        )}
        {promptMode !== "english" && (promptMode === "japanese" ? showKana || showRomaji : showRomaji) && (
          <p className="mt-3 text-center text-sm text-ink-subtle">
            {promptMode === "japanese" && showKana && activeTerm.kana && <span lang="ja">{activeTerm.kana}</span>}
            {promptMode === "japanese" && showKana && activeTerm.kana && showRomaji && activeTerm.romaji && " · "}
            {showRomaji && activeTerm.romaji}
          </p>
        )}

        {answerVisible ? (
          <div className="mt-6 rounded-xl bg-surface-subtle p-4">
            {promptMode !== "japanese" && <p lang="ja" className="text-2xl font-semibold text-ink">{activeTerm.japanese}</p>}
            {promptMode === "english" && (showKana || showRomaji) && (
              <p className="mt-2 text-sm text-ink-subtle">
                {showKana && activeTerm.kana && <span lang="ja">{activeTerm.kana}</span>}
                {showKana && activeTerm.kana && showRomaji && activeTerm.romaji && " · "}
                {showRomaji && activeTerm.romaji}
              </p>
            )}
            {promptMode !== "english" && <p className="mt-2 text-lg font-semibold text-ink">{activeTerm.englishName}</p>}
            <p className="mt-2 leading-7 text-ink-muted">{activeTerm.shortDefinition}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={!isReady} onClick={() => completeReview("again")} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line-strong bg-surface px-5 text-sm font-semibold text-ink-firm hover:border-caution-edge hover:bg-caution-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution-focus disabled:cursor-wait disabled:opacity-50">{message("glossaryStudy.reviewAgain")}</button>
              <button type="button" disabled={!isReady} onClick={() => completeReview("understood")} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-50">{message("glossaryStudy.understood")}</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAnswerVisible(true)} className="mx-auto mt-6 flex min-h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("glossaryStudy.showMeaning")}</button>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" onClick={() => move(-1)} disabled={orderedTerms.length < 2} className="min-h-11 rounded-full px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40">{message("glossaryStudy.previous")}</button>
          <button type="button" onClick={() => move(1)} disabled={orderedTerms.length < 2} className="min-h-11 rounded-full px-4 text-sm font-semibold text-brand-link hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40">{message("glossaryStudy.next")}</button>
        </div>
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </section>
  );
}
