import { guidedJourneys } from "@/data/discovery";
import { roadmapRecommendationRuleSchema, type RoadmapRecommendationRule } from "@/domain/roadmap/personalized-roadmap";
import { JOURNEY_STAGE_IDS, type JourneyStageId } from "@/domain/taxonomy/taxonomy";

const stageChecklistIds: Record<JourneyStageId, readonly string[]> = {
  planning: ["visa-and-status-of-residence-explained", "planning-your-studies-in-japan", "choosing-a-work-status-and-coe"],
  preparing: ["preparing-for-long-term-entry-to-japan", "preparing-to-enter-japan", "finding-housing-and-moving-in"],
  "recently-arrived": ["documents-received-when-entering-japan", "registering-your-address-after-arrival", "getting-a-phone-number-in-japan", "opening-a-bank-account-after-moving-to-japan"],
  "living-in-japan": ["understanding-my-number", "joining-national-health-insurance", "national-pension-after-moving-to-japan", "income-and-resident-tax-after-moving-to-japan"],
};

const stageRules = JOURNEY_STAGE_IDS.flatMap((stageId) => stageChecklistIds[stageId].map((checklistId, index) => roadmapRecommendationRuleSchema.parse({
  id: `stage-${stageId}-${checklistId}`,
  checklistId,
  reason: `Recommended for the ${stageId.replaceAll("-", " ")} stage.`,
  priority: index + 1,
  when: { journeyStageIds: [stageId] },
})));

const journeyRules = guidedJourneys.flatMap((journey) => {
  let position = 0;
  return journey.phases.flatMap((phase) => phase.steps.flatMap((step) => {
    position += 1;
    if (step.type === "route-choice") {
      return journey.routes.map((route) => roadmapRecommendationRuleSchema.parse({
        id: `journey-${journey.id}-${route.id}-${route.articleId}`,
        checklistId: route.articleId,
        reason: `${phase.title} for the ${route.title} route in ${journey.title}.`,
        priority: position,
        when: { journeyIds: [journey.id], routeIds: [route.id] },
      }));
    }

    if (step.routeIds?.length) {
      return step.routeIds.map((routeId) => roadmapRecommendationRuleSchema.parse({
        id: `journey-${journey.id}-${routeId}-${step.articleId}`,
        checklistId: step.articleId,
        reason: `${phase.title} in your selected ${journey.title.toLowerCase()} route.`,
        priority: position,
        when: { journeyIds: [journey.id], routeIds: [routeId] },
      }));
    }

    return [roadmapRecommendationRuleSchema.parse({
      id: `journey-${journey.id}-${step.articleId}`,
      checklistId: step.articleId,
      reason: `${phase.title} in ${journey.title}.`,
      priority: position,
      when: { journeyIds: [journey.id] },
    })];
  }));
});

export const roadmapRecommendationRules: readonly RoadmapRecommendationRule[] = [...stageRules, ...journeyRules];
