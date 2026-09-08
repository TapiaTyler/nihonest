import { z } from "zod";
import { audienceIdSchema, journeyStageIdSchema } from "@/domain/taxonomy/taxonomy";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const CHECKLIST_PROGRESS_STATES = ["not-started", "in-progress", "complete"] as const;
export const checklistProgressStateSchema = z.enum(CHECKLIST_PROGRESS_STATES);

export const roadmapApplicabilitySchema = z.object({
  journeyStageIds: z.array(journeyStageIdSchema).optional(),
  journeyIds: z.array(stableIdSchema).optional(),
  routeIds: z.array(stableIdSchema).optional(),
  audienceIds: z.array(audienceIdSchema).optional(),
});

export const checklistDefinitionSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  relatedArticleIds: z.array(stableIdSchema).min(1),
  applicability: roadmapApplicabilitySchema.default({}),
});

export const checklistProgressSchema = z.object({
  checklistId: stableIdSchema,
  state: checklistProgressStateSchema,
  updatedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().optional(),
}).superRefine((progress, context) => {
  if (progress.state === "complete" && !progress.completedAt) {
    context.addIssue({ code: "custom", path: ["completedAt"], message: "Completed checklist progress requires completedAt." });
  }
  if (progress.state !== "complete" && progress.completedAt) {
    context.addIssue({ code: "custom", path: ["completedAt"], message: "Only completed checklist progress may include completedAt." });
  }
});

export const roadmapRecommendationRuleSchema = z.object({
  id: stableIdSchema,
  checklistId: stableIdSchema,
  reason: z.string().min(1),
  priority: z.number().int().min(1).max(100),
  when: roadmapApplicabilitySchema.default({}),
});

export const roadmapContextSchema = z.object({
  journeyStageId: journeyStageIdSchema.optional(),
  journeyId: stableIdSchema.optional(),
  routeId: stableIdSchema.optional(),
  audienceIds: z.array(audienceIdSchema).default([]),
});

export type ChecklistDefinition = z.infer<typeof checklistDefinitionSchema>;
export type ChecklistProgress = z.infer<typeof checklistProgressSchema>;
export type RoadmapRecommendationRule = z.infer<typeof roadmapRecommendationRuleSchema>;
export type RoadmapContext = z.infer<typeof roadmapContextSchema>;

function includesOrAppliesToAll(values: readonly string[] | undefined, value: string | undefined): boolean {
  return !values?.length || Boolean(value && values.includes(value));
}

export function matchesRoadmapApplicability(
  applicability: z.infer<typeof roadmapApplicabilitySchema>,
  context: RoadmapContext,
): boolean {
  return includesOrAppliesToAll(applicability.journeyStageIds, context.journeyStageId)
    && includesOrAppliesToAll(applicability.journeyIds, context.journeyId)
    && includesOrAppliesToAll(applicability.routeIds, context.routeId)
    && (!applicability.audienceIds?.length || applicability.audienceIds.some((id) => context.audienceIds.includes(id)));
}

export type RoadmapItem = Readonly<{
  definition: ChecklistDefinition;
  progressState: z.infer<typeof checklistProgressStateSchema>;
  reason: string;
  priority: number;
}>;

export function validateRoadmapContracts(
  definitions: readonly ChecklistDefinition[],
  rules: readonly RoadmapRecommendationRule[],
): void {
  const definitionIds = new Set(definitions.map(({ id }) => id));
  if (definitionIds.size !== definitions.length) throw new Error("Checklist definition IDs must be unique.");

  const ruleIds = new Set<string>();
  for (const rule of rules) {
    if (ruleIds.has(rule.id)) throw new Error("Roadmap recommendation rule IDs must be unique.");
    if (!definitionIds.has(rule.checklistId)) throw new Error(`Roadmap rule "${rule.id}" references unknown checklist "${rule.checklistId}".`);
    ruleIds.add(rule.id);
  }
}

/** Resolution is deterministic and retains completed items so their public guidance remains reachable. */
export function resolvePersonalizedRoadmap(
  definitions: readonly ChecklistDefinition[],
  rules: readonly RoadmapRecommendationRule[],
  progress: readonly ChecklistProgress[],
  context: RoadmapContext,
): readonly RoadmapItem[] {
  validateRoadmapContracts(definitions, rules);
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const progressById = new Map(progress.map((entry) => [entry.checklistId, entry]));

  return rules.flatMap((rule) => {
    const definition = definitionsById.get(rule.checklistId);
    if (!definition || !matchesRoadmapApplicability(rule.when, context) || !matchesRoadmapApplicability(definition.applicability, context)) return [];
    return [{
      definition,
      progressState: progressById.get(definition.id)?.state ?? "not-started",
      reason: rule.reason,
      priority: rule.priority,
    } satisfies RoadmapItem];
  }).sort((left, right) => {
    const completionOrder = Number(left.progressState === "complete") - Number(right.progressState === "complete");
    return completionOrder || left.priority - right.priority || left.definition.title.localeCompare(right.definition.title);
  });
}
