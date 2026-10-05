import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { articleComponents } from "@/data/article-components";
import { residenceApplicationFees } from "@/data/residence-application-fees";
import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { tokyoAreas } from "@/domain/geography/tokyo-areas";
import { englishInterfaceMessages } from "@/domain/localization/interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "@/domain/localization/interface-message-catalogs/japanese";
import { contentBundleVersionInput, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import { bundledComponentProvenanceSchema } from "@/domain/content-bundle/component-payloads";
import { projectBundledFinder } from "@/domain/content-bundle/finder-projection";
import { type TranslationArtifact } from "@/domain/translation/translation";
import { selectArticleComponentTranslation } from "./article-component-translations";
import { getPrefectureFinderData } from "./prefecture-finder";
import { buildContentBundle, type ContentBundle } from "./content-bundle";
import { currentArticleComponentTranslations } from "./content-bundle-components";

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
const options = { articleDirectory: resolve("content/articles"), generatedAt: "2026-10-04T12:00:00.000Z" };
let bundle: ContentBundle;
beforeAll(async () => { bundle = await buildContentBundle(options); });
const read = (path: string) => JSON.parse(bundle.files.get(path)!);
function mutation(path: string, edit: (records: Record<string, unknown>[]) => void) {
  const files = new Map(bundle.files);
  const manifest = structuredClone(bundle.manifest);
  const records = read(path);
  edit(records);
  const json = JSON.stringify(records) + "\n";
  files.set(path, json);
  const descriptor = manifest.files.find((file) => file.path === path)!;
  descriptor.checksum = sha256(json);
  descriptor.records = records.length;
  manifest.catalogVersion = sha256(contentBundleVersionInput(manifest.files));
  return () => verifyContentBundle(manifest, files, sha256);
}
describe("format 10 component export", () => {
  it("requires all 38 files, including the ten additions, and rejects format 9", () => {
    expect(bundle.manifest.formatVersion).toBe(10);
    expect(bundle.files.size).toBe(38);
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 9 }, bundle.files, sha256)).toThrow();
    for (const path of ["article-components.en.json", "article-component-translations.ja.json", "component-bindings.en.json",
      "component-provenance.en.json", "residence-application-fees.en.json", "orientation-regions.en.json",
      "prefecture-map-resources.en.json", "finder-bindings.en.json", "interface-messages.en.json", "interface-messages.ja.json"]) {
      const files = new Map(bundle.files); files.delete(path);
      expect(() => verifyContentBundle(bundle.manifest, files, sha256), path).toThrow("exactly the supported files");
    }
    expect(bundle.files.has("component-copy.en.json")).toBe(false);
  });
  it("round trips every canonical owner without rewriting content, artifact provenance or bilingual proper names", () => {
    expect(read("article-components.en.json")).toEqual(Object.values(articleComponents).map((component) => ({ id: component.kind, component })));
    expect(read("article-component-translations.ja.json")).toEqual(japaneseArticleComponentTranslations);
    expect(read("residence-application-fees.en.json")[0].fees).toEqual(residenceApplicationFees);
    expect(read("orientation-regions.en.json")[0]).toEqual({ id: "japan-orientation-regions", regions: japanPrefectureRegions, tokyoAreas });
    expect(read("prefecture-map-resources.en.json")[0].paths).toEqual(prefectureMapPaths);
    expect(read("interface-messages.en.json")[0].messages).toEqual(englishInterfaceMessages);
    expect(read("interface-messages.ja.json")[0].messages).toEqual(japaneseInterfaceMessages);
    expect(read("interface-messages.ja.json")[0].reviewState).toBe("machine-translated");
  });
  it("derives exactly the current web finder, retaining researched-only selection and editorial dates", () => {
    const projected = projectBundledFinder(bundle.files);
    expect(projected).toEqual(getPrefectureFinderData());
    expect(projected.prefectures).toHaveLength(47);
    expect(projected.municipalities).toHaveLength(112);
    expect(projected.municipalities.some(({ id }) => id === "jp-01101")).toBe(false);
    expect(projected.coverage.flatMap(({ municipalities }) => municipalities.flatMap(({ supplements }) => supplements))).toHaveLength(784);
  });
  it("records unused alias/composition context without inventing direct occurrences or human approval", () => {
    const records = bundledComponentProvenanceSchema.array().parse(read("component-provenance.en.json"));
    expect(records).toHaveLength(8);
    for (const id of ["japan-prefecture-regions", "japan-prefecture-region-cards"]) {
      const record = records.find((record) => record.id === id)!;
      expect(record.directArticleIds).toEqual([]);
      expect(record.hostArticleIds.length).toBeGreaterThan(0);
      expect(record.contextSourceIds.length).toBeGreaterThan(0);
      expect(record).not.toHaveProperty("lastReviewedAt");
    }
  });
  it("generates identical payload bytes, checksums and catalog version for different generation times", async () => {
    const second = await buildContentBundle({ ...options, generatedAt: "2026-10-05T12:00:00.000Z" });
    expect(second.files).toEqual(bundle.files);
    expect(second.manifest.files).toEqual(bundle.manifest.files);
    expect(second.manifest.catalogVersion).toBe(bundle.manifest.catalogVersion);
    expect(second.manifest.generatedAt).not.toBe(bundle.manifest.generatedAt);
  });
  it.each(["stale", "incomplete", "blank", "extra", "placeholder"])("matches first-active web fallback for a %s candidate before a valid one", (mode) => {
    const component = articleComponents["residence-application-fees"];
    const valid = japaneseArticleComponentTranslations.find(({ contentId }) => contentId === component.kind)!;
    const first = structuredClone(valid);
    if (mode === "stale") first.sourceRevision = "0".repeat(64);
    if (mode === "incomplete") delete first.fields["messages.heading"];
    if (mode === "blank") first.fields["messages.heading"] = " ";
    if (mode === "extra") first.fields.extra = "extra";
    if (mode === "placeholder") first.fields["messages.heading"] += " {unknown}";
    expect(currentArticleComponentTranslations([component], [first, valid])).toEqual([]);
    expect(selectArticleComponentTranslation(component, [first, valid])).toBeUndefined();
  });
  it("skips inactive identities but preserves a valid first candidate's untrimmed bytes and metadata", () => {
    const component = articleComponents["tax-residence-scope"];
    const valid = structuredClone(japaneseArticleComponentTranslations.find(({ contentId }) => contentId === component.kind)!);
    valid.fields.caption = ` ${valid.fields.caption} `;
    const inactive: TranslationArtifact = { ...valid, availability: "stale" };
    expect(currentArticleComponentTranslations([component], [inactive, valid])).toEqual([valid]);
    expect(currentArticleComponentTranslations([component], [inactive, valid])[0]).toBe(valid);
  });
  it("permits an empty Japanese component array for whole-component English fallback", () => {
    expect(mutation("article-component-translations.ja.json", (records) => { records.length = 0; })).not.toThrow();
  });
  it.each(["target", "suffix", "practical", "metadata"])("rejects checksummed invalid %s component content", (mode) => {
    const path = mode === "target" ? "article-components.en.json" : "article-component-translations.ja.json";
    expect(mutation(path, (records) => {
      if (mode === "target") {
        const owner = records.find((record) => record.id === "training-route-comparison")!.component as { rows: { href: string }[] };
        owner.rows[0]!.href = "/articles/unknown-article";
      }
      if (mode === "suffix") {
        const fields = records.find((record) => record.contentId === "training-route-comparison")!.fields as Record<string, string>;
        const empty = Object.keys(fields).find((key) => /^rows\.[^.]+\.2$/.test(key) && fields[key] === "")!;
        fields[empty] = " ";
      }
      if (mode === "practical") {
        const fields = records.find((record) => record.contentId === "japan-practical-basics")!.fields as Record<string, string>;
        fields[Object.keys(fields)[0]!] = "**Label:** <script>bad</script>";
      }
      if (mode === "metadata") records[0]!.inventedReview = "approved";
    })).toThrow();
  });
  it.each(["revision", "inactive", "blank", "extra", "unknown", "placeholder", "duplicate"])("rejects a checksummed %s component overlay", (mode) => {
    expect(mutation("article-component-translations.ja.json", (records) => {
      if (mode === "duplicate") { records.push(records[0]!); return; }
      const artifact = records.find((record) => record.contentId === "residence-application-fees")!;
      if (mode === "revision") artifact.sourceRevision = "0".repeat(64);
      if (mode === "inactive") artifact.availability = "stale";
      if (mode === "unknown") artifact.contentId = "unregistered";
      const fields = artifact.fields as Record<string, string>;
      if (mode === "blank") fields["messages.heading"] = " ";
      if (mode === "extra") fields.extra = "extra";
      if (mode === "placeholder") fields["messages.heading"] += " {unknown}";
    })).toThrow();
  });
  it.each(["data", "alias", "composition", "context", "source", "occurrence", "resource", "guide", "messages", "partition", "geometry", "license", "fees"])
    ("rejects checksummed invalid %s references or resources", (mode) => {
      const paths: Record<string, string> = { data: "article-components.en.json", alias: "component-bindings.en.json", composition: "component-bindings.en.json",
        context: "component-provenance.en.json", source: "component-provenance.en.json", occurrence: "component-provenance.en.json", resource: "component-provenance.en.json",
        guide: "finder-bindings.en.json", messages: "interface-messages.ja.json", partition: "orientation-regions.en.json",
        geometry: "prefecture-map-resources.en.json", license: "prefecture-map-resources.en.json", fees: "residence-application-fees.en.json" };
      expect(mutation(paths[mode]!, (records) => {
        if (mode === "data") records.pop();
        if (mode === "alias") records.find((record) => record.kind === "alias")!.target = "japan-prefecture-region-cards";
        if (mode === "composition") records.find((record) => record.kind === "composition")!.children = ["japan-region-map", "japan-prefecture-finder"];
        if (mode === "context") records[0]!.hostArticleIds = ["unknown-article"];
        if (mode === "source") records[0]!.contextSourceIds = ["unknown-source"];
        if (mode === "occurrence") records.find((record) => record.id === "japan-prefecture-region-cards")!.directArticleIds = ["invented-article"];
        if (mode === "resource") records[0]!.payloadRefs = ["sources.en.json"];
        if (mode === "guide") (records[0]!.nationalGuides as { articleId: string }[])[0]!.articleId = "unknown-article";
        if (mode === "messages") delete (records[0]!.messages as Record<string, string>)[Object.keys(englishInterfaceMessages)[0]!];
        if (mode === "partition") (records[0]!.regions as { prefectureIds: string[] }[])[0]!.prefectureIds = [];
        if (mode === "geometry") (records[0]!.paths as { d: string }[])[0]!.d = "M1.0,1.0Z";
        if (mode === "license") (records[0]!.license as { text: string }).text += "changed";
        if (mode === "fees") (records[0]!.fees as { qualifyingReducedYen: number }).qualifyingReducedYen = -1;
      })).toThrow();
    });
});
