"use client";

import Link from "next/link";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { activityCrossReferenceHref } from "@/lib/navigation/activity-cross-reference";
import { searchActivityCrossReferences } from "@/lib/search/activity-cross-reference-search";
import { useInterfaceMessages } from "@/components/localization/interface-text";

export function ActivitySearchSuggestion({ query, returnTo }: Readonly<{ query: string; returnTo: string }>) {
  const { message } = useInterfaceMessages();
  const matches = searchActivityCrossReferences(activityCrossReferences, query);
  if (matches.length === 0) return null;

  return (
    <aside className="mt-7 rounded-2xl border border-brand-line bg-brand-soft p-5" aria-labelledby="activity-suggestion-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent">{message("activity.relatedCheck")}</p>
      <h3 id="activity-suggestion-heading" className="mt-2 text-lg font-semibold text-brand-deep">{message("activity.startWithGoal")}</h3>
      <p className="mt-2 text-sm leading-6 text-brand-deep-soft">{message("activity.checkExplanation")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {matches.map((activity) => (
          <Link key={activity.id} href={activityCrossReferenceHref(activity.id, returnTo)} className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-semibold text-brand-link shadow-sm hover:bg-brand-softer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            <span><span className="font-normal text-brand-accent">{message("activity.checkPrefix")}</span> <span lang="en">{activity.shortLabel}</span></span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
