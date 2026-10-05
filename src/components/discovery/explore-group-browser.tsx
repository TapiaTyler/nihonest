"use client";

import { ArticleGroupCard } from "@/components/discovery/article-group-card";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import type { ArticleGroupSearchTranslation } from "@/lib/search/knowledgebase-search";
import { ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import type { ViewMode } from "@/lib/storage/view-mode";

export function ExploreGroupBrowser({ groups, translations = [], locale = "en", viewMode = "cards", setViewMode }: Readonly<{
  groups: readonly ArticleGroup[];
  translations?: readonly ArticleGroupSearchTranslation[];
  locale?: ContentLocalePreference;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
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
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-3xl leading-7 text-slate-600">{message("explore.groupHelp")}</p>
        {setViewMode && <ViewModeToggle mode={viewMode} onChange={setViewMode} />}
      </div>
      <ViewModeItems
        mode={viewMode}
        gridClassName="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        listContainerClassName="mt-8"
        items={sortedGroups.map((group) => ({
          key: group.id,
          node: <ArticleGroupCard group={group} contentLanguage={translationsById.has(group.id) ? locale : "en"} variant={viewMode === "list" ? "row" : "card"} />,
        }))}
      />
    </section>
  );
}
