import { z } from "zod";

/** Stable presentation order of the existing fee bands; a new period family requires a contract revision. */
export const residenceApplicationFeePeriodIds = [
  "up-to-three-months", "over-three-through-six-months", "over-six-months-under-one-year", "one-year",
  "over-one-under-three-years", "three-under-five-years", "five-years-or-more",
] as const;

export const residenceApplicationFeePeriodIdSchema = z.enum(residenceApplicationFeePeriodIds);
const yen = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const processingFeesSchema = z.object({ underThreeYears: yen, threeYearsOrMore: yen }).strict();

export const residenceApplicationFeeBandSchema = z.object({
  periodId: residenceApplicationFeePeriodIdSchema,
  counterYen: yen,
  onlineBaseYen: yen,
}).strict();

export type ResidenceApplicationFeePeriodId = z.infer<typeof residenceApplicationFeePeriodIdSchema>;
export type ResidenceApplicationFeeBand = z.infer<typeof residenceApplicationFeeBandSchema>;
export type ResidenceApplicationProcessingFees = z.infer<typeof processingFeesSchema>;

function onlineTotal(band: Readonly<ResidenceApplicationFeeBand>, processingFees: Readonly<ResidenceApplicationProcessingFees>): number {
  const charge = band.periodId === "three-under-five-years" || band.periodId === "five-years-or-more"
    ? processingFees.threeYearsOrMore : processingFees.underThreeYears;
  return band.onlineBaseYen + charge;
}

/**
 * Portable numeric/date contract for the existing fee data. It carries no translated prose or eligibility rule.
 * Acceptance dates determine the schedule; an effective date is not an editorial review date. Validation never
 * coerces amounts, trims strings, reorders bands or derives a human-review state. Both schedules remain explicit.
 */
export const residenceApplicationFeeDataSchema = z.object({
  previousSchedule: z.object({
    acceptedFrom: z.iso.date(), acceptedThrough: z.iso.date(), counterYen: yen, onlineYen: yen,
  }).strict(),
  currentSchedule: z.object({
    acceptedFrom: z.iso.date(),
    processingYen: processingFeesSchema,
    bands: residenceApplicationFeeBandSchema.array().length(residenceApplicationFeePeriodIds.length),
  }).strict(),
  qualifyingReducedFeeYen: yen,
  // A sender-domain suffix, not a complete address, URL, credential or provider configuration.
  onlinePaymentEmailDomain: z.string().max(254).regex(
    /^@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i,
  ).refine((value) => !/\s/.test(value), "Sender-domain suffix cannot contain whitespace."),
}).strict().superRefine((fees, context) => {
  if (fees.previousSchedule.acceptedFrom > fees.previousSchedule.acceptedThrough) {
    context.addIssue({ code: "custom", path: ["previousSchedule", "acceptedThrough"], message: "Previous acceptance interval is reversed." });
  }
  if (fees.previousSchedule.acceptedThrough >= fees.currentSchedule.acceptedFrom) {
    context.addIssue({ code: "custom", path: ["currentSchedule", "acceptedFrom"], message: "Acceptance schedules must be ordered and cannot overlap." });
  }
  fees.currentSchedule.bands.forEach((band, index) => {
    if (band.periodId !== residenceApplicationFeePeriodIds[index]) {
      context.addIssue({ code: "custom", path: ["currentSchedule", "bands", index, "periodId"], message: "Fee bands must contain every period exactly once in canonical order." });
    }
    if (!Number.isSafeInteger(onlineTotal(band, fees.currentSchedule.processingYen))) {
      context.addIssue({ code: "custom", path: ["currentSchedule", "bands", index, "onlineBaseYen"], message: "Online total exceeds exact integer arithmetic." });
    }
  });
});

export type ResidenceApplicationFeeData = z.infer<typeof residenceApplicationFeeDataSchema>;

/**
 * Base fee plus the schedule's processing charge: the two bands starting at three years use the higher-period
 * charge. Inputs are validated even for direct callers; unsafe sums fail rather than exporting a rounded total.
 * This does not choose a schedule, establish relief eligibility or consult the current date.
 */
export function calculateResidenceApplicationOnlineTotal(
  band: Readonly<ResidenceApplicationFeeBand>,
  processingFees: Readonly<ResidenceApplicationProcessingFees>,
): number {
  const total = onlineTotal(residenceApplicationFeeBandSchema.parse(band), processingFeesSchema.parse(processingFees));
  if (!Number.isSafeInteger(total)) throw new RangeError("Online total exceeds exact integer arithmetic.");
  return total;
}
