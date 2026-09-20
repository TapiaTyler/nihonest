import {
  structuredResidenceStatusGuidanceSchema,
  type StructuredResidenceStatusGuidance,
  type StructuredResidenceStatusGuidanceInput,
} from "@/domain/residence-status/residence-status";

/** Shared evidence-check date used by this researched guidance batch. */
export const checkedAt = "2026-09-12";

/** Validates each category-owned record before the compatibility registry assembles it. */
export function defineStructuredGuidance(
  input: StructuredResidenceStatusGuidanceInput,
): StructuredResidenceStatusGuidance {
  return structuredResidenceStatusGuidanceSchema.parse(input);
}
