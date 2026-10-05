import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { residenceApplicationFees, residenceApplicationOnlineTotal } from "@/data/residence-application-fees";
import { ResidenceApplicationFeeSection } from "@/components/content/residence-application-fee-section";
import { calculateResidenceApplicationOnlineTotal, residenceApplicationFeeDataSchema } from "@/domain/article/residence-application-fees";

describe("numeric fee contract preparation against the current web owner", () => {
  it("accepts canonical data without changing source serialization", () => {
    const before = JSON.stringify(residenceApplicationFees);
    const parsed = residenceApplicationFeeDataSchema.parse(residenceApplicationFees);
    expect(parsed).toEqual(residenceApplicationFees);
    expect(JSON.stringify(parsed)).toBe(before);
    expect(JSON.stringify(residenceApplicationFees)).toBe(before);
    for (const band of parsed.currentSchedule.bands) {
      expect(calculateResidenceApplicationOnlineTotal(band, parsed.currentSchedule.processingYen)).toBe(residenceApplicationOnlineTotal(band));
    }
  });

  it.each(["en", "ja"] as const)("preserves all rendered amounts and band order in %s", (locale) => {
    const parsed = residenceApplicationFeeDataSchema.parse(residenceApplicationFees);
    const document = new DOMParser().parseFromString(renderToStaticMarkup(<ResidenceApplicationFeeSection locale={locale} />), "text/html");
    const yen = (amount: number) => locale === "ja" ? `${amount.toLocaleString("en-US")}円` : `JPY ${amount.toLocaleString("en-US")}`;
    expect([...document.querySelectorAll("tbody tr")].map((row) => [...row.querySelectorAll("td")].map((cell) => cell.textContent)))
      .toEqual(parsed.currentSchedule.bands.map((band) => [yen(band.counterYen), yen(band.onlineBaseYen), yen(calculateResidenceApplicationOnlineTotal(band, parsed.currentSchedule.processingYen))]));
  });
});
