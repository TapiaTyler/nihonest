import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const articleGroupSchema = z.object({ id: stableIdSchema, title: z.string().min(1), description: z.string().min(1), articleIds: z.array(stableIdSchema).min(1) });

export const journeyRouteSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  articleId: stableIdSchema,
});

export const journeyArticleStepSchema = z.object({
  id: stableIdSchema,
  type: z.literal("article"),
  articleId: stableIdSchema,
  requiredness: z.enum(["required", "conditional"]).default("required"),
  conditionLabel: z.string().min(1).optional(),
  routeIds: z.array(stableIdSchema).min(1).optional(),
}).superRefine((step, context) => {
  if (step.requiredness === "conditional" && !step.conditionLabel) {
    context.addIssue({ code: "custom", path: ["conditionLabel"], message: "Conditional journey steps require a clear condition label." });
  }
});

export const journeyRouteChoiceStepSchema = z.object({ id: stableIdSchema, type: z.literal("route-choice") });

export const journeyPhaseSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  steps: z.array(z.union([journeyArticleStepSchema, journeyRouteChoiceStepSchema])).min(1),
});

export const guidedJourneySchema = z.object({
  id: stableIdSchema,
  groupId: stableIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  introduction: z.string().min(1),
  routes: z.array(journeyRouteSchema).default([]),
  phases: z.array(journeyPhaseSchema).min(1),
});

export type ArticleGroup = z.infer<typeof articleGroupSchema>;
export type GuidedJourney = z.infer<typeof guidedJourneySchema>;
export type JourneyRoute = z.infer<typeof journeyRouteSchema>;
export type JourneyArticleStep = z.infer<typeof journeyArticleStepSchema>;

export type ResolvedJourneyStep = Readonly<{
  phaseId: string;
  phaseTitle: string;
  articleId: string;
  requiredness: JourneyArticleStep["requiredness"];
  conditionLabel?: string;
  isRouteSelection: boolean;
}>;

export function getJourneyArticleIds(journey: GuidedJourney): readonly string[] {
  return [
    ...journey.routes.map(({ articleId }) => articleId),
    ...journey.phases.flatMap(({ steps }) => steps.flatMap((step) => step.type === "article" ? [step.articleId] : [])),
  ];
}

export function getJourneyRouteById(journey: GuidedJourney, routeId?: string): JourneyRoute | undefined {
  return journey.routes.find(({ id }) => id === routeId);
}

export function getJourneyRouteForArticle(journey: GuidedJourney, articleId: string): JourneyRoute | undefined {
  return journey.routes.find((route) => route.articleId === articleId);
}

export function resolveJourneySteps(journey: GuidedJourney, routeId?: string): readonly ResolvedJourneyStep[] {
  const route = getJourneyRouteById(journey, routeId);
  // Route choices replace one placeholder with one canonical guide; alternatives must never become sequential steps.
  return journey.phases.flatMap<ResolvedJourneyStep>((phase) => phase.steps.flatMap<ResolvedJourneyStep>((step) => {
    if (step.type === "route-choice") {
      return route ? [{ phaseId: phase.id, phaseTitle: phase.title, articleId: route.articleId, requiredness: "required" as const, isRouteSelection: true }] : [];
    }
    if (step.routeIds && (!route || !step.routeIds.includes(route.id))) return [];
    return [{ phaseId: phase.id, phaseTitle: phase.title, articleId: step.articleId, requiredness: step.requiredness, conditionLabel: step.conditionLabel, isRouteSelection: false }];
  }));
}

export function validateDiscoveryModel(groups: readonly ArticleGroup[], journeys: readonly GuidedJourney[], articleIds: readonly string[]) {
  const knownArticleIds = new Set(articleIds);
  for (const group of groups) {
    if (new Set(group.articleIds).size !== group.articleIds.length) throw new Error(`Discovery record \"${group.id}\" contains duplicate articles.`);
    for (const articleId of group.articleIds) if (!knownArticleIds.has(articleId)) throw new Error(`Discovery record \"${group.id}\" references unknown article \"${articleId}\".`);
  }

  for (const journey of journeys) {
    if (!groups.some((group) => group.id === journey.groupId)) throw new Error(`Journey "${journey.id}" references unknown group "${journey.groupId}".`);

    const routeIds = journey.routes.map(({ id }) => id);
    if (new Set(routeIds).size !== routeIds.length) throw new Error(`Journey "${journey.id}" contains duplicate route IDs.`);
    const phaseIds = journey.phases.map(({ id }) => id);
    if (new Set(phaseIds).size !== phaseIds.length) throw new Error(`Journey "${journey.id}" contains duplicate phase IDs.`);
    const steps = journey.phases.flatMap(({ steps }) => steps);
    const stepIds = steps.map(({ id }) => id);
    if (new Set(stepIds).size !== stepIds.length) throw new Error(`Journey "${journey.id}" contains duplicate step IDs.`);

    const routeChoiceCount = steps.filter(({ type }) => type === "route-choice").length;
    if (journey.routes.length > 0 && routeChoiceCount !== 1) throw new Error(`Journey "${journey.id}" with routes must contain exactly one route choice.`);
    if (journey.routes.length === 0 && routeChoiceCount > 0) throw new Error(`Journey "${journey.id}" cannot contain a route choice without routes.`);

    for (const step of steps) {
      if (step.type !== "article" || !step.routeIds) continue;
      for (const routeId of step.routeIds) if (!routeIds.includes(routeId)) throw new Error(`Journey "${journey.id}" step "${step.id}" references unknown route "${routeId}".`);
    }

    const journeyArticleIds = getJourneyArticleIds(journey);
    if (new Set(journeyArticleIds).size !== journeyArticleIds.length) throw new Error(`Discovery record \"${journey.id}\" contains duplicate articles.`);
    for (const articleId of journeyArticleIds) if (!knownArticleIds.has(articleId)) throw new Error(`Discovery record \"${journey.id}\" references unknown article \"${articleId}\".`);
  }
}
