"use client";

import { useEffect, useRef, useState } from "react";
import type { ArticleOutlineEntry } from "@/domain/article/article-outline";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

const minimumEntries = 4;
/** Where the rail appears; keep in step with the `xl:` classes below. */
const railBreakpoint = "(min-width: 80rem)";
/** A heading counts as "current" once it has scrolled within this distance of the top of the viewport. */
const currentHeadingOffset = 140;

/**
 * The "On this page" outline for long guides. It follows the language the body is shown in, so the English and
 * translated outlines never mix; either may be empty, which hides it. It has three presentations that never show
 * together: a collapsed row under the title, a sticky rail beside the reading column on wide screens (placed
 * against the nearest positioned ancestor, so the page gives the column `relative`), and on narrower screens a
 * floating button that opens the same list as a bottom sheet once the row has scrolled out of view.
 */
export function ArticleOutline({ english, japanese }: Readonly<{
  english: readonly ArticleOutlineEntry[];
  japanese?: readonly ArticleOutlineEntry[];
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const showJapanese = locale === "ja" && japanese !== undefined;
  const entries = showJapanese ? japanese : english;
  const enough = entries.length >= minimumEntries;
  const inlineRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [rowScrolledPast, setRowScrolledPast] = useState(false);
  const activeId = useCurrentHeading(enough ? entries : []);

  useEffect(() => {
    const row = inlineRef.current;
    if (!row || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setRowScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, [enough]);

  useEffect(() => {
    const wide = window.matchMedia?.(railBreakpoint);
    if (!wide) return;
    const closeWhenRailTakesOver = () => { if (wide.matches) sheetRef.current?.close(); };
    wide.addEventListener("change", closeWhenRailTakesOver);
    return () => wide.removeEventListener("change", closeWhenRailTakesOver);
  }, []);

  if (!enough) return null;
  const groups = groupBySection(entries);
  const label = message("article.onThisPage");
  const lang = showJapanese ? "ja" : "en";
  const uiLang = locale === "ja" ? "ja" : "en";

  return (
    <>
      <nav ref={inlineRef} aria-label={label} lang={lang} className="mt-2 xl:hidden">
        <details className="group border-b border-line">
          <summary className="flex min-h-12 cursor-pointer list-none select-none items-center gap-2 font-semibold text-brand-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
            <span lang={uiLang}>{label}</span>
            <DisclosureChevron />
          </summary>
          <OutlineList groups={groups} activeId={activeId} className="pb-4 pt-1 sm:columns-2 sm:gap-x-10" />
        </details>
      </nav>

      <nav aria-label={label} lang={lang} className="absolute bottom-0 left-full top-0 ml-8 hidden w-48 xl:block">
        <div className="sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-4">
          <p lang={uiLang} className="text-sm font-semibold text-ink">{label}</p>
          <OutlineList groups={groups} activeId={activeId} dense className="mt-2" />
        </div>
      </nav>

      {rowScrolledPast && (
        <button
          type="button"
          aria-haspopup="dialog"
          lang={uiLang}
          onClick={() => sheetRef.current?.showModal()}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 min-h-12 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand shadow-[0_8px_24px_-8px_rgba(15,23,42,0.45)] hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus xl:hidden"
        >
          {label}
        </button>
      )}

      <dialog
        ref={sheetRef}
        aria-labelledby="article-outline-sheet-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[75dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border-0 bg-surface p-0 text-ink-strong backdrop:bg-scrim/40 xl:hidden"
      >
        <div className="sticky top-0 flex min-h-14 items-center justify-between gap-4 border-b border-line bg-surface px-5">
          <h2 id="article-outline-sheet-title" lang={uiLang} className="text-lg font-semibold tracking-tight text-ink">{label}</h2>
          <button type="button" lang={uiLang} onClick={() => sheetRef.current?.close()} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            {message("article.closeOutline")}
          </button>
        </div>
        <nav aria-labelledby="article-outline-sheet-title" lang={lang} className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) sheetRef.current?.close(); }}>
          <OutlineList groups={groups} activeId={activeId} />
        </nav>
      </dialog>
    </>
  );
}

/** The id of the last heading that has reached the top of the viewport, so the outline can show where the reader is. */
function useCurrentHeading(entries: readonly ArticleOutlineEntry[]) {
  const [activeId, setActiveId] = useState<string>();
  useEffect(() => {
    if (entries.length === 0) return;
    let frame = 0;
    const update = () => {
      let current: string | undefined;
      for (const { id } of entries) {
        const heading = document.getElementById(id);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top <= currentHeadingOffset) current = id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);
  return activeId;
}

type OutlineGroup = Readonly<{ heading: ArticleOutlineEntry; children: readonly ArticleOutlineEntry[] }>;

/** Nests each sub-heading under the section heading before it; a sub-heading with no section stands alone. */
function groupBySection(entries: readonly ArticleOutlineEntry[]): OutlineGroup[] {
  const groups: { heading: ArticleOutlineEntry; children: ArticleOutlineEntry[] }[] = [];
  for (const entry of entries) {
    const current = groups.at(-1);
    if (entry.level === 3 && current) current.children.push(entry);
    else groups.push({ heading: entry, children: [] });
  }
  return groups;
}

function OutlineList({ groups, activeId, dense = false, className }: Readonly<{
  groups: readonly OutlineGroup[];
  activeId?: string;
  dense?: boolean;
  className?: string;
}>) {
  return (
    <ul className={className}>
      {groups.map(({ heading, children }, index) => (
        // A section and its sub-items stay in one column so the indented items never sit apart from their parent.
        <li key={`${heading.id}-${index}`} className="break-inside-avoid">
          <OutlineLink entry={heading} activeId={activeId} dense={dense} />
          {children.length > 0 && (
            <ul>
              {children.map((child, childIndex) => <li key={`${child.id}-${childIndex}`}><OutlineLink entry={child} activeId={activeId} dense={dense} /></li>)}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function OutlineLink({ entry: { level, id, text }, activeId, dense }: Readonly<{ entry: ArticleOutlineEntry; activeId?: string; dense: boolean }>) {
  const current = id === activeId;
  const size = dense ? "min-h-8 py-0.5 text-sm" : "min-h-11 sm:min-h-9";
  const tone = current ? "font-semibold text-brand-link" : level === 3 ? "text-ink-muted" : "font-medium text-ink-body";
  return (
    <a
      href={`#${id}`}
      aria-current={current ? "location" : undefined}
      className={`flex items-center rounded-sm leading-6 hover:text-brand-link hover:underline hover:decoration-brand-300 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${size} ${tone} ${level === 3 ? "pl-4" : ""} ${level === 3 && !dense ? "text-[0.9375rem]" : ""}`}
    >
      {text}
    </a>
  );
}
