import { localizeJourney } from "@/domain/localization/journey-presentation";
import type { ArticleJourneyData } from "@/lib/navigation/article-journey";
import { getArticleById, getGuidedJourneysByArticleIds, getJourneySteps } from "./article-metadata";
import { getJapaneseArticleTranslation, getJourneyTranslations } from "./translations";

/**
 * Everything the article page's journey context needs for any `?journey=&route=` value, so the page can be
 * prebuilt. Steps are resolved here with getJourneySteps, exactly as the request-time page did, and sent as
 * indexes into one shared article list.
 */
export function getArticleJourneyData(articleId: string): ArticleJourneyData {
  const articles: { slug: string; title: string; japaneseTitle?: string }[] = [];
  const indexes = new Map<string, number>();
  const indexOf = (id: string) => {
    const known = indexes.get(id);
    if (known !== undefined) return known;
    const metadata = getArticleById(id)?.metadata;
    if (!metadata) throw new Error(`Unknown journey article ${id}.`);
    const japaneseTitle = getJapaneseArticleTranslation(id)?.fields.title;
    indexes.set(id, articles.length);
    articles.push({ slug: metadata.slug, title: metadata.title, ...(typeof japaneseTitle === "string" ? { japaneseTitle } : {}) });
    return articles.length - 1;
  };
  const articleIndex = indexOf(articleId);
  const translations = getJourneyTranslations();

  const journeys = getGuidedJourneysByArticleIds([articleId]).map((journey) => {
    const presented = localizeJourney(journey, translations.find(({ contentId }) => contentId === journey.id));
    const japaneseLabels = new Map(presented.phases.flatMap(({ steps }) => steps.flatMap((step) => (
      step.type === "article" && step.conditionLabel ? [[step.articleId, step.conditionLabel] as const] : []
    ))));
    const contexts: Record<string, number[]> = {};
    const conditions: Record<number, { english: string; japanese?: string }> = {};
    for (const routeId of [undefined, ...journey.routes.map(({ id }) => id)]) {
      const steps = getJourneySteps(journey.id, routeId);
      if (!steps.some(({ article }) => article.metadata.id === articleId)) continue;
      contexts[routeId ?? ""] = steps.map(({ step, article }) => {
        const index = indexOf(article.metadata.id);
        if (step.requiredness === "conditional") {
          const japanese = japaneseLabels.get(article.metadata.id);
          conditions[index] = { english: step.conditionLabel ?? "", ...(japanese ? { japanese } : {}) };
        }
        return index;
      });
    }
    return {
      id: journey.id,
      title: journey.title,
      japaneseTitle: presented.title,
      routes: journey.routes.map(({ id, title }) => ({ id, title, japaneseTitle: presented.routes.find((route) => route.id === id)?.title ?? title })),
      contexts,
      conditions,
    };
  });
  return { articleIndex, articles, journeys };
}
