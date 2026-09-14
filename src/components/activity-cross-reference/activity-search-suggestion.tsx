import Link from "next/link";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { activityCrossReferenceHref } from "@/lib/navigation/activity-cross-reference";
import { searchActivityCrossReferences } from "@/lib/search/activity-cross-reference-search";

export function ActivitySearchSuggestion({ query, returnTo }: Readonly<{ query: string; returnTo: string }>) {
  const matches = searchActivityCrossReferences(activityCrossReferences, query);
  if (matches.length === 0) return null;

  return (
    <aside className="mt-7 rounded-2xl border border-teal-200 bg-teal-50 p-5" aria-labelledby="activity-suggestion-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">Related activity check</p>
      <h3 id="activity-suggestion-heading" className="mt-2 text-lg font-semibold text-teal-950">Start with what you want to do</h3>
      <p className="mt-2 text-sm leading-6 text-teal-900">These educational checks separate immigration, employment, licensing, tax, and other questions without deciding eligibility.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {matches.map((activity) => (
          <Link key={activity.id} href={activityCrossReferenceHref(activity.id, returnTo)} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-teal-800 shadow-sm hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            <span><span className="font-normal text-teal-700">Activity check:</span> {activity.shortLabel} →</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
