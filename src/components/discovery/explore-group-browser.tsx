"use client";

import { ArticleGroupCard } from "@/components/discovery/article-group-card";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import type { ArticleGroupSearchTranslation } from "@/lib/search/knowledgebase-search";

export function ExploreGroupBrowser({ groups, translations = [], locale = "en" }: Readonly<{
  groups: readonly ArticleGroup[];
  translations?: readonly ArticleGroupSearchTranslation[];
  locale?: ContentLocalePreference;
}>) {
  const { message } = useInterfaceMessages();
  const translationsById = new Map(translations
    .filter(({ targetLocale }) => targetLocale === locale)
    .map((translation) => [translation.contentId, translation]));
  const presentedGroups = groups.map((group) => {
    const translation = translationsById.get(group.id);
    return translation ? { ...group, title: translation.title, description: translation.description } : group;
  });
  const sortedGroups = presentedGroups.sort((left, right) => left.title.localeCompare(right.title, locale, { sensitivity: "base" }));

  return (
    <section className="mt-14" aria-labelledby="content-groups-heading">
      <p className="eyebrow">{message("explore.browseByGroup")}</p>
      <h2 id="content-groups-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{message("explore.choosePlace")}</h2>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">{message("explore.groupHelp")}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedGroups.map((group) => <ArticleGroupCard key={group.id} group={group} contentLanguage={translationsById.has(group.id) ? locale : "en"} />)}
      </div>
    </section>
  );
}
