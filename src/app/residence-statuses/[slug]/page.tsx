import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OfficialSourceList } from "@/components/content/official-source-list";
import { getArticleById, getArticleGroupsByArticleIds, getGuidedJourneysByArticleIds } from "@/lib/content/article-metadata";
import { journeyHref } from "@/lib/navigation/journey-context";
import { getResidenceStatusBySlug, residenceStatuses } from "@/data/residence-statuses";
import { getSourceById } from "@/data/sources";
import { getGlossaryTermById } from "@/lib/content/glossary";
import { SaveContentButton } from "@/components/saved-content/save-content-button";
import { JapaneseReading } from "@/components/localization/japanese-reading";
import { StructuredStatusGuidance } from "@/components/residence-status/structured-status-guidance";
import { LocalizedResidenceStatusActivities, LocalizedResidenceStatusPurpose, LocalizedResidenceStatusSummary } from "@/components/localization/localized-residence-status-fields";
import {
  LocalizedLastReviewed,
  LocalizedRelatedGuidance,
  LocalizedStatusBackLink,
  QueryStatusBackLink,
  LocalizedStatusBadges,
  LocalizedStatusContext,
  LocalizedStatusHeading,
} from "@/components/localization/localized-residence-status-chrome";
import {
  getArticleGroupSearchTranslations,
  getJapaneseArticleTranslation,
  getJourneyTranslations,
  getResidenceStatusGuidanceTranslation,
  getResidenceStatusTranslations,
} from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { formatInterfaceMessage } from "@/domain/localization/interface-messages";

export const dynamicParams = false;

export function generateStaticParams() {
  return residenceStatuses.map((status) => ({ slug: status.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/residence-statuses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const residenceStatus = getResidenceStatusBySlug(slug);

  if (!residenceStatus) {
    return {};
  }

  return {
    title: `${residenceStatus.englishName} | Nihonest`,
    description: residenceStatus.summary,
  };
}

const backLinkClass = "inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700";

export default async function ResidenceStatusPage({
  params,
}: PageProps<"/residence-statuses/[slug]">) {
  const { slug } = await params;
  const residenceStatus = getResidenceStatusBySlug(slug);

  if (!residenceStatus) {
    notFound();
  }

  const statusSources = residenceStatus.sourceIds.flatMap((sourceId) => {
    const source = getSourceById(sourceId);
    return source ? [source] : [];
  });
  const relatedArticles = residenceStatus.relatedArticleIds.flatMap((articleId) => {
    const article = getArticleById(articleId);
    return article ? [article.metadata] : [];
  });
  const relatedGroups = getArticleGroupsByArticleIds(residenceStatus.relatedArticleIds);
  const relatedJourneys = getGuidedJourneysByArticleIds(residenceStatus.relatedArticleIds);
  const glossaryTerm = getGlossaryTermById(residenceStatus.glossaryTermId);
  if (!glossaryTerm) notFound();
  const translation = getResidenceStatusTranslations().find(({ contentId }) => contentId === residenceStatus.id);
  // Only the Japanese titles this page links to are sent to the client chrome.
  const groupTitles = Object.fromEntries(getArticleGroupSearchTranslations()
    .filter(({ contentId }) => relatedGroups.some(({ id }) => id === contentId))
    .map(({ contentId, title }) => [contentId, title]));
  const journeyTitles = Object.fromEntries(getJourneyTranslations()
    .filter(({ contentId }) => relatedJourneys.some(({ id }) => id === contentId))
    .map(({ contentId, title }) => [contentId, title]));
  const articleTitles = Object.fromEntries(relatedArticles.flatMap(({ id }) => {
    const title = getJapaneseArticleTranslation(id)?.fields.title;
    return title ? [[id, title]] : [];
  }));

  return (
    <article className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={formatInterfaceMessage("ja", "pageTitle.withSite", { title: residenceStatus.japaneseName })} />
      <div className="mx-auto max-w-3xl">
        {/* The prebuilt page shows the default destination; a validated returnTo replaces it after hydration. */}
        <Suspense fallback={<LocalizedStatusBackLink href="/residence-statuses" className={backLinkClass} />}>
          <QueryStatusBackLink className={backLinkClass} />
        </Suspense>

        <header className="relative mt-8 border-b border-slate-200 pb-8">
          <div className="absolute right-0 top-0"><SaveContentButton kind="residence-status" contentId={residenceStatus.id} /></div>
          <div className="flex flex-wrap items-center gap-3 pr-14">
            <LocalizedStatusBadges category={residenceStatus.category} status={residenceStatus.status} />
          </div>
          <LocalizedStatusHeading
            status={residenceStatus}
            glossaryTerm={glossaryTerm}
            reading={<JapaneseReading kana={residenceStatus.japaneseKana} romaji={residenceStatus.romaji} />}
          />
          <LocalizedResidenceStatusSummary status={residenceStatus} translation={translation} />
        </header>

        <LocalizedResidenceStatusPurpose status={residenceStatus} translation={translation} />

        {residenceStatus.structuredGuidance && (
          <StructuredStatusGuidance guidance={residenceStatus.structuredGuidance} translation={getResidenceStatusGuidanceTranslation(residenceStatus.id)} />
        )}

        <LocalizedResidenceStatusActivities status={residenceStatus} translation={translation} />

        {(relatedGroups.length > 0 || relatedJourneys.length > 0) && (
          <LocalizedStatusContext
            groups={relatedGroups.map((group) => ({ id: group.id, href: `/explore/${group.id}`, title: group.title }))}
            journeys={relatedJourneys.map((journey) => ({
              id: journey.id,
              href: journeyHref(journey.id, journey.routes.find(({ articleId }) => residenceStatus.relatedArticleIds.includes(articleId))?.id),
              title: journey.title,
            }))}
            groupTitles={groupTitles}
            journeyTitles={journeyTitles}
          />
        )}

        {relatedArticles.length > 0 && (
          <LocalizedRelatedGuidance
            articles={relatedArticles.map((article) => ({ id: article.id, href: `/articles/${article.slug}`, title: article.title }))}
            articleTitles={articleTitles}
          />
        )}

        {residenceStatus.status === "verified" && <LocalizedLastReviewed date={residenceStatus.lastReviewedAt} />}
        <OfficialSourceList sources={statusSources} />
      </div>
    </article>
  );
}
