import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { articleComponentTableSchema, validateArticleComponentTable, type ArticleComponentTable } from "@/domain/article/article-component-tables";
import { readCanonicalArticleSources } from "./content-bundle";
import { taxResidenceScopeComponent, trainingRouteComparisonComponent } from "@/data/article-components";
import { articleComponentEnglishFixture } from "./article-component-english.fixture";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";

let tables: ArticleComponentTable[];
let slugs: string[];
beforeAll(async () => {
  const canonical = [taxResidenceScopeComponent, trainingRouteComparisonComponent];
  tables = canonical.map((component) => articleComponentTableSchema.parse(component));
  expect(tables).toEqual(canonical);
  for (const component of tables) {
    const fixture = articleComponentEnglishFixture.find(({ kind }) => kind === component.kind)!;
    expect(translationSourceFields["article-component"](component)).toEqual(translationSourceFields["article-component"](fixture));
  }
  slugs = (await readCanonicalArticleSources(resolve("content/articles"))).map(({ article }) => article.metadata.slug);
});

describe("Stage-C English-only v2 component table contracts", () => {
  it("accepts canonical tax/training copy and links without changing serialized evidence", () => {
    const before = JSON.stringify(tables);
    for (const table of tables) expect(validateArticleComponentTable(table, slugs)).toEqual(table);
    expect(JSON.stringify(tables)).toBe(before);
    expect(JSON.parse(JSON.stringify(tables))).toEqual(tables);
  });
  it("preserves required empty and nonempty training suffixes", () => {
    const training = tables.find((table) => table.kind === "training-route-comparison")!;
    expect(training.rows.some(({ cells }) => cells[2] === "")).toBe(true);
    expect(training.rows.some(({ cells }) => cells[2].length > 0)).toBe(true);
    const copy = structuredClone(training);
    copy.rows[0]!.cells.pop();
    expect(() => articleComponentTableSchema.parse(copy)).toThrow();
  });
  it.each(["caption", "headers", "row", "locale", "id", "unknown", "duplicate", "version"])(
    "rejects incomplete or ambiguous %s in both table contracts", (mode) => {
      for (const table of tables) {
        const copy = JSON.parse(JSON.stringify(table));
        if (mode === "caption") copy.caption = " ";
        if (mode === "headers") copy.headers.pop();
        if (mode === "row") copy.rows[0].cells[0] = "";
        if (mode === "locale") copy.rows[0].ja = [...copy.rows[0].cells];
        if (mode === "id") copy.rows[0].id = "bad id";
        if (mode === "unknown") copy.rows[0].approved = true;
        if (mode === "duplicate") copy.rows.push(copy.rows[0]);
        if (mode === "version") copy.schemaVersion = 1;
        expect(() => articleComponentTableSchema.parse(copy)).toThrow();
      }
    });
  it.each(["/articles/unknown-article", "https://example.com", "/articles/../account", "/articles/student?route=x"])(
    "rejects invalid training target %s", (href) => {
      const copy = structuredClone(tables.find((table) => table.kind === "training-route-comparison")!);
      copy.rows[0]!.href = href;
      expect(() => validateArticleComponentTable(copy, slugs)).toThrow();
    });
  it("resolves hrefs by slug rather than assuming slug equals article ID", () => {
    const copy = structuredClone(tables.find((table) => table.kind === "training-route-comparison")!);
    copy.rows = [copy.rows[0]!];
    copy.rows[0]!.href = "/articles/public-route-slug";
    expect(validateArticleComponentTable(copy, ["public-route-slug"])).toEqual(copy);
    expect(() => validateArticleComponentTable(copy, ["different-record-id"])).toThrow("unknown article slug");
  });
});
