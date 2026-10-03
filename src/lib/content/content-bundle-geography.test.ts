import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { administrativeGeographies, administrativeGeographySources, legacyGeographyIds, getAdministrativeGeography } from "@/data/geography";
import { createAdministrativeGeographyRegistry } from "@/domain/geography/administrative-geography";
import { contentBundleVersionInput, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});
describe("administrative geography bundle", () => {
  it("preserves canonical names, codes, hierarchy, dated provenance and alias order", () => {
    expect(JSON.parse(bundle.files.get("administrative-geographies.en.json")!)).toEqual(administrativeGeographies);
    expect(JSON.parse(bundle.files.get("geography-sources.en.json")!)).toEqual(administrativeGeographySources);
    const aliases = JSON.parse(bundle.files.get("geography-aliases.en.json")!) as { id: string; geographyId: string }[];
    expect(aliases).toEqual(Object.entries(legacyGeographyIds).map(([id, geographyId]) => ({ id, geographyId })));
    const registry = createAdministrativeGeographyRegistry(JSON.parse(bundle.files.get("administrative-geographies.en.json")!));
    const canonicalRegistry = createAdministrativeGeographyRegistry(administrativeGeographies);
    for (const alias of aliases) expect(registry.get(alias.geographyId)).toEqual(getAdministrativeGeography(alias.id));
    for (const record of administrativeGeographies) {
      expect(registry.ancestors(record.id).map(({ id }) => id)).toEqual(
        canonicalRegistry.ancestors(record.id).map(({ id }) => id));
    }
  });
  it.each(["source", "count", "parent", "check-digit", "alias-target", "alias-collision", "supported-type", "supported-parent"])(
    "rejects %s corruption even after recomputing checksums", (mode) => {
      const manifest = structuredClone(bundle.manifest);
      const files = new Map(bundle.files);
      const path = mode.startsWith("alias") ? "geography-aliases.en.json"
        : mode.startsWith("supported") ? "supported-geographies.en.json"
          : mode === "count" ? "geography-sources.en.json" : "administrative-geographies.en.json";
      const records = JSON.parse(files.get(path)!);
      if (mode === "source") records[0].sourceId = "missing-source";
      if (mode === "count") records[0].recordCount++;
      if (mode === "parent") records.find((record: { parentId?: string }) => record.parentId).parentId = "jp-99999";
      if (mode === "check-digit") records[0].localGovernmentCode = "000000";
      if (mode === "alias-target") records[0].geographyId = "jp-99999";
      if (mode === "alias-collision") records[0].id = records[0].geographyId;
      if (mode === "supported-type") records[0].type = "village";
      if (mode === "supported-parent") records.find((record: { parentId?: string }) => record.parentId).parentId = "missing-parent";
      const json = `${JSON.stringify(records)}\n`;
      files.set(path, json);
      manifest.files.find((file) => file.path === path)!.checksum = sha256(json);
      manifest.catalogVersion = sha256(contentBundleVersionInput(manifest.files));
      expect(() => verifyContentBundle(manifest, files, sha256)).toThrow();
    });
});
