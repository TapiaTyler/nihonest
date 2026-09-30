import { describe, expect, it } from "vitest";
import { parseArticleInline, type ArticleInline } from "./article-inline";

const flatten = (nodes: readonly ArticleInline[]): ArticleInline[] => nodes.flatMap((node) =>
  "children" in node ? [node, ...flatten(node.children)] : [node]);
const text = (nodes: readonly ArticleInline[]): string => nodes.map((node) =>
  "children" in node ? text(node.children) : "text" in node ? node.text : node.raw).join("");

describe("portable article inline grammar", () => {
  it.each(["*emphasis*", "_emphasis_", "**bold**", "__bold__"])("parses %s", (source) => {
    const node = parseArticleInline(source)[0]!;
    expect(node.kind).toBe(source.startsWith("**") || source.startsWith("__") ? "strong" : "emphasis");
    expect(text([node])).toBe(source.includes("bold") ? "bold" : "emphasis");
  });
  it.each(["**bold *nested***", "*emphasis **nested***", "***nested***", "__bold _nested___", "_emphasis __nested___"])(
    "supports deliberate emphasis nesting in %s", (source) => {
      const nodes = flatten(parseArticleInline(source));
      expect(nodes.some(({ kind }) => kind === "strong")).toBe(true);
      expect(nodes.some(({ kind }) => kind === "emphasis")).toBe(true);
      expect(nodes.some(({ kind }) => kind === "protected")).toBe(false);
    });
  it("preserves raw spelling and offsets while decoding escaped punctuation for display", () => {
    const source = String.raw`😀 \ \*literal\*`;
    for (const node of flatten(parseArticleInline(source))) expect(node.raw).toBe(source.slice(node.start, node.end));
    const escaped = String.raw`\*literal\*`;
    expect(parseArticleInline(escaped).map(({ raw }) => raw).join("")).toBe(escaped);
    expect(text(parseArticleInline(escaped))).toBe("*literal*");
    expect(text(parseArticleInline(String.raw`\[literal\]`))).toContain("literal");
  });
  it("keeps intraword underscores, quotes and ordinary comparison text literal", () => {
    const source = 'one_word_two “quoted” 2 > 1';
    expect(parseArticleInline(source)).toEqual([{ kind: "text", raw: source, start: 0, end: source.length, text: source }]);
  });
  it("keeps markup inert in variable-length code spans", () => {
    const source = '``**literal** `value` [x](/x)``';
    const nodes = parseArticleInline(source);
    expect(nodes).toEqual([{ kind: "code", raw: source, start: 0, end: source.length,
      text: '**literal** `value` [x](/x)' }]);
  });
  it("supports formatted link labels, balanced destination parentheses and fragments", () => {
    const nodes = parseArticleInline('[**Label** and *note*](https://example.com/a_(b)) [section](#target)');
    const links = nodes.filter((node) => node.kind === "link");
    expect(links.map((node) => node.href)).toEqual(["https://example.com/a_(b)", "#target"]);
    expect(flatten(links).map(({ kind }) => kind)).toContain("strong");
    expect(flatten(links).map(({ kind }) => kind)).toContain("emphasis");
  });
  it("preserves the existing escaped link-opening convention and escaped destination parentheses", () => {
    const source = String.raw`[在留資格]\(/glossary/zairyu-shikaku)`;
    const nodes = parseArticleInline(source);
    expect(nodes[0]).toMatchObject({ kind: "link", href: "/glossary/zairyu-shikaku", raw: source });
    expect(parseArticleInline(String.raw`[label](/a\(b\))`)[0]).toMatchObject({ kind: "link", href: "/a(b)" });
  });
  it("treats bracket characters inside a code label as code rather than link delimiters", () => {
    expect(parseArticleInline('[`value]` and **label**](/path)')[0]).toMatchObject({ kind: "link", href: "/path",
      children: [{ kind: "code", text: "value]" }, { kind: "text", text: " and " }, { kind: "strong" }] });
  });
  it.each(["![image](/x)", "[reference][id]", "<Widget />", "{expression}", "<https://example.com>", "**unclosed", "`unclosed",
    "[label](javascript:alert(1))", "[label](//example.com)", "[label](https://)", '[label](/x "title")', "[label](/unclosed",
    "[outer [inner](/inside)](/outside)", "****unsupported****"])("protects unsupported syntax %s without losing raw source", (source) => {
    const nodes = parseArticleInline(source);
    expect(flatten(nodes).some(({ kind }) => kind === "protected")).toBe(true);
    expect(nodes.map(({ raw }) => raw).join("")).toBe(source);
  });
  it("returns plain serializable nodes and fails loudly for oversized input", () => {
    const nodes = parseArticleInline('**[日本](/articles/japan)** and `code`');
    expect(JSON.parse(JSON.stringify(nodes))).toEqual(nodes);
    expect(() => parseArticleInline("x".repeat(200_001))).toThrow("exceeds");
  });
  it.each(["_one_word_", "_one_word_two_", "__one__word__", "_日本_語_", "_𠮷_野_", "_𠮷野_𠮷野_"])(
    "keeps intraword underscores inside outer formatting for %s", (source) => {
      const nodes = parseArticleInline(source);
      expect(nodes).toHaveLength(1);
      expect(nodes[0]!.raw).toBe(source);
      expect(nodes[0]!.kind).toBe(source.startsWith("__") ? "strong" : "emphasis");
      const count = source.startsWith("__") ? 2 : 1;
      expect(text(nodes)).toBe(source.slice(count, -count));
      expect(flatten(nodes).some(({ kind }) => kind === "protected")).toBe(false);
    });
  it.each(["**value****", "_value____", "***value*****"])("protects excessive closing runs in %s", (source) => {
    const nodes = parseArticleInline(source);
    expect(nodes.map(({ raw }) => raw).join("")).toBe(source);
    expect(nodes[0]!.kind).toBe("protected");
  });
  it.each(["<", "{"])("protects repeated unclosed %s syntax in one span", (character) => {
    const source = character.repeat(10_000);
    expect(parseArticleInline(source)).toEqual([{ kind: "protected", raw: source, start: 0, end: source.length,
      reason: "Unsupported HTML, autolink or MDX expression" }]);
  });
});
