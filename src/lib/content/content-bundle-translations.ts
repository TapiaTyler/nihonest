import type { TranslationArtifact } from "@/domain/translation/translation";
import { getActiveTranslations } from "./translations";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";

/** The existing availability selector plus canonical source revision; absence means English fallback. */
export function selectCurrentBundleTranslations(
  artifacts: readonly TranslationArtifact[], revisions: ReadonlyMap<string, string>,
): readonly TranslationArtifact[] {
  return getActiveTranslations(artifacts).filter((artifact) => artifact.targetLocale === "ja"
    && revisions.get(artifact.contentId) === artifact.sourceRevision);
}

/** Match the web general-advice rule: incomplete title/steps fall back to the whole English advice. */
export function selectCurrentGeneralAdviceTranslations(
  artifacts: readonly TranslationArtifact[], advice: readonly Readonly<{ id: string; title: string; steps: readonly string[] }>[],
): readonly TranslationArtifact[] {
  const byId = new Map(advice.map((record) => [record.id, record]));
  const revisions = new Map(advice.map((record) => [record.id,
    createTranslationSourceRevision(translationSourceFields["local-guidance-general-advice"](record))]));
  return selectCurrentBundleTranslations(artifacts, revisions).filter((artifact) => Boolean(artifact.fields.title)
    && byId.get(artifact.contentId)!.steps.every((_, index) => Boolean(artifact.fields[`steps.${index}`])));
}
