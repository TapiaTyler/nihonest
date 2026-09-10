"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type PlaybackState = "ready" | "speaking" | "stopped" | "finished" | "error";
type PresentedState = PlaybackState | "unavailable";

const stateLabels: Readonly<Record<PresentedState, string>> = {
  ready: "Play pronunciation",
  speaking: "Stop pronunciation",
  stopped: "Replay pronunciation",
  finished: "Replay pronunciation",
  error: "Try pronunciation again",
  unavailable: "Pronunciation unavailable",
};

function subscribeToSpeechSupport() {
  return () => undefined;
}

function browserSupportsSpeech() {
  return typeof window.speechSynthesis !== "undefined"
    && typeof SpeechSynthesisUtterance === "function";
}

export function PronunciationButton({
  japanese,
  kana,
  englishName,
}: Readonly<{
  japanese: string;
  kana?: string;
  englishName: string;
}>) {
  const speechSupported = useSyncExternalStore(subscribeToSpeechSupport, browserSupportsSpeech, () => false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("ready");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechText = kana ?? japanese;

  useEffect(() => {
    const synthesis = browserSupportsSpeech() ? window.speechSynthesis : undefined;
    return () => {
      if (utteranceRef.current) synthesis?.cancel();
    };
  }, []);

  function startSpeaking() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    utterance.voice = window.speechSynthesis.getVoices().find(({ lang }) => (
      lang.toLowerCase() === "ja-jp"
    )) ?? window.speechSynthesis.getVoices().find(({ lang }) => (
      lang.toLowerCase().startsWith("ja")
    )) ?? null;
    utterance.onstart = () => setPlaybackState("speaking");
    utterance.onend = () => setPlaybackState("finished");
    utterance.onerror = () => setPlaybackState("error");
    utteranceRef.current = utterance;
    setPlaybackState("speaking");
    window.speechSynthesis.speak(utterance);
  }

  function handlePlayback() {
    if (!speechSupported) return;
    if (playbackState === "speaking") {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setPlaybackState("stopped");
      return;
    }
    startSpeaking();
  }

  const presentedState: PresentedState = speechSupported ? playbackState : "unavailable";
  const label = stateLabels[presentedState];

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={!speechSupported}
        onClick={handlePlayback}
        aria-label={`${label} for ${englishName}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-300 bg-white px-4 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
      >
        {playbackState === "speaking" ? (
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><rect x="5" y="5" width="10" height="10" rx="1" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h3l4-3v10l-4-3H4zM14 7.25a4 4 0 0 1 0 5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
        <span>{label}</span>
      </button>
      <span className="text-sm text-slate-500" aria-live="polite">
        {playbackState === "speaking" ? "Playing Japanese pronunciation." : playbackState === "stopped" ? "Pronunciation stopped." : playbackState === "error" ? "Your browser could not play this pronunciation." : ""}
      </span>
    </div>
  );
}
