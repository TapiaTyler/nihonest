"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { InlineGlossaryTerm } from "@/components/glossary/inline-glossary-term";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import { residenceStatusCategoryLabels, type ResidenceStatus } from "@/domain/residence-status/residence-status";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";
import { useInterfaceMessages } from "./interface-text";
import { useSearchParams } from "next/navigation";
import { singleQueryValue, statusReturnDestination } from "@/lib/navigation/query-values";

/**
 * Page chrome for residence-status detail pages. The server page passes only the Japanese titles it needs
 * (keyed by stable ID); each label falls back to canonical English when no current translation exists.
 */
export type LocalizedTitles = Readonly<Record<string, string>>;

export function LocalizedStatusBackLink({ href, className }: Readonly<{ href: string; className: string }>) {
  const { message } = useInterfaceMessages();
  return <Link href={href} className={className}>← {message(href === "/saved" ? "status.backToSaved" : "status.backToStatuses")}</Link>;
}

/** Reads `returnTo` on the prebuilt status page; render inside Suspense with the default link as the fallback. */
export function QueryStatusBackLink({ className }: Readonly<{ className: string }>) {
  const query = useSearchParams();
  return <LocalizedStatusBackLink href={statusReturnDestination(singleQueryValue(query, "returnTo"))} className={className} />;
}

const statusMessages: Record<ResidenceStatus["status"], InterfaceMessageId> = {
  draft: "article.statusDraft",
  "needs-review": "article.statusEditorial",
  verified: "article.statusReviewed",
  archived: "article.statusArchived",
};

const statusBadgeColors: Record<ResidenceStatus["status"], string> = {
  draft: "bg-amber-50 text-amber-800",
  "needs-review": "bg-amber-50 text-amber-800",
  verified: "bg-brand-soft text-brand-link",
  archived: "bg-slate-100 text-slate-700",
};

export function LocalizedStatusBadge({ status }: Readonly<{ status: ResidenceStatus["status"] }>) {
  const { message } = useInterfaceMessages();
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeColors[status]}`}>
      {message(statusMessages[status])}
    </span>
  );
}

export function LocalizedStatusBadges({ category, status }: Readonly<{
  category: ResidenceStatus["category"];
  status: ResidenceStatus["status"];
}>) {
  const { locale } = useInterfaceMessages();
  return (
    <>
      <LocalizedStatusBadge status={status} />
      <span className="text-sm text-slate-500">
        {locale === "ja" ? japaneseTaxonomyLabels.residenceStatusCategory[category] : residenceStatusCategoryLabels[category]}
      </span>
    </>
  );
}

/** English puts the English name first; Japanese promotes the official Japanese name and keeps the English name beneath. */
export function LocalizedStatusHeading({ status, glossaryTerm, reading }: Readonly<{
  status: ResidenceStatus;
  glossaryTerm: JapaneseTerm;
  reading: ReactNode;
}>) {
  const { locale } = useInterfaceMessages();
  const japaneseName = (
    <InlineGlossaryTerm term={glossaryTerm}>
      <span lang="ja">{status.japaneseName}</span>
    </InlineGlossaryTerm>
  );
  const headingClass = "mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl";
  return locale === "ja" ? (
    <>
      <h1 className={headingClass}>{japaneseName}</h1>
      <p lang="en" className="mt-3 text-2xl text-slate-600">{status.englishName}</p>
      <p className="mt-2 text-sm text-slate-500">{reading}</p>
    </>
  ) : (
    <>
      <h1 className={headingClass}>{status.englishName}</h1>
      <p className="mt-3 text-2xl text-slate-600">{japaneseName}</p>
      <p className="mt-2 text-sm text-slate-500">{reading}</p>
    </>
  );
}

type ContextItem = Readonly<{ id: string; href: string; title: string }>;

export function LocalizedStatusContext({ groups, journeys, groupTitles, journeyTitles }: Readonly<{
  groups: readonly ContextItem[];
  journeys: readonly ContextItem[];
  groupTitles: LocalizedTitles;
  journeyTitles: LocalizedTitles;
}>) {
  const { locale, message } = useInterfaceMessages();
  const title = (item: ContextItem, titles: LocalizedTitles) => (locale === "ja" ? titles[item.id] : undefined) ?? item.title;
  return (
    <section lang={locale} className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="explore-paths-heading">
      <h2 id="explore-paths-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("status.contextHeading")}</h2>
      <p className="mt-3 leading-7 text-slate-600">{message("status.contextIntro")}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {groups.map((group) => <ContextLink key={`group-${group.id}`} href={group.href} eyebrow={message("content.contentGroup")} title={title(group, groupTitles)} />)}
        {journeys.map((journey) => <ContextLink key={`journey-${journey.id}`} href={journey.href} eyebrow={message("journey.guidedJourney")} title={title(journey, journeyTitles)} />)}
      </div>
    </section>
  );
}

export function LocalizedRelatedGuidance({ articles, articleTitles }: Readonly<{ articles: readonly ContextItem[]; articleTitles: LocalizedTitles }>) {
  const { locale, message } = useInterfaceMessages();
  return (
    <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-guidance-heading">
      <h2 id="related-guidance-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("status.relatedGuidance")}</h2>
      <ul className="mt-4 space-y-3">
        {articles.map((article) => {
          const translated = locale === "ja" ? articleTitles[article.id] : undefined;
          return (
            <li key={article.id} lang={translated ? "ja" : "en"}>
              <Link href={article.href} className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                {translated ?? article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function LocalizedLastReviewed({ date }: Readonly<{ date: string }>) {
  const { locale, message } = useInterfaceMessages();
  const formatted = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
  return <p className="mt-10 text-sm text-slate-500">{message("status.lastReviewed")}{" "}<time dateTime={date}>{formatted}</time></p>;
}

function ContextLink({ href, eyebrow, title }: Readonly<{ href: string; eyebrow: string; title: string }>) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{eyebrow}</span>
      <span className="mt-2 block font-semibold text-slate-950 group-hover:text-brand-accent">{title}</span>
    </Link>
  );
}
