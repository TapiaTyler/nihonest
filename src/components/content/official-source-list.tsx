import type { OfficialSource } from "@/domain/source/source";

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
        Official sources
      </h2>
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {source.title} — {source.organization}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
