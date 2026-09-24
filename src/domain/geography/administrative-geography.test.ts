import { describe, expect, it } from "vitest";
import { administrativeGeographySchema, createAdministrativeGeographyRegistry, hasValidLocalGovernmentCheckDigit, sortAdministrativeGeographies } from "./administrative-geography";

const tokyo = {
  id: "jp-13000", code: "13000", localGovernmentCode: "130001", prefectureCode: "13",
  type: "metropolis", names: { ja: "東京都", en: "Tokyo" }, sourceId: "test",
};
const shinjuku = {
  id: "jp-13104", code: "13104", localGovernmentCode: "131041", prefectureCode: "13",
  type: "special-ward", parentId: "jp-13000", names: { ja: "新宿区", en: "Shinjuku City" }, sourceId: "test",
};
const aichi = {
  id: "jp-23000", code: "23000", localGovernmentCode: "230006", prefectureCode: "23",
  type: "prefecture", names: { ja: "愛知県", en: "Aichi" }, sourceId: "test",
};
const nagoya = {
  id: "jp-23100", code: "23100", localGovernmentCode: "231002", prefectureCode: "23",
  type: "designated-city", parentId: "jp-23000", names: { ja: "名古屋市", en: "Nagoya City" }, sourceId: "test",
};
const chikusaward = {
  id: "jp-23101", code: "23101", localGovernmentCode: "231011", prefectureCode: "23",
  type: "administrative-ward", parentId: "jp-23100", names: { ja: "名古屋市千種区", kana: "なごやしちくさく" }, sourceId: "test",
};

describe("administrative geography schema", () => {
  it("validates official check digits including leading zero and zero-checksum codes", () => {
    for (const code of ["010006", "131041", "231002", "281000"]) expect(hasValidLocalGovernmentCheckDigit(code)).toBe(true);
    for (const code of ["131042", "10006", "13104", "abcdef"]) expect(hasValidLocalGovernmentCheckDigit(code)).toBe(false);
  });

  it.each([
    { ...shinjuku, id: "jp-13105" },
    { ...shinjuku, localGovernmentCode: "131042" },
    { ...shinjuku, prefectureCode: "23" },
    { ...shinjuku, parentId: "jp-23000" },
    { ...shinjuku, parentId: undefined },
    { ...shinjuku, type: "city" },
    { ...tokyo, parentId: "jp-23000" },
    { ...tokyo, type: "prefecture" },
    { ...aichi, type: "metropolis" },
    { ...aichi, prefectureCode: "48" },
  ])("rejects inconsistent record %#", (record) => {
    expect(administrativeGeographySchema.safeParse(record).success).toBe(false);
  });

  it("distinguishes two-level Tokyo parentage from three-level designated-city parentage", () => {
    const registry = createAdministrativeGeographyRegistry([shinjuku, tokyo, chikusaward, nagoya, aichi]);
    expect(registry.ancestors(shinjuku.id).map(({ id }) => id)).toEqual([tokyo.id]);
    expect(registry.ancestors(chikusaward.id).map(({ id }) => id)).toEqual([aichi.id, nagoya.id]);
    expect(registry.children(nagoya.id).map(({ id }) => id)).toEqual([chikusaward.id]);
    expect(registry.get("missing")).toBeUndefined();
    expect(registry.children("missing")).toEqual([]);
    expect(registry.ancestors("missing")).toEqual([]);
  });

  it("rejects missing, duplicate, cross-prefecture, and structurally invalid parents", () => {
    expect(() => createAdministrativeGeographyRegistry([shinjuku])).toThrow(/Missing parent/);
    expect(() => createAdministrativeGeographyRegistry([tokyo, tokyo])).toThrow(/Duplicate/);
    expect(() => createAdministrativeGeographyRegistry([tokyo, aichi, { ...nagoya, parentId: tokyo.id }])).toThrow(/Invalid parent/);
    expect(() => createAdministrativeGeographyRegistry([aichi, { ...chikusaward, parentId: aichi.id }])).toThrow(/Invalid parent/);
    expect(() => createAdministrativeGeographyRegistry([aichi, { ...nagoya, parentId: nagoya.id }])).toThrow(/Invalid parent/);
  });

  it("sorts by official code by default and supports display ordering without mutating identities", () => {
    const registry = createAdministrativeGeographyRegistry([aichi, shinjuku, tokyo]);
    expect(registry.records.map(({ code }) => code)).toEqual(["13000", "13104", "23000"]);
    expect(sortAdministrativeGeographies(registry.records, "en").map(({ id }) => id)).toEqual([aichi.id, shinjuku.id, tokyo.id]);
    expect(registry.records[0].id).toBe(tokyo.id);
    expect(Object.isFrozen(registry.records)).toBe(true);
    expect(Object.isFrozen(registry.get(tokyo.id)?.names)).toBe(true);
  });

  it("uses sourced kana for Japanese sorting and puts missing English labels after translated labels", () => {
    const records = [
      { ...administrativeGeographySchema.parse(chikusaward), names: { ja: "名古屋市千種区", kana: "なごやしちくさく" } },
      { ...administrativeGeographySchema.parse(nagoya), names: { ja: "名古屋市", kana: "なごやし", en: "Nagoya City" } },
    ];
    expect(sortAdministrativeGeographies(records, "ja").map(({ code }) => code)).toEqual(["23100", "23101"]);
    expect(sortAdministrativeGeographies(records, "en")[0].names.en).toBe("Nagoya City");
  });

  it("rejects assigning a ward to the wrong designated city in the same prefecture", () => {
    const kanagawa = { ...aichi, id: "jp-14000", code: "14000", localGovernmentCode: "140007", prefectureCode: "14", names: { ja: "神奈川県" } };
    const yokohama = { ...nagoya, id: "jp-14100", code: "14100", localGovernmentCode: "141003", prefectureCode: "14", parentId: "jp-14000", names: { ja: "横浜市" } };
    const kawasakiWard = { ...chikusaward, id: "jp-14131", code: "14131", localGovernmentCode: "141313", prefectureCode: "14", parentId: "jp-14100", names: { ja: "川崎市川崎区" } };
    expect(() => createAdministrativeGeographyRegistry([kanagawa, yokohama, kawasakiWard])).toThrow(/parent city/);
  });
});
