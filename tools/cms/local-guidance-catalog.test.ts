import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { localGuidanceArticleOrder, localGuidanceLocations, localGuidanceSupplements } from "@/data/local-guidance";
import { japaneseLocalGuidanceLocationTranslations } from "@/data/translations/ja/local-guidance";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { localGuidanceTranslationState, readLocalGuidanceCatalog } from "./local-guidance-catalog";

describe("readLocalGuidanceCatalog", () => {
  it("reflects every registered location and guide without folder discovery", async () => {
    const catalog = await readLocalGuidanceCatalog(process.cwd());

    expect(catalog.failures).toEqual([]);
    expect(catalog.locations.map(({ id }) => id)).toEqual(localGuidanceLocations.map(({ geography }) => geography.id));
    expect(catalog.guides).toEqual([...localGuidanceArticleOrder]);
    expect(catalog.locations.flatMap(({ supplements }) => supplements.map(({ id }) => id)).sort())
      .toEqual(localGuidanceSupplements.map(({ id }) => id).sort());
    expect(catalog.details.size).toBe(localGuidanceSupplements.length);
    expect(catalog.locations.find(({ id }) => id === "jp-26100")).toMatchObject({
      id: "jp-26100",
      name: "Kyoto City",
      prefectureId: "jp-26000",
      prefectureName: "Kyoto",
    });
  });

  it("reports source file and targeted literal ranges for editable fields", async () => {
    const catalog = await readLocalGuidanceCatalog(process.cwd());
    const detail = catalog.details.get("kyoto-household-waste");
    expect(detail).toBeDefined();
    expect(detail?.source.path).toBe("src/data/local-guidance/locations/kyoto/kyoto.ts");
    expect(detail?.source.sourceRevision).toMatch(/^[a-f0-9]{64}$/);
    expect(detail?.source.objectStart).toBeLessThan(detail?.source.objectEnd ?? 0);
    expect(detail?.source.fieldValues.title).toBeDefined();
    expect(detail?.source.fieldValues["actions.0.description"]).toBeDefined();
    expect(detail?.source.fieldProperties.receivingOffice).toBeUndefined();
    expect(detail?.source.fieldProperties.sourceFormatNote).toBeDefined();
    const raw = await readFile(detail!.source.path, "utf8");
    expect(raw.slice(...detail!.source.fieldValues.title!)).toContain("Sorting and disposing of waste in Kyoto");
    expect(createHash("sha256").update(raw, "utf8").digest("hex")).toBe(detail?.source.sourceRevision);
  });

  it("keeps source citations, applicable recheck items, and canonical supplement values", async () => {
    const catalog = await readLocalGuidanceCatalog(process.cwd());
    const detail = catalog.details.get("kyoto-address-registration");
    const registeredLocation = localGuidanceLocations.find(({ geography }) => geography.id === detail?.locationId);
    const registeredSupplement = registeredLocation?.supplements.find(({ id }) => id === detail?.id);
    expect(detail?.value).toEqual(registeredSupplement);
    expect(detail?.sources.map(({ id }) => id)).toEqual(detail?.value.sourceIds);
    expect(detail?.recheck).toEqual(registeredLocation?.recheck.filter(({ records }) => records.includes(detail!.id)));
  });

  it("calculates current, stale, and missing Japanese states from the shared selector and revision helper", async () => {
    const catalog = await readLocalGuidanceCatalog(process.cwd());
    const byId = new Map(japaneseLocalGuidanceLocationTranslations.flatMap(({ entries, artifacts }) => {
      const artifactById = new Map(artifacts.map((artifact) => [artifact.contentId, artifact]));
      return entries.map((entry) => [entry.supplementId, { entry, artifact: artifactById.get(entry.supplementId) }] as const);
    }));
    for (const [id, detail] of catalog.details) {
      const translated = byId.get(id);
      const entry = translated?.entry;
      const expected = !entry ? "missing"
        : entry.sourceRevision === createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](detail.value)) ? "current"
          : "stale";
      expect(detail.translation).toBe(expected);
      if (entry) {
        expect(detail.generator).toBe(entry.generator);
        expect(detail.translationReviewState).toBe(translated?.artifact?.reviewState);
      }
    }
    // Each state is checked per record above; once every location is translated, no supplement is missing.
    expect([...catalog.details.values()].some(({ translation }) => translation === "current")).toBe(true);
  });

  it("distinguishes current, stale, and missing translation revisions", () => {
    const sample = localGuidanceLocations.flatMap(({ supplements }) => supplements)[0]!;
    const currentRevision = createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](sample));
    expect(localGuidanceTranslationState(sample)).toBe("missing");
    expect(localGuidanceTranslationState(sample, currentRevision)).toBe("current");
    expect(localGuidanceTranslationState(sample, "0".repeat(64))).toBe("stale");
  });
});
