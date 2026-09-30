import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";
import { articleComponentTableSchema, validateArticleComponentTable, type ArticleComponentTable } from "@/domain/article/article-component-tables";
import { readCanonicalArticleSources } from "./content-bundle";

/** Test-only literal inspection: reads existing copy without executing JSX or producing new content files. */
function literal(node: ts.Node): unknown {
  if (ts.isAsExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((property) => {
    if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))) {
      throw new Error("Expected a literal component property.");
    }
    return [property.name.text, literal(property.initializer)];
  }));
  throw new Error("Expected literal component data; update the read-only fixture for a changed owner.");
}

async function readTableFixture(file: string, kind: ArticleComponentTable["kind"]) {
  const source = await readFile(resolve("src/components/content", file), "utf8");
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let rows: unknown;
  const chrome: { en: string; ja: string }[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "rows" && node.initializer) {
      rows = literal(node.initializer);
    }
    if (ts.isJsxElement(node)) {
      const tag = node.openingElement.tagName.getText(tree);
      const column = node.openingElement.attributes.properties.some((attribute) => ts.isJsxAttribute(attribute)
        && attribute.name.getText(tree) === "scope" && attribute.initializer && ts.isStringLiteral(attribute.initializer)
        && attribute.initializer.text === "col");
      if (tag === "caption" || (tag === "th" && column)) {
        const expression = node.children.find(ts.isJsxExpression)?.expression;
        if (!expression || !ts.isConditionalExpression(expression)) throw new Error("Expected bilingual table chrome.");
        const ja = literal(expression.whenTrue);
        const en = literal(expression.whenFalse);
        if (typeof ja !== "string" || typeof en !== "string") throw new Error("Expected literal bilingual text.");
        chrome.push({ en, ja });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  if (chrome.length !== 3) throw new Error("Expected one caption and two column headers.");
  return { schemaVersion: 1, kind, rows, caption: chrome[0],
    headers: { en: [chrome[1]!.en, chrome[2]!.en], ja: [chrome[1]!.ja, chrome[2]!.ja] } };
}

let tables: ArticleComponentTable[];
let slugs: string[];
beforeAll(async () => {
  const fixtures = await Promise.all([
    readTableFixture("tax-residence-scope-table.tsx", "tax-residence-scope"),
    readTableFixture("training-route-comparison-table.tsx", "training-route-comparison"),
  ]);
  tables = fixtures.map((fixture) => articleComponentTableSchema.parse(fixture));
  // Parsing must not rewrite wording, IDs, order, suffixes or bilingual chrome.
  expect(tables).toEqual(fixtures);
  slugs = (await readCanonicalArticleSources(resolve("content/articles"))).map(({ article }) => article.metadata.slug);
});

describe("Stage-B portable component table contracts", () => {
  it("accepts actual tax/training copy and links without changing serialized evidence", () => {
    const before = JSON.stringify(tables);
    for (const table of tables) expect(validateArticleComponentTable(table, slugs)).toEqual(table);
    expect(JSON.stringify(tables)).toBe(before);
    expect(JSON.parse(JSON.stringify(tables))).toEqual(tables);
  });
  it("preserves required empty and nonempty training suffixes", () => {
    const training = tables.find((table) => table.kind === "training-route-comparison")!;
    expect(training.rows.some(({ en, ja }) => en[2] === "" && ja[2] === "")).toBe(true);
    expect(training.rows.some(({ en, ja }) => en[2].length > 0 && ja[2].length > 0)).toBe(true);
    const copy = structuredClone(training);
    copy.rows[0]!.en.pop();
    expect(() => articleComponentTableSchema.parse(copy)).toThrow();
  });
  it.each(["caption", "headers", "row", "locale", "id", "unknown", "duplicate"])(
    "rejects incomplete or ambiguous %s in both table contracts", (mode) => {
      for (const table of tables) {
        const copy = JSON.parse(JSON.stringify(table));
        if (mode === "caption") copy.caption.en = " ";
        if (mode === "headers") copy.headers.ja.pop();
        if (mode === "row") copy.rows[0].en[0] = "";
        if (mode === "locale") delete copy.rows[0].ja;
        if (mode === "id") copy.rows[0].id = "bad id";
        if (mode === "unknown") copy.rows[0].approved = true;
        if (mode === "duplicate") copy.rows.push(copy.rows[0]);
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
