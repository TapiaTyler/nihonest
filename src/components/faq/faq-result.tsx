"use client";

import Link from "next/link";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { FaqEntry } from "@/lib/content/faqs";
import type { FaqSearchTranslation } from "@/lib/search/faq-search";
import { activityCrossReferenceHref } from "@/lib/navigation/activity-cross-reference";

export function FaqResult({ entry, translation, headingLevel = 3, returnTo }: Readonly<{
  entry: FaqEntry;
  translation?: FaqSearchTranslation;
  headingLevel?: 2 | 3;
  returnTo?: string;
}>) {
  const { locale, message } = useInterfaceMessages();
  const headingClassName = "mt-3 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl";
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

  return (
    <article id={`faq-${entry.faq.slug}`} lang={translation ? locale : "en"} className="scroll-mt-6 border-b border-slate-200 py-7 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{message("faq.label")}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">{statusLabel}</span>
      </div>
      {headingLevel === 2
        ? <h2 className={headingClassName}>{question}</h2>
        : <h3 className={headingClassName}>{question}</h3>}
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">{summary}</p>
      <div className="mt-5" aria-label={`${message("faq.relatedFor")} ${question}`}>
        <p className="text-sm font-semibold text-slate-900">{message("content.relatedGuidance")}</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-3">
          {entry.targets.map((target) => (
            <li key={`${target.kind}-${target.id}`}>
              <Link href={target.kind === "activity" ? activityCrossReferenceHref(target.id, returnTo) : target.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                <span><span className="font-normal text-slate-500">{targetKindLabels[target.kind]}:</span> {target.label} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
