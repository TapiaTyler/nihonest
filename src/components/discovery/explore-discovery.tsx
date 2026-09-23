"use client";

import { useMemo } from "react";
import { ExploreFilterPanel } from "@/components/discovery/explore-filter-panel";
import { ExploreGroupBrowser } from "@/components/discovery/explore-group-browser";
import { ExploreResults } from "@/components/discovery/explore-results";
import { useExploreSearchState } from "@/components/discovery/explore-search-state";
import { useContentLocale } from "@/components/localization/content-locale-provider";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ArticleGroup } from "@/domain/discovery/discovery";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import type { FaqEntry } from "@/lib/content/faqs";
import type { FaqSearchTranslation } from "@/lib/search/faq-search";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";
import { buildKnowledgebaseSearchIndex, searchKnowledgebaseIndex, type ArticleGroupSearchTranslation, type ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";

/** Coordinates the search index with independently owned state, controls, and result presentation. */
export function ExploreDiscovery({ groups, articles, terms, residenceStatuses, faqEntries = [], articleTranslations = [], groupTranslations = [], faqTranslations = [], glossaryTranslations = [] }: Readonly<{
  groups: readonly ArticleGroup[];
  articles: readonly ArticleMetadata[];
  terms: readonly JapaneseTerm[];
  residenceStatuses: readonly ResidenceStatus[];
  faqEntries?: readonly FaqEntry[];
  articleTranslations?: readonly ArticleSearchTranslation[];
  groupTranslations?: readonly ArticleGroupSearchTranslation[];
  faqTranslations?: readonly FaqSearchTranslation[];
  glossaryTranslations?: readonly GlossarySearchTranslation[];
}>) {
  const { locale } = useContentLocale();
  const searchState = useExploreSearchState(residenceStatuses, locale);
  const knowledgebaseIndex = useMemo(
    () => buildKnowledgebaseSearchIndex(groups, articles, terms, faqEntries.map(({ faq }) => faq), { locale, articleTranslations, groupTranslations, faqTranslations, glossaryTranslations }),
    [articleTranslations, articles, faqEntries, faqTranslations, glossaryTranslations, groupTranslations, groups, locale, terms],
  );
  const results = useMemo(
    () => searchKnowledgebaseIndex(knowledgebaseIndex, searchState.filters),
    [knowledgebaseIndex, searchState.filters],
  );

  return (
    <div className="mt-10">
      <ExploreFilterPanel
        filters={searchState.filters}
        isSearching={searchState.isSearching}
        locale={locale}
        residenceStatuses={residenceStatuses}
        updateFilter={searchState.updateFilter}
        commitQuery={searchState.commitQuery}
        clearSearch={searchState.clearSearch}
      />
      {searchState.isSearching ? (
        <ExploreResults
          results={results}
          index={knowledgebaseIndex}
          filters={searchState.filters}
          faqEntries={faqEntries}
          locale={locale}
          returnTo={searchState.returnTo}
          searchIsPending={searchState.searchIsPending}
          clearSearch={searchState.clearSearch}
        />
      ) : (
        <ExploreGroupBrowser groups={groups} translations={groupTranslations} locale={locale} />
      )}
    </div>
  );
}
