import { describe, expect, it } from "vitest";
import { administrativeGeographies, administrativeGeographySources, getAdministrativeGeography, getAdministrativeGeographyAncestors, getAdministrativeGeographyByCode, getAdministrativeGeographyChildren } from "./index";
import { supportedGeographies } from "@/data/local-guidance/geographies";

describe("national geography snapshot", () => {
  it("covers 47 prefectures, 23 special wards, and all 171 wards of 20 designated cities", () => {
    expect(administrativeGeographies).toHaveLength(261);
    expect(administrativeGeographies.filter(({ type }) => type === "prefecture" || type === "metropolis").map(({ prefectureCode }) => prefectureCode))
      .toEqual(Array.from({ length: 47 }, (_, index) => String(index + 1).padStart(2, "0")));
    expect(administrativeGeographies.filter(({ type }) => type === "special-ward")).toHaveLength(23);
    expect(administrativeGeographies.filter(({ type }) => type === "administrative-ward")).toHaveLength(171);
    const expectedWardCounts = {
      "01100": 10, "04100": 5, "11100": 10, "12100": 6, "14100": 18,
      "14130": 7, "14150": 3, "15100": 8, "22100": 3, "22130": 3,
      "23100": 16, "26100": 11, "27100": 24, "27140": 7, "28100": 9,
      "33100": 4, "34100": 8, "40100": 7, "40130": 7, "43100": 5,
    };
    expect(administrativeGeographies.filter(({ type }) => type === "designated-city")).toHaveLength(20);
    for (const [code, count] of Object.entries(expectedWardCounts)) {
      const children = getAdministrativeGeographyChildren(`jp-${code}`);
      expect(children).toHaveLength(count);
      expect(children.every(({ type }) => type === "administrative-ward")).toBe(true);
    }
  });

  it("keeps same-named wards distinct by code and parent", () => {
    const tokyoChuo = getAdministrativeGeographyByCode("13102")!;
    const sapporoChuo = getAdministrativeGeographyByCode("01101")!;
    expect(tokyoChuo.type).toBe("special-ward");
    expect(sapporoChuo.type).toBe("administrative-ward");
    expect(tokyoChuo.parentId).toBe("jp-13000");
    expect(sapporoChuo.parentId).toBe("jp-01100");
    expect(getAdministrativeGeographyAncestors(sapporoChuo.id).map(({ id }) => id)).toEqual(["jp-01000", "jp-01100"]);
  });

  it("uses Hamamatsu's current three wards and excludes retired codes, including former Tenryu", () => {
    expect(getAdministrativeGeographyChildren("jp-22130").map(({ code }) => code)).toEqual(["22138", "22139", "22140"]);
    for (const code of ["22131", "22132", "22133", "22134", "22135", "22136", "22137"]) {
      expect(getAdministrativeGeographyByCode(code)).toBeUndefined();
    }
  });

  it("resolves legacy IDs and keeps researched coverage narrower than the administrative registry", () => {
    expect(supportedGeographies.map(({ id }) => id)).toEqual(["tokyo", "aichi", "jp-13101", "jp-13102", "jp-13103", "shinjuku", "jp-13105", "jp-13106", "jp-13107", "jp-13108", "jp-13109", "jp-13110", "jp-13111", "jp-13112", "jp-13113", "jp-13114", "jp-13115", "jp-13116", "jp-13117", "jp-13118", "jp-13119", "jp-13120", "jp-13121", "jp-13122", "jp-13123", "nagoya"]);
    expect(supportedGeographies.filter(({ selectable }) => selectable).map(({ id }) => id)).toEqual(["jp-13101", "jp-13102", "jp-13103", "shinjuku", "jp-13105", "jp-13106", "jp-13107", "jp-13108", "jp-13109", "jp-13110", "jp-13111", "jp-13112", "jp-13113", "jp-13114", "jp-13115", "jp-13116", "jp-13117", "jp-13118", "jp-13119", "jp-13120", "jp-13121", "jp-13122", "jp-13123", "nagoya"]);
    for (const old of supportedGeographies) {
      const canonical = getAdministrativeGeography(old.id)!;
      expect(canonical.type).toBe(old.type);
      if (old.parentId) expect(canonical.parentId).toBe(getAdministrativeGeography(old.parentId)?.id);
    }
    expect(getAdministrativeGeography("shinjuku")).toBe(getAdministrativeGeography("jp-13104"));
    expect(getAdministrativeGeographyByCode("131041")).toBe(getAdministrativeGeography("shinjuku"));
    expect(getAdministrativeGeographyByCode("131042")).toBeUndefined();
    expect(getAdministrativeGeographyChildren("tokyo")).toHaveLength(23);
  });

  it("has a dated source for every record and only source-backed readings", () => {
    const uniqueCodes = new Set(administrativeGeographies.map(({ localGovernmentCode }) => localGovernmentCode));
    expect(uniqueCodes.size).toBe(261);
    for (const source of administrativeGeographySources) {
      expect(new URL(source.url).hostname).toBe("www.j-lis.go.jp");
      expect(source.retrievedAt).toBe("2026-09-23");
      expect(administrativeGeographies.filter(({ sourceId }) => sourceId === source.id)).toHaveLength(source.recordCount);
    }
    expect(administrativeGeographies.filter(({ type }) => type.endsWith("ward")).every(({ names }) => Boolean(names.kana))).toBe(true);
    expect(administrativeGeographies.filter(({ type }) => type === "prefecture" || type === "metropolis").every(({ names }) => Boolean(names.en))).toBe(true);
  });
});
