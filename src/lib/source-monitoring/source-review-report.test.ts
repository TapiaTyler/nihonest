import { describe, expect, it } from "vitest";
import { summarizeSourceDifference } from "@/lib/source-monitoring/source-review-report";

describe("source review difference summary", () => {
  it("shows concise before and after evidence without claiming an interpretation", () => {
    const difference = summarizeSourceDifference({
      accepted: {
        fingerprint: "a".repeat(64),
        capturedAt: "2026-08-01T00:00:00.000Z",
        resolvedUrl: "https://example.go.jp/source",
        contentKind: "html",
        normalizedLength: 14,
      },
      candidate: {
        fingerprint: "b".repeat(64),
        capturedAt: "2026-09-11T00:00:00.000Z",
        resolvedUrl: "https://example.go.jp/source",
        contentKind: "html",
        normalizedLength: 14,
      },
      acceptedText: "Same sentence. Old rule.",
      candidateText: "Same sentence. New rule.",
    });

    expect(difference).toMatchObject({
      basis: "normalized-text",
      beforeExcerpts: ["Old rule."],
      afterExcerpts: ["New rule."],
    });
    expect(difference.summary).toContain("not their legal meaning");
  });
});
