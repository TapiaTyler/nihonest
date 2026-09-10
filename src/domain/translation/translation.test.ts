import { describe, expect, it } from "vitest";
import { isTranslationCurrent, translationArtifactSchema, translationCacheKey } from "./translation";

const identity = {
  contentKind: "article",
  contentId: "preparing-to-enter-japan",
  targetLocale: "es-MX",
  sourceRevision: "a".repeat(64),
  terminologyRevision: "b".repeat(64),
  promptRevision: "d".repeat(64),
  generatorId: "test-provider",
  generatorModel: "model 1",
} as const;

const artifact = {
  schemaVersion: 1,
  contentKind: identity.contentKind,
  contentId: identity.contentId,
  sourceLocale: "en",
  targetLocale: identity.targetLocale,
  sourceRevision: identity.sourceRevision,
  terminologyRevision: identity.terminologyRevision,
  promptRevision: identity.promptRevision,
  generator: { id: identity.generatorId, model: identity.generatorModel },
  fields: { title: "Prepararse para entrar a Japón" },
  reviewState: "machine-translated",
  generatedAt: "2026-09-09T00:00:00.000Z",
} as const;

describe("translation artifacts", () => {
  it("builds a deterministic key from every invalidation input", () => {
    expect(translationCacheKey(identity)).toBe(
      `translation-v1:article:preparing-to-enter-japan:es-MX:${"a".repeat(64)}:${"b".repeat(64)}:${"d".repeat(64)}:test-provider:model%201`,
    );
  });

  it("recognizes current and stale artifacts", () => {
    expect(isTranslationCurrent(artifact, identity)).toBe(true);
    expect(isTranslationCurrent(artifact, { ...identity, sourceRevision: "c".repeat(64) })).toBe(false);
  });

  it("requires review metadata only for human-reviewed translations", () => {
    expect(translationArtifactSchema.safeParse({ ...artifact, reviewState: "human-reviewed" }).success).toBe(false);
    expect(translationArtifactSchema.safeParse({
      ...artifact,
      reviewState: "human-reviewed",
      reviewedAt: "2026-09-10T00:00:00.000Z",
    }).success).toBe(true);
  });
});
