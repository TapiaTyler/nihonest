import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { prefectureGeneralGuides, prefectureNationalGuides, getPrefectureFinderData } from "./prefecture-finder";

const articleExists = (id: string) => existsSync(resolve(process.cwd(), `content/articles/${id}.mdx`));

describe("prefecture finder data", () => {
  const { prefectures, municipalities, coverage } = getPrefectureFinderData();

  it("offers every mapped municipality or ward under its canonical prefecture", () => {
    const mapped = administrativeGeographies.filter(({ type }) => type !== "prefecture" && type !== "metropolis");
    expect(municipalities).toHaveLength(mapped.length);
    expect(new Set(municipalities.map(({ id }) => id))).toEqual(new Set(mapped.map(({ id }) => id)));
    expect(municipalities.find(({ id }) => id === "jp-01101")?.prefectureId).toBe("jp-01000");
    expect(municipalities.find(({ id }) => id === "jp-13104")?.prefectureId).toBe("jp-13000");
  });

  it("maps all 47 official IDs into exactly one orientation region", () => {
    const ids = japanPrefectureRegions.flatMap(({ prefectureIds }) => prefectureIds);
    expect(prefectures).toHaveLength(47);
    expect(new Set(ids).size).toBe(47);
    expect(new Set(ids)).toEqual(new Set(prefectures.map(({ id }) => id)));
    for (const prefecture of prefectures) {
      expect(prefecture.id).toBe(`jp-${prefecture.code}`);
      expect(prefecture.names.en).toBeTruthy();
      expect(prefecture.names.ja).toBeTruthy();
      expect(administrativeGeographies.find(({ id }) => id === prefecture.id)).toBeTruthy();
    }
  });

  it("projects exactly the researched supplements, grouped by canonical prefecture in code order", () => {
    // Derived from the data, so a new researched batch needs no edits here.
    const locationIds = [...new Set(localGuidanceSupplements.map(({ geographyId }) => getAdministrativeGeography(geographyId)!.id))];
    const expectedPrefectures = [...new Set(locationIds.map((id) => getAdministrativeGeography(id)!.parentId!))];
    expect(coverage.map(({ prefectureId }) => prefectureId).sort()).toEqual([...expectedPrefectures].sort());
    for (const { prefectureId, municipalities: covered } of coverage) {
      const ids = covered.map(({ id }) => id);
      expect(ids).toEqual(locationIds.filter((id) => getAdministrativeGeography(id)!.parentId === prefectureId).sort());
      for (const municipality of covered) {
        expect(getAdministrativeGeography(municipality.id)?.parentId).toBe(prefectureId);
        expect(municipality.name).toBe(supportedGeographies.find(({ id }) => getAdministrativeGeography(id)!.id === municipality.id)?.name);
      }
    }
    const projected = coverage.flatMap(({ municipalities: covered }) => covered.flatMap(({ supplements }) => supplements));
    expect(new Set(projected.map(({ id }) => id))).toEqual(new Set(localGuidanceSupplements.map(({ id }) => id)));
    const today = new Date().toISOString().slice(0, 10);
    for (const supplement of projected) {
      expect(supplement.status).toBe("needs-review");
      expect(supplement.lastCheckedAt <= today, supplement.id).toBe(true);
      expect(articleExists(supplement.articleId)).toBe(true);
    }
    for (const guide of [...prefectureNationalGuides, ...prefectureGeneralGuides]) {
      expect(articleExists(guide.articleId)).toBe(true);
    }
  });
});
