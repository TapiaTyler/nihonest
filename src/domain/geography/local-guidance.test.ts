import { describe, expect, it } from "vitest";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import { validateLocalGuidanceCollection } from "./local-guidance";

describe("local guidance model", () => {
  it("assembles the pilot geographies and subject pairs in their established order", () => {
    expect(supportedGeographies.map(({ id }) => id)).toEqual([
      "tokyo",
      "aichi",
      "shinjuku",
      "nagoya",
    ]);
    expect(localGuidanceSupplements.map(({ id }) => id)).toEqual([
      "shinjuku-address-registration",
      "nagoya-address-registration",
      "shinjuku-national-health-insurance",
      "nagoya-national-health-insurance",
      "shinjuku-household-waste",
      "nagoya-household-waste",
      "shinjuku-resident-tax",
      "nagoya-resident-tax",
      "shinjuku-disaster-preparation",
      "nagoya-disaster-preparation",
      "shinjuku-language-and-consultation",
      "nagoya-language-and-consultation",
    ]);
  });

  it("links every pilot supplement to known geography, article, and source records", () => {
    expect(() => validateLocalGuidanceCollection(
      supportedGeographies,
      localGuidanceSupplements,
      [...new Set(localGuidanceSupplements.map(({ articleId }) => articleId))],
      sources.map(({ id }) => id),
    )).not.toThrow();
    expect(localGuidanceSupplements).toHaveLength(12);
  });
});
