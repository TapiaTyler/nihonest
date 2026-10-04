import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { URL as NodeURL } from "node:url";
import { articleComponents } from "@/data/article-components";
import { residenceApplicationFees } from "@/data/residence-application-fees";
import { japanPrefectureRegions } from "@/data/geography/regions";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { tokyoAreas } from "@/domain/geography/tokyo-areas";
import { articleComponentBlocks } from "@/domain/article/article-blocks";
import { englishInterfaceMessages } from "@/domain/localization/interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "@/domain/localization/interface-message-catalogs/japanese";
import { translationSourceFields, type ArticleComponentSource } from "@/domain/translation/translation-source-fields";
import { areArticleComponentTranslationFieldsValid } from "@/domain/translation/article-component-translation-fields";
import type { TranslationArtifact } from "@/domain/translation/translation";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { bundledComponentBindingSchema, componentHostArticles, componentPayloadRefs, type BundledComponentBinding } from "@/domain/content-bundle/component-payloads";
import type { BundledArticle, ContentBundleFile } from "@/domain/content-bundle/content-bundle";
import { prefectureNationalGuides, prefectureGeneralGuides } from "./prefecture-finder-guides";

/** Match web selection: a stale/incomplete first active identity never exposes a later candidate. */
export function currentArticleComponentTranslations(
  components: readonly ArticleComponentSource[], artifacts: readonly TranslationArtifact[] = japaneseArticleComponentTranslations,
): TranslationArtifact[] {
  return components.flatMap((component) => {
    const artifact = artifacts.find((candidate) => candidate.availability === "active" && candidate.targetLocale === "ja"
      && candidate.contentKind === "article-component" && candidate.contentId === component.kind);
    return artifact && artifact.sourceRevision === createTranslationSourceRevision(translationSourceFields["article-component"](component))
      && areArticleComponentTranslationFieldsValid(component, artifact.fields) ? [artifact] : [];
  });
}

type Entry = [Omit<ContentBundleFile, "checksum" | "records">, readonly unknown[]];
export async function buildComponentBundleEntries(articles: readonly BundledArticle[]): Promise<readonly Entry[]> {
  const components = Object.values(articleComponents);
  const bindings = Object.keys(articleComponentBlocks).map((id): BundledComponentBinding => {
    if (Object.hasOwn(articleComponents, id)) return bundledComponentBindingSchema.parse({ id, kind: "data", componentId: id,
      ...(id === "residence-application-fees" ? { feeDataId: id } : {}) });
    if (id === "japan-prefecture-finder") return { id, kind: "finder", finderId: id };
    if (id === "japan-region-map") return { id, kind: "region-map", regionsId: "japan-orientation-regions",
      mapId: "japan-prefecture-map", interfaceId: "interface-messages", messagePrefix: "regionMap." };
    if (id === "japan-prefecture-regions") return { id, kind: "composition", children: ["japan-prefecture-finder", "japan-region-map"] };
    if (id === "japan-prefecture-region-cards") return { id, kind: "alias", target: "japan-region-map" };
    throw new Error(`Unbound registered component: ${id}`);
  });
  const license = (await readFile(new NodeURL("../../data/geography/PREFECTURE-MAP-LICENSE.txt", import.meta.url), "utf8")).replace(/\r\n?/g, "\n");
  const payloads: readonly [string, readonly unknown[], "en" | "ja", "catalog" | "catalog-translations"][] = [
    ["article-components.en.json", components.map((component) => ({ id: component.kind, component })), "en", "catalog"],
    ["article-component-translations.ja.json", currentArticleComponentTranslations(components), "ja", "catalog-translations"],
    ["component-bindings.en.json", bindings, "en", "catalog"],
    ["component-provenance.en.json", bindings.map((binding) => {
      const { direct, hosts } = componentHostArticles(binding.id, articles);
      return { id: binding.id, directArticleIds: direct.map(({ metadata }) => metadata.id), hostArticleIds: hosts.map(({ metadata }) => metadata.id),
        contextSourceIds: [...new Set(hosts.flatMap(({ metadata }) => metadata.sourceIds))], payloadRefs: componentPayloadRefs(binding) };
    }), "en", "catalog"],
    ["residence-application-fees.en.json", [{ id: "residence-application-fees", fees: residenceApplicationFees }], "en", "catalog"],
    ["orientation-regions.en.json", [{ id: "japan-orientation-regions", regions: japanPrefectureRegions, tokyoAreas }], "en", "catalog"],
    ["prefecture-map-resources.en.json", [{ id: "japan-prefecture-map", paths: prefectureMapPaths,
      source: { boundaryUrl: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html", edition: 2019,
        boundaryArchive: "N03-190101_GML.zip", conversionProject: "https://github.com/piuccio/open-data-jp-prefectures-geojson",
        inputUrl: "https://raw.githubusercontent.com/piuccio/open-data-jp-prefectures-geojson/master/output/prefectures.geojson",
        retrievedAt: "2026-09-25", inputSha256: "c12ec2656d13fe9c59237e742274fbc072e6b4a540de3cc41d432042aef7bace" },
      transform: { x: "(longitude - 122) * 23 + 20", y: "(46 - latitude) * 27 + 14", minimumRingArea: 0.5,
        simplifyTolerance: 0.15, decimalPlaces: 1, focus: "bounding-box center and largest span of the largest retained ring" },
      limits: "Orientation only: simplified coastlines and omitted small islands; not exact boundaries, distances, hazard zones, or responsible-office guidance.",
      license: { text: license, sha256: createHash("sha256").update(license, "utf8").digest("hex") },
    }], "en", "catalog"],
    ["finder-bindings.en.json", [{ id: "japan-prefecture-finder", refs: {
      geographies: "administrative-geographies.en.json", aliases: "geography-aliases.en.json", supported: "supported-geographies.en.json",
      supplements: "local-guidance.en.json", supplementTranslations: "local-guidance-translations.ja.json", advice: "general-local-advice.en.json",
      adviceTranslations: "general-local-advice-translations.ja.json", regions: "orientation-regions.en.json", map: "prefecture-map-resources.en.json",
      englishMessages: "interface-messages.en.json", japaneseMessages: "interface-messages.ja.json",
    }, nationalGuides: prefectureNationalGuides, generalGuides: prefectureGeneralGuides,
    messageIds: Object.keys(englishInterfaceMessages).filter((key) => key.startsWith("finder.")), behavior: {
      municipalities: "researched-only, canonical registry order, aliases resolved",
      prefectures: "English-name sort, canonical ID and bilingual names",
      coverage: "selectable supported geographies; canonical municipality ID; supported name; supplement registration order; municipality ID sort",
      designatedCities: "city-wide guidance; ward-office details may differ; unresearched wards are not offered",
      selection: "ephemeral; does not write saved location",
      supplementTitleFallback: "current Japanese title when nonempty, otherwise canonical English",
      adviceFallback: "complete current Japanese advice, otherwise canonical English",
      tokyoGrouping: "131xx special wards; 13360 and above islands; other Tokyo municipalities Tama",
    } }], "en", "catalog"],
    ["interface-messages.en.json", [{ kind: "catalog", id: "interface-messages", locale: "en", messages: englishInterfaceMessages }], "en", "catalog"],
    ["interface-messages.ja.json", [{ kind: "catalog", id: "interface-messages", locale: "ja", messages: japaneseInterfaceMessages,
      reviewState: "machine-translated" }], "ja", "catalog"],
  ];
  return payloads.map(([path, records, locale, kind]) => [{ path, locale, kind }, records]);
}
