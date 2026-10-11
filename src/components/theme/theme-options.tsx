"use client";

import { themePreferenceOptions, type ThemePreference } from "@/domain/theme/theme";
import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { useThemePreference } from "./use-theme-preference";

export const themeLabelIds: Record<ThemePreference, InterfaceMessageId> = {
  system: "theme.system",
  light: "theme.light",
  dark: "theme.dark",
};

/** The three choices as a radio group, in the same style as the language options. */
export function ThemeOptions({ onSelect }: Readonly<{ onSelect?: () => void }>) {
  const { preference, setPreference } = useThemePreference();
  const { message } = useInterfaceMessages();

  return (
    <div role="radiogroup" aria-label={message("theme.label")} className="space-y-1">
      {themePreferenceOptions.map((option) => {
        const selected = option === preference;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              setPreference(option);
              onSelect?.();
            }}
            className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus ${selected ? "bg-brand-soft font-semibold text-brand-deep" : "text-ink-body hover:bg-surface-subtle"}`}
          >
            <span>{message(themeLabelIds[option])}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-5 w-5 shrink-0 text-brand-accent ${selected ? "visible" : "invisible"}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 10 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        );
      })}
      <p className="px-3 pt-1 text-xs text-ink-subtle">{message("theme.systemHint")}</p>
    </div>
  );
}
