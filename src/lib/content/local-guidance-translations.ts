import "server-only";
import { getGeneralLocalAdvice } from "@/data/local-guidance/general-advice";
import { japaneseLocalGuidanceTranslations } from "@/data/translations/ja/local-guidance";
import { japaneseGeneralLocalAdviceTranslations } from "@/data/translations/ja/local-guidance-general-advice";
import type { LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";

/** Path-keyed Japanese text for one supplement (`title`, `actions.0.description`, …). */
export type LocalGuidanceJapaneseFields = Readonly<Record<string, string>>;

const artifactsBySupplement = new Map(japaneseLocalGuidanceTranslations.map((artifact) => [artifact.contentId, artifact]));

/**
 * Current Japanese text for the given supplements, keyed by supplement ID. An artifact whose English has changed
 * since it was translated is left out, so the panel shows canonical English instead of outdated Japanese.
 */
export function getJapaneseLocalGuidanceFields(supplements: readonly LocalGuidanceSupplement[]): Readonly<Record<string, LocalGuidanceJapaneseFields>> {
  const result: Record<string, LocalGuidanceJapaneseFields> = {};
  for (const supplement of supplements) {
    const artifact = artifactsBySupplement.get(supplement.id);
    if (!artifact || artifact.availability !== "active") continue;
    const english = translationSourceFields["local-guidance-supplement"](supplement);
    if (artifact.sourceRevision !== createTranslationSourceRevision(english)) continue;
    result[supplement.id] = artifact.fields;
  }
  return result;
}

let japaneseSupplementTitles: Readonly<Record<string, string>> | undefined;

/** Current Japanese titles of every supplement, keyed by supplement ID, for the prefecture finder. */
export function getJapaneseSupplementTitles(supplements: readonly LocalGuidanceSupplement[]): Readonly<Record<string, string>> {
  japaneseSupplementTitles ??= Object.fromEntries(Object.entries(getJapaneseLocalGuidanceFields(supplements))
    .flatMap(([id, fields]) => (fields.title ? [[id, fields.title]] : [])));
  return japaneseSupplementTitles;
}

/** Japanese general advice for an article when its artifact is current and complete; otherwise undefined. */
export function getJapaneseGeneralLocalAdvice(articleId: string): Readonly<{ title: string; steps: readonly string[] }> | undefined {
  const advice = getGeneralLocalAdvice(articleId);
  const artifact = japaneseGeneralLocalAdviceTranslations.find((item) => item.contentId === articleId);
  if (!advice || !artifact || artifact.availability !== "active") return undefined;
  if (artifact.sourceRevision !== createTranslationSourceRevision(translationSourceFields["local-guidance-general-advice"](advice))) return undefined;
  const steps = advice.steps.map((_, index) => artifact.fields[`steps.${index}`]);
  if (!artifact.fields.title || steps.some((step) => !step)) return undefined;
  return { title: artifact.fields.title, steps: steps as string[] };
}
