import { z } from "zod";

const text = z.string().min(1);
const label = text.refine((value) => value.trim().length > 0, "Rich-text label must be nonempty.");
const articleHref = z.string().regex(/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** Exact literal content, not Markdown or JSX. Consumers render strings as text, never as HTML. */
export const practicalBasicsSegmentSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text }).strict(),
  z.object({ kind: z.literal("strong"), text: label }).strict(),
  z.object({ kind: z.literal("link"), text: label, href: articleHref }).strict(),
]);
const segments = practicalBasicsSegmentSchema.array().min(2).superRefine((nodes, context) => {
  if (nodes[0]?.kind !== "strong" || !nodes.some((node) => node.kind !== "strong" && node.text.trim().length > 0)) {
    context.addIssue({ code: "custom", message: "Practical paragraph requires a leading strong label and body text." });
  }
});

export const articlePracticalBasicsSchema = z.object({
  schemaVersion: z.literal(1), kind: z.literal("japan-practical-basics"),
  paragraphs: z.array(z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), en: segments, ja: segments,
  }).strict()).min(1),
}).strict().superRefine((content, context) => {
  if (new Set(content.paragraphs.map(({ id }) => id)).size !== content.paragraphs.length) {
    context.addIssue({ code: "custom", message: "Practical paragraph IDs must be unique." });
  }
  for (const paragraph of content.paragraphs) {
    const targets = (nodes: typeof paragraph.en) => nodes.flatMap((node) => node.kind === "link" ? [node.href] : []);
    if (JSON.stringify(targets(paragraph.en)) !== JSON.stringify(targets(paragraph.ja))) {
      context.addIssue({ code: "custom", message: "Practical paragraph link targets and order must agree across locales." });
    }
  }
});

export type ArticlePracticalBasics = z.infer<typeof articlePracticalBasicsSchema>;

export function validateArticlePracticalBasics(input: unknown, articleSlugs: readonly string[]): ArticlePracticalBasics {
  const content = articlePracticalBasicsSchema.parse(input);
  const slugs = new Set(articleSlugs);
  for (const paragraph of content.paragraphs) for (const nodes of [paragraph.en, paragraph.ja]) for (const node of nodes) {
    if (node.kind === "link" && !slugs.has(node.href.slice("/articles/".length))) {
      throw new Error(`Practical paragraph "${paragraph.id}" references an unknown article slug.`);
    }
  }
  return content;
}
