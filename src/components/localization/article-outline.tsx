"use client";

import type { ArticleOutlineEntry } from "@/domain/article/article-outline";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

const minimumEntries = 4;

/**
 * A collapsed "On this page" list for long guides. It follows the language the body is shown in, so the English
 * outline and the translated outline never mix; either may be empty, which hides it.
 */
export function ArticleOutline({ english, japanese }: Readonly<{
  english: readonly ArticleOutlineEntry[];
  japanese?: readonly ArticleOutlineEntry[];
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const showJapanese = locale === "ja" && japanese !== undefined;
  const entries = showJapanese ? japanese : english;
  if (entries.length < minimumEntries) return null;

  return (
    <nav aria-label={message("article.onThisPage")} lang={showJapanese ? "ja" : "en"} className="mt-8">
      <details className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-1">
        <summary className="flex min-h-12 cursor-pointer list-none select-none items-center justify-between gap-4 font-semibold text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
          <span lang={locale === "ja" ? "ja" : "en"}>{message("article.onThisPage")}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5 shrink-0 text-teal-700 transition-transform group-open:rotate-180">
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <ul className="space-y-1 pb-3 pt-1">
          {entries.map(({ level, id, text }, index) => (
            <li key={`${id}-${index}`} className={level === 3 ? "pl-5" : undefined}>
              <a href={`#${id}`} className="inline-flex min-h-11 items-center rounded-sm leading-6 text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-teal-800 hover:decoration-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{text}</a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
