import { describe, expect, it } from "vitest";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import { validateLocalGuidanceCollection } from "./local-guidance";

describe("local guidance model", () => {
  it("assembles researched municipalities and subject pairs in code and subject order", () => {
    expect(supportedGeographies.map(({ id }) => id)).toEqual([
      "tokyo",
      "aichi",
      "jp-13101",
      "jp-13102",
      "jp-13103",
      "shinjuku",
      "jp-13105",
      "jp-13106",
      "jp-13107",
      "jp-13108",
      "jp-13109",
      "jp-13110",
      "jp-13111",
      "jp-13112",
      "jp-13113",
      "jp-13114",
      "jp-13115",
      "jp-13116",
      "jp-13117",
      "jp-13118",
      "jp-13119",
      "jp-13120",
      "jp-13121",
      "jp-13122",
      "jp-13123",
      "nagoya",
    ]);
    expect(localGuidanceSupplements.map(({ id }) => id)).toEqual([
      "chiyoda-address-registration",
      "chuo-address-registration",
      "minato-address-registration",
      "shinjuku-address-registration",
      "bunkyo-address-registration",
      "taito-address-registration",
      "sumida-address-registration",
      "koto-address-registration",
      "shinagawa-address-registration",
      "meguro-address-registration",
      "ota-address-registration",
      "setagaya-address-registration",
      "shibuya-address-registration",
      "nakano-address-registration",
      "suginami-address-registration",
      "toshima-address-registration",
      "kita-address-registration",
      "arakawa-address-registration",
      "itabashi-address-registration",
      "nerima-address-registration",
      "adachi-address-registration",
      "katsushika-address-registration",
      "edogawa-address-registration",
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
    expect(localGuidanceSupplements).toHaveLength(34);
  });
});
