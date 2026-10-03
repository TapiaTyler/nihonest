import { translationArtifactSchema } from "@/domain/translation/translation";

/** Path-keyed guidance overlays share the historical residence-status kind, but have their own file contract. */
export const bundledStatusGuidanceTranslationSchema = translationArtifactSchema.superRefine((artifact, context) => {
  if (artifact.contentKind !== "residence-status" || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
    context.addIssue({ code: "custom", message: "Expected an active Japanese residence-status guidance artifact." });
  }
  if (Object.values(artifact.fields).some((value) => !value)) {
    context.addIssue({ code: "custom", message: "Supplied guidance overlay fields must be nonempty." });
  }
});
