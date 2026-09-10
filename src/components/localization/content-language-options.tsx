"use client";

import { contentLocaleOptions } from "@/domain/localization/content-locale";
import { useContentLocale } from "./content-locale-provider";

export function ContentLanguageOptions({ onSelect }: Readonly<{ onSelect?: () => void }>) {
  const { locale, setLocale } = useContentLocale();

  return (
    <div role="radiogroup" aria-label="Guide language" className="space-y-1">
      {contentLocaleOptions.map((option) => {
        const selected = option.id === locale;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              setLocale(option.id);
              onSelect?.();
            }}
            className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 ${selected ? "bg-teal-50 font-semibold text-teal-950" : "text-slate-700 hover:bg-slate-50"}`}
          >
            <span>{option.label}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-5 w-5 shrink-0 text-teal-700 ${selected ? "visible" : "invisible"}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 10 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        );
      })}
    </div>
  );
}
