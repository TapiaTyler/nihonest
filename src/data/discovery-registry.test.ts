import { describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { resolveJourneySteps } from "@/domain/discovery/discovery";

const expectedGroupIds = [
  "study-in-japan",
  "arrival-essentials",
  "professional-work",
  "business-and-high-skill",
  "skilled-and-sector-work",
  "family-and-long-term-residence",
  "culture-and-training",
  "workforce-development-programs",
  "designated-activities",
  "short-stay-and-medical",
  "diplomatic-and-official",
  "taxes-and-resident-responsibilities",
  "working-in-japan",
  "transport-safety-and-emergencies",
  "daily-life-and-local-community",
];

const expectedJourneyIds = [
  "student-moving-to-japan",
  "accepting-international-students",
  "professional-worker-moving-to-japan",
  "accepting-foreign-workers",
  "founder-or-highly-skilled-moving-to-japan",
  "skilled-or-sector-worker-moving-to-japan",
  "workforce-development-in-japan",
  "joining-family-in-japan",
  "cultural-activities-or-training-in-japan",
  "working-holiday-in-japan",
  "side-work-or-freelancing-while-employed",
  "ongoing-resident-responsibilities",
  "digital-nomad-in-japan",
  "j-find-future-creation",
  "long-stay-sightseeing-in-japan",
  "short-visit-to-japan",
  "medical-visit-to-japan",
  "diplomatic-or-official-assignment",
  "preparing-for-permanent-residence",
  "employment-lifecycle-in-japan",
];

describe("discovery registry assembly", () => {
  it("preserves established group and journey membership and public order", () => {
    expect(articleGroups.map(({ id }) => id)).toEqual(expectedGroupIds);
    expect(guidedJourneys.map(({ id }) => id)).toEqual(expectedJourneyIds);
    expect(new Set(expectedGroupIds).size).toBe(articleGroups.length);
    expect(new Set(expectedJourneyIds).size).toBe(guidedJourneys.length);
  });

  it("preserves route-aware resident steps in the student journey", () => {
    const journey = guidedJourneys.find(({ id }) => id === "student-moving-to-japan");
    expect(journey).toBeDefined();

    const temporaryVisitorSteps = resolveJourneySteps(journey!, "temporary-visitor-study").map(({ articleId }) => articleId);
    const studentSteps = resolveJourneySteps(journey!, "student-status").map(({ articleId }) => articleId);

    expect(temporaryVisitorSteps).not.toContain("registering-your-address-after-arrival");
    expect(studentSteps).toContain("registering-your-address-after-arrival");
    expect(studentSteps).toContain("working-part-time-on-student-status");
  });

  it("keeps the shared professional route catalog identical across its three journeys", () => {
    const professionalJourneys = guidedJourneys.filter(({ id }) => [
      "professional-worker-moving-to-japan",
      "accepting-foreign-workers",
      "side-work-or-freelancing-while-employed",
    ].includes(id));

    expect(professionalJourneys).toHaveLength(3);
    expect(professionalJourneys.map(({ routes }) => routes.map(({ id }) => id))).toEqual([
      professionalJourneys[0]!.routes.map(({ id }) => id),
      professionalJourneys[0]!.routes.map(({ id }) => id),
      professionalJourneys[0]!.routes.map(({ id }) => id),
    ]);
  });
});
