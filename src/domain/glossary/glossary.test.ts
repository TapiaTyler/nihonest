import { describe, expect, it } from "vitest";
import { japaneseTermSchema, validateGlossaryCollection } from "./glossary";

const term = japaneseTermSchema.parse({
  id: "juminhyo",
  slug: "juminhyo",
  japanese: "住民票",
  kana: "じゅうみんひょう",
  romaji: "jūminhyō",
  englishName: "Certificate of Residence",
  shortDefinition: "A record of registered residence.",
  detailedExplanation: "A municipal record used for administrative procedures.",
  commonContext: "Requested at a municipal office.",
  topicIds: ["municipal-procedures"],
  relatedArticleIds: ["address"],
  sourceIds: ["source"],
  status: "needs-review",
});

describe("glossary model", () => {
  it("validates known source and article relationships", () => {
    expect(() =>
      validateGlossaryCollection(
        [term],
        [{ id: "source", organization: "Authority", title: "Guide", url: "https://example.com", authorityLevel: "national-government", language: "en" }],
        ["address"],
      ),
    ).not.toThrow();
  });

  it("rejects unknown related terms", () => {
    const invalid = { ...term, relatedTermIds: ["missing"] };
    expect(() => validateGlossaryCollection([invalid], [], ["address"])).toThrow(
      'references unknown term "missing"',
    );
  });
});
