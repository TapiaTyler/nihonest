import { describe, expect, it } from "vitest";
import { residenceApplicationFeesComponent } from "@/data/article-components";
import { residenceApplicationFees } from "@/data/residence-application-fees";
import {
  fillResidenceApplicationFeeTemplate,
  residenceApplicationFeeCopyIds,
  residenceApplicationFeeCopySchema,
  residenceApplicationFeeTemplateValues,
} from "./residence-application-fee-copy";
import { residenceApplicationFeeDataSchema, residenceApplicationFeePeriodIds } from "./residence-application-fees";

const copy = residenceApplicationFeesComponent;
const withMessage = (id: string, text: string) => ({ ...copy, messages: copy.messages.map((message) => message.id === id ? { ...message, text } : message) });

describe("residence application fee copy", () => {
  it("accepts the canonical English copy unchanged, with one label per fee period", () => {
    expect(residenceApplicationFeeCopySchema.parse(copy)).toEqual(copy);
    for (const periodId of residenceApplicationFeePeriodIds) expect(residenceApplicationFeeCopyIds).toContain(`period-${periodId}`);
  });

  it("requires every message once in canonical order", () => {
    expect(residenceApplicationFeeCopySchema.safeParse({ ...copy, messages: copy.messages.slice(1) }).success).toBe(false);
    expect(residenceApplicationFeeCopySchema.safeParse({ ...copy, messages: [copy.messages[1], copy.messages[0], ...copy.messages.slice(2)] }).success).toBe(false);
  });

  it("rejects blank copy and placeholders the fee record cannot fill", () => {
    expect(residenceApplicationFeeCopySchema.safeParse(withMessage("heading", " ")).success).toBe(false);
    expect(residenceApplicationFeeCopySchema.safeParse(withMessage("heading", "Fees {total}")).success).toBe(false);
  });

  it("formats every value from the numeric record in each language", () => {
    const fees = residenceApplicationFeeDataSchema.parse(residenceApplicationFees);
    expect(residenceApplicationFeeTemplateValues(fees, "en")).toMatchObject({ previousThrough: "September 30, 2026", reducedFee: "JPY 10,000", emailDomain: "@service-dgft.com" });
    expect(residenceApplicationFeeTemplateValues(fees, "ja")).toMatchObject({ previousThrough: "2026年9月30日", processingThreeOrMore: "550円" });
  });

  it("fills only supplied names and never reads inherited properties", () => {
    expect(fillResidenceApplicationFeeTemplate("{a} and {constructor}", { a: "A" })).toBe("A and {constructor}");
  });
});
