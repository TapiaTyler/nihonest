import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const ACTIVITY_RULE_LAYER_IDS = [
  "immigration",
  "employment-contract",
  "professional-licensing",
  "tax",
  "social-insurance",
  "local-rules",
] as const;

const activityChoiceSchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  description: z.string().min(1).optional(),
});

const activityQuestionSchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.array(activityChoiceSchema).min(2),
});

const activityLinkSchema = z.object({
  kind: z.enum(["article", "residence-status", "journey"]),
  id: stableIdSchema,
  label: z.string().min(1),
  href: z.string().startsWith("/"),
});

const activityConditionSchema = z.object({
  questionId: stableIdSchema,
  choiceIds: z.array(stableIdSchema).min(1),
});

const activityRuleAssertionSchema = z.object({
  statement: z.string().min(1),
  editorialState: z.enum(["researched", "approved"]),
  sourceIds: z.array(stableIdSchema).min(1),
  approvedAt: z.iso.date().optional(),
}).superRefine((assertion, context) => {
  if ((assertion.editorialState === "approved") !== Boolean(assertion.approvedAt)) {
    context.addIssue({ code: "custom", path: ["approvedAt"], message: "Approved assertions require an approval date." });
  }
});

const activityRuleSchema = z.object({
  id: stableIdSchema,
  layer: z.enum(ACTIVITY_RULE_LAYER_IDS),
  title: z.string().min(1),
  orientation: z.string().min(1),
  verify: z.array(z.string().min(1)).min(1),
  when: z.array(activityConditionSchema).default([]),
  links: z.array(activityLinkSchema).min(1),
  assertion: activityRuleAssertionSchema.optional(),
});

export const activityCrossReferenceSchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  shortLabel: z.string().min(1),
  description: z.string().min(1),
  mode: z.enum(["guided", "handoff"]),
  searchTerms: z.array(z.string().min(1)).min(1),
  questions: z.array(activityQuestionSchema),
  rules: z.array(activityRuleSchema).min(1),
}).superRefine((activity, context) => {
  const questionIds = new Set(activity.questions.map(({ id }) => id));
  const choiceIds = new Map(activity.questions.map((question) => [question.id, new Set(question.choices.map(({ id }) => id))]));
  if (activity.mode === "guided" && activity.questions.length === 0) {
    context.addIssue({ code: "custom", path: ["questions"], message: "Guided activities require questions." });
  }
  for (const [ruleIndex, rule] of activity.rules.entries()) {
    for (const [conditionIndex, condition] of rule.when.entries()) {
      if (!questionIds.has(condition.questionId)) {
        context.addIssue({ code: "custom", path: ["rules", ruleIndex, "when", conditionIndex, "questionId"], message: "Rule condition references an unknown question." });
      }
      for (const choiceId of condition.choiceIds) {
        if (!choiceIds.get(condition.questionId)?.has(choiceId)) {
          context.addIssue({ code: "custom", path: ["rules", ruleIndex, "when", conditionIndex, "choiceIds"], message: "Rule condition references an unknown choice." });
        }
      }
    }
  }
});

export type ActivityCrossReference = z.infer<typeof activityCrossReferenceSchema>;
export type ActivityCrossReferenceAnswers = Readonly<Record<string, string>>;
export type ActivityCrossReferenceRule = ActivityCrossReference["rules"][number];

export function getApplicableActivityRules(
  activity: ActivityCrossReference,
  answers: ActivityCrossReferenceAnswers,
): readonly ActivityCrossReferenceRule[] {
  return activity.rules.filter((rule) => rule.when.every((condition) => {
    const answer = answers[condition.questionId];
    return answer ? condition.choiceIds.includes(answer) : false;
  }));
}

export function assertionIsApproved(
  assertion: ActivityCrossReferenceRule["assertion"],
): boolean {
  return assertion?.editorialState === "approved" && Boolean(assertion.approvedAt);
}

export function validateActivityCrossReferences(
  activities: readonly ActivityCrossReference[],
  knownArticleIds: readonly string[],
  knownResidenceStatusIds: readonly string[],
  knownJourneyIds: readonly string[],
  knownSourceIds: readonly string[],
): void {
  const ids = new Set<string>();
  const knownTargets = {
    article: new Set(knownArticleIds),
    "residence-status": new Set(knownResidenceStatusIds),
    journey: new Set(knownJourneyIds),
  };
  const sources = new Set(knownSourceIds);

  for (const activity of activities) {
    if (ids.has(activity.id)) throw new Error(`Activity cross-reference ID "${activity.id}" is duplicated.`);
    ids.add(activity.id);
    for (const rule of activity.rules) {
      for (const link of rule.links) {
        if (!knownTargets[link.kind].has(link.id)) {
          throw new Error(`Activity "${activity.id}" references unknown ${link.kind} "${link.id}".`);
        }
      }
      for (const sourceId of rule.assertion?.sourceIds ?? []) {
        if (!sources.has(sourceId)) {
          throw new Error(`Activity "${activity.id}" references unknown source "${sourceId}".`);
        }
      }
    }
  }
}
