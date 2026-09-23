import { applyText, extractText, type TextPathConfig } from "@/domain/translation/text-paths";
import type { ActivityCrossReference } from "./activity-cross-reference";

/**
 * Path-keyed reader-facing text of an activity cross-reference (labels, prompts, choices, rule titles,
 * orientation, facts to verify, and assertion statements). Links are skipped because their labels are
 * titles of articles, statuses, and journeys, which the explorer localizes from those existing translations.
 */
const activityTextPaths: TextPathConfig = {
  translatableKeys: new Set(["label", "shortLabel", "description", "prompt", "title", "orientation", "verify", "statement"]),
  skippedKeys: new Set(["searchTerms", "links", "when", "sourceIds"]),
};

export function extractActivityText(activity: ActivityCrossReference): Record<string, string> {
  return extractText(activityTextPaths, activity);
}

export function applyActivityText(activity: ActivityCrossReference, translated: Readonly<Record<string, string>>): ActivityCrossReference {
  return applyText(activityTextPaths, activity, translated);
}
