import { describe, expect, it } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { defaultKnowledgebaseSearchFilters } from "@/lib/search/knowledgebase-search";
import { filtersFromExploreSearch, searchForExploreFilters } from "@/components/discovery/explore-search-state";

describe("Explore URL state", () => {
  it("restores supported query and structured-filter values", () => {
    expect(filtersFromExploreSearch(
      "?q=bank+account&kind=article&stage=recently-arrived&topic=banking&audience=newcomer&scope=national&content=guide&importance=important&status=student",
      residenceStatuses,
    )).toEqual({
      query: "bank account",
      kind: "article",
      journeyStageId: "recently-arrived",
      topicId: "banking",
      audienceId: "newcomer",
      geographicScopeId: "national",
      contentType: "guide",
      importance: "important",
      residenceStatusId: "student",
    });
  });

  it("rejects unsupported filter values without discarding the query", () => {
    expect(filtersFromExploreSearch("?q=taxes&kind=unknown&topic=unknown&status=unknown", residenceStatuses)).toEqual({
      ...defaultKnowledgebaseSearchFilters,
      query: "taxes",
    });
  });

  it("omits defaults and retains the active non-English locale", () => {
    expect(searchForExploreFilters({
      ...defaultKnowledgebaseSearchFilters,
      query: "在留資格",
      kind: "article",
    }, "ja")).toBe("q=%E5%9C%A8%E7%95%99%E8%B3%87%E6%A0%BC&kind=article&lang=ja");
  });
});
