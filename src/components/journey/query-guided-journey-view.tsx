"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import type { ArticleMetadata } from "@/domain/article/article";
import { getJourneyRouteById } from "@/domain/discovery/discovery";
import { resolveJourneyViewSteps } from "@/lib/navigation/journey-context";
import { singleQueryValue } from "@/lib/navigation/query-values";
import { GuidedJourneyView } from "./guided-journey-view";

type RouteIndependentProps = Omit<ComponentProps<typeof GuidedJourneyView>, "selectedRoute" | "requestedRouteId" | "steps" | "mode">;

/**
 * Catalog journey view for the prebuilt page: reads `route` from the URL and resolves its steps from the candidate
 * articles. Render inside Suspense with the route-less view as the fallback.
 */
export function QueryGuidedJourneyView({ articles, ...props }: RouteIndependentProps & Readonly<{ articles: readonly ArticleMetadata[] }>) {
  const requestedRouteId = singleQueryValue(useSearchParams(), "route");
  const selectedRoute = getJourneyRouteById(props.journey, requestedRouteId);
  return <GuidedJourneyView {...props} selectedRoute={selectedRoute} requestedRouteId={requestedRouteId} steps={resolveJourneyViewSteps(props.journey, selectedRoute?.id, articles)} />;
}
