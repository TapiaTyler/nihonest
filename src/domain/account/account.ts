import { z } from "zod";
import {
  anonymousPreferencesSchema,
  type AnonymousPreferences,
} from "@/domain/personalization/preferences";
import { journeyStageIdSchema } from "@/domain/taxonomy/taxonomy";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const accountProfileSchema = z.object({
  displayName: z.string().trim().max(80).optional(),
});

export const accountPreferenceRowSchema = z.object({
  user_id: z.uuid(),
  journey_stage: journeyStageIdSchema.nullable(),
  journey_id: stableIdSchema.nullable(),
  route_id: stableIdSchema.nullable(),
  focused_article_id: stableIdSchema.nullable(),
  onboarding_completed: z.boolean(),
});

export type AccountPreferenceRow = z.infer<typeof accountPreferenceRowSchema>;

/** Converts a private database row back into the browser-independent personalization contract. */
export function accountRowToAnonymousPreferences(row: AccountPreferenceRow): AnonymousPreferences {
  return anonymousPreferencesSchema.parse({
    version: 2,
    journeyStage: row.journey_stage ?? undefined,
    journeyId: row.journey_id ?? undefined,
    routeId: row.route_id ?? undefined,
    focusedArticleId: row.focused_article_id ?? undefined,
    onboardingCompleted: row.onboarding_completed,
  });
}

/** Serializes only the approved anonymous preference fields for a user-owned upsert. */
export function anonymousPreferencesToAccountRow(userId: string, preferences: AnonymousPreferences) {
  return accountPreferenceRowSchema.parse({
    user_id: userId,
    journey_stage: preferences.journeyStage ?? null,
    journey_id: preferences.journeyId ?? null,
    route_id: preferences.routeId ?? null,
    focused_article_id: preferences.focusedArticleId ?? null,
    onboarding_completed: preferences.onboardingCompleted,
  });
}
