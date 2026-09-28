import "server-only";
import { japaneseLocalGuidanceTranslations } from "@/data/translations/ja/local-guidance";
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
