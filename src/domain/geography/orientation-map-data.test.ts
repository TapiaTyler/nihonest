import { describe, expect, it } from "vitest";
import { isOrientationMapPath, orientationMapPathSchema, parseOrientationMapData } from "./orientation-map-data";

const triangle = "M-1.0,2.0L3.0,4.0L5.0,6.0Z";
const fixture = () => ({
  prefectures: [
    { id: "jp-01000", code: "01000", names: { en: "One", ja: "JA One" } },
    { id: "jp-02000", code: "02000", names: { en: "Two", ja: "JA Two" } },
  ],
  regions: [{ name: { en: "Group", ja: "JA Group" }, prefectureIds: ["jp-02000", "jp-01000"], prefectures: { en: "Two, One", ja: "JA Two、JA One" } }],
  paths: [
    { code: "02", name: "JA Two", focus: [3, 4, 5], d: triangle },
    { code: "01", name: "JA One", focus: [-1, 2, 3], d: triangle + triangle },
  ],
});

describe("projected orientation geometry", () => {
  it("accepts multiple closed rings and preserves geometry and signed focus coordinates", () => {
    const path = fixture().paths[1]!;
    expect(orientationMapPathSchema.parse(path)).toEqual(path);
  });

  it.each([
    "", "M1.0,2.0L3.0,4.0Z", "M1.0,2.0L3.0,4.0L5.0,6.0", "L1.0,2.0L3.0,4.0L5.0,6.0Z",
    `${triangle}Z`, triangle.replace("L", "M"), triangle.replace("L", "C"), triangle.toLowerCase(),
    `${triangle}junk`, ` ${triangle}`, triangle.replace("-1.0", "NaN"), triangle.replace("-1.0", "1e3"),
    triangle.replace("-1.0", "1"), triangle.replace("-1.0", "1.00"), triangle.replace("-1.0", `${"9".repeat(400)}.0`),
    `${triangle}<script/>`, triangle.repeat(10_000),
  ])("rejects invalid, unsupported or excessive geometry (%#)", (path) => {
    expect(isOrientationMapPath(path)).toBe(false);
  });

  it.each([[1, 2], [1, 2, 3, 4], [NaN, 2, 3], [1, Infinity, 3], [1, 2, 0], [1, 2, -1], [1, 2, "3"]].map((focus) => ({ focus })))("rejects malformed focus $focus", ({ focus }) => {
    expect(orientationMapPathSchema.safeParse({ ...fixture().paths[0], focus }).success).toBe(false);
  });
});

describe("orientation region and path identity", () => {
  it("preserves supplied group, membership, path and label ordering without mutating input", () => {
    const input = fixture();
    input.regions[0]!.name.en = " Group ";
    const before = JSON.stringify(input);
    expect(parseOrientationMapData(input.regions, input.paths, input.prefectures)).toEqual({ regions: input.regions, paths: input.paths });
    expect(JSON.stringify(input)).toBe(before);
  });

  it.each(["duplicate-within", "duplicate-across", "unknown", "missing", "wrong-order-label", "blank-label", "extra-field"])("rejects %s region data", (mode) => {
    const input = fixture();
    const region = input.regions[0]!;
    if (mode === "duplicate-within") region.prefectureIds.push("jp-01000");
    if (mode === "duplicate-across") input.regions.push(structuredClone(region));
    if (mode === "unknown") region.prefectureIds[0] = "jp-03000";
    if (mode === "missing") { region.prefectureIds.pop(); region.prefectures = { en: "Two", ja: "JA Two" }; }
    if (mode === "wrong-order-label") region.prefectures.en = "One, Two";
    if (mode === "blank-label") region.name.ja = " \t";
    if (mode === "extra-field") Reflect.set(region, "id", "invented-region-id");
    expect(() => parseOrientationMapData(input.regions, input.paths, input.prefectures)).toThrow();
  });

  it.each(["duplicate", "unknown", "missing", "wrong-name", "extra-field"])("rejects %s path coverage", (mode) => {
    const input = fixture();
    if (mode === "duplicate") input.paths[1] = { ...input.paths[0]! };
    if (mode === "unknown") input.paths[0]!.code = "03";
    if (mode === "missing") input.paths.pop();
    if (mode === "wrong-name") input.paths[0]!.name = "Wrong";
    if (mode === "extra-field") Reflect.set(input.paths[0]!, "href", "https://example.test");
    expect(() => parseOrientationMapData(input.regions, input.paths, input.prefectures)).toThrow();
  });

  it.each(["duplicate", "inconsistent-id", "invalid-code", "blank-name", "empty"])("rejects %s reference input", (mode) => {
    const input = fixture();
    if (mode === "duplicate") input.prefectures.push(structuredClone(input.prefectures[0]!));
    if (mode === "inconsistent-id") input.prefectures[0]!.id = "jp-03000";
    if (mode === "invalid-code") input.prefectures[0]!.code = "48000";
    if (mode === "blank-name") input.prefectures[0]!.names.en = " ";
    if (mode === "empty") input.prefectures = [];
    expect(() => parseOrientationMapData(input.regions, input.paths, input.prefectures)).toThrow();
  });
});
