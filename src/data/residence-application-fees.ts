import type { ResidenceApplicationFeeBand as FeeBand, ResidenceApplicationFeePeriodId } from "@/domain/article/residence-application-fees";

/** Period IDs and band fields come from the portable fee contract, so there is one period inventory. */
export type { ResidenceApplicationFeePeriodId };
export type ResidenceApplicationFeeBand = Readonly<FeeBand>;

/**
 * Canonical amounts and effective dates for change-of-status and extension fees.
 * Presentation copy is localized separately, while every displayed amount derives from this record.
 */
export const residenceApplicationFees = {
  previousSchedule: {
    acceptedFrom: "2025-04-01",
    acceptedThrough: "2026-09-30",
    counterYen: 6_000,
    onlineYen: 5_500,
  },
  currentSchedule: {
    acceptedFrom: "2026-10-01",
    processingYen: {
      underThreeYears: 330,
      threeYearsOrMore: 550,
    },
    bands: [
      { periodId: "up-to-three-months", counterYen: 10_000, onlineBaseYen: 10_000 },
      { periodId: "over-three-through-six-months", counterYen: 18_000, onlineBaseYen: 15_000 },
      { periodId: "over-six-months-under-one-year", counterYen: 25_000, onlineBaseYen: 21_000 },
      { periodId: "one-year", counterYen: 33_000, onlineBaseYen: 27_000 },
      { periodId: "over-one-under-three-years", counterYen: 48_000, onlineBaseYen: 42_000 },
      { periodId: "three-under-five-years", counterYen: 64_000, onlineBaseYen: 56_000 },
      { periodId: "five-years-or-more", counterYen: 75_000, onlineBaseYen: 65_000 },
    ] satisfies readonly ResidenceApplicationFeeBand[],
  },
  qualifyingReducedFeeYen: 10_000,
  onlinePaymentEmailDomain: "@service-dgft.com",
} as const;

export function residenceApplicationOnlineTotal(band: ResidenceApplicationFeeBand) {
  const processingYen = band.periodId === "three-under-five-years" || band.periodId === "five-years-or-more"
    ? residenceApplicationFees.currentSchedule.processingYen.threeYearsOrMore
    : residenceApplicationFees.currentSchedule.processingYen.underThreeYears;

  return band.onlineBaseYen + processingYen;
}
