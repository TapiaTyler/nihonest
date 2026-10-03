import { annotatedDocumentFamilySchema } from "@/domain/document/annotated-document";
import { translationArtifactSchema } from "@/domain/translation/translation";

/** Reject ambiguous path identities before constructing stable version/section/visual overlay keys. */
export const bundledAnnotatedDocumentSchema = annotatedDocumentFamilySchema.superRefine((family, context) => {
  const groups = family.jurisdictionVariants.length ? family.jurisdictionVariants.map(({ versions }) => versions) : [family.versions];
  for (const versions of groups) {
    for (const version of versions) {
      for (const entries of [version.sections, version.officialVisuals]) {
        if (new Set(entries.map(({ id }) => id)).size !== entries.length) {
          context.addIssue({ code: "custom", message: "Document section and visual IDs must be unique within a version." });
        }
      }
      if (version.validFrom && version.validThrough && version.validFrom > version.validThrough) {
        context.addIssue({ code: "custom", message: "Document validity dates must be ordered." });
      }
    }
  }
});

export const bundledAnnotatedDocumentTranslationSchema = translationArtifactSchema.superRefine((artifact, context) => {
  if (artifact.contentKind !== "annotated-document" || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
    context.addIssue({ code: "custom", message: "Expected an active Japanese annotated-document artifact." });
  }
  if (Object.values(artifact.fields).some((value) => !value)) {
    context.addIssue({ code: "custom", message: "Supplied annotated-document text must be nonempty." });
  }
});
