import { parseArticleMarkdown } from "./article-blocks";
import { parseArticleInline, type ArticleInline } from "./article-inline";

/**
 * The headings of an article body, used for the "On this page" outline and as anchor targets. The outline is built
 * from the portable body model so English (MDX) and Japanese (translated Markdown) share one definition, and each
 * rendered heading derives its `id` from the same text with `headingId`.
 */
export type ArticleOutlineEntry = Readonly<{ level: 2 | 3; id: string; text: string }>;

function plainText(nodes: readonly ArticleInline[]): string {
  return nodes.map((node) => {
    if (node.kind === "text" || node.kind === "code") return node.text;
    if (node.kind === "protected") return node.raw;
    return "children" in node ? plainText(node.children) : "";
  }).join("");
}

/** The visible text of a heading written in the article inline Markdown subset. */
export function headingPlainText(markdown: string): string {
  return plainText(parseArticleInline(markdown)).replace(/\s+/g, " ").trim();
}

/**
 * A stable fragment for a heading's visible text. Letters and numbers from any script are kept so Japanese
 * headings produce readable, unique anchors.
 */
export function headingId(text: string): string {
  const slug = text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
  return slug || "section";
}

export function articleOutline(portableMarkdown: string): readonly ArticleOutlineEntry[] {
  return parseArticleMarkdown(portableMarkdown).flatMap((block) => {
    if (block.kind !== "heading") return [];
    const text = headingPlainText(block.text);
    return [{ level: block.level, id: headingId(text), text }];
  });
}
