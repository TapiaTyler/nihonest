import { describe, expect, it } from "vitest";
import {
  residenceStatusSchema,
  validateResidenceStatusCollection,
} from "./residence-status";
import { officialSourceSchema } from "@/domain/source/source";
import { residenceStatuses } from "@/data/residence-statuses";
import { glossaryTerms } from "@/data/glossary";
import { sources } from "@/data/sources";

const validStatus = residenceStatusSchema.parse({
  id: "sample-status",
  slug: "sample-status",
  englishName: "Sample status",
  japaneseName: "サンプル",
  japaneseKana: "さんぷる",
  romaji: "sanpuru",
  glossaryTermId: "sample-status",
  category: "study",
  summary: "A sample record used to test the domain model.",
  purpose: "Testing validation.",
  typicalActivities: ["A sample activity"],
  examples: [],
  considerations: ["Verify the details."],
  sourceIds: ["official-source"],
  relatedArticleIds: [],
  lastReviewedAt: "2026-09-05",
  status: "draft",
});

const validSource = officialSourceSchema.parse({
  id: "official-source",
  organization: "Example authority",
  title: "Example source",
  url: "https://example.com/",
  authorityLevel: "public-institution",
  language: "en",
});

describe("residence status domain", () => {
  it("rejects categories outside the controlled set", () => {
    expect(() => residenceStatusSchema.parse({ ...validStatus, category: "other" })).toThrow();
  });

  it("rejects unknown source relationships", () => {
    expect(() =>
      validateResidenceStatusCollection(
        [{ ...validStatus, sourceIds: ["missing-source"] }],
        [validSource],
        [],
        ["sample-status"],
      ),
    ).toThrow('references unknown source "missing-source"');
  });

  it("validates twenty-eight structurally distinct research-pilot fixtures", () => {
    const pilots = residenceStatuses.filter(({ structuredGuidance }) => structuredGuidance);

    expect(pilots).toHaveLength(28);
    expect(pilots.every(({ structuredGuidance }) => structuredGuidance?.researchState === "draft-pilot")).toBe(true);
    expect(pilots.find(({ id }) => id === "engineer-specialist-humanities-international-services")?.structuredGuidance?.qualificationPathways).toHaveLength(4);
    expect(pilots.find(({ id }) => id === "business-manager")?.structuredGuidance?.sourceAssertions).toContainEqual(expect.objectContaining({ effectiveFrom: "2025-10-16" }));
    expect(pilots.find(({ id }) => id === "designated-activities")?.structuredGuidance?.routeKind).toBe("individual-designation");
    expect(pilots.find(({ id }) => id === "researcher")?.structuredGuidance?.qualificationPathways).toHaveLength(2);
    expect(pilots.find(({ id }) => id === "intra-company-transferee")?.structuredGuidance?.routeKindLabel).toBe("Transfer-specific professional status");
    expect(pilots.find(({ id }) => id === "artist")?.structuredGuidance?.qualificationPathways).toHaveLength(2);
    expect(pilots.find(({ id }) => id === "entertainer")?.structuredGuidance?.periodsOfStay[0]?.duration).toContain("30 days");
    expect(pilots.find(({ id }) => id === "journalist")?.structuredGuidance?.qualificationPathways[0]?.id).toBe("foreign-news-contract");
    expect(pilots.find(({ id }) => id === "medical-services")?.structuredGuidance?.searchTerms).toContain("physical therapist");
    expect(pilots.find(({ id }) => id === "nursing-care")?.structuredGuidance?.transitions).toContainEqual(expect.objectContaining({ targetStatusId: "specified-skilled-worker" }));
    expect(pilots.find(({ id }) => id === "legal-accounting-services")?.structuredGuidance?.searchTerms).toContain("registered foreign lawyer");
    expect(pilots.find(({ id }) => id === "religious-activities")?.structuredGuidance?.qualificationPathways[0]?.id).toBe("foreign-religious-organization-dispatch");
    expect(pilots.find(({ id }) => id === "skilled-labor")?.structuredGuidance?.qualificationPathways).toHaveLength(4);
    expect(pilots.find(({ id }) => id === "specified-skilled-worker")?.structuredGuidance?.searchTerms).toContain("forestry worker");
    expect(pilots.find(({ id }) => id === "cultural-activities")?.structuredGuidance?.workAuthorization.mode).toBe("not-authorized-by-default");
    expect(pilots.find(({ id }) => id === "trainee")?.structuredGuidance?.renewal.mode).toBe("program-limited");
    expect(pilots.find(({ id }) => id === "technical-intern-training")?.structuredGuidance?.transitions).toContainEqual(expect.objectContaining({ targetStatusId: "employment-for-skill-development" }));
    expect(pilots.find(({ id }) => id === "employment-for-skill-development")?.structuredGuidance?.sourceAssertions).toContainEqual(expect.objectContaining({ effectiveFrom: "2027-04-01" }));
    expect(pilots.find(({ id }) => id === "temporary-visitor")?.structuredGuidance?.workAuthorization.mode).toBe("not-authorized-by-default");
    expect(pilots.find(({ id }) => id === "diplomat")?.structuredGuidance?.periodsOfStay[0]?.duration).toBe("During mission");
    expect(pilots.find(({ id }) => id === "official")?.structuredGuidance?.periodsOfStay[0]?.duration).toContain("15 days");
  });

  it("keeps every pilot source and transition connected to the canonical catalogs", () => {
    expect(() => validateResidenceStatusCollection(
      residenceStatuses,
      sources,
      residenceStatuses.flatMap(({ relatedArticleIds }) => relatedArticleIds),
      glossaryTerms.map(({ id }) => id),
    )).not.toThrow();
  });
});
