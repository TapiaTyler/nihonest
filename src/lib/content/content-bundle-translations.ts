import type { TranslationArtifact } from "@/domain/translation/translation";
import { getActiveTranslations } from "./translations";

/** The existing availability selector plus canonical source revision; absence means English fallback. */
export function selectCurrentBundleTranslations(
  artifacts: readonly TranslationArtifact[], revisions: ReadonlyMap<string, string>,
): readonly TranslationArtifact[] {
  return getActiveTranslations(artifacts).filter((artifact) => artifact.targetLocale === "ja"
    && revisions.get(artifact.contentId) === artifact.sourceRevision);
}
