import { localGuidanceSupplementSchema, type LocalGuidanceSupplement } from "@/domain/geography/local-guidance";

// Default for earlier records; new research batches set lastCheckedAt per record.
// A source check is not human editorial approval or source-monitoring acceptance.
const sharedReviewState = { lastCheckedAt: "2026-09-23", status: "needs-review" } as const;

/** Applies the batch review state and validates each municipality-specific supplement. */
export function defineLocalGuidanceSupplements(records: readonly Record<string, unknown>[]): readonly LocalGuidanceSupplement[] {
  return records.map((record) => localGuidanceSupplementSchema.parse({ ...sharedReviewState, ...record }));
}
