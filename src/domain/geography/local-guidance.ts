import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const geographyTypeSchema = z.enum([
  "prefecture",
  "metropolis",
  "special-ward",
  "designated-city",
]);

export const supportedGeographySchema = z.object({
  id: stableIdSchema,
  name: z.string().min(1),
  type: geographyTypeSchema,
  parentId: stableIdSchema.optional(),
  aliases: z.array(z.string().min(1)).default([]),
  selectable: z.boolean().default(false),
});

export const localGuidanceSupplementSchema = z.object({
  id: stableIdSchema,
  articleId: stableIdSchema,
  geographyId: stableIdSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  applicability: z.string().min(1),
  responsibleBody: z.string().min(1),
  receivingOffice: z.string().min(1).optional(),
  actions: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1),
  sourceIds: z.array(stableIdSchema).min(1),
  sourceFormatNote: z.string().min(1).optional(),
  lastCheckedAt: z.iso.date(),
  status: z.literal("needs-review"),
});

export type SupportedGeography = z.infer<typeof supportedGeographySchema>;
export type LocalGuidanceSupplement = z.infer<typeof localGuidanceSupplementSchema>;

export function validateLocalGuidanceCollection(
  geographies: readonly SupportedGeography[],
  supplements: readonly LocalGuidanceSupplement[],
  articleIds: readonly string[],
  sourceIds: readonly string[],
): void {
  const geographyIds = new Set(geographies.map(({ id }) => id));
  if (geographyIds.size !== geographies.length) throw new Error("Local guidance has duplicate geography IDs.");

  for (const geography of geographies) {
    if (geography.parentId && (!geographyIds.has(geography.parentId) || geography.parentId === geography.id)) {
      throw new Error(`Geography "${geography.id}" has an invalid parent.`);
    }
  }

  const knownArticles = new Set(articleIds);
  const knownSources = new Set(sourceIds);
  const supplementIds = new Set<string>();
  const articleGeographies = new Set<string>();

  for (const supplement of supplements) {
    if (supplementIds.has(supplement.id)) throw new Error(`Duplicate local supplement "${supplement.id}".`);
    supplementIds.add(supplement.id);
    const articleGeography = `${supplement.articleId}:${supplement.geographyId}`;
    if (articleGeographies.has(articleGeography)) throw new Error(`Duplicate local supplement for "${articleGeography}".`);
    articleGeographies.add(articleGeography);
    if (!knownArticles.has(supplement.articleId)) throw new Error(`Local supplement "${supplement.id}" references an unknown article.`);
    if (!geographyIds.has(supplement.geographyId)) throw new Error(`Local supplement "${supplement.id}" references an unknown geography.`);
    for (const sourceId of supplement.sourceIds) {
      if (!knownSources.has(sourceId)) throw new Error(`Local supplement "${supplement.id}" references unknown source "${sourceId}".`);
    }
  }
}
