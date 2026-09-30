import { z } from "zod";
import { translationArtifactSchema } from "@/domain/translation/translation";

const requiredText = z.string().min(1);
const stringArray = z.string().superRefine((value, context) => {
  try {
    z.array(requiredText).parse(JSON.parse(value));
  } catch {
    context.addIssue({ code: "custom", message: "Expected a JSON array of nonempty strings." });
  }
});
const fieldSchemas = {
  faq: z.object({ question: requiredText, summary: requiredText }),
  "glossary-term": z.object({ "short-definition": requiredText, "detailed-explanation": requiredText, "common-context": requiredText }),
  "residence-status": z.object({ summary: requiredText, purpose: requiredText, "typical-activities": stringArray, examples: stringArray, considerations: stringArray }),
};

/** Preserve the complete artifact, including generator/input revisions and human review provenance. */
export function bundledCatalogTranslationSchema(kind: keyof typeof fieldSchemas) {
  return translationArtifactSchema.superRefine((artifact, context) => {
    if (artifact.contentKind !== kind || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
      context.addIssue({ code: "custom", message: "Expected an active Japanese artifact of the declared catalog kind." });
    }
    const fields = fieldSchemas[kind].safeParse(artifact.fields);
    if (!fields.success) context.addIssue({ code: "custom", message: "Translation fields do not satisfy the catalog contract." });
  });
}
