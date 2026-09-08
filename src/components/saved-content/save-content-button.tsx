"use client";

import { useEffect, useRef, useState } from "react";
import type { SavedContentReference } from "@/domain/saved-content/saved-content";
import { useSavedContent } from "./saved-content-provider";

type SaveContentButtonProps = SavedContentReference & Readonly<{ deferRemoval?: boolean }>;

export function SaveContentButton({ kind, contentId, deferRemoval = false }: SaveContentButtonProps) {
  const { isReady, isSaved, setSaved } = useSavedContent();
  const reference = { kind, contentId } as const;
  const saved = isSaved(reference);
  const contentLabel = {
    article: "guide",
    "glossary-term": "term",
    "residence-status": "residence status",
  }[kind];
  const feedbackLabel = contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1);
  const [feedback, setFeedback] = useState<string>();
  const [removalPending, setRemovalPending] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const removalTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => {
    clearTimeout(feedbackTimer.current);
    clearTimeout(removalTimer.current);
  }, []);

  function showFeedback(message: string) {
    clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(undefined), 1600);
  }

  function toggleSaved() {
    if (saved && deferRemoval) {
      // Keep Saved-page cards mounted briefly so the nearby confirmation remains visible.
      setRemovalPending(true);
      showFeedback(`${feedbackLabel} removed from saved list`);
      removalTimer.current = setTimeout(() => setSaved(reference, false), 900);
      return;
    }

    const nextSaved = !saved;
    setSaved(reference, nextSaved);
    showFeedback(`${feedbackLabel} ${nextSaved ? "added to saved list" : "removed from saved list"}`);
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${contentLabel} from saved content` : `Save ${contentLabel}`}
        disabled={!isReady || removalPending}
        onClick={toggleSaved}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-pink-300 bg-white text-pink-600 shadow-sm transition-colors hover:border-pink-500 hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:cursor-wait disabled:opacity-50 aria-pressed:border-pink-600 aria-pressed:bg-pink-600 aria-pressed:text-white"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      </button>
      {feedback && (
        <span role="status" className="absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg">
          {feedback}
        </span>
      )}
    </span>
  );
}
