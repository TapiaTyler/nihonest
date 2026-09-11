import { describe, expect, it } from "vitest";
import { officialSourceSchema } from "@/domain/source/source";
import { auditSourceRegistry, buildSourceDependencyGraph } from "@/domain/source/source-dependency";

describe("official source operational metadata", () => {
  it("keeps reachability and substantive review dates separate", () => {
    const source = officialSourceSchema.parse({
      id: "official-example",
      organization: "Example Ministry",
      title: "Official guidance",
      url: "https://example.go.jp/guidance",
      authorityLevel: "national-government",
      language: "en",
      lastCheckedAt: "2026-09-10",
      lastReviewedAt: "2026-09-08",
    });

    expect(source).toMatchObject({
      checkMethod: "automated",
      lastCheckedAt: "2026-09-10",
      lastReviewedAt: "2026-09-08",
    });
  });
});

describe("source dependency graph", () => {
  it("includes direct records and derives containers through their articles", () => {
    const graph = buildSourceDependencyGraph({
      sourceIds: ["source-a", "source-b"],
      references: [
        { kind: "article", id: "article-a", sourceIds: ["source-a"] },
        { kind: "article", id: "article-b", sourceIds: ["source-a", "source-b"] },
        { kind: "glossary-term", id: "term-a", sourceIds: ["source-a"] },
        { kind: "residence-status", id: "status-a", sourceIds: ["source-b"] },
      ],
      containers: [
        { kind: "article-group", id: "group-a", articleIds: ["article-a", "article-b"] },
        { kind: "guided-journey", id: "journey-a", articleIds: ["article-b"] },
      ],
    });

    expect(graph.find(({ sourceId }) => sourceId === "source-a")?.dependents).toEqual([
      { kind: "article", id: "article-a", viaArticleIds: [] },
      { kind: "article", id: "article-b", viaArticleIds: [] },
      { kind: "glossary-term", id: "term-a", viaArticleIds: [] },
      { kind: "article-group", id: "group-a", viaArticleIds: ["article-a", "article-b"] },
      { kind: "guided-journey", id: "journey-a", viaArticleIds: ["article-b"] },
    ]);
  });
});

describe("source registry audit", () => {
  it("reports all registry defects in one deterministic result", () => {
    const findings = auditSourceRegistry({
      sourceIds: ["source-a", "source-a", "unused-source"],
      references: [
        { kind: "article", id: "missing", sourceIds: [] },
        { kind: "glossary-term", id: "duplicate", sourceIds: ["source-a", "source-a"] },
        { kind: "residence-status", id: "unknown", sourceIds: ["unknown-source"] },
      ],
    });

    expect(findings.map(({ code }) => code)).toEqual([
      "duplicate-source-id",
      "duplicate-source-reference",
      "missing-source-reference",
      "unknown-source-reference",
      "unused-source",
    ]);
  });
});
