"use client";

import { readingAidOptions } from "@/domain/localization/reading-aid";
import { useReadingAid } from "./reading-aid-provider";

export function ReadingAidOptions() {
  const { readingAid, setReadingAid } = useReadingAid();
  return (
    <div role="radiogroup" aria-label="Japanese reading aids" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
      {readingAidOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={readingAid === option.id}
          onClick={() => setReadingAid(option.id)}
          className={`min-h-10 rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 ${readingAid === option.id ? "bg-white text-teal-900 shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-slate-900"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
