"use client";

import { readingAidOptions } from "@/domain/localization/reading-aid";
import { useReadingAid } from "./reading-aid-provider";

export function ReadingAidOptions() {
  const { readingAid, setReadingAid } = useReadingAid();
  return (
    <div role="radiogroup" aria-label="Japanese reading aids" className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1">
      {readingAidOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={readingAid === option.id}
          onClick={() => setReadingAid(option.id)}
          className={`min-h-10 rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus ${readingAid === option.id ? "bg-surface text-brand-deep-soft shadow-sm" : "text-ink-muted hover:bg-surface/70 hover:text-ink-strong"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
