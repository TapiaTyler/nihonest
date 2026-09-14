import { describe, expect, it } from "vitest";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { searchActivityCrossReferences } from "./activity-cross-reference-search";

describe("activity cross-reference search", () => {
  it("maps an ordinary side-work question to the curated activity", () => {
    expect(searchActivityCrossReferences(activityCrossReferences, "Can I freelance on my work visa?")[0]?.id)
      .toBe("add-side-work-or-freelancing");
  });

  it("maps a tax question without treating it as a legal conclusion", () => {
    expect(searchActivityCrossReferences(activityCrossReferences, "Where do I go to pay taxes?")[0]?.id)
      .toBe("receive-or-report-income");
  });

  it("does not manufacture a match for unknown wording", () => {
    expect(searchActivityCrossReferences(activityCrossReferences, "replace a broken umbrella")).toEqual([]);
  });
});
