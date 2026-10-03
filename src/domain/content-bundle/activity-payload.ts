import { activityCrossReferenceSchema } from "@/domain/activity-cross-reference/activity-cross-reference";
import { translationArtifactSchema } from "@/domain/translation/translation";

/** IDs used by answers and conditional rules must be unambiguous within their canonical scopes. */
export const bundledActivitySchema = activityCrossReferenceSchema.superRefine((activity, context) => {
  for (const records of [activity.questions, activity.rules, ...activity.questions.map(({ choices }) => choices)]) {
    if (new Set(records.map(({ id }) => id)).size !== records.length) {
      context.addIssue({ code: "custom", message: "Activity question, rule and scoped choice IDs must be unique." });
    }
  }
});

export const bundledActivityTranslationSchema = translationArtifactSchema.superRefine((artifact, context) => {
  if (artifact.contentKind !== "activity-cross-reference" || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
    context.addIssue({ code: "custom", message: "Expected an active Japanese activity artifact." });
  }
  if (Object.values(artifact.fields).some((value) => !value)) {
    context.addIssue({ code: "custom", message: "Supplied activity overlay text must be nonempty." });
  }
});
