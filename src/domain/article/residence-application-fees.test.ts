import { describe, expect, it } from "vitest";
import {
  calculateResidenceApplicationOnlineTotal, residenceApplicationFeeDataSchema, residenceApplicationFeePeriodIds,
  type ResidenceApplicationFeeBand, type ResidenceApplicationProcessingFees,
} from "./residence-application-fees";

// Deliberately synthetic amounts/dates; canonical-source and renderer parity are tested separately.
const fixture = () => ({
  previousSchedule: { acceptedFrom: "2025-01-01", acceptedThrough: "2025-12-31", counterYen: 100, onlineYen: 90 },
  currentSchedule: {
    acceptedFrom: "2026-01-01", processingYen: { underThreeYears: 3, threeYearsOrMore: 7 },
    bands: residenceApplicationFeePeriodIds.map((periodId, index) => ({ periodId, counterYen: 100 + index, onlineBaseYen: 90 + index })),
  },
  qualifyingReducedFeeYen: 10,
  onlinePaymentEmailDomain: "@payments.example",
});

describe("portable residence application fee data", () => {
  it("preserves the supplied schedules, values and ordered bands exactly", () => {
    const input = fixture();
    expect(residenceApplicationFeeDataSchema.parse(input)).toEqual(input);
    expect(input.currentSchedule.bands.map(({ periodId }) => periodId)).toEqual(residenceApplicationFeePeriodIds);
  });

  it.each(["missing", "duplicate", "reordered", "unknown"])("rejects %s period coverage", (mode) => {
    const input = fixture();
    if (mode === "missing") input.currentSchedule.bands.pop();
    if (mode === "duplicate") input.currentSchedule.bands[1] = { ...input.currentSchedule.bands[0]! };
    if (mode === "reordered") input.currentSchedule.bands.reverse();
    if (mode === "unknown") Reflect.set(input.currentSchedule.bands[0]!, "periodId", "future-period");
    expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
  });

  it.each([-1, 0.5, "100", NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])("rejects invalid amount %s at every numeric field", (amount) => {
    for (const field of ["counterYen", "onlineYen"]) {
      const input = fixture(); Reflect.set(input.previousSchedule, field, amount);
      expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
    }
    for (const field of ["counterYen", "onlineBaseYen"]) {
      const input = fixture(); Reflect.set(input.currentSchedule.bands[0]!, field, amount);
      expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
    }
    for (const field of ["underThreeYears", "threeYearsOrMore"]) {
      const input = fixture(); Reflect.set(input.currentSchedule.processingYen, field, amount);
      expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
    }
    const input = fixture(); Reflect.set(input, "qualifyingReducedFeeYen", amount);
    expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
  });

  it("allows exact zero amounts without assigning reduction or exemption eligibility", () => {
    const input = fixture();
    input.previousSchedule.counterYen = input.previousSchedule.onlineYen = input.qualifyingReducedFeeYen = 0;
    input.currentSchedule.processingYen.underThreeYears = input.currentSchedule.processingYen.threeYearsOrMore = 0;
    input.currentSchedule.bands.forEach((band) => { band.counterYen = band.onlineBaseYen = 0; });
    expect(residenceApplicationFeeDataSchema.parse(input)).toEqual(input);
  });

  it.each(["2026-02-30", "2026-01-01T00:00:00Z", " 2026-01-01", "not-a-date"])("rejects malformed acceptance date %s", (value) => {
    for (const target of ["from", "through", "current"]) {
      const input = fixture();
      if (target === "from") input.previousSchedule.acceptedFrom = value;
      if (target === "through") input.previousSchedule.acceptedThrough = value;
      if (target === "current") input.currentSchedule.acceptedFrom = value;
      expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
    }
  });

  it("rejects reversed and overlapping schedules while retaining an explicit gap", () => {
    const reversed = fixture(); reversed.previousSchedule.acceptedThrough = "2024-12-31";
    expect(residenceApplicationFeeDataSchema.safeParse(reversed).success).toBe(false);
    const overlap = fixture(); overlap.currentSchedule.acceptedFrom = "2025-12-31";
    expect(residenceApplicationFeeDataSchema.safeParse(overlap).success).toBe(false);
    const gap = fixture(); gap.currentSchedule.acceptedFrom = "2026-02-01";
    expect(residenceApplicationFeeDataSchema.parse(gap)).toEqual(gap);
  });

  it.each(["ja", "metadata", "band", "processing", "previous", "current"])("rejects extra %s data", (target) => {
    const input = fixture();
    const object = target === "band" ? input.currentSchedule.bands[0]!
      : target === "processing" ? input.currentSchedule.processingYen
        : target === "previous" ? input.previousSchedule : target === "current" ? input.currentSchedule : input;
    Reflect.set(object, target === "ja" ? "ja" : "extra", "Unregistered content");
    expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
  });

  it.each(["sender@payments.example", "https://payments.example", "@bad..example", "@-bad.example", "@bad-.example", "@payments.example\n", "@payments.example/path"])("rejects malformed sender-domain suffix %j", (value) => {
    const input = fixture(); input.onlinePaymentEmailDomain = value;
    expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
  });

  it("preserves sender-domain spelling without normalization", () => {
    const input = fixture(); input.onlinePaymentEmailDomain = "@Payments.Example";
    expect(residenceApplicationFeeDataSchema.parse(input).onlinePaymentEmailDomain).toBe("@Payments.Example");
  });

  it("rejects a rounded online sum even when both operands are valid safe integers", () => {
    const input = fixture(); input.currentSchedule.bands[0]!.onlineBaseYen = Number.MAX_SAFE_INTEGER;
    expect(residenceApplicationFeeDataSchema.safeParse(input).success).toBe(false);
  });
});

describe("portable online fee computation", () => {
  it("applies the supplied charges on both sides of the three-year boundary", () => {
    const input = fixture();
    expect(input.currentSchedule.bands.map((band) => calculateResidenceApplicationOnlineTotal(band, input.currentSchedule.processingYen)))
      .toEqual([93, 94, 95, 96, 97, 102, 103]);
    expect(calculateResidenceApplicationOnlineTotal(input.currentSchedule.bands[0]!, { underThreeYears: 10, threeYearsOrMore: 20 })).toBe(100);
    expect(calculateResidenceApplicationOnlineTotal(input.currentSchedule.bands[5]!, { underThreeYears: 10, threeYearsOrMore: 20 })).toBe(115);
  });

  it("rejects invalid direct-call inputs and unsafe totals", () => {
    const band = fixture().currentSchedule.bands[0]!;
    expect(() => calculateResidenceApplicationOnlineTotal({ ...band, periodId: "unknown" } as unknown as ResidenceApplicationFeeBand, { underThreeYears: 3, threeYearsOrMore: 7 })).toThrow();
    expect(() => calculateResidenceApplicationOnlineTotal(band, { underThreeYears: "3", threeYearsOrMore: 7 } as unknown as ResidenceApplicationProcessingFees)).toThrow();
    expect(() => calculateResidenceApplicationOnlineTotal({ ...band, onlineBaseYen: Number.MAX_SAFE_INTEGER }, { underThreeYears: 3, threeYearsOrMore: 7 })).toThrow(RangeError);
  });
});
