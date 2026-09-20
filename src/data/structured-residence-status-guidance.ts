import type { StructuredResidenceStatusGuidance } from "@/domain/residence-status/residence-status";
import { businessStructuredGuidance } from "@/data/structured-residence-status-guidance/business";
import { designatedStructuredGuidance } from "@/data/structured-residence-status-guidance/designated";
import { familyStructuredGuidance } from "@/data/structured-residence-status-guidance/family";
import { officialStructuredGuidance } from "@/data/structured-residence-status-guidance/official";
import { studyStructuredGuidance } from "@/data/structured-residence-status-guidance/study";
import { unrestrictedStructuredGuidance } from "@/data/structured-residence-status-guidance/unrestricted";
import { visitorStructuredGuidance } from "@/data/structured-residence-status-guidance/visitor";
import { workStructuredGuidance } from "@/data/structured-residence-status-guidance/work";

// Module order follows RESIDENCE_STATUS_CATEGORY_IDS; each category owns its local record order.
const assembledStructuredGuidance = {
  ...workStructuredGuidance,
  ...businessStructuredGuidance,
  ...studyStructuredGuidance,
  ...familyStructuredGuidance,
  ...designatedStructuredGuidance,
  ...visitorStructuredGuidance,
  ...officialStructuredGuidance,
  ...unrestrictedStructuredGuidance,
};

type StructuredGuidanceStatusId = keyof typeof assembledStructuredGuidance;

export const structuredResidenceStatusGuidance: Readonly<Record<StructuredGuidanceStatusId, StructuredResidenceStatusGuidance>> = assembledStructuredGuidance;

export function getStructuredResidenceStatusGuidance(id: string) {
  return structuredResidenceStatusGuidance[id as StructuredGuidanceStatusId];
}
