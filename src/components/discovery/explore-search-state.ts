"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { contentLocalePreferenceSchema } from "@/domain/localization/content-locale";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { audiences, CONTENT_TYPE_IDS, geographicScopes, IMPORTANCE_IDS, journeyStages, topics } from "@/domain/taxonomy/taxonomy";
import { defaultKnowledgebaseSearchFilters, hasActiveKnowledgebaseSearch, type KnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";
import { writeContentLocale } from "@/lib/storage/content-locale";

const exploreReturnStorageKey = "nihonest:explore-return";
const filterParamKeys: Record<keyof KnowledgebaseSearchFilters, string> = {
  query: "q",
  kind: "kind",
  journeyStageId: "stage",
  topicId: "topic",
  audienceId: "audience",
  geographicScopeId: "scope",
  contentType: "content",
  importance: "importance",
  residenceStatusId: "status",
};

export type UpdateExploreFilter = <Key extends keyof KnowledgebaseSearchFilters>(
  key: Key,
  value: KnowledgebaseSearchFilters[Key],
) => void;

export function filtersFromExploreSearch(search: string, residenceStatuses: readonly ResidenceStatus[]): KnowledgebaseSearchFilters {
  const params = new URLSearchParams(search);
  const accepted = <Value extends string>(value: string | null, values: readonly Value[]): Value | "all" =>
    value && values.includes(value as Value) ? value as Value : "all";

  return {
    query: params.get("q") ?? "",
    kind: accepted(params.get("kind"), ["all", "group", "faq", "article", "glossary"] as const),
    journeyStageId: accepted(params.get("stage"), ["all", ...journeyStages.map(({ id }) => id)]),
    topicId: accepted(params.get("topic"), ["all", ...topics.map(({ id }) => id)]),
    audienceId: accepted(params.get("audience"), ["all", ...audiences.map(({ id }) => id)]),
    geographicScopeId: accepted(params.get("scope"), ["all", ...geographicScopes.map(({ id }) => id)]),
    contentType: accepted(params.get("content"), ["all", ...CONTENT_TYPE_IDS]),
    importance: accepted(params.get("importance"), ["all", ...IMPORTANCE_IDS]),
    residenceStatusId: accepted(params.get("status"), ["all", ...residenceStatuses.map(({ id }) => id)]),
  };
}

export function searchForExploreFilters(filters: KnowledgebaseSearchFilters, locale: ContentLocalePreference = "en") {
  const params = new URLSearchParams();
  for (const [key, paramKey] of Object.entries(filterParamKeys) as [keyof KnowledgebaseSearchFilters, string][]) {
    const value = filters[key];
    if (value && value !== "all") params.set(paramKey, value);
  }
  if (locale !== "en") params.set("lang", locale);
  return params.toString();
}

/** Keeps Explore filters synchronized with browser history and result-page return links. */
export function useExploreSearchState(residenceStatuses: readonly ResidenceStatus[], locale: ContentLocalePreference) {
  const [searchIsPending, startSearchTransition] = useTransition();
  const [filters, setFilters] = useState<KnowledgebaseSearchFilters>(defaultKnowledgebaseSearchFilters);
  const filtersRef = useRef<KnowledgebaseSearchFilters>(defaultKnowledgebaseSearchFilters);

  useEffect(() => {
    function restoreFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const requestedLocale = contentLocalePreferenceSchema.safeParse(params.get("lang"));
      if (requestedLocale.success) writeContentLocale(requestedLocale.data);
      const restoredFilters = filtersFromExploreSearch(window.location.search, residenceStatuses);
      filtersRef.current = restoredFilters;
      setFilters(restoredFilters);
      sessionStorage.setItem(exploreReturnStorageKey, window.location.pathname + window.location.search);
    }

    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, [residenceStatuses]);

  function persist(next: KnowledgebaseSearchFilters) {
    const search = searchForExploreFilters(next, locale);
    const href = search ? `/explore?${search}` : "/explore";
    window.history.replaceState(null, "", href);
    sessionStorage.setItem(exploreReturnStorageKey, href);
  }

  const updateFilter: UpdateExploreFilter = (key, value) => {
    const next = { ...filtersRef.current, [key]: value } as KnowledgebaseSearchFilters;
    filtersRef.current = next;
    setFilters(next);
    persist(next);
  };

  function commitQuery(value: string) {
    const next = { ...filtersRef.current, query: value };
    filtersRef.current = next;
    startSearchTransition(() => setFilters(next));
    persist(next);
  }

  function clearSearch() {
    filtersRef.current = defaultKnowledgebaseSearchFilters;
    setFilters(defaultKnowledgebaseSearchFilters);
    const href = locale === "en" ? "/explore" : `/explore?lang=${locale}`;
    window.history.replaceState(null, "", href);
    sessionStorage.setItem(exploreReturnStorageKey, href);
  }

  const filterSearch = searchForExploreFilters(filters, locale);
  return {
    filters,
    isSearching: hasActiveKnowledgebaseSearch(filters),
    searchIsPending,
    returnTo: filterSearch ? `/explore?${filterSearch}` : "/explore",
    updateFilter,
    commitQuery,
    clearSearch,
  };
}
