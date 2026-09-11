import { describe, expect, it } from "vitest";
import { auditEditorialState, createEditorialReviewRecord } from "@/domain/editorial/editorial-review";

const target = {
  kind: "article" as const,
  id: "example-guide",
  status: "verified" as const,
  revision: "a".repeat(64),
  updatedAt: "2026-09-10",
  lastReviewedAt: "2026-09-11",
};

function approval() {
  return createEditorialReviewRecord({
    target,
    reviewedAt: "2026-09-11",
    changeNote: "Confirmed the current eligibility explanation and source links.",
    approvalNote: "I reviewed and approve this exact revision.",
    validationPerformed: ["Focused content validation passed."],
    recordedAt: "2026-09-11T12:00:00.000Z",
  });
}

describe("editorial approval", () => {
  it("records explicit human approval for an exact verified revision", () => {
    expect(approval()).toMatchObject({
      contentRevision: target.revision,
      reviewedAt: target.lastReviewedAt,
      explicitHumanApproval: true,
    });
  });

  it("rejects an approval date that differs from content metadata", () => {
    expect(() => createEditorialReviewRecord({
      target,
      reviewedAt: "2026-09-10",
      changeNote: "Reviewed.",
      approvalNote: "Approved.",
      validationPerformed: ["Checked."],
      recordedAt: "2026-09-11T12:00:00.000Z",
    })).toThrow("must match");
  });

  it("blocks verified content when the approval belongs to an older revision", () => {
    const findings = auditEditorialState(
      [{ ...target, revision: "b".repeat(64) }],
      [approval()],
      "2026-09-11",
    );

    expect(findings.map(({ code }) => code)).toContain("missing-current-approval");
  });

  it("accepts a current approval and review date", () => {
    expect(auditEditorialState([target], [approval()], "2026-09-11")).toEqual([]);
  });
});
