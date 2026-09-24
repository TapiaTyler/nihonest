import { describe, expect, it } from "vitest";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import { searchPrefectures } from "./prefecture";

describe("prefecture finder search", () => {
  const { prefectures } = getPrefectureFinderData();

  it("matches English, Japanese, wide Latin, accented Latin, and official codes", () => {
    for (const query of ["tokyo", "東京都", "ＴＯＫＹＯ", "Tókyó", "13000"]) {
      expect(searchPrefectures(prefectures, query).map(({ id }) => id)).toEqual(["jp-13000"]);
    }
    expect(searchPrefectures(prefectures, "not-a-place")).toEqual([]);
    expect(searchPrefectures(prefectures, "")).toHaveLength(47);
  });
});
