import { z } from "zod";
import type { OfficialSource } from "@/domain/source/source";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const RESIDENCE_STATUS_CATEGORY_IDS = [
  "work",
  "business",
  "study",
  "family",
  "designated",
  "visitor",
  "official",
  "unrestricted",
] as const;

export const residenceStatusCategorySchema = z.enum(RESIDENCE_STATUS_CATEGORY_IDS);

export const residenceStatusCategoryLabels: Record<(typeof RESIDENCE_STATUS_CATEGORY_IDS)[number], string> = {
  work: "Work",
  business: "Business and high-skill",
  study: "Study, culture, and training",
  family: "Family",
  designated: "Designated activities",
  visitor: "Visitor",
  official: "Diplomatic and official",
  unrestricted: "Status-based residence",
};

export const residenceStatusSchema = z.object({
  id: stableIdSchema,
  slug: stableIdSchema,
  englishName: z.string().min(1),
  japaneseName: z.string().min(1),
  japaneseKana: z.string().min(1),
  romaji: z.string().min(1),
  glossaryTermId: stableIdSchema,
  category: residenceStatusCategorySchema,
  summary: z.string().min(1).max(220),
  purpose: z.string().min(1),
  typicalActivities: z.array(z.string().min(1)).min(1),
  examples: z.array(z.string().min(1)).default([]),
  considerations: z.array(z.string().min(1)).min(1),
  sourceIds: z.array(stableIdSchema).min(1),
  relatedArticleIds: z.array(stableIdSchema).default([]),
  lastReviewedAt: z.iso.date(),
  status: z.enum(["draft", "verified", "needs-review", "archived"]),
});

export type ResidenceStatus = z.infer<typeof residenceStatusSchema>;
export type ResidenceStatusCategory = z.infer<typeof residenceStatusCategorySchema>;

export function validateResidenceStatusCollection(
  residenceStatuses: readonly ResidenceStatus[],
  sources: readonly OfficialSource[],
  articleIds: readonly string[] = [],
  glossaryTermIds: readonly string[] = [],
): void {
  const ids = new Set(residenceStatuses.map((status) => status.id));
  const slugs = new Set(residenceStatuses.map((status) => status.slug));
  const sourceIds = new Set(sources.map((source) => source.id));
  const knownArticleIds = new Set(articleIds);
  const knownGlossaryTermIds = new Set(glossaryTermIds);

  if (ids.size !== residenceStatuses.length) {
    throw new Error("Residence status IDs must be unique.");
  }

  if (slugs.size !== residenceStatuses.length) {
    throw new Error("Residence status slugs must be unique.");
  }

  for (const residenceStatus of residenceStatuses) {
    if (!knownGlossaryTermIds.has(residenceStatus.glossaryTermId)) {
      throw new Error(
        `Residence status \"${residenceStatus.id}\" references unknown glossary term \"${residenceStatus.glossaryTermId}\".`,
      );
    }
    for (const sourceId of residenceStatus.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(
          `Residence status \"${residenceStatus.id}\" references unknown source \"${sourceId}\".`,
        );
      }
    }

    for (const articleId of residenceStatus.relatedArticleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(
          `Residence status \"${residenceStatus.id}\" references unknown article \"${articleId}\".`,
        );
      }
    }
  }
}
