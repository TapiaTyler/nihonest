import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import { articleComponentBlocks } from "@/domain/article/article-blocks";
import { readCanonicalArticleSources, currentArticleTranslations } from "./content-bundle";

describe("real English/Japanese article inline fixtures", () => {
  it("preserves every portable block's raw source and spans without changing canonical or translated evidence", async () => {
    const canonical = await readCanonicalArticleSources(resolve("content/articles"));
    const translated = currentArticleTranslations(canonical);
    const corpora = [canonical.map(({ article }) => article), translated];
    const before = JSON.stringify(corpora);
    const kinds = new Set<string>();
    const visit = (source: string, nodes: readonly ArticleInline[]) => {
      for (const node of nodes) {
        expect(node.raw).toBe(source.slice(node.start, node.end));
        expect(node.end).toBeGreaterThan(node.start);
        kinds.add(node.kind);
        if ("children" in node) visit(source, node.children);
        if (node.kind === "protected") expect(node.reason).toBeTruthy();
      }
    };
    const blockKinds = new Set<string>();
    for (const articles of corpora) for (const article of articles) for (const block of article.blocks) {
      blockKinds.add(block.kind);
      if (block.kind === "component") { expect(block.component in articleComponentBlocks).toBe(true); continue; }
      for (const source of "items" in block ? block.items : [block.text]) {
        const nodes = parseArticleInline(source);
        expect(nodes.map(({ raw }) => raw).join("")).toBe(source);
        visit(source, nodes);
        expect(JSON.parse(JSON.stringify(nodes))).toEqual(nodes);
      }
    }
    expect([...kinds]).toEqual(expect.arrayContaining(["text", "strong", "emphasis", "link", "protected"]));
    expect([...blockKinds]).toEqual(expect.arrayContaining(["heading", "paragraph", "blockquote", "unordered-list", "ordered-list", "component"]));
    expect(JSON.stringify(corpora)).toBe(before);
  });
});
