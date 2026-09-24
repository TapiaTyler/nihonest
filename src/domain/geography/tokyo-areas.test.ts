import { describe, expect, it } from "vitest";
import { getAdministrativeGeographyChildren } from "@/data/geography";
import { groupMunicipalityOptions, tokyoAreaForCode } from "./tokyo-areas";

describe("Tokyo area divisions", () => {
  it("splits Tokyo's 62 municipalities into the special wards, the Tama area, and the island area", () => {
    const groups = groupMunicipalityOptions(getAdministrativeGeographyChildren("jp-13000"), ({ code }) => code);
    expect(groups.map(({ label, options }) => [label, options.length])).toEqual([["Special wards", 23], ["Tama area", 30], ["Island area", 9]]);
    expect(groups[1]!.options.map(({ names }) => names.ja)).toEqual(expect.arrayContaining(["八王子市", "瑞穂町", "檜原村", "奥多摩町"]));
    expect(groups[2]!.options.map(({ names }) => names.ja)).toEqual(expect.arrayContaining(["大島町", "八丈町", "小笠原村"]));
  });

  it("leaves other prefectures and Tokyo itself ungrouped", () => {
    expect(tokyoAreaForCode("13000")).toBeUndefined();
    expect(tokyoAreaForCode("27100")).toBeUndefined();
    expect(groupMunicipalityOptions(getAdministrativeGeographyChildren("jp-27000"), ({ code }) => code)).toEqual([
      { label: undefined, options: getAdministrativeGeographyChildren("jp-27000") },
    ]);
  });
});
