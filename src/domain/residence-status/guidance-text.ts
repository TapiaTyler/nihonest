import { applyText, extractText, type TextPathConfig } from "@/domain/translation/text-paths";
import type { StructuredResidenceStatusGuidance } from "./residence-status";

/**
 * Path-keyed reader-facing text of structured residence-status guidance (e.g.
 * `qualification-pathways.0.all-of.1.summary`). Search terms and source assertions stay canonical.
 */
const guidanceTextPaths: TextPathConfig = {
  translatableKeys: new Set([
    "routeKindLabel", "label", "duration", "note", "summary", "outsideActivityNote",
    "included", "boundaries", "exceptions", "organizationConditions", "evidenceCategories",
  ]),
  skippedKeys: new Set(["searchTerms", "sourceAssertions"]),
};

/** Every reader-facing English snippet keyed by its path. */
export function extractGuidanceText(guidance: StructuredResidenceStatusGuidance): Record<string, string> {
  return extractText(guidanceTextPaths, guidance);
}

/** A copy of the guidance with translated snippets applied; any snippet without a translation stays English. */
export function applyGuidanceText(
  guidance: StructuredResidenceStatusGuidance,
  translated: Readonly<Record<string, string>>,
): StructuredResidenceStatusGuidance {
  return applyText(guidanceTextPaths, guidance, translated);
}
