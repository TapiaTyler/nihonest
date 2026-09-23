import { describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { searchGlossary } from "./glossary-search";

describe("glossary search", () => {
  it.each(["住民票", "じゅうみんひょう", "jūminhyō", "juminhyo", "residence certificate"])(
    "finds a term using %s",
    (query) => {
      expect(searchGlossary(glossaryTerms, { query }).map(({ id }) => id)).toContain("juminhyo");
    },
  );

  it("combines text search and topic filtering", () => {
    expect(searchGlossary(glossaryTerms, { query: "national", topicId: "healthcare" })).toHaveLength(1);
  });

  it("returns no matches for an unrelated query", () => {
    expect(searchGlossary(glossaryTerms, { query: "shinkansen platform" })).toEqual([]);
  });

  it("searches localized definitions while retaining canonical English fallback", () => {
    const term = glossaryTerms.find(({ id }) => id === "zairyu-card")!;
    const translations = [{
      contentId: term.id,
      targetLocale: "ja",
      shortDefinition: "中長期在留者に交付される身分と在留に関する書類です。",
      detailedExplanation: "住所や在留資格などが記載されます。",
      commonContext: "自治体の手続きで提示します。",
    }];

    expect(searchGlossary([term], { query: "中長期在留者" }, { locale: "ja", translations })).toEqual([term]);
    expect(searchGlossary([term], { query: "identity and residence" }, { locale: "ja", translations })).toEqual([term]);
  });
});
