import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements } from "@/data/local-guidance";
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

  it("projects only real municipal supplements under their canonical prefecture", () => {
    expect(coverage.map(({ prefectureId }) => prefectureId).sort()).toEqual(["jp-13000", "jp-23000"]);
    expect(coverage.find(({ prefectureId }) => prefectureId === "jp-13000")?.municipalities.map(({ id }) => id)).toEqual(["jp-13101", "jp-13102", "jp-13103", "jp-13104", "jp-13105", "jp-13106", "jp-13107", "jp-13108", "jp-13109", "jp-13110", "jp-13111", "jp-13112", "jp-13113", "jp-13114", "jp-13115", "jp-13116", "jp-13117", "jp-13118", "jp-13119", "jp-13120", "jp-13121", "jp-13122", "jp-13123"]);
    expect(coverage.find(({ prefectureId }) => prefectureId === "jp-13000")?.municipalities.slice(4).map(({ name }) => name)).toEqual(["Bunkyo City", "Taito City", "Sumida City", "Koto City", "Shinagawa City", "Meguro City", "Ota City", "Setagaya City", "Shibuya City", "Nakano City", "Suginami City", "Toshima City", "Kita City", "Arakawa City", "Itabashi City", "Nerima City", "Adachi City", "Katsushika City", "Edogawa City"]);
    expect(coverage.find(({ prefectureId }) => prefectureId === "jp-13000")?.municipalities.flatMap(({ supplements }) => supplements.filter(({ articleId }) => articleId === "registering-your-address-after-arrival").map(({ id }) => id))).toEqual([
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
    ]);
    expect(coverage.find(({ prefectureId }) => prefectureId === "jp-23000")?.municipalities.map(({ id }) => id)).toEqual(["jp-23100"]);
    const projected = coverage.flatMap(({ prefectureId, municipalities }) => municipalities.flatMap((municipality) => {
      expect(getAdministrativeGeography(municipality.id)?.parentId).toBe(prefectureId);
      return municipality.supplements;
    }));
    expect(new Set(projected.map(({ id }) => id))).toEqual(new Set(localGuidanceSupplements.map(({ id }) => id)));
    for (const supplement of projected) {
      expect(supplement.status).toBe("needs-review");
      expect(supplement.lastCheckedAt).toBe("2026-09-23");
      expect(articleExists(supplement.articleId)).toBe(true);
    }
    for (const guide of prefectureNationalGuides) {
      expect(articleExists(guide.articleId)).toBe(true);
    }
    for (const guide of prefectureGeneralGuides) {
      expect(articleExists(guide.articleId)).toBe(true);
    }
  });
});
