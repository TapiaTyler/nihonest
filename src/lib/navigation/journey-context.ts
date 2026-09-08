export function journeyHref(journeyId: string, routeId?: string) {
  return routeId
    ? `/explore/journeys/${journeyId}?route=${encodeURIComponent(routeId)}`
    : `/explore/journeys/${journeyId}`;
}

export function articleJourneyHref(slug: string, journeyId: string, routeId?: string, returnTo?: string) {
  const query = new URLSearchParams({ journey: journeyId });
  if (routeId) query.set("route", routeId);
  if (returnTo) query.set("returnTo", returnTo);
  return `/articles/${slug}?${query.toString()}`;
}
