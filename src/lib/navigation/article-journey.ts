/**
 * Journey context for a prebuilt article page, precomputed on the server for every journey that includes the
 * article. Each context lists its steps as indexes into `articles`; a client boundary resolves
 * `?journey=&route=` against it as the page did per request, without receiving journey definitions.
 */
export type ArticleJourneyData = Readonly<{
  /** Index of this article in `articles`. */
  articleIndex: number;
  articles: readonly Readonly<{ slug: string; title: string; japaneseTitle?: string }>[];
  journeys: readonly Readonly<{
    id: string;
    title: string;
    /** Presented Japanese title (the English title when the journey has no translation). */
    japaneseTitle: string;
    /** Every route of the journey, so an unknown `route` value falls back to no route. */
    routes: readonly Readonly<{ id: string; title: string; japaneseTitle: string }>[];
    /** Step article indexes keyed by route ID, or "" for no route; only contexts that include this article. */
    contexts: Readonly<Record<string, readonly number[]>>;
    /** Condition labels of conditional steps, keyed by article index. */
    conditions: Readonly<Record<number, Readonly<{ english: string; japanese?: string }>>>;
  }>[];
}>;

export type ArticleJourneyContext = NonNullable<ReturnType<typeof resolveArticleJourneyContext>>;

/** The requested journey applies only when it includes this article; an unknown route falls back to no route. */
export function resolveArticleJourneyContext(data: ArticleJourneyData, journeyId: string | undefined, routeId: string | undefined) {
  const journey = data.journeys.find(({ id }) => id === journeyId);
  if (!journey) return undefined;
  const route = journey.routes.find(({ id }) => id === routeId);
  const steps = Object.hasOwn(journey.contexts, route?.id ?? "") ? journey.contexts[route?.id ?? ""] : undefined;
  const index = steps?.indexOf(data.articleIndex) ?? -1;
  return steps && index >= 0 ? { journey, route, steps, index } : undefined;
}
