import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const GLOSSARY_REVIEW_STATES = ["new", "learning", "reviewed"] as const;
export const glossaryReviewStateSchema = z.enum(GLOSSARY_REVIEW_STATES);

export const glossaryStudyProgressSchema = z.object({
  termId: stableIdSchema,
  state: glossaryReviewStateSchema,
  reviewCount: z.number().int().nonnegative(),
  updatedAt: z.iso.datetime(),
  lastReviewedAt: z.iso.datetime().optional(),
});

export type GlossaryStudyProgress = z.infer<typeof glossaryStudyProgressSchema>;
export type GlossaryReviewOutcome = "again" | "understood";

export function createGlossaryStudyProgress(termId: string, updatedAt: string): GlossaryStudyProgress {
  return glossaryStudyProgressSchema.parse({ termId, state: "new", reviewCount: 0, updatedAt });
}

export function recordGlossaryReview(
  progress: GlossaryStudyProgress,
  outcome: GlossaryReviewOutcome,
  reviewedAt: string,
): GlossaryStudyProgress {
  return glossaryStudyProgressSchema.parse({
    ...progress,
    state: outcome === "understood" ? "reviewed" : "learning",
    reviewCount: progress.reviewCount + 1,
    updatedAt: reviewedAt,
    lastReviewedAt: reviewedAt,
  });
}

