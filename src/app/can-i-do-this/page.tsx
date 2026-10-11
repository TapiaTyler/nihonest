import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCrossReferenceExplorer } from "@/components/activity-cross-reference/activity-cross-reference-explorer";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { sources } from "@/data/sources";
import { safeActivityReturnPath } from "@/lib/navigation/activity-cross-reference";
import { InterfaceText } from "@/components/localization/interface-text";
import { residenceStatuses } from "@/data/residence-statuses";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import { getActivityTranslations, getJapaneseArticleTranslation, getJourneyTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

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
  const returnLabel: InterfaceMessageId = returnTo.startsWith("/faq")
    ? "activityPage.backFaq"
    : returnTo.startsWith("/residence-statuses") ? "status.backToStatuses" : "activityPage.backExplore";
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
  // Linked guides, statuses, and journeys reuse their existing Japanese titles instead of a second translation.
  const journeyTitles = new Map(getJourneyTranslations().map(({ contentId, title }) => [contentId, title]));
  const linkTitles = Object.fromEntries(activityCrossReferences.flatMap((activity) => activity.rules.flatMap((rule) => rule.links.flatMap((link) => {
    const title = link.kind === "article" ? getJapaneseArticleTranslation(link.id)?.fields.title
      : link.kind === "residence-status" ? residenceStatuses.find(({ id }) => id === link.id)?.japaneseName
        : journeyTitles.get(link.id);
    return title ? [[`${link.kind}:${link.id}`, title]] : [];
  }))));
  const referencedSourceIds = new Set(activityCrossReferences.flatMap((activity) => activity.rules.flatMap((rule) => rule.assertion?.sourceIds ?? [])));

  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.canIDoThis")} />
      <Link href={returnTo} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-link hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">← <InterfaceText id={returnLabel} /></Link>
      <header className="mt-5 max-w-3xl">
        <p className="eyebrow"><InterfaceText id="activityPage.eyebrow" /></p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"><InterfaceText id="activityPage.heading" /></h1>
        <p className="mt-6 text-lg leading-8 text-slate-600"><InterfaceText id="activityPage.intro" /></p>
      </header>
      {/* The short note keeps the first screen for the tool; the full notice follows it, unchanged. */}
      <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
        <strong className="font-semibold text-slate-800"><InterfaceText id="activityPage.disclaimerStrong" /></strong> <InterfaceText id="activityPage.disclaimerShort" />
      </p>
      <ActivityCrossReferenceExplorer
        activities={activityCrossReferences}
        officialSources={sources.filter(({ id }) => referencedSourceIds.has(id))}
        initialActivityId={requestedActivity?.id}
        initialAnswers={initialAnswers}
        returnTo={returnTo}
        translations={getActivityTranslations()}
        linkTitles={linkTitles}
      />
      <aside className="mt-12 max-w-3xl border-t border-slate-200 pt-6 text-sm leading-6 text-slate-700">
        <strong className="font-semibold text-slate-900"><InterfaceText id="activityPage.disclaimerStrong" /></strong> <InterfaceText id="activityPage.disclaimer" />
      </aside>
    </div>
  );
}
