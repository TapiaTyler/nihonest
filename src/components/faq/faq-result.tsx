"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { listRowClassName, listRowDetailsClassName, listRowFocusClassName } from "@/components/navigation/view-mode-items";
import type { FaqEntry } from "@/lib/content/faqs";
import type { FaqSearchTranslation } from "@/lib/search/faq-search";
import { activityCrossReferenceHref } from "@/lib/navigation/activity-cross-reference";

/**
 * One FAQ, collapsed to its question. Opening it (native details, so it works by keyboard and before hydration)
 * reveals the answer and related guidance. A link to `#faq-<slug>` opens that question.
 */
export function FaqResult({ entry, translation, headingLevel = 3, returnTo, variant = "card" }: Readonly<{
  entry: FaqEntry;
  translation?: FaqSearchTranslation;
  headingLevel?: 2 | 3;
  returnTo?: string;
  /** "row" is the compact list presentation. */
  variant?: "card" | "row";
}>) {
  const { locale, message } = useInterfaceMessages();
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const anchor = `faq-${entry.faq.slug}`;
  useEffect(() => {
    // Opening the element (not state) fires toggle, which keeps `open` in step.
    if (window.location.hash === `#${anchor}` && detailsRef.current) detailsRef.current.open = true;
  }, [anchor]);

  const Heading = headingLevel === 2 ? "h2" : "h3";
  const question = translation?.question ?? entry.faq.question;
  const summary = translation?.summary ?? entry.faq.summary;
  const statusLabel = {
    draft: message("faq.statusDraft"),
    verified: message("faq.statusReviewed"),
    "needs-review": message("faq.statusEditorial"),
  }[entry.faq.status];
  const targetKindLabels: Record<FaqEntry["targets"][number]["kind"], string> = {
    guide: message("faq.targetGuide"),
    group: message("faq.targetGroup"),
    journey: message("faq.targetJourney"),
    glossary: message("faq.targetGlossary"),
    "residence-status": message("faq.targetStatus"),
    activity: message("faq.targetActivity"),
  };
  // Reviewed answers carry no pill; only answers still in progress are marked.
  const statusBadge = entry.faq.status === "verified" ? null : <span className="rounded-full bg-caution-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-caution-text">{statusLabel}</span>;
  const answer = (
    <>
      <p className="max-w-3xl leading-7 text-ink-muted">{summary}</p>
      <div className="mt-5" aria-label={`${message("faq.relatedFor")} ${question}`}>
        <p className="text-sm font-semibold text-ink-strong">{message("content.relatedGuidance")}</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-3">
          {entry.targets.map((target) => (
            <li key={`${target.kind}-${target.id}`}>
              <Link lang={locale} href={target.kind === "activity" ? activityCrossReferenceHref(target.id, returnTo) : target.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                <span><span lang={locale} className="font-normal text-ink-subtle">{targetKindLabels[target.kind]}:</span> <span lang={locale === "ja" && target.japaneseLabel ? "ja" : "en"}>{locale === "ja" ? target.japaneseLabel ?? target.label : target.label}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
  const onToggle = (event: SyntheticEvent<HTMLDetailsElement>) => setOpen(event.currentTarget.open);

  if (variant === "row") {
    return (
      <details ref={detailsRef} id={anchor} lang={translation ? locale : "en"} onToggle={onToggle} className="scroll-mt-6">
        <summary className={`${listRowClassName} ${listRowFocusClassName} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <Heading className="min-w-0 text-lg font-semibold tracking-tight text-ink group-hover/item:text-brand-accent">{question}</Heading>
          <div className={listRowDetailsClassName}>
            <span className="flex items-center gap-3">{statusBadge}<DisclosureChevron open={open} /></span>
          </div>
        </summary>
        <div className="px-5 pb-5">{answer}</div>
      </details>
    );
  }

  return (
    <details ref={detailsRef} id={anchor} lang={translation ? locale : "en"} onToggle={onToggle} className="scroll-mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <summary className="group/item flex cursor-pointer list-none items-start justify-between gap-4 p-5 transition-colors hover:bg-brand-soft/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{message("faq.label")}</span>
            {statusBadge}
          </div>
          <Heading className="mt-3 text-xl font-semibold tracking-tight text-ink group-hover/item:text-brand-accent">{question}</Heading>
        </div>
        <div className="mt-1"><DisclosureChevron open={open} /></div>
      </summary>
      <div className="border-t border-line-faint px-5 pb-5 pt-4">{answer}</div>
    </details>
  );
}
