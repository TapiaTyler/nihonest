import { describe, expect, it } from "vitest";
import { sources } from "@/data/sources";
import { japaneseOrganizationNames } from "@/data/sources/japanese-organization-names";
import { japaneseSourceTitles } from "@/data/sources/japanese-source-titles";

describe("Japanese source names", () => {
  it("names every source organization in Japanese", () => {
    const missing = [...new Set(sources.map(({ organization }) => organization))].filter((name) => !japaneseOrganizationNames[name]);
    expect(missing, "add the official Japanese name to japanese-organization-names.ts").toEqual([]);
  });

  it("records Japanese titles only for existing Japanese-language sources", () => {
    const japaneseSourceIds = new Set(sources.filter(({ language }) => language === "ja").map(({ id }) => id));
    expect(Object.keys(japaneseSourceTitles).filter((id) => !japaneseSourceIds.has(id))).toEqual([]);
    for (const [id, title] of Object.entries(japaneseSourceTitles)) {
      expect(title, id).toMatch(/[぀-ヿ一-鿿]/);
      expect(title, id).not.toMatch(/[｜│∥]|ホームページ$/);
    }
  });

  it("gives Japanese readers the Japanese title of most Japanese-language sources", () => {
    const japanese = sources.filter(({ language }) => language === "ja");
    expect(japanese.filter(({ japaneseTitle }) => japaneseTitle).length / japanese.length).toBeGreaterThan(0.9);
  });
});
