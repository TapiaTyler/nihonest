import { describe, expect, it } from "vitest";
import { createSourceReviewRecord, resolveSourceReview } from "@/domain/source/source-review";

const fingerprintA = "a".repeat(64);
const fingerprintB = "b".repeat(64);
const candidate = {
  fingerprint: fingerprintB,
  capturedAt: "2026-09-11T10:00:00.000Z",
  resolvedUrl: "https://example.go.jp/immigration",
  contentKind: "html" as const,
  normalizedLength: 240,
};
const dependency = {
  sourceId: "official-immigration",
  dependents: [
    { kind: "article" as const, id: "work-permission", viaArticleIds: [] },
    { kind: "guided-journey" as const, id: "worker-journey", viaArticleIds: ["work-permission"] },
  ],
};

function openRecord() {
  return createSourceReviewRecord({
    source: {
      id: "official-immigration",
      organization: "Example Ministry",
      title: "Immigration guidance",
      url: "https://example.go.jp/immigration",
      authorityLevel: "national-government",
      language: "en",
      checkMethod: "automated",
    },
    dependency,
    articles: [{
      id: "work-permission",
      title: "Work permission",
      sourceIds: ["official-immigration"],
      importance: "critical",
      topicIds: ["immigration", "employment"],
    }],
    candidateFingerprint: fingerprintB,
    detectedAs: "changed",
    detectedAt: candidate.capturedAt,
    createdAt: "2026-09-11T11:00:00.000Z",
    difference: {
      basis: "normalized-text",
      summary: "The eligibility paragraph changed.",
      beforeExcerpts: ["Old eligibility."],
      afterExcerpts: ["New eligibility."],
    },
  });
}

describe("source review records", () => {
  it("prioritizes high-risk, critical guidance and records its evidence context", () => {
    const record = openRecord();

    expect(record).toMatchObject({
      sourceTitle: "Immigration guidance",
      officialUrl: "https://example.go.jp/immigration",
      detectedAs: "changed",
      priority: { level: "critical" },
    });
    expect(record.potentiallyAffectedClaims).toContain("work permissions and activity limits");
  });

  it("accepts the candidate only with an explicit, dependency-aware resolution", () => {
    const record = openRecord();
    const result = resolveSourceReview({
      record,
      monitoringState: {
        version: 1,
        sources: {
          "official-immigration": {
            accepted: { ...candidate, fingerprint: fingerprintA, capturedAt: "2026-08-01T10:00:00.000Z" },
            candidate,
          },
        },
      },
      decision: "accept",
      outcome: "guidance-remains-accurate",
      reviewedAt: "2026-09-11",
      approvalNote: "I compared the official eligibility section with the dependent article.",
      unresolvedUncertainty: "None identified.",
      validationPerformed: ["Focused source-review tests passed."],
      resolvedAt: "2026-09-11T12:00:00.000Z",
      reviewedDependencies: dependency.dependents,
    });

    expect(result.record.resolution).toMatchObject({
      explicitHumanApproval: true,
      reviewedDependencies: dependency.dependents,
    });
    expect(result.monitoringState.sources["official-immigration"]).toMatchObject({
      accepted: candidate,
      lastReviewedAt: "2026-09-11",
    });
    expect(result.monitoringState.sources["official-immigration"]?.candidate).toBeUndefined();
  });
});
