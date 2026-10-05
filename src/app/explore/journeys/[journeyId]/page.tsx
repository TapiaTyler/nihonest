import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GuidedJourneyView } from "@/components/journey/guided-journey-view";
import { QueryGuidedJourneyView } from "@/components/journey/query-guided-journey-view";
import { guidedJourneys } from "@/data/discovery";
import { getArticleById, getArticleGroupById, getGuidedJourneyById } from "@/lib/content/article-metadata";
import { journeyCandidateArticleIds, resolveJourneyViewSteps } from "@/lib/navigation/journey-context";
import { getArticleGroupSearchTranslations, getArticleSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { formatInterfaceMessage } from "@/domain/localization/interface-messages";

export const dynamicParams = false;

export function generateStaticParams() {
  return guidedJourneys.map(({ id }) => ({ journeyId: id }));
}

export async function generateMetadata({ params }: PageProps<"/explore/journeys/[journeyId]">): Promise<Metadata> {
  const { journeyId } = await params;
  const journey = getGuidedJourneyById(journeyId);
  return journey ? { title: `${journey.title} | Nihonest`, description: journey.description } : {};
}

export default async function GuidedJourneyPage({ params }: PageProps<"/explore/journeys/[journeyId]">) {
  const { journeyId } = await params;
  const journey = getGuidedJourneyById(journeyId);
  if (!journey) notFound();
  const group = getArticleGroupById(journey.groupId);
  if (!group) notFound();

  const translation = getJourneyTranslations().find(({ contentId }) => contentId === journey.id);
  const groupTranslation = getArticleGroupSearchTranslations().find(({ contentId }) => contentId === group.id);
  // The page is prebuilt without a route; the client boundary resolves `?route=` from these candidates.
  const articles = journeyCandidateArticleIds(journey).flatMap((id) => {
    const article = getArticleById(id);
    return article ? [article.metadata] : [];
  });
  const articleTranslations = getArticleSearchTranslations().filter(({ contentId }) => articles.some(({ id }) => id === contentId));
  const viewProps = { journey, group, translation, groupTranslation, articleTranslations };

  return (
    <div className="page-shell py-12 sm:py-20">
      <LocalizedDocumentTitle japanese={translation ? formatInterfaceMessage("ja", "pageTitle.withSite", { title: translation.title }) : undefined} />
      <Suspense fallback={<GuidedJourneyView {...viewProps} steps={resolveJourneyViewSteps(journey, undefined, articles)} />}>
        <QueryGuidedJourneyView {...viewProps} articles={articles} />
      </Suspense>
    </div>
  );
}
