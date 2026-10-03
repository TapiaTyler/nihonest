import { z } from "zod";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
// Validate without trimming: spaces, punctuation and localized wording must survive extraction exactly.
const text = z.string().refine((value) => value.trim().length > 0, "Component text must be nonempty.");
const pair = z.tuple([text, text]);
const bilingualText = z.object({ en: text, ja: text }).strict();
const bilingualHeaders = z.object({ en: pair, ja: pair }).strict();
const taxRow = z.object({ id, en: pair, ja: pair }).strict();
const trainingCells = z.tuple([text, text, z.string()]);
const trainingRow = z.object({
  id, en: trainingCells, ja: trainingCells,
  href: z.string().regex(/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
}).strict();

/** Content contract only. Renderers retain table/caption/header semantics, styling and interaction. */
export const articleComponentTableSchema = z.discriminatedUnion("kind", [
  z.object({ schemaVersion: z.literal(1), kind: z.literal("tax-residence-scope"),
    caption: bilingualText, headers: bilingualHeaders, rows: taxRow.array().min(1) }).strict(),
  z.object({ schemaVersion: z.literal(1), kind: z.literal("training-route-comparison"),
    caption: bilingualText, headers: bilingualHeaders, rows: trainingRow.array().min(1) }).strict(),
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
