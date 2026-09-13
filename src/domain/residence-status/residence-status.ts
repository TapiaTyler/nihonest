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

const structuredConditionSchema = z.object({
  type: z.enum([
    "activity",
    "education",
    "experience",
    "examination",
    "license",
    "language",
    "remuneration",
    "organization",
    "relationship",
    "program",
  ]),
  summary: z.string().min(1),
});

const qualificationPathwaySchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  allOf: z.array(structuredConditionSchema).default([]),
  anyOf: z.array(structuredConditionSchema).default([]),
  exceptions: z.array(z.string().min(1)).default([]),
  sourceIds: z.array(stableIdSchema).min(1),
}).superRefine((pathway, context) => {
  if (pathway.allOf.length === 0 && pathway.anyOf.length === 0) {
    context.addIssue({ code: "custom", path: ["allOf"], message: "A qualification pathway must contain at least one condition." });
  }
});

/**
 * A reviewed-facts presentation model, not an executable eligibility engine.
 * Branching structures preserve official alternatives without producing a yes/no result for an individual.
 */
export const structuredResidenceStatusGuidanceSchema = z.object({
  researchState: z.literal("draft-pilot"),
  routeKind: z.enum(["activity-based", "status-based", "individual-designation"]),
  routeKindLabel: z.string().min(1),
  periodsOfStay: z.array(z.object({
    label: z.string().min(1),
    duration: z.string().min(1),
    kind: z.enum(["fixed-options", "individually-designated", "unlimited"]),
    note: z.string().min(1).optional(),
    sourceIds: z.array(stableIdSchema).min(1),
  })).min(1),
  workAuthorization: z.object({
    mode: z.enum(["status-limited", "unrestricted", "not-authorized-by-default", "designation-specific"]),
    summary: z.string().min(1),
    outsideActivityNote: z.string().min(1),
  }),
  activityScope: z.object({
    included: z.array(z.string().min(1)).min(1),
    boundaries: z.array(z.string().min(1)).min(1),
  }),
  qualificationPathways: z.array(qualificationPathwaySchema),
  organizationConditions: z.array(z.string().min(1)),
  renewal: z.object({
    mode: z.enum(["renewable", "program-limited", "designation-dependent", "not-applicable"]),
    summary: z.string().min(1),
  }),
  transitions: z.array(z.object({
    label: z.string().min(1),
    summary: z.string().min(1),
    targetStatusId: stableIdSchema.optional(),
  })),
  evidenceCategories: z.array(z.string().min(1)).min(1),
  searchTerms: z.array(z.string().min(1)).min(1),
  sourceAssertions: z.array(z.object({
    sourceId: stableIdSchema,
    supports: z.array(z.string().min(1)).min(1),
    effectiveFrom: z.iso.date().optional(),
    lastCheckedAt: z.iso.date(),
  })).min(1),
});

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
  structuredGuidance: structuredResidenceStatusGuidanceSchema.optional(),
});

export type ResidenceStatus = z.infer<typeof residenceStatusSchema>;
export type ResidenceStatusCategory = z.infer<typeof residenceStatusCategorySchema>;
export type StructuredResidenceStatusGuidance = z.infer<typeof structuredResidenceStatusGuidanceSchema>;

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

    const structuredSourceIds = residenceStatus.structuredGuidance
      ? [
          ...residenceStatus.structuredGuidance.periodsOfStay.flatMap(({ sourceIds }) => sourceIds),
          ...residenceStatus.structuredGuidance.qualificationPathways.flatMap(({ sourceIds }) => sourceIds),
          ...residenceStatus.structuredGuidance.sourceAssertions.map(({ sourceId }) => sourceId),
        ]
      : [];
    for (const structuredSourceId of structuredSourceIds) {
      if (!sourceIds.has(structuredSourceId)) {
        throw new Error(
          `Residence status "${residenceStatus.id}" structured guidance references unknown source "${structuredSourceId}".`,
        );
      }
    }

    for (const transition of residenceStatus.structuredGuidance?.transitions ?? []) {
      if (transition.targetStatusId && !ids.has(transition.targetStatusId)) {
        throw new Error(
          `Residence status "${residenceStatus.id}" structured guidance references unknown target status "${transition.targetStatusId}".`,
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
