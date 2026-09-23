import { describe, expect, it } from "vitest";
import { translationArtifactSchema } from "@/domain/translation/translation";
import { createArticleTranslationCoverageReport } from "./localization-coverage";

const currentRevision = "a".repeat(64);
const terminologyRevision = "b".repeat(64);
const promptRevision = "c".repeat(64);

function artifact(overrides: Readonly<Record<string, unknown>> = {}) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "translated-guide",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: currentRevision,
    terminologyRevision,
    promptRevision,
    generator: { id: "test-generator", model: "test-model" },
    fields: { title: "翻訳" },
    reviewState: "machine-translated",
    availability: "active",
    generatedAt: "2026-09-19T00:00:00.000Z",
    ...overrides,
  });
}

describe("article translation coverage", () => {
  it("separates current, stale, and missing artifacts without failing for partial coverage", () => {
    const report = createArticleTranslationCoverageReport({
      contentIds: ["translated-guide", "stale-guide", "missing-guide"],
      sourceRevisions: new Map([
        ["translated-guide", currentRevision],
        ["stale-guide", currentRevision],
        ["missing-guide", currentRevision],
      ]),
      artifacts: [artifact(), artifact({ contentId: "stale-guide", availability: "stale" })],
      targetLocale: "ja",
      terminologyRevision,
      promptRevision,
    });

    expect(report).toMatchObject({ total: 3, current: 1, machineTranslated: 1, humanReviewed: 0, stale: 1, staleArtifacts: 1, missing: 1, outdatedActive: 0, errors: [] });
  });

  it("fails closed when an outdated artifact is still active", () => {
    const report = createArticleTranslationCoverageReport({
      contentIds: ["translated-guide"],
      sourceRevisions: new Map([["translated-guide", currentRevision]]),
      artifacts: [artifact({ sourceRevision: "d".repeat(64) })],
      targetLocale: "ja",
      terminologyRevision,
      promptRevision,
    });

    expect(report.outdatedActive).toBe(1);
    expect(report.errors).toEqual([
      'Article "translated-guide" has an active ja translation with an outdated revision.',
    ]);
  });
});
