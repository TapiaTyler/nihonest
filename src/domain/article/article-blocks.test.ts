import { describe, expect, it } from "vitest";
import { articleBlockSchema, parseArticleMarkdown } from "./article-blocks";
import { splitArticleSource, toPortableArticleMarkdown } from "./article-source";

describe("portable article blocks", () => {
  it("parses the supported Markdown structures", () => {
    const blocks = parseArticleMarkdown("## 見出し\n\n[在留資格](/glossary/zairyu-shikaku)の本文です。\n続きです。\n\n- 項目\n- 次\n\n1. 一\n2. 二\n\n> **注意：** 確認\n> してください。\n\n### 小見出し");
    expect(blocks).toEqual([
      { kind: "heading", level: 2, text: "見出し" },
      { kind: "paragraph", text: "[在留資格](/glossary/zairyu-shikaku)の本文です。 続きです。" },
      { kind: "unordered-list", items: ["項目", "次"] },
      { kind: "ordered-list", items: ["一", "二"] },
      { kind: "blockquote", text: "**注意：** 確認 してください。" },
      { kind: "heading", level: 3, text: "小見出し" },
    ]);
    for (const block of blocks) expect(articleBlockSchema.parse(block)).toEqual(block);
  });

  it("turns known directives into component blocks and keeps unknown ones as text", () => {
    expect(parseArticleMarkdown("前\n\n:::tax-residence-scope\n\n:::not-a-component")).toEqual([
      { kind: "paragraph", text: "前" },
      { kind: "component", component: "tax-residence-scope" },
      { kind: "paragraph", text: ":::not-a-component" },
    ]);
  });
});

describe("article MDX source", () => {
  const source = `export const metadata = {\n  id: "sample",\n  title: "A { brace } title",\n};\n\n## Heading\n\n<TaxResidenceScopeTable />\n\nText with *zairyū shikaku*.\n`;

  it("splits the metadata literal from the body", () => {
    const { metadataLiteral, body } = splitArticleSource(source);
    expect(metadataLiteral).toBe(`{\n  id: "sample",\n  title: "A { brace } title",\n}`);
    expect(body.startsWith("\n## Heading")).toBe(true);
  });

  it("converts shared components to directives", () => {
    expect(toPortableArticleMarkdown(splitArticleSource(source).body)).toBe("## Heading\n\n:::tax-residence-scope\n\nText with *zairyū shikaku*.");
  });

  it("rejects JSX and expressions a native client could not render", () => {
    expect(() => toPortableArticleMarkdown("<UnknownWidget />")).toThrow(/unknown article component/);
    expect(() => toPortableArticleMarkdown("<div>raw</div>")).toThrow(/unsupported MDX syntax/);
    expect(() => toPortableArticleMarkdown("{someExpression}")).toThrow(/unsupported MDX syntax/);
  });
});
