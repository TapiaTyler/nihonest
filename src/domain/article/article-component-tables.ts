import { z } from "zod";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
// Validate without trimming: canonical wording, suffix spacing and punctuation must survive extraction exactly.
const text = z.string().refine((value) => value.trim().length > 0, "Component text must be nonempty.");
const pair = z.tuple([text, text]);
const taxRow = z.object({ id, cells: pair }).strict();
const trainingCells = z.tuple([text, text, z.string()]);
const trainingRow = z.object({
  id, cells: trainingCells,
  href: z.string().regex(/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
}).strict();

/** English-only v2 canonical content. Japanese lives in revision-bound artifacts, never this data. */
export const articleComponentTableSchema = z.discriminatedUnion("kind", [
  z.object({ schemaVersion: z.literal(2), kind: z.literal("tax-residence-scope"),
    caption: text, headers: pair, rows: taxRow.array().min(1) }).strict(),
  z.object({ schemaVersion: z.literal(2), kind: z.literal("training-route-comparison"),
    caption: text, headers: pair, rows: trainingRow.array().min(1) }).strict(),
]).superRefine((table, context) => {
  if (new Set(table.rows.map(({ id }) => id)).size !== table.rows.length) {
    context.addIssue({ code: "custom", message: "Component row IDs must be unique." });
  }
});

export type ArticleComponentTable = z.infer<typeof articleComponentTableSchema>;

/** Training hrefs resolve by canonical article slug, which may differ from the article ID. */
export function validateArticleComponentTable(input: unknown, articleSlugs: readonly string[]): ArticleComponentTable {
  const table = articleComponentTableSchema.parse(input);
  if (table.kind === "training-route-comparison") {
    const slugs = new Set(articleSlugs);
    for (const row of table.rows) {
      if (!slugs.has(row.href.slice("/articles/".length))) {
        throw new Error(`Component row "${row.id}" references an unknown article slug.`);
      }
    }
  }
  return table;
}
