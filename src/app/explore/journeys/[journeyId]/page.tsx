import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidedJourneyView } from "@/components/journey/guided-journey-view";
import { guidedJourneys } from "@/data/discovery";
import { getJourneyRouteById } from "@/domain/discovery/discovery";
import { getArticleGroupById, getGuidedJourneyById, getJourneySteps } from "@/lib/content/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return guidedJourneys.map(({ id }) => ({ journeyId: id }));
}

export async function generateMetadata({ params }: PageProps<"/explore/journeys/[journeyId]">): Promise<Metadata> {
  const { journeyId } = await params;
  const journey = getGuidedJourneyById(journeyId);
  return journey ? { title: `${journey.title} | Nihonest`, description: journey.description } : {};
}

export default async function GuidedJourneyPage({ params, searchParams }: PageProps<"/explore/journeys/[journeyId]">) {
  const { journeyId } = await params;
  const query = await searchParams;
  const requestedRouteId = typeof query.route === "string" ? query.route : undefined;
  const journey = getGuidedJourneyById(journeyId);
  if (!journey) notFound();
  const group = getArticleGroupById(journey.groupId);
  if (!group) notFound();

  const selectedRoute = getJourneyRouteById(journey, requestedRouteId);
  const steps = getJourneySteps(journey.id, selectedRoute?.id).map(({ step, article }) => ({ step, article: article.metadata }));

  return (
    <div className="page-shell py-12 sm:py-20">
      <GuidedJourneyView journey={journey} group={group} selectedRoute={selectedRoute} requestedRouteId={requestedRouteId} steps={steps} />
    </div>
  );
}
