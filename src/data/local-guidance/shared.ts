import { localGuidanceSupplementSchema, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";

const sharedReviewState = { lastCheckedAt: "2026-09-13", status: "needs-review" } as const;

/** Applies the batch review state and validates each municipality-specific supplement. */
export function defineLocalGuidanceSupplements(records: readonly Record<string, unknown>[]): readonly LocalGuidanceSupplement[] {
  return records.map((record) => localGuidanceSupplementSchema.parse({ ...sharedReviewState, ...record }));
}
