import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";
import { articlePracticalBasicsSchema, validateArticlePracticalBasics, type ArticlePracticalBasics } from "@/domain/article/article-practical-basics";
import { readCanonicalArticleSources } from "./content-bundle";

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
  const ja = readLocale("ja");
  if (en.length !== ja.length) throw new Error("Locale paragraph counts must correspond.");
  const fixture = { schemaVersion: 1, kind: "japan-practical-basics", paragraphs: en.map((nodes, index) => ({
    // Proposed stable IDs derive from existing English labels; Stage-C owners must review their adoption.
    id: nodes[0]!.text.replace(/:$/, "").toLowerCase(), en: nodes, ja: ja[index],
  })) };
  return fixture;
}

let content: ArticlePracticalBasics;
let slugs: string[];
beforeAll(async () => {
  const fixture = await readFixture();
  content = articlePracticalBasicsSchema.parse(fixture);
  expect(content).toEqual(fixture);
  slugs = (await readCanonicalArticleSources(resolve("content/articles"))).map(({ article }) => article.metadata.slug);
});

describe("Stage-B practical-basics rich-text contract", () => {
  it("preserves literal paragraph/text/label/link order and wording in both locales", () => {
    const before = JSON.stringify(content);
    expect(validateArticlePracticalBasics(content, slugs)).toEqual(content);
    expect(JSON.stringify(content)).toBe(before);
    expect(JSON.parse(JSON.stringify(content))).toEqual(content);
    const emergency = content.paragraphs.find(({ en }) => en.some(({ kind }) => kind === "link"))!;
    for (const nodes of [emergency.en, emergency.ja]) {
      expect(nodes[0]!.kind).toBe("strong");
      expect(nodes.map(({ kind }) => kind)).toEqual(["strong", "text", "link", "text", "link", "text"]);
    }
  });
  it.each(["duplicate", "locale", "label", "body", "empty", "unknown", "target-order", "href"])(
    "rejects incomplete or ambiguous %s", (mode) => {
      const copy = JSON.parse(JSON.stringify(content));
      const first = copy.paragraphs[0];
      const emergency = copy.paragraphs.find((paragraph: { en: { kind: string }[] }) => paragraph.en.some(({ kind }) => kind === "link"));
      if (mode === "duplicate") copy.paragraphs.push(first);
      if (mode === "locale") delete first.ja;
      if (mode === "label") first.en[0].kind = "text";
      if (mode === "body") first.en = [first.en[0], { kind: "text", text: " " }];
      if (mode === "empty") first.en[0].text = "";
      if (mode === "unknown") first.en[0].approved = true;
      if (mode === "target-order") { const links = emergency.ja.filter((node: { kind: string }) => node.kind === "link");
        [links[0].href, links[1].href] = [links[1].href, links[0].href]; }
      if (mode === "href") emergency.en.find((node: { kind: string }) => node.kind === "link").href = "https://example.com";
      expect(() => articlePracticalBasicsSchema.parse(copy)).toThrow();
    });
  it("rejects matching cross-locale targets absent from the candidate article catalog", () => {
    const copy = structuredClone(content);
    for (const paragraph of copy.paragraphs) for (const nodes of [paragraph.en, paragraph.ja]) for (const node of nodes) {
      if (node.kind === "link") node.href = "/articles/unknown-article";
    }
    expect(() => validateArticlePracticalBasics(copy, slugs)).toThrow("unknown article slug");
  });
  it("resolves targets by slug and preserves leading text spaces without Markdown interpretation", () => {
    const copy = structuredClone(content);
    for (const paragraph of copy.paragraphs) for (const nodes of [paragraph.en, paragraph.ja]) for (const node of nodes) {
      if (node.kind === "link") node.href = "/articles/public-article-slug";
    }
    expect(validateArticlePracticalBasics(copy, ["public-article-slug"])).toEqual(copy);
    expect(() => validateArticlePracticalBasics(copy, ["different-article-id"])).toThrow();
    copy.paragraphs[0]!.en[1]!.text = "  **literal text** ";
    expect(articlePracticalBasicsSchema.parse(copy).paragraphs[0]!.en[1]!.text).toBe("  **literal text** ");
  });
});
