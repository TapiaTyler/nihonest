import { describe, expect, it } from "vitest";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { sources } from "@/data/sources";
import { readReferenceCatalog } from "./reference-catalog";

describe("readReferenceCatalog", () => {
  it("lists every canonical registry record in registry order", () => {
    const catalog = readReferenceCatalog();

    expect(catalog.summaries.map(({ kind, id }) => `${kind}:${id}`)).toEqual([
      ...sources.map(({ id }) => `source:${id}`),
      ...guidedJourneys.map(({ id }) => `journey:${id}`),
      ...articleGroups.map(({ id }) => `article-group:${id}`),
      ...annotatedDocumentFamilies.map(({ id }) => `annotated-document:${id}`),
    ]);
    expect(catalog.records.map(({ kind, id }) => `${kind}:${id}`)).toEqual(
      catalog.summaries.map(({ kind, id }) => `${kind}:${id}`),
    );
    expect(catalog.records.map(({ value }) => value)).toEqual([
      ...sources,
      ...guidedJourneys,
      ...articleGroups,
      ...annotatedDocumentFamilies,
    ]);
    expect(catalog.summaries.every(({ id }) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true);
  });

  it("exposes inspect-only metadata and a full source value with its effective registry dates", () => {
    const catalog = readReferenceCatalog();
    const registeredSource = sources.find(({ id }) => id === "isa-artist-status");
    const detail = catalog.getRecord("source", "isa-artist-status");

    expect(registeredSource).toBeDefined();
    expect(detail).toMatchObject({
      id: "isa-artist-status",
      title: registeredSource?.title,
      kind: "source",
      registryPath: "src/data/sources.ts",
      capability: "inspect-only",
      value: registeredSource,
    });
    expect(detail?.value).toEqual(registeredSource);
    expect(detail?.value).toHaveProperty("lastCheckedAt", registeredSource?.lastCheckedAt);
    expect(detail).not.toHaveProperty("status");
  });

  it("preserves journey route choices, route filters, and conditional step labels", () => {
    const journey = guidedJourneys.find(({ id }) => id === "student-moving-to-japan");
    const detail = readReferenceCatalog().getRecord("journey", "student-moving-to-japan");

    expect(detail?.value).toEqual(journey);
    expect(journey?.routes).toHaveLength(2);
    expect(journey?.phases.find(({ id }) => id === "choose-route")?.steps).toContainEqual({ id: "select-route", type: "route-choice" });
    expect(journey?.phases.find(({ id }) => id === "prepare")?.steps).toContainEqual(expect.objectContaining({
      type: "article",
      articleId: "preparing-to-enter-japan",
      requiredness: "required",
      routeIds: ["student-status"],
    }));
    expect(journey?.phases.find(({ id }) => id === "work-and-transition")?.steps).toContainEqual(expect.objectContaining({
      type: "article",
      articleId: "working-part-time-on-student-status",
      conditionLabel: "If you plan to undertake paid work",
    }));
  });

  it("preserves article group article order and nested document variants and versions", () => {
    const group = articleGroups.find(({ id }) => id === "study-in-japan");
    const groupDetail = readReferenceCatalog().getRecord("article-group", "study-in-japan");
    expect(groupDetail?.value).toEqual(group);
    expect(group?.articleIds.slice(0, 4)).toEqual([
      "planning-your-studies-in-japan",
      "choosing-a-school-and-understanding-admission-requirements",
      "short-term-study-in-japan",
      "student-visa-and-certificate-of-eligibility",
    ]);

    const family = annotatedDocumentFamilies.find(({ id }) => id === "resident-tax-notice");
    const familyDetail = readReferenceCatalog().getRecord("annotated-document", "resident-tax-notice");
    expect(familyDetail?.value).toEqual(family);
    expect(family?.jurisdictionVariants.length).toBeGreaterThan(0);
    expect(family?.jurisdictionVariants[0]?.versions[0]).toMatchObject({
      id: "assessment-year-2026",
      lifecycle: "current",
      validFrom: "2026-04-01",
      validThrough: "2027-03-31",
      sourceIds: expect.arrayContaining(["nagoya-resident-tax-2026"]),
    });
  });

  it("returns undefined for unknown reference IDs", () => {
    expect(readReferenceCatalog().getRecord("journey", "missing-record")).toBeUndefined();
  });
});
