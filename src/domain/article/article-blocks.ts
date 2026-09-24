import { z } from "zod";

/**
 * The portable article body model shared by the website, the offline content bundle, and future native clients.
 * Bodies are a deliberately small Markdown subset: paragraphs, H2/H3 headings, blockquotes, flat ordered and
 * unordered lists, and one directive line (`:::name`) per shared component. Inline text inside blocks stays
 * Markdown (`**bold**`, `*italic*`, `[label](/path)` links); each renderer interprets it.
 */

/** Shared components, keyed by block kind. The MDX component name is used when converting English sources. */
export const articleComponentBlocks = {
  "residence-application-fees": "ResidenceApplicationFeeSection",
  "tax-residence-scope": "TaxResidenceScopeTable",
  "training-route-comparison": "TrainingRouteComparisonTable",
  "japan-prefecture-regions": "JapanPrefectureRegionGrid",
  "japan-practical-basics": "JapanPracticalBasics",
} as const;

export type ArticleComponentBlockKind = keyof typeof articleComponentBlocks;

const componentBlockKinds = Object.keys(articleComponentBlocks) as [ArticleComponentBlockKind, ...ArticleComponentBlockKind[]];

export const articleBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("heading"), level: z.union([z.literal(2), z.literal(3)]), text: z.string().min(1) }),
  z.object({ kind: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({ kind: z.literal("blockquote"), text: z.string().min(1) }),
  z.object({ kind: z.literal("unordered-list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ kind: z.literal("ordered-list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ kind: z.literal("component"), component: z.enum(componentBlockKinds) }),
]);

export type ArticleBlock = z.infer<typeof articleBlockSchema>;

const directivePattern = /^:::([a-z0-9-]+)$/;
const unorderedItemPattern = /^[-*]\s+(.+)$/;
const orderedItemPattern = /^\d+[.)]\s+(.+)$/;

function isComponentBlockKind(name: string): name is ArticleComponentBlockKind {
  return Object.hasOwn(articleComponentBlocks, name);
}

/** Parses a portable article body. Unknown directives are kept as paragraph text rather than dropped. */
export function parseArticleMarkdown(markdown: string): readonly ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  }

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }
    const directive = line.match(directivePattern)?.[1];
    if (directive && isComponentBlockKind(directive)) {
      flushParagraph();
      blocks.push({ kind: "component", component: directive });
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", level: heading[1].length as 2 | 3, text: heading[2] });
      index += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push({ kind: "blockquote", text: quoteLines.join(" ") });
      continue;
    }
    const itemPattern = unorderedItemPattern.test(line) ? unorderedItemPattern : orderedItemPattern.test(line) ? orderedItemPattern : undefined;
    if (itemPattern) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].trim().match(itemPattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ kind: itemPattern === unorderedItemPattern ? "unordered-list" : "ordered-list", items });
      continue;
    }
    paragraph.push(line);
    index += 1;
  }

  flushParagraph();
  return blocks;
}
