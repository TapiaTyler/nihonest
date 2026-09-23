import type { OfficialSource } from "@/domain/source/source";
import { InterfaceText } from "@/components/localization/interface-text";
import { OfficialSourceMetadata } from "./official-source-metadata";
import { OfficialSourceItems } from "./official-source-items";

type OfficialSourceListProps = Readonly<{
  sources: readonly OfficialSource[];
}>;

export function OfficialSourceList({ sources }: OfficialSourceListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
        <InterfaceText id="sources.heading" />
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600"><InterfaceText id="sources.description" /></p>
      <OfficialSourceItems>
        {sources.map((source) => (
          <li key={source.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              <span lang={source.language}>{source.title} — {source.organization}</span>
              <span className="sr-only"><InterfaceText id="sources.openNewTab" /></span>
            </a>
            <OfficialSourceMetadata source={{
              authorityLevel: source.authorityLevel,
              language: source.language,
              lastCheckedAt: source.lastCheckedAt,
              lastReviewedAt: source.lastReviewedAt,
            }} />
          </li>
        ))}
      </OfficialSourceItems>
    </section>
  );
}
