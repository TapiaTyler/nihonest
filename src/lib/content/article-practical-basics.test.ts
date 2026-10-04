import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";
import { articlePracticalBasicsSchema, validateArticlePracticalBasics, type ArticlePracticalBasics } from "@/domain/article/article-practical-basics";
import { readCanonicalArticleSources } from "./content-bundle";
import { japanPracticalBasicsComponent } from "@/data/article-components";

/** Read-only JSX literal inspection; never evaluates JSX, imports the renderer or writes extracted copy. */
async function readFixture() {
  const file = resolve("src/components/content/japan-geography-reference.tsx");
  const source = await readFile(file, "utf8");
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let data: ts.ObjectLiteralExpression | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "practicalBasics"
      && node.initializer && ts.isAsExpression(node.initializer) && ts.isObjectLiteralExpression(node.initializer.expression)) {
      data = node.initializer.expression;
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  if (!data) throw new Error("Expected literal practical-basics owner.");
  const readLocale = (locale: string) => {
    const property = data!.properties.find((node) => ts.isPropertyAssignment(node) && node.name.getText(tree) === locale);
    if (!property || !ts.isPropertyAssignment(property) || !ts.isArrayLiteralExpression(property.initializer)) {
      throw new Error("Expected literal locale paragraph array.");
    }
    return property.initializer.elements.map((paragraph) => {
      if (!ts.isJsxFragment(paragraph)) throw new Error("Expected a literal JSX paragraph.");
      return paragraph.children.map((child) => {
        if (ts.isJsxText(child)) return { kind: "text" as const, text: child.text };
        if (!ts.isJsxElement(child)) throw new Error("Unsupported fixture expression; update for the new canonical owner.");
        const tag = child.openingElement.tagName.getText(tree);
        const text = child.children.map((node) => {
          if (!ts.isJsxText(node)) throw new Error("Expected a literal label.");
          return node.text;
        }).join("");
        if (tag === "strong") return { kind: "strong" as const, text };
        if (tag !== "Link") throw new Error("Unsupported fixture element.");
        const href = child.openingElement.attributes.properties.find((attribute) => ts.isJsxAttribute(attribute)
          && attribute.name.getText(tree) === "href");
        if (!href || !ts.isJsxAttribute(href) || !href.initializer || !ts.isStringLiteral(href.initializer)) {
          throw new Error("Expected a literal article href.");
        }
        return { kind: "link" as const, text, href: href.initializer.text };
      });
    });
  };
  const en = readLocale("en");
  return { schemaVersion: 2, kind: "japan-practical-basics", paragraphs: en.map((nodes) => ({
    id: nodes[0]!.text.replace(/:$/, "").toLowerCase(),
    text: nodes.map((node) => node.kind === "strong" ? `**${node.text}**`
      : node.kind === "link" ? `[${node.text}](${node.href})` : node.text).join(""),
  })) };
}

let content: ArticlePracticalBasics;
let slugs: string[];
beforeAll(async () => {
  const fixture = await readFixture();
  content = articlePracticalBasicsSchema.parse(fixture);
  expect(content).toEqual(fixture);
  expect(content).toEqual(japanPracticalBasicsComponent);
  slugs = (await readCanonicalArticleSources(resolve("content/articles"))).map(({ article }) => article.metadata.slug);
});

describe("Stage-C English-only v2 practical basics", () => {
  it("preserves current English labels, spacing, paragraph order and linked targets from JSX", () => {
    expect(validateArticlePracticalBasics(content, slugs)).toEqual(content);
    expect(content.paragraphs.map(({ id }) => id)).toEqual(["time", "money", "measurements", "emergencies"]);
    expect(JSON.parse(JSON.stringify(content))).toEqual(content);
  });

  it.each(["version", "locale", "id", "duplicate", "unknown"])("rejects ambiguous or old %s records", (mode) => {
    const copy = JSON.parse(JSON.stringify(content));
    if (mode === "version") copy.schemaVersion = 1;
    if (mode === "locale") copy.paragraphs[0].ja = "Japanese belongs to artifacts";
    if (mode === "id") copy.paragraphs[0].id = "bad id";
    if (mode === "duplicate") copy.paragraphs.push(copy.paragraphs[0]);
    if (mode === "unknown") copy.approved = true;
    expect(() => articlePracticalBasicsSchema.parse(copy)).toThrow();
  });

  it.each([
    "Plain body without a label", "**Label:**", "**Label:**   ", "** ** body",
    "**Label:** <script>unsafe</script>", "**Label:** **unclosed", "**Label:** [ ]",
    "**Label:** [outside](https://example.com)", "**Label:** [outside](//example.com)",
    "**Label:** [outside](/account)",
  ])("rejects invalid body/label/grammar/target %j", (text) => {
    const copy = structuredClone(content);
    copy.paragraphs[0]!.text = text;
    expect(() => articlePracticalBasicsSchema.parse(copy)).toThrow();
  });

  it("validates links by canonical slug and preserves inline source without trimming", () => {
    const copy = structuredClone(content);
    copy.paragraphs = [{ id: "fixture", text: "**Label:**  [visible label](/articles/public-slug)  " }];
    expect(validateArticlePracticalBasics(copy, ["public-slug"])).toEqual(copy);
    expect(() => validateArticlePracticalBasics(copy, ["different-record-id"])).toThrow("unknown article slug");
  });
});
