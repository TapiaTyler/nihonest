import { z } from "zod";

export const JOURNEY_STAGE_IDS = [
  "planning",
  "preparing",
  "recently-arrived",
  "living-in-japan",
] as const;

export const TOPIC_IDS = [
  "banking",
  "daily-life",
  "employment",
  "healthcare",
  "housing",
  "immigration",
  "language",
  "municipal-procedures",
  "taxes",
  "transportation",
] as const;

export const AUDIENCE_IDS = [
  "newcomer",
  "student",
  "education-provider",
  "employer",
  "employee",
  "freelancer",
  "business-owner",
  "spouse",
  "dependent",
  "parent",
] as const;

export const GEOGRAPHIC_SCOPE_IDS = ["national", "prefectural", "municipal"] as const;
export const IMPORTANCE_IDS = ["informational", "recommended", "important", "critical"] as const;
export const CONTENT_TYPE_IDS = ["checklist", "glossary", "guide", "official-procedure", "reference"] as const;

export const journeyStageIdSchema = z.enum(JOURNEY_STAGE_IDS);
export const topicIdSchema = z.enum(TOPIC_IDS);
export const audienceIdSchema = z.enum(AUDIENCE_IDS);
export const geographicScopeIdSchema = z.enum(GEOGRAPHIC_SCOPE_IDS);
export const importanceSchema = z.enum(IMPORTANCE_IDS);
export const contentTypeSchema = z.enum(CONTENT_TYPE_IDS);

export type JourneyStageId = z.infer<typeof journeyStageIdSchema>;
export type TopicId = z.infer<typeof topicIdSchema>;
export type AudienceId = z.infer<typeof audienceIdSchema>;
export type GeographicScopeId = z.infer<typeof geographicScopeIdSchema>;

type TaxonomyOption<Id extends string> = Readonly<{
  id: Id;
  label: string;
}>;

function createOptions<const Ids extends readonly string[]>(
  ids: Ids,
  labels: Record<Ids[number], string>,
): readonly TaxonomyOption<Ids[number]>[] {
  return ids.map((id) => ({ id, label: labels[id as Ids[number]] }));
}

export const journeyStages = createOptions(JOURNEY_STAGE_IDS, {
  planning: "Planning",
  preparing: "Preparing",
  "recently-arrived": "Recently arrived",
  "living-in-japan": "Living in Japan",
});

export const topics = createOptions(TOPIC_IDS, {
  immigration: "Immigration",
  employment: "Employment",
  taxes: "Taxes",
  housing: "Housing",
  healthcare: "Healthcare",
  banking: "Banking",
  "municipal-procedures": "Municipal procedures",
  transportation: "Transportation",
  language: "Language",
  "daily-life": "Daily life",
});

export const audiences = createOptions(AUDIENCE_IDS, {
  employee: "Employee",
  student: "Student",
  "education-provider": "Education provider",
  employer: "Employer",
  spouse: "Spouse",
  dependent: "Dependent",
  parent: "Parent",
  freelancer: "Freelancer",
  "business-owner": "Business owner",
  newcomer: "Newcomer",
});

export const geographicScopes = createOptions(GEOGRAPHIC_SCOPE_IDS, {
  national: "National",
  prefectural: "Prefectural",
  municipal: "Municipal",
});
