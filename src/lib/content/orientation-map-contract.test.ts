import { expect, it } from "vitest";
import { administrativeGeographies } from "@/data/geography";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { parseOrientationMapData } from "@/domain/geography/orientation-map-data";

it("preserves all canonical orientation regions, prefecture identities and projected geometry bytes", () => {
  const references = administrativeGeographies.filter(({ type }) => type === "prefecture" || type === "metropolis")
    .map(({ id, code, names }) => ({ id, code, names: { en: names.en, ja: names.ja } }));
  const source = { regions: japanPrefectureRegions, paths: prefectureMapPaths };
  const before = JSON.stringify(source);
  const parsed = parseOrientationMapData(source.regions, source.paths, references);
  expect(JSON.stringify(parsed)).toBe(before);
  expect(JSON.stringify(source)).toBe(before);
  expect(references).toHaveLength(47);
  expect(parsed.regions).toHaveLength(8);
  expect(parsed.paths).toHaveLength(47);
  expect(parsed.paths.reduce((count, { d }) => count + (d.match(/Z/g)?.length ?? 0), 0)).toBe(171);
});
