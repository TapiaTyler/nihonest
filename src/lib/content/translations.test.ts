import { describe, expect, it } from "vitest";
import { translationArtifactSchema } from "@/domain/translation/translation";
import { getActiveArticleTranslations } from "@/lib/content/translations";

const artifact = translationArtifactSchema.parse({
  schemaVersion: 1,
  contentKind: "article",
  contentId: "example-guide",
  sourceLocale: "en",
  targetLocale: "ja",
  sourceRevision: "a".repeat(64),
  terminologyRevision: "b".repeat(64),
  promptRevision: "c".repeat(64),
  generator: { id: "test-generator", model: "test model" },
  fields: { title: "例" },
  reviewState: "machine-translated",
  generatedAt: "2026-09-11T00:00:00.000Z",
});

describe("repository article translations", () => {
  it("excludes explicitly stale artifacts from application consumers", () => {
    expect(getActiveArticleTranslations([artifact, { ...artifact, contentId: "old-guide", availability: "stale" }]))
      .toEqual([artifact]);
  });
});
