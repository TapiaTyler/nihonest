"use client";

import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { ArticleGroupSearchTranslation } from "@/lib/search/knowledgebase-search";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

export function LocalizedArticleGroupHeading({
  group,
  guideCount,
  translations = [],
}: Readonly<{
  group: ArticleGroup;
  guideCount: number;
  translations?: readonly ArticleGroupSearchTranslation[];
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const translation = translations.find(({ contentId, targetLocale }) => (
    contentId === group.id && targetLocale === locale
  ));
  const title = translation?.title ?? group.title;
  const description = translation?.description ?? group.description;

  return (
    <header className="mt-8 max-w-3xl" lang={translation ? locale : "en"}>
      <p className="eyebrow">{message("content.contentGroup")}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-6 text-lg leading-8 text-ink-muted">{description}</p>
      <p className="mt-4 text-sm font-medium text-ink-subtle">
        {guideCount} {message(guideCount === 1 ? "content.guide" : "content.guides")}
      </p>
    </header>
  );
}
