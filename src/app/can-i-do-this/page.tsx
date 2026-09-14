import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCrossReferenceExplorer } from "@/components/activity-cross-reference/activity-cross-reference-explorer";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { sources } from "@/data/sources";
import { safeActivityReturnPath } from "@/lib/navigation/activity-cross-reference";

export const metadata: Metadata = {
  title: "Can I Do This? | Nihonest",
  description: "Explore the separate rules and facts to check before working, studying, running a business, or making another change in Japan.",
};

export default async function CanIDoThisPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const returnTo = safeActivityReturnPath(typeof params.returnTo === "string" ? params.returnTo : undefined);
  const returnLabel = returnTo.startsWith("/faq")
    ? "Back to FAQ results"
    : returnTo.startsWith("/residence-statuses") ? "Back to Residence Statuses" : "Back to Explore";
  const requestedActivity = typeof params.activity === "string"
    ? activityCrossReferences.find(({ id }) => id === params.activity)
    : undefined;
  const initialAnswers = Object.fromEntries(
    (requestedActivity?.questions ?? []).flatMap((question) => {
      const value = params[question.id];
      return typeof value === "string" && question.choices.some(({ id }) => id === value)
        ? [[question.id, value]]
        : [];
    }),
  );
  const referencedSourceIds = new Set(activityCrossReferences.flatMap((activity) => activity.rules.flatMap((rule) => rule.assertion?.sourceIds ?? [])));

  return (
    <div className="page-shell py-16 sm:py-24">
      <Link href={returnTo} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">← {returnLabel}</Link>
      <header className="mt-5 max-w-3xl">
        <p className="eyebrow">Educational cross-reference</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Can I do this in Japan?</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">Start with your intended activity. Nihonest will separate the questions you need to investigate and point you toward focused guidance and responsible authorities.</p>
      </header>
      <aside className="mt-8 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>General information, not legal advice.</strong> This tool does not determine eligibility, permission, legality, or an application outcome. Rules depend on complete circumstances and can change; confirm important decisions with the responsible authority or a qualified professional.
      </aside>
      <ActivityCrossReferenceExplorer
        activities={activityCrossReferences}
        officialSources={sources.filter(({ id }) => referencedSourceIds.has(id))}
        initialActivityId={requestedActivity?.id}
        initialAnswers={initialAnswers}
        returnTo={returnTo}
      />
    </div>
  );
}
