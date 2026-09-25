import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getAdministrativeGeography } from "@/data/geography";
import { localGuidanceLocations, localGuidanceSourceEntries } from "@/data/local-guidance";
import { prefectureGuidance } from "@/data/local-guidance/locations";

/** Rules for the per-location layout (docs/LOCAL-GUIDANCE-WORKFLOW.md); adding a location needs no edit here. */
describe("local guidance location files", () => {
  const root = resolve(process.cwd(), "src/data/local-guidance/locations");

  it("files each location under its own prefecture's folder", () => {
    for (const prefecture of prefectureGuidance) {
      const prefectureRecord = getAdministrativeGeography(prefecture.geography.id)!;
      expect(["prefecture", "metropolis"]).toContain(prefectureRecord.type);
      const folder = prefectureRecord.names.en!.toLowerCase().replace(/[^a-z]/g, "");
      const files = readdirSync(join(root, folder));
      for (const { geography } of prefecture.locations) {
        expect(getAdministrativeGeography(geography.id)?.prefectureCode, geography.name).toBe(prefectureRecord.prefectureCode);
        expect(files, geography.name).toContain(`${geography.name.split(/[ ,]/)[0]!.toLowerCase().replace(/[^a-z]/g, "")}.ts`);
      }
    }
  });

  it("registers every location file in its prefecture's index", () => {
    const registered = new Set(localGuidanceLocations.map(({ geography }) => geography.id));
    const declared = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory()).flatMap((folder) => (
      readdirSync(join(root, folder)).filter((name) => name.endsWith(".ts") && name !== "index.ts" && !name.endsWith(".test.ts"))
        .map((name) => readFileSync(join(root, folder, name), "utf8").match(/geography: \{ id: "([a-z0-9-]+)"/)?.[1])
    ));
    expect(new Set(declared)).toEqual(registered);
    expect(declared).toHaveLength(registered.size);
  });

  it("keeps a location's own sources cited only by that location", () => {
    for (const location of localGuidanceLocations) {
      const cited = new Set(location.supplements.flatMap(({ sourceIds }) => sourceIds));
      for (const source of location.sources) {
        expect(cited.has(source.id), `${source.id} is not cited by ${location.geography.name}`).toBe(true);
        const others = localGuidanceLocations.filter((other) => other !== location && other.supplements.some(({ sourceIds }) => sourceIds.includes(source.id)));
        expect(others.map(({ geography }) => geography.name), `${source.id} is shared; move it to src/data/sources`).toEqual([]);
      }
    }
    expect(new Set(localGuidanceSourceEntries.map(({ id }) => id)).size).toBe(localGuidanceSourceEntries.length);
  });

  it("gives cities outside Tokyo that are not designated cities a coverage-plan group", () => {
    for (const { geography } of localGuidanceLocations) {
      const record = getAdministrativeGeography(geography.id)!;
      if (record.type === "city" && record.prefectureCode !== "13") expect(geography.planGroup, geography.name).toBeDefined();
    }
  });
});
