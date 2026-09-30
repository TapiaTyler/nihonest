import { z } from "zod";
import { translationArtifactSchema } from "@/domain/translation/translation";

/** General lookup prompts stay distinct from researched municipality instructions. ID is the article ID. */
export const bundledGeneralLocalAdviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.literal("general-lookup-prompts"),
  title: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
});

export function bundledLocalGuidanceTranslationSchema(kind: "local-guidance-supplement" | "local-guidance-general-advice") {
  return translationArtifactSchema.superRefine((artifact, context) => {
    if (artifact.contentKind !== kind || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
      context.addIssue({ code: "custom", message: "Expected an active Japanese local-guidance artifact of the declared kind." });
    }
    if (Object.values(artifact.fields).some((value) => !value)) {
      context.addIssue({ code: "custom", message: "Supplied local-guidance translation fields must be nonempty." });
    }
  });
}
