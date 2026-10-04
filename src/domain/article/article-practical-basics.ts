import { z } from "zod";
import { parseArticleInline, type ArticleInline } from "./article-inline";

/** Link order is traversal order, shared by canonical validation and future translation parity checks. */
export function practicalBasicsLinkTargets(nodes: readonly ArticleInline[]): string[] {
  return nodes.flatMap((node) => node.kind === "link"
    ? [node.href, ...practicalBasicsLinkTargets(node.children)]
    : "children" in node ? practicalBasicsLinkTargets(node.children) : []);
}

function visibleText(nodes: readonly ArticleInline[]): string {
  return nodes.map((node) => "children" in node ? visibleText(node.children)
    : node.kind === "protected" ? "" : node.text).join("");
}

const paragraphText = z.string().min(1).max(200_000).superRefine((value, context) => {
  let nodes: readonly ArticleInline[];
  try { nodes = parseArticleInline(value); }
  catch {
    context.addIssue({ code: "custom", message: "Practical paragraph exceeds the inline grammar limits." });
    return;
  }
  const protectedSpan = (items: readonly ArticleInline[]): boolean => items.some((node) => node.kind === "protected"
    || ("children" in node && protectedSpan(node.children)));
  if (protectedSpan(nodes)) {
    context.addIssue({ code: "custom", message: "Practical paragraph cannot contain protected markup." });
  }
  if (nodes[0]?.kind !== "strong" || !visibleText(nodes[0].children).trim()
    || !visibleText(nodes.slice(1)).trim()) {
    context.addIssue({ code: "custom", message: "Practical paragraph requires a leading strong label and body text." });
  }
  if (practicalBasicsLinkTargets(nodes).some((href) => !/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(href))) {
    context.addIssue({ code: "custom", message: "Practical links must be canonical article paths." });
  }
});

/** English-only v2 paragraphs use N2 inline grammar; whitespace is preserved without trimming/normalization. */
export const articlePracticalBasicsSchema = z.object({
  schemaVersion: z.literal(2), kind: z.literal("japan-practical-basics"),
  paragraphs: z.array(z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), text: paragraphText,
  }).strict()).min(1),
}).strict().superRefine((content, context) => {
  if (new Set(content.paragraphs.map(({ id }) => id)).size !== content.paragraphs.length) {
    context.addIssue({ code: "custom", message: "Practical paragraph IDs must be unique." });
  }
});

export type ArticlePracticalBasics = z.infer<typeof articlePracticalBasicsSchema>;

/** Targets resolve by article slug. Translation link equality is an artifact/selector responsibility. */
export function validateArticlePracticalBasics(input: unknown, articleSlugs: readonly string[]): ArticlePracticalBasics {
  const content = articlePracticalBasicsSchema.parse(input);
  const slugs = new Set(articleSlugs);
  for (const paragraph of content.paragraphs) for (const href of practicalBasicsLinkTargets(parseArticleInline(paragraph.text))) {
    if (!slugs.has(href.slice("/articles/".length))) {
      throw new Error(`Practical paragraph "${paragraph.id}" references an unknown article slug.`);
    }
  }
  return content;
}
