// @vitest-environment node
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { readArticleCatalog } from "./catalog";
import { readStructuredCatalog, type StructuredRecord } from "./structured-catalog";
import { readLocalGuidanceCatalog } from "./local-guidance-catalog";
import { buildTranslationHandoff, readTranslationHandoff } from "./translation-handoff";

const root = resolve(import.meta.dirname, "../..");

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("CMS translation handoff projection", { timeout: 30_000 }, () => {
  it("sorts stale and missing records deterministically and marks failed catalogs incomplete", () => {
    const record = (kind: "faq" | "residence-status" | "glossary-term", id: string, state: "stale" | "missing") => ({
      kind,
      id,
      title: `${kind} ${id}`,
      translation: state,
      source: { path: `src/data/${kind}/${id}.ts` },
      value: kind === "faq"
        ? { id, question: "Question", summary: "Summary" }
        : kind === "residence-status"
          ? { id, summary: "Summary", purpose: "Purpose", typicalActivities: [], examples: [], considerations: [] }
          : { id, shortDefinition: "Definition", detailedExplanation: "Details", commonContext: "Context" },
    } as unknown as StructuredRecord);
    const projection = buildTranslationHandoff({
      articles: [
        { id: "z-article", title: "Zulu", path: "content/articles/z.mdx", revision: "article-rev", translation: "stale" },
        { id: "a-article", title: "Alpha", path: "content/articles/a.mdx", revision: "article-rev-2", translation: "current" },
      ] as never,
      structuredRecords: [
        record("glossary-term", "z-term", "missing"),
        record("faq", "b-faq", "stale"),
        record("faq", "a-faq", "missing"),
        record("residence-status", "c-status", "stale"),
      ],
      localGuidanceDetails: [{
        id: "jp-13101-registering-your-address-after-arrival",
        value: { title: "Registering your address", summary: "Summary", applicability: "Applies", responsibleBody: "Ward office", actions: [] },
        source: { path: "src/data/local-guidance/locations/tokyo/chiyoda.ts" },
        translation: "stale",
      }] as never,
      articleFailures: [{ path: "content/articles/broken.mdx", error: "Invalid metadata" }],
      structuredFailures: [{ path: "src/data/faqs/broken.ts", error: "Could not parse record" }],
      localGuidanceFailures: [{ path: "src/data/local-guidance/locations/tokyo/broken.ts", error: "Could not parse location" }],
    });

    expect(projection.items.map(({ kind, id, state }) => `${kind}:${id}:${state}`)).toEqual([
      "article:z-article:stale",
      "faq:a-faq:missing",
      "faq:b-faq:stale",
      "residence-status:c-status:stale",
      "glossary-term:z-term:missing",
      "local-guidance-supplement:jp-13101-registering-your-address-after-arrival:stale",
    ]);
    expect(projection.complete).toBe(false);
    expect(projection.failures.map(({ catalog, path }) => `${catalog}:${path}`)).toEqual([
      "articles:content/articles/broken.mdx",
      "local-guidance:src/data/local-guidance/locations/tokyo/broken.ts",
      "structured:src/data/faqs/broken.ts",
    ]);
    expect(projection.exportText).toContain("Catalog coverage: INCOMPLETE");
    expect(projection.exportText).toContain("Catalog failures (coverage is incomplete):");
    expect(projection.exportText).toContain("English source revision: article-rev");
    const permuted = buildTranslationHandoff({
      articles: [
        { id: "a-article", title: "Alpha", path: "content/articles/a.mdx", revision: "article-rev-2", translation: "current" },
        { id: "z-article", title: "Zulu", path: "content/articles/z.mdx", revision: "article-rev", translation: "stale" },
      ] as never,
      structuredRecords: [
        record("residence-status", "c-status", "stale"),
        record("faq", "a-faq", "missing"),
        record("glossary-term", "z-term", "missing"),
        record("faq", "b-faq", "stale"),
      ],
      localGuidanceDetails: [{
        id: "jp-13101-registering-your-address-after-arrival",
        value: { title: "Registering your address", summary: "Summary", applicability: "Applies", responsibleBody: "Ward office", actions: [] },
        source: { path: "src/data/local-guidance/locations/tokyo/chiyoda.ts" },
        translation: "stale",
      }] as never,
      articleFailures: [{ path: "content/articles/broken.mdx", error: "Invalid metadata" }],
      structuredFailures: [{ path: "src/data/faqs/broken.ts", error: "Could not parse record" }],
      localGuidanceFailures: [{ path: "src/data/local-guidance/locations/tokyo/broken.ts", error: "Could not parse location" }],
    });
    expect(permuted.exportText).toBe(projection.exportText);
  });

  it("matches editorial and municipality translation states and canonical paths from the catalog selectors", async () => {
    const [articles, structured, localGuidance, handoff] = await Promise.all([
      readArticleCatalog(root),
      readStructuredCatalog(root),
      readLocalGuidanceCatalog(root),
      readTranslationHandoff(root),
    ]);
    const expected = [
      ...articles.articles.filter(({ translation }) => translation !== "current").map((item) => ({
        kind: "article", id: item.id, title: item.title, path: item.path, state: item.translation,
      })),
      ...[...structured.records.values()].filter(({ translation }) => translation !== "current").map((item) => ({
        kind: item.kind, id: item.id, title: item.title, path: item.source.path, state: item.translation,
      })),
      ...[...localGuidance.details.values()].filter(({ translation }) => translation !== "current").map((item) => ({
        kind: "local-guidance-supplement", id: item.id, title: item.value.title, path: item.source.path, state: item.translation,
      })),
    ].sort((a, b) => a.kind.localeCompare(b.kind, "en") || a.id.localeCompare(b.id, "en"));
    expect(handoff.items.map(({ kind, id, title, path, state }) => ({ kind, id, title, path, state })))
      .toEqual(expected);
    expect(handoff.complete).toBe(articles.failures.length === 0 && structured.failures.length === 0 && localGuidance.failures.length === 0);
    expect(handoff.failures).toHaveLength(articles.failures.length + structured.failures.length + localGuidance.failures.length);
    for (const item of handoff.items.filter(({ kind }) => kind !== "article")) {
      expect(item.sourceRevision).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(handoff.exportText).toContain(`Items needing translation: ${expected.length}`);
  }, 20_000);
});
