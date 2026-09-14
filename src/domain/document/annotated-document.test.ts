import { describe, expect, it } from "vitest";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { glossaryTerms } from "@/data/glossary";
import { sources } from "@/data/sources";
import { supportedGeographies } from "@/data/local-guidance";
import { validateAnnotatedDocumentCollection } from "./annotated-document";

const articleIds = [...new Set(annotatedDocumentFamilies.map(({ articleId }) => articleId))];
const selectableGeographyIds = supportedGeographies.filter(({ selectable }) => selectable).map(({ id }) => id);

describe("annotated document model", () => {
  it("validates version, glossary, article, and source references", () => {
    expect(() => validateAnnotatedDocumentCollection(
      annotatedDocumentFamilies,
      articleIds,
      glossaryTerms.map(({ id }) => id),
      sources.map(({ id }) => id),
      selectableGeographyIds,
    )).not.toThrow();
  });

  it("uses directly sourced official images only when their reuse basis is recorded", () => {
    const residenceCard = annotatedDocumentFamilies.find(({ id }) => id === "residence-card");
    const currentVersion = residenceCard?.versions.find(({ lifecycle }) => lifecycle === "current");

    expect(currentVersion?.officialVisuals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        assetUrl: "https://www.moj.go.jp/isa/content/001458498.jpg",
        rightsSourceId: "isa-content-reuse-policy",
        presentation: "unmodified",
      }),
    ]));
  });

  it("requires exactly one current version per document family", () => {
    const invalid = annotatedDocumentFamilies.map((family) => family.id === "residence-card"
      ? { ...family, versions: family.versions.map((version) => ({ ...version, lifecycle: "superseded" as const })) }
      : family);

    expect(() => validateAnnotatedDocumentCollection(
      invalid,
      articleIds,
      glossaryTerms.map(({ id }) => id),
      sources.map(({ id }) => id),
      selectableGeographyIds,
    )).toThrow(/exactly one current version/);
  });

  it("keeps each municipality and its version history independently selectable", () => {
    const residentTaxNotice = annotatedDocumentFamilies.find(({ id }) => id === "resident-tax-notice");

    expect(residentTaxNotice?.jurisdictionVariants.map(({ label }) => label)).toEqual(["Nagoya City", "Shinjuku City"]);
    expect(residentTaxNotice?.versions).toEqual([]);

    const invalid = annotatedDocumentFamilies.map((family) => family.id === "resident-tax-notice"
      ? {
          ...family,
          jurisdictionVariants: family.jurisdictionVariants.map((variant) => variant.id === "shinjuku-city"
            ? { ...variant, versions: variant.versions.map((version) => ({ ...version, lifecycle: "superseded" as const })) }
            : variant),
        }
      : family);

    expect(() => validateAnnotatedDocumentCollection(
      invalid,
      articleIds,
      glossaryTerms.map(({ id }) => id),
      sources.map(({ id }) => id),
      selectableGeographyIds,
    )).toThrow(/group "shinjuku-city" must have exactly one current version/);
  });
});
