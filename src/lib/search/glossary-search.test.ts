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
});
