import type { OfficialSource } from "@/domain/source/source";

const authorityLabels: Record<OfficialSource["authorityLevel"], string> = {
  "national-government": "National government",
  "prefectural-government": "Prefectural government",
  "municipal-government": "Municipal government",
  "public-institution": "Public institution",
};

function checkedDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

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
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Use these links to verify the current official wording. “Last link check” records when Nihonest last confirmed that the source was reachable, not when every claim was substantively re-reviewed.</p>
      <ul className="mt-5 space-y-3">
        {sources.map((source) => (
          <li key={source.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {source.title} — {source.organization}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {authorityLabels[source.authorityLevel]} · {source.language === "en" ? "English" : "Japanese"}
              {source.lastCheckedAt ? ` · Last link check: ${checkedDate(source.lastCheckedAt)}` : ""}
              {source.lastReviewedAt ? ` · Last substantive review: ${checkedDate(source.lastReviewedAt)}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
