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

export function createChecklistProgress(
  checklistId: string,
  state: ChecklistProgress["state"],
  updatedAt: string,
): ChecklistProgress {
  return checklistProgressSchema.parse({
    checklistId,
    state,
    updatedAt,
    completedAt: state === "complete" ? updatedAt : undefined,
  });
}

export function updateChecklistProgress(
  records: readonly ChecklistProgress[],
  nextRecord: ChecklistProgress,
): readonly ChecklistProgress[] {
  return [...records.filter(({ checklistId }) => checklistId !== nextRecord.checklistId), nextRecord];
}

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

function applicabilitySpecificity(applicability: z.infer<typeof roadmapApplicabilitySchema>): number {
  return (applicability.journeyStageIds?.length ? 1 : 0)
    + (applicability.audienceIds?.length ? 2 : 0)
    + (applicability.journeyIds?.length ? 4 : 0)
    + (applicability.routeIds?.length ? 8 : 0);
}

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

/** A chosen journey is a stronger boundary than broad stage discovery and must not inherit unrelated stage items. */
export function selectRoadmapRules(
  rules: readonly RoadmapRecommendationRule[],
  context: RoadmapContext,
): readonly RoadmapRecommendationRule[] {
  return context.journeyId
    ? rules.filter((rule) => rule.when.journeyIds?.includes(context.journeyId!))
    : rules.filter((rule) => !rule.when.journeyIds?.length);
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

  const matchingItems = rules.flatMap((rule) => {
    const definition = definitionsById.get(rule.checklistId);
    if (!definition || !matchesRoadmapApplicability(rule.when, context) || !matchesRoadmapApplicability(definition.applicability, context)) return [];
    return [{
      definition,
      progressState: progressById.get(definition.id)?.state ?? "not-started",
      reason: rule.reason,
      priority: rule.priority,
      specificity: applicabilitySpecificity(rule.when),
    }];
  });

  // A journey-specific rule should explain a shared item instead of duplicating its broader stage recommendation.
  const uniqueItems = new Map<string, RoadmapItem & { specificity: number }>();
  for (const item of matchingItems) {
    const current = uniqueItems.get(item.definition.id);
    if (!current || item.specificity > current.specificity || (item.specificity === current.specificity && item.priority < current.priority)) {
      uniqueItems.set(item.definition.id, item);
    }
  }

  return [...uniqueItems.values()].sort((left, right) => {
    const completionOrder = Number(left.progressState === "complete") - Number(right.progressState === "complete");
    return completionOrder || left.priority - right.priority || left.definition.title.localeCompare(right.definition.title);
  }).map((item) => ({
    definition: item.definition,
    progressState: item.progressState,
    reason: item.reason,
    priority: item.priority,
  }));
}
