import { japanesePilotArticleTranslations } from "@/data/translations/ja/pilot-article-translations";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";

export function getArticleTranslation(contentId: string, locale: ContentLocalePreference) {
  if (locale === "en") return undefined;
  return japanesePilotArticleTranslations.find((artifact) => (
    artifact.contentId === contentId && artifact.targetLocale === locale
  ));
}

export function getJapanesePilotArticleTranslation(contentId: string) {
  return getArticleTranslation(contentId, "ja");
}

export function getPilotArticleSearchTranslations(): readonly ArticleSearchTranslation[] {
  return japanesePilotArticleTranslations.map((artifact) => ({
    contentId: artifact.contentId,
    targetLocale: artifact.targetLocale,
    title: artifact.fields.title ?? "",
    description: artifact.fields.description ?? "",
  })).filter(({ title, description }) => Boolean(title && description));
}
