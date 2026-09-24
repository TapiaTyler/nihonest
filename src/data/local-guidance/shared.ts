import { localGuidanceSupplementSchema, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";

// B1 pilot and all seven Tokyo ward batches were checked on this date. A source
// check is not human editorial approval or source-monitoring baseline acceptance.
const sharedReviewState = { lastCheckedAt: "2026-09-23", status: "needs-review" } as const;

/** Applies the batch review state and validates each municipality-specific supplement. */
export function defineLocalGuidanceSupplements(records: readonly Record<string, unknown>[]): readonly LocalGuidanceSupplement[] {
  return records.map((record) => localGuidanceSupplementSchema.parse({ ...sharedReviewState, ...record }));
}
