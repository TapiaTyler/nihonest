import { describe, expect, it } from "vitest";
import { activityCrossReferenceHref, safeActivityReturnPath } from "./activity-cross-reference";

describe("activity cross-reference navigation", () => {
  it("carries an exact originating search into a preselected activity", () => {
    expect(activityCrossReferenceHref("add-side-work-or-freelancing", "/faq?q=freelance"))
      .toBe("/can-i-do-this?activity=add-side-work-or-freelancing&returnTo=%2Ffaq%3Fq%3Dfreelance");
  });

  it("rejects external and lookalike return paths", () => {
    expect(safeActivityReturnPath("//example.com/explore")).toBe("/explore");
    expect(safeActivityReturnPath("/explore-elsewhere")).toBe("/explore");
  });
});
