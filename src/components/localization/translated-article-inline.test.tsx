import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import { currentArticleTranslations, readCanonicalArticleSources } from "@/lib/content/content-bundle";
import { TranslatedArticleBody } from "./localized-article";

describe("translated article shared inline grammar", () => {
  it("renders nested emphasis and formatted link labels", () => {
    const { container } = render(<TranslatedArticleBody markdown={"**Bold *inside*** and [**Label** with _note_](https://example.com/a_(b))"} />);
    expect(container.querySelector("strong em")).toHaveTextContent("inside");
    const link = screen.getByRole("link", { name: "Label with note" });
    expect(link).toHaveAttribute("href", "https://example.com/a_(b)");
    expect(link.querySelector("strong")).toHaveTextContent("Label");
    expect(link.querySelector("em")).toHaveTextContent("note");
  });

  it("decodes punctuation escapes and supports fragment links", () => {
    const { container } = render(<TranslatedArticleBody markdown={String.raw`\*literal\* [section](#target) [path](/a\(b\))`} />);
    expect(container.textContent).toBe("*literal* section path");
    expect(container.querySelector("em")).toBeNull();
    expect(screen.getByRole("link", { name: "section" })).toHaveAttribute("href", "#target");
    expect(screen.getByRole("link", { name: "path" })).toHaveAttribute("href", "/a(b)");
  });

  it("keeps code contents inert", () => {
    const { container } = render(<TranslatedArticleBody markdown={"``**literal** `value` [link](/target)``"} />);
    expect(container.querySelector("code")).toHaveTextContent("**literal** `value` [link](/target)");
    expect(container.querySelector("strong, a")).toBeNull();
  });

  it("applies the grammar to headings, quotes and both list kinds", () => {
    const { container } = render(<TranslatedArticleBody markdown={"## *Heading*\n\n> __Quote__\n\n- `item`\n\n1. [**Label**](/target)"} />);
    expect(container.querySelector("h2 em")).toHaveTextContent("Heading");
    expect(container.querySelector("blockquote strong")).toHaveTextContent("Quote");
    expect(container.querySelector("ul li code")).toHaveTextContent("item");
    expect(container.querySelector("ol li a strong")).toHaveTextContent("Label");
  });

  it("renders unsupported spans as visible raw text without HTML, scripts or unsafe links", () => {
    const source = 'Form [ ] <script>bad()</script> {expression} [unsafe](//example.com) [unsafe](javascript:bad) **unclosed';
    const { container } = render(<TranslatedArticleBody markdown={source} />);
    expect(container.textContent).toBe(source);
    expect(container.querySelector("script, a, strong")).toBeNull();
  });

  it("propagates the shared parser's input and depth limits", () => {
    expect(() => renderToStaticMarkup(<TranslatedArticleBody markdown={"x".repeat(200_001)} />)).toThrow("exceeds 200000");
    expect(() => renderToStaticMarkup(<TranslatedArticleBody markdown={"**a ".repeat(33)} />)).toThrow("nesting exceeds 32");
  });

  it("renders every current English/Japanese portable text unit with the parser's text, links and semantic tags", async () => {
    const canonical = await readCanonicalArticleSources(resolve("content/articles"));
    const translated = currentArticleTranslations(canonical);
    const corpora = [canonical.map(({ article }) => article), translated];
    let protectedUnits = 0;
    for (const articles of corpora) for (const article of articles) for (const block of article.blocks) {
      if (block.kind === "component") continue;
      for (const source of "items" in block ? block.items : [block.text]) {
        const counts = { strong: 0, emphasis: 0, code: 0, protected: 0 };
        const hrefs: string[] = [];
        function visible(nodes: readonly ArticleInline[]): string {
          return nodes.map((node) => {
            if (node.kind === "link") hrefs.push(node.href);
            if (node.kind in counts) counts[node.kind as keyof typeof counts]++;
            return "children" in node ? visible(node.children) : "text" in node ? node.text : node.raw;
          }).join("");
        }
        const text = visible(parseArticleInline(source));
        if (counts.protected) protectedUnits++;
        const element = document.createElement("div");
        // Prefix avoids treating a standalone text unit as a new block directive/list/heading.
        element.innerHTML = renderToStaticMarkup(<TranslatedArticleBody markdown={`probe ${source}`} />);
        expect(element.textContent?.slice(6), source).toBe(text);
        expect(Array.from(element.querySelectorAll("a"), (link) => link.getAttribute("href")), source).toEqual(hrefs);
        expect(element.querySelectorAll("strong").length, source).toBe(counts.strong);
        expect(element.querySelectorAll("em").length, source).toBe(counts.emphasis);
        expect(element.querySelectorAll("code").length, source).toBe(counts.code);
      }
    }
    // The current form blanks exercise the explicit raw-text path, not just the supported grammar.
    expect(protectedUnits).toBeGreaterThan(0);
  }, 30_000);
});
