import { describe, expect, it } from "vitest";
import { administrativeGeographies, administrativeGeographySources, getAdministrativeGeography, getAdministrativeGeographyAncestors, getAdministrativeGeographyByCode, getAdministrativeGeographyChildren } from "./index";
import { supportedGeographies } from "@/data/local-guidance/geographies";

describe("national geography snapshot", () => {
  it("covers 47 prefectures, all 62 Tokyo municipalities, and 20 designated cities without their wards", () => {
    expect(administrativeGeographies).toHaveLength(157);
    expect(administrativeGeographies.filter(({ type }) => type === "prefecture" || type === "metropolis").map(({ prefectureCode }) => prefectureCode))
      .toEqual(Array.from({ length: 47 }, (_, index) => String(index + 1).padStart(2, "0")));
    expect(administrativeGeographies.filter(({ type }) => type === "special-ward")).toHaveLength(23);
    // Designated cities run local procedures for all their wards, so ward records are not kept.
    expect(administrativeGeographies.filter(({ type }) => type === "administrative-ward")).toHaveLength(0);
    // Tokyo: 23 special wards plus the Tama area and islands (26 cities, 5 towns, 8 villages).
    const tokyoTypes = getAdministrativeGeographyChildren("jp-13000").map(({ type }) => type);
    expect(tokyoTypes.filter((type) => type === "city")).toHaveLength(26);
    expect(tokyoTypes.filter((type) => type === "town")).toHaveLength(5);
    expect(tokyoTypes.filter((type) => type === "village")).toHaveLength(8);
    const designatedCities = administrativeGeographies.filter(({ type }) => type === "designated-city");
    expect(designatedCities).toHaveLength(20);
    for (const city of designatedCities) {
      expect(getAdministrativeGeographyChildren(city.id)).toHaveLength(0);
      expect(getAdministrativeGeographyAncestors(city.id).map(({ id }) => id)).toEqual([`jp-${city.prefectureCode}000`]);
    }
  });

  it("resolves legacy IDs and keeps researched coverage narrower than the administrative registry", () => {
    // Rules rather than a list, so adding researched locations needs no edit here.
    const supportedIds = supportedGeographies.map(({ id }) => id);
    for (const legacyId of ["tokyo", "aichi", "shinjuku", "nagoya"]) expect(supportedIds).toContain(legacyId);
    expect(new Set(supportedGeographies.map(({ id }) => getAdministrativeGeography(id)?.id)).size).toBe(supportedIds.length);
    expect(supportedIds.length).toBeLessThan(administrativeGeographies.length);
    for (const old of supportedGeographies) {
      const canonical = getAdministrativeGeography(old.id)!;
      expect(canonical.type).toBe(old.type);
      if (old.parentId) expect(canonical.parentId).toBe(getAdministrativeGeography(old.parentId)?.id);
    }
    expect(getAdministrativeGeography("shinjuku")).toBe(getAdministrativeGeography("jp-13104"));
    expect(getAdministrativeGeographyByCode("131041")).toBe(getAdministrativeGeography("shinjuku"));
    expect(getAdministrativeGeographyByCode("131042")).toBeUndefined();
    expect(getAdministrativeGeographyChildren("tokyo")).toHaveLength(62);
  });

  it("has a dated source for every record and only source-backed readings", () => {
    const uniqueCodes = new Set(administrativeGeographies.map(({ localGovernmentCode }) => localGovernmentCode));
    expect(uniqueCodes.size).toBe(157);
    for (const source of administrativeGeographySources) {
      expect(new URL(source.url).hostname).toBe("www.j-lis.go.jp");
      expect(source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isFinite(Date.parse(source.retrievedAt))).toBe(true);
      expect(Date.parse(source.retrievedAt)).toBeLessThanOrEqual(Date.now());
      expect(administrativeGeographies.filter(({ sourceId }) => sourceId === source.id)).toHaveLength(source.recordCount);
    }
    expect(administrativeGeographies.filter(({ type }) => type !== "prefecture" && type !== "metropolis").every(({ names }) => Boolean(names.kana))).toBe(true);
    expect(administrativeGeographies.filter(({ type }) => type === "prefecture" || type === "metropolis").every(({ names }) => Boolean(names.en))).toBe(true);
  });
});
