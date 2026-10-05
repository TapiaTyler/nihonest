import { z } from "zod";
import type { ArticleGroup, GuidedJourney } from "@/domain/discovery/discovery";
import type { JourneyTranslation } from "@/domain/localization/journey-presentation";
import { translationArtifactSchema } from "@/domain/translation/translation";

/** Existing catalog revision inputs, matching the registered group/journey translation checks. */
export function bundledGroupSourceFields(group: ArticleGroup): Record<string, string> {
  return { title: group.title, description: group.description };
}
export function bundledJourneySourceFields(journey: GuidedJourney): Record<string, string> {
  return {
    title: journey.title, description: journey.description, introduction: journey.introduction,
    routes: JSON.stringify(journey.routes.map(({ id, title, description }) => ({ id, title, description }))),
    phases: JSON.stringify(journey.phases.map(({ id, title, description }) => ({ id, title, ...(description ? { description } : {}) }))),
    conditions: JSON.stringify(journey.phases.flatMap(({ steps }) => steps.flatMap((step) =>
      step.type === "article" && step.conditionLabel ? [{ id: step.id, label: step.conditionLabel }] : []))),
  };
}

const text = z.string().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
function jsonArray<T extends z.ZodType<{ id: string }>>(schema: T) {
  return z.string().transform((value, context): unknown => {
    try { return JSON.parse(value); } catch {
      context.addIssue({ code: "custom", message: "Expected a JSON translation array." });
      return z.NEVER;
    }
  }).pipe(schema.array().superRefine((records, context) => {
    if (new Set(records.map((record) => record.id)).size !== records.length) {
      context.addIssue({ code: "custom", message: "Translation entry IDs must be unique." });
    }
  }));
}
const groupFields = z.object({ title: text, description: text }).strict();
const journeyFields = z.object({
  title: text, description: text, introduction: text,
  routes: jsonArray(z.object({ id, title: text, description: text }).strict()),
  phases: jsonArray(z.object({ id, title: text, description: text.optional() }).strict()),
  conditions: jsonArray(z.object({ id, label: text }).strict()),
}).strict();

function artifactSchema(kind: "article-group" | "journey") {
  return translationArtifactSchema.superRefine((artifact, context) => {
    if (artifact.contentKind !== kind || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
      context.addIssue({ code: "custom", message: "Expected an active Japanese discovery artifact of the declared kind." });
    }
    const fields = (kind === "article-group" ? groupFields : journeyFields).safeParse(artifact.fields);
    if (!fields.success) context.addIssue({ code: "custom", message: "Invalid discovery translation fields." });
  });
}
export const bundledGroupTranslationSchema = artifactSchema("article-group");
export const bundledJourneyTranslationSchema = artifactSchema("journey");

/** Portable presentation adapter; strict nested contracts prevent relationship fields entering localization. */
export function parseBundledJourneyTranslation(input: unknown): JourneyTranslation {
  const artifact = bundledJourneyTranslationSchema.parse(input);
  return { contentId: artifact.contentId, targetLocale: artifact.targetLocale, ...journeyFields.parse(artifact.fields) };
}

export function validateBundledJourneyTranslation(journey: GuidedJourney, input: unknown): void {
  const translated = parseBundledJourneyTranslation(input);
  const routes = new Set(journey.routes.map(({ id }) => id));
  const phases = new Set(journey.phases.map(({ id }) => id));
  const conditions = new Set(journey.phases.flatMap(({ steps }) => steps.flatMap((step) =>
    step.type === "article" && step.conditionLabel ? [step.id] : [])));
  if (translated.contentId !== journey.id || translated.routes.some(({ id }) => !routes.has(id))
    || translated.phases.some(({ id }) => !phases.has(id)) || translated.conditions.some(({ id }) => !conditions.has(id))) {
    throw new Error("Journey translation references an unknown route, phase or condition.");
  }
  if (translated.phases.some((phase) => phase.description !== undefined
    && journey.phases.find(({ id }) => id === phase.id)!.description === undefined)) {
    throw new Error("Journey translation cannot introduce a missing canonical phase description.");
  }
}
