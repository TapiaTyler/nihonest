"use client";

import type { ComponentProps } from "react";
import { ArticleCard } from "@/components/content/article-card";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";
import { useInterfaceMessages } from "./interface-text";

/**
 * ArticleCard that shows the current Japanese title and description when Japanese is selected; slugs, links,
 * and metadata stay canonical, and a guide without a translation keeps its English card.
 */
export function LocalizedArticleCard({ translations = [], ...props }: ComponentProps<typeof ArticleCard> & Readonly<{
  translations?: readonly ArticleSearchTranslation[];
}>) {
  const { locale } = useInterfaceMessages();
  const translation = locale === "ja"
    ? translations.find(({ contentId, targetLocale }) => contentId === props.article.id && targetLocale === "ja")
    : undefined;
  if (!translation) return <ArticleCard {...props} />;
  return (
    <ArticleCard
      {...props}
      article={{ ...props.article, title: translation.title, description: translation.description }}
      contentLanguage="ja"
    />
  );
}
