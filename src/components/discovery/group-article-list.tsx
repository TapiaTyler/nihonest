"use client";

import { LocalizedArticleCard } from "@/components/localization/localized-article-card";
import { useViewMode, ViewModeToggle } from "@/components/navigation/view-mode-toggle";
import { ViewModeItems } from "@/components/navigation/view-mode-items";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";

/** A content group's guides as cards or a list; every group page shares one remembered choice. */
export function GroupArticleList({ articles, translations }: Readonly<{
  articles: readonly ArticleMetadata[];
  translations: readonly ArticleSearchTranslation[];
}>) {
  const [viewMode, setViewMode] = useViewMode("explore-group");
  return (
    <>
      <div className="flex justify-end">
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>
      <ViewModeItems
        mode={viewMode}
        gridClassName="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        listContainerClassName="mt-6"
        items={articles.map((article) => ({
          key: article.id,
          node: <LocalizedArticleCard article={article} translations={translations} variant={viewMode === "list" ? "row" : "card"} />,
        }))}
      />
    </>
  );
}
