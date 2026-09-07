import Link from "next/link";
import { faqStatusLabels } from "@/domain/faq/faq";
import type { FaqEntry } from "@/lib/content/faqs";

const targetKindLabels: Record<FaqEntry["targets"][number]["kind"], string> = {
  guide: "Guide",
  group: "Content group",
  journey: "Guided journey",
  glossary: "Glossary term",
  "residence-status": "Residence status",
};

export function FaqResult({ entry, headingLevel = 3 }: Readonly<{ entry: FaqEntry; headingLevel?: 2 | 3 }>) {
  const headingClassName = "mt-3 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl";

  return (
    <article id={`faq-${entry.faq.slug}`} className="scroll-mt-6 border-b border-slate-200 py-7 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Frequently asked question</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">{faqStatusLabels[entry.faq.status]}</span>
      </div>
      {headingLevel === 2
        ? <h2 className={headingClassName}>{entry.faq.question}</h2>
        : <h3 className={headingClassName}>{entry.faq.question}</h3>}
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">{entry.faq.summary}</p>
      <div className="mt-5" aria-label={`Related guidance for: ${entry.faq.question}`}>
        <p className="text-sm font-semibold text-slate-900">Related guidance</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-3">
          {entry.targets.map((target) => (
            <li key={`${target.kind}-${target.id}`}>
              <Link href={target.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                <span><span className="font-normal text-slate-500">{targetKindLabels[target.kind]}:</span> {target.label} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
