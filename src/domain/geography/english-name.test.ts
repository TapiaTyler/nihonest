import { describe, expect, it } from "vitest";
import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { englishGeographyName, romanizeKana } from "./english-name";

const label = (id: string) => {
  const record = getAdministrativeGeography(id)!;
  return englishGeographyName(record, record.parentId ? getAdministrativeGeography(record.parentId) : undefined);
};

describe("English geography labels", () => {
  it("romanizes kana in modified Hepburn without macrons, as official English names are written", () => {
    expect(romanizeKana("とうきょう")).toBe("tokyo");
    expect(romanizeKana("おおさか")).toBe("osaka");
    expect(romanizeKana("きたきゅうしゅう")).toBe("kitakyushu");
    expect(romanizeKana("さっぽろ")).toBe("sapporo");
    expect(romanizeKana("てんぱく")).toBe("tempaku");
    expect(romanizeKana("めいとう")).toBe("meito");
    expect(romanizeKana("ふくおか")).toBe("fukuoka");
  });

  it("labels special wards and designated cities as cities, and administrative wards with their city", () => {
    expect(label("jp-13101")).toBe("Chiyoda City");
    expect(label("jp-01100")).toBe("Sapporo City");
    expect(label("jp-23100")).toBe("Nagoya City");
    // Ward records are not in the registry, but the schema still accepts them and they are labeled with their city.
    const sapporo = getAdministrativeGeography("jp-01100")!;
    const chuoWard = { ...sapporo, id: "jp-01101", code: "01101", localGovernmentCode: "011011", type: "administrative-ward" as const, parentId: sapporo.id, names: { ja: "札幌市中央区", kana: "さっぽろしちゅうおうく" } };
    expect(englishGeographyName(chuoWard, sapporo)).toBe("Chuo Ward, Sapporo");
  });

  it("gives every mapped municipality an English label", () => {
    for (const record of administrativeGeographies) {
      expect(label(record.id), record.id).toMatch(/^[A-Z][A-Za-z ,]+$/);
    }
  });
});
