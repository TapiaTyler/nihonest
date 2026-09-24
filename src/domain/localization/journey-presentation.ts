import type { GuidedJourney } from "@/domain/discovery/discovery";

type JourneyRouteTranslation = Readonly<{ id: string; title: string; description: string }>;
type JourneyPhaseTranslation = Readonly<{ id: string; title: string; description?: string }>;
type JourneyConditionTranslation = Readonly<{ id: string; label: string }>;

export type JourneyTranslation = Readonly<{
  contentId: string;
  targetLocale: string;
  title: string;
  description: string;
  introduction: string;
  routes: readonly JourneyRouteTranslation[];
  phases: readonly JourneyPhaseTranslation[];
  conditions: readonly JourneyConditionTranslation[];
}>;

/** Only the journey and route titles, for surfaces that name a journey without rendering it. */
export type JourneyTitleTranslation = Readonly<{
  contentId: string;
  title: string;
  routes: readonly Readonly<{ id: string; title: string }>[];
}>;

/** Applies translated presentation fields while retaining canonical IDs and relationships. */
export function localizeJourney(journey: GuidedJourney, translation?: JourneyTranslation): GuidedJourney {
  if (!translation || translation.contentId !== journey.id) return journey;
  const routes = new Map(translation.routes.map((route) => [route.id, route]));
  const phases = new Map(translation.phases.map((phase) => [phase.id, phase]));
  const conditions = new Map(translation.conditions.map((condition) => [condition.id, condition.label]));

  return {
    ...journey,
    title: translation.title,
    description: translation.description,
    introduction: translation.introduction,
    routes: journey.routes.map((route) => ({ ...route, ...routes.get(route.id) })),
    phases: journey.phases.map((phase) => {
      const translatedPhase = phases.get(phase.id);
      return {
        ...phase,
        ...(translatedPhase ? { title: translatedPhase.title, description: translatedPhase.description ?? phase.description } : {}),
        steps: phase.steps.map((step) => step.type === "article" && conditions.has(step.id)
          ? { ...step, conditionLabel: conditions.get(step.id) }
          : step),
      };
    }),
  };
}
