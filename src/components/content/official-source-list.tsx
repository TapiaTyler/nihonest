import type { OfficialSource } from "@/domain/source/source";
import { InterfaceText } from "@/components/localization/interface-text";
import { OfficialSourceMetadata } from "./official-source-metadata";
import { OfficialSourceItems } from "./official-source-items";
import { LocalizedSourceName } from "./localized-source-name";

type OfficialSourceListProps = Readonly<{
  sources: readonly OfficialSource[];
}>;

export function OfficialSourceList({ sources }: OfficialSourceListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-line pt-8" aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="text-2xl font-semibold tracking-tight text-ink">
        <InterfaceText id="sources.heading" />
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted"><InterfaceText id="sources.description" /></p>
      <OfficialSourceItems>
        {sources.map((source) => (
          <li key={source.id} className="rounded-xl border border-line bg-surface p-4">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {/* Japanese readers see the page's own Japanese title and the organization's Japanese name where recorded. */}
              <LocalizedSourceName source={source} />
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
