import { describe, expect, it } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import {
  getStructuredResidenceStatusGuidance,
  structuredResidenceStatusGuidance,
} from "@/data/structured-residence-status-guidance";
import { businessStructuredGuidance } from "@/data/structured-residence-status-guidance/business";
import { designatedStructuredGuidance } from "@/data/structured-residence-status-guidance/designated";
import { familyStructuredGuidance } from "@/data/structured-residence-status-guidance/family";
import { officialStructuredGuidance } from "@/data/structured-residence-status-guidance/official";
import { studyStructuredGuidance } from "@/data/structured-residence-status-guidance/study";
import { unrestrictedStructuredGuidance } from "@/data/structured-residence-status-guidance/unrestricted";
import { visitorStructuredGuidance } from "@/data/structured-residence-status-guidance/visitor";
import { workStructuredGuidance } from "@/data/structured-residence-status-guidance/work";

const categoryModules = [
  ["work", workStructuredGuidance],
  ["business", businessStructuredGuidance],
  ["study", studyStructuredGuidance],
  ["family", familyStructuredGuidance],
  ["designated", designatedStructuredGuidance],
  ["visitor", visitorStructuredGuidance],
  ["official", officialStructuredGuidance],
  ["unrestricted", unrestrictedStructuredGuidance],
] as const;

describe("structured residence-status guidance assembly", () => {
  it("assembles every category-owned record exactly once in canonical category order", () => {
    const moduleIds = categoryModules.flatMap(([, records]) => Object.keys(records));

    expect(moduleIds).toHaveLength(30);
    expect(Object.keys(structuredResidenceStatusGuidance)).toEqual(moduleIds);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });

  it("keeps each record with its established residence-status category and lookup", () => {
    for (const [category, records] of categoryModules) {
      for (const id of Object.keys(records)) {
        expect(residenceStatuses.find((status) => status.id === id)?.category).toBe(category);
        expect(getStructuredResidenceStatusGuidance(id)).toBe(records[id as keyof typeof records]);
      }
    }

    expect(getStructuredResidenceStatusGuidance("unknown-status")).toBeUndefined();
  });

  it("provides structured guidance for every residence status", () => {
    expect(residenceStatuses).toHaveLength(30);
    expect(residenceStatuses.filter((status) => !status.structuredGuidance).map(({ id }) => id)).toEqual([]);
  });
});
