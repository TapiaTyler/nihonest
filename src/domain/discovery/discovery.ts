import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const articleGroupSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  articleIds: z.array(stableIdSchema).min(1),
});

export const JOURNEY_APPLICABILITY_IDS = [
  "all-routes",
  "student-status",
  "temporary-visitor",
  "registered-resident",
  "work-status",
  "highly-skilled-professional",
  "intra-company-transferee",
  "startup-pathway",
  "business-manager",
  "specified-skilled-worker",
  "technical-intern-training",
  "dependent",
  "spouse-or-child-status",
  "cultural-activities",
  "trainee",
  "designated-activities",
] as const;

export const journeyApplicabilitySchema = z.enum(JOURNEY_APPLICABILITY_IDS);

export const journeyApplicabilityLabels: Record<(typeof JOURNEY_APPLICABILITY_IDS)[number], string> = {
  "all-routes": "All routes in this journey",
  "student-status": "Student status",
  "temporary-visitor": "Temporary Visitor route",
  "registered-resident": "Resident registration required",
  "work-status": "Work-status route",
  "highly-skilled-professional": "Highly Skilled Professional route",
  "intra-company-transferee": "Intra-company transfer route",
  "startup-pathway": "Start-up pathway",
  "business-manager": "Business Manager route",
  "specified-skilled-worker": "Specified Skilled Worker route",
  "technical-intern-training": "Technical Intern Training route",
  dependent: "Dependent route",
  "spouse-or-child-status": "Spouse or child route",
  "cultural-activities": "Cultural Activities route",
  trainee: "Trainee route",
  "designated-activities": "Designated Activities route",
};

export const journeyStepSchema = z.object({
  articleId: stableIdSchema,
  applicability: z.array(journeyApplicabilitySchema).min(1),
  role: z.enum(["core", "choose-one", "conditional"]).default("core"),
});

export const journeyStepRoleLabels = {
  core: "Journey step",
  "choose-one": "Choose the relevant route",
  conditional: "If applicable",
} as const;

export const guidedJourneySchema = z.object({
  id: stableIdSchema,
  groupId: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  introduction: z.string().min(1),
  steps: z.array(journeyStepSchema).min(1),
});

export type ArticleGroup = z.infer<typeof articleGroupSchema>;
export type GuidedJourney = z.infer<typeof guidedJourneySchema>;
export type JourneyStep = z.infer<typeof journeyStepSchema>;

export function validateDiscoveryModel(
  groups: readonly ArticleGroup[],
  journeys: readonly GuidedJourney[],
  articleIds: readonly string[],
) {
  const knownArticleIds = new Set(articleIds);
  for (const group of groups) {
    if (new Set(group.articleIds).size !== group.articleIds.length) {
      throw new Error(`Discovery record \"${group.id}\" contains duplicate articles.`);
    }
    for (const articleId of group.articleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(`Discovery record \"${group.id}\" references unknown article \"${articleId}\".`);
      }
    }
  }

  for (const journey of journeys) {
    if (!groups.some((group) => group.id === journey.groupId)) {
      throw new Error(`Journey "${journey.id}" references unknown group "${journey.groupId}".`);
    }
    const journeyArticleIds = journey.steps.map(({ articleId }) => articleId);
    if (new Set(journeyArticleIds).size !== journeyArticleIds.length) {
      throw new Error(`Discovery record \"${journey.id}\" contains duplicate articles.`);
    }
    for (const articleId of journeyArticleIds) {
      if (!knownArticleIds.has(articleId)) {
        throw new Error(`Discovery record \"${journey.id}\" references unknown article \"${articleId}\".`);
      }
    }
  }
}
