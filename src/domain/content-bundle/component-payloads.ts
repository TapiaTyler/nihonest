import { z } from "zod";
import { articleComponentBlocks, type ArticleComponentBlockKind } from "@/domain/article/article-blocks";
import { articleComponentTableSchema, validateArticleComponentTable } from "@/domain/article/article-component-tables";
import { articlePracticalBasicsSchema, validateArticlePracticalBasics } from "@/domain/article/article-practical-basics";
import { residenceApplicationFeeCopySchema } from "@/domain/article/residence-application-fee-copy";
import { residenceApplicationFeeDataSchema } from "@/domain/article/residence-application-fees";
import { administrativeGeographySchema } from "@/domain/geography/administrative-geography";
import { orientationRegionSchema, orientationMapPathSchema, parseOrientationMapData } from "@/domain/geography/orientation-map-data";
import { translationArtifactSchema } from "@/domain/translation/translation";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { areArticleComponentTranslationFieldsValid } from "@/domain/translation/article-component-translation-fields";
import { interfaceMessagePackPairSchema, englishInterfaceMessagePackSchema, japaneseInterfaceMessagePackSchema } from "./interface-message-pack";
import { bundledArticleSchema, bundledArticleTranslationSchema, type BundledArticle } from "./content-bundle";
import { projectBundledFinder } from "./finder-projection";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().refine((value) => value.trim().length > 0, "Expected visible text.");
export const bundledArticleComponentSchema = z.object({
  id, component: z.union([articleComponentTableSchema, articlePracticalBasicsSchema, residenceApplicationFeeCopySchema]),
}).strict().refine((record) => record.id === record.component.kind, "Component identity must match its kind.");
export const bundledArticleComponentArtifactSchema = translationArtifactSchema.strict().refine((artifact) =>
  artifact.contentKind === "article-component" && artifact.targetLocale === "ja" && artifact.availability === "active",
"Expected an active Japanese article-component artifact.");
export const bundledFeeDataSchema = z.object({ id: z.literal("residence-application-fees"), fees: residenceApplicationFeeDataSchema }).strict();
export const bundledOrientationRegionsSchema = z.object({
  id: z.literal("japan-orientation-regions"), regions: orientationRegionSchema.array().length(8),
  tokyoAreas: z.tuple([
    z.object({ id: z.literal("special-wards"), en: text, ja: text }).strict(),
    z.object({ id: z.literal("tama"), en: text, ja: text }).strict(),
    z.object({ id: z.literal("islands"), en: text, ja: text }).strict(),
  ]),
}).strict();

/** Recorded resource evidence, distinct from article editorial status or a legal revalidation. */
export const bundledPrefectureMapSchema = z.object({
  id: z.literal("japan-prefecture-map"), paths: orientationMapPathSchema.array().length(47),
  source: z.object({
    boundaryUrl: z.literal("https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html"),
    edition: z.literal(2019), boundaryArchive: z.literal("N03-190101_GML.zip"),
    conversionProject: z.literal("https://github.com/piuccio/open-data-jp-prefectures-geojson"),
    inputUrl: z.literal("https://raw.githubusercontent.com/piuccio/open-data-jp-prefectures-geojson/master/output/prefectures.geojson"),
    retrievedAt: z.literal("2026-09-25"),
    inputSha256: z.literal("c12ec2656d13fe9c59237e742274fbc072e6b4a540de3cc41d432042aef7bace"),
  }).strict(),
  transform: z.object({
    x: z.literal("(longitude - 122) * 23 + 20"), y: z.literal("(46 - latitude) * 27 + 14"),
    minimumRingArea: z.literal(0.5), simplifyTolerance: z.literal(0.15), decimalPlaces: z.literal(1),
    focus: z.literal("bounding-box center and largest span of the largest retained ring"),
  }).strict(),
  limits: z.literal("Orientation only: simplified coastlines and omitted small islands; not exact boundaries, distances, hazard zones, or responsible-office guidance."),
  license: z.object({ text, sha256: z.literal("95c2dc0528be198c89df162afd9680dfb8e7d82c8ca12deee6a5e2580dfb2db4") }).strict(),
}).strict();

const dataBinding = (componentId: "tax-residence-scope" | "training-route-comparison" | "japan-practical-basics") =>
  z.object({ id: z.literal(componentId), kind: z.literal("data"), componentId: z.literal(componentId) }).strict();
export const bundledComponentBindingSchema = z.union([
  dataBinding("tax-residence-scope"), dataBinding("training-route-comparison"), dataBinding("japan-practical-basics"),
  z.object({ id: z.literal("residence-application-fees"), kind: z.literal("data"),
    componentId: z.literal("residence-application-fees"), feeDataId: z.literal("residence-application-fees") }).strict(),
  z.object({ id: z.literal("japan-prefecture-finder"), kind: z.literal("finder"), finderId: z.literal("japan-prefecture-finder") }).strict(),
  z.object({ id: z.literal("japan-region-map"), kind: z.literal("region-map"),
    regionsId: z.literal("japan-orientation-regions"), mapId: z.literal("japan-prefecture-map"),
    interfaceId: z.literal("interface-messages"), messagePrefix: z.literal("regionMap.") }).strict(),
  z.object({ id: z.literal("japan-prefecture-regions"), kind: z.literal("composition"),
    children: z.tuple([z.literal("japan-prefecture-finder"), z.literal("japan-region-map")]) }).strict(),
  z.object({ id: z.literal("japan-prefecture-region-cards"), kind: z.literal("alias"), target: z.literal("japan-region-map") }).strict(),
]);
export type BundledComponentBinding = z.infer<typeof bundledComponentBindingSchema>;
export const bundledComponentProvenanceSchema = z.object({
  id, hostArticleIds: id.array().min(1), directArticleIds: id.array(), contextSourceIds: id.array().min(1),
  payloadRefs: z.string().regex(/^[a-z0-9-]+\.(?:en|ja)\.json$/).array().min(1),
}).strict();

const guide = z.object({ articleId: id, messageId: z.string().regex(/^finder\.(?:nationalGuide|generalGuide)\.[\w]+$/) }).strict();
export const bundledFinderBindingSchema = z.object({
  id: z.literal("japan-prefecture-finder"),
  refs: z.object({
    geographies: z.literal("administrative-geographies.en.json"), aliases: z.literal("geography-aliases.en.json"),
    supported: z.literal("supported-geographies.en.json"), supplements: z.literal("local-guidance.en.json"),
    supplementTranslations: z.literal("local-guidance-translations.ja.json"), advice: z.literal("general-local-advice.en.json"),
    adviceTranslations: z.literal("general-local-advice-translations.ja.json"),
    regions: z.literal("orientation-regions.en.json"), map: z.literal("prefecture-map-resources.en.json"),
    englishMessages: z.literal("interface-messages.en.json"), japaneseMessages: z.literal("interface-messages.ja.json"),
  }).strict(),
  nationalGuides: guide.array().length(4), generalGuides: guide.array().length(7),
  messageIds: z.string().regex(/^finder\./).array().min(1),
  behavior: z.object({
    municipalities: z.literal("researched-only, canonical registry order, aliases resolved"),
    prefectures: z.literal("English-name sort, canonical ID and bilingual names"),
    coverage: z.literal("selectable supported geographies; canonical municipality ID; supported name; supplement registration order; municipality ID sort"),
    designatedCities: z.literal("city-wide guidance; ward-office details may differ; unresearched wards are not offered"),
    selection: z.literal("ephemeral; does not write saved location"),
    supplementTitleFallback: z.literal("current Japanese title when nonempty, otherwise canonical English"),
    adviceFallback: z.literal("complete current Japanese advice, otherwise canonical English"),
    tokyoGrouping: z.literal("131xx special wards; 13360 and above islands; other Tokyo municipalities Tama"),
  }).strict(),
}).strict();

/** Resource dependencies are file references; article/source context is retained separately. */
export function componentPayloadRefs(binding: BundledComponentBinding): string[] {
  if (binding.kind === "data") return ["article-components.en.json", "article-component-translations.ja.json",
    ...(binding.id === "residence-application-fees" ? ["residence-application-fees.en.json"] : [])];
  if (binding.kind === "finder") return ["finder-bindings.en.json"];
  if (binding.kind === "region-map") return ["orientation-regions.en.json", "prefecture-map-resources.en.json",
    "administrative-geographies.en.json", "interface-messages.en.json", "interface-messages.ja.json"];
  return ["component-bindings.en.json", "component-provenance.en.json"];
}

/** Unused composition/alias registrations borrow geography context, never an invented direct occurrence. */
export function componentHostArticles(id: ArticleComponentBlockKind, articles: readonly BundledArticle[]) {
  const direct = articles.filter(({ blocks }) => blocks.some((block) => block.kind === "component" && block.component === id));
  const hosts = direct.length || (id !== "japan-prefecture-regions" && id !== "japan-prefecture-region-cards") ? direct
    : articles.filter(({ blocks }) => blocks.some((block) => block.kind === "component"
    && (block.component === "japan-prefecture-finder" || block.component === "japan-region-map")));
  return { direct, hosts };
}

/** Runs after the ordinary file/schema/checksum and base-catalog reference gates. No platform API. */
export function validateBundledComponents(files: ReadonlyMap<string, string>, sha256: (text: string) => string,
  revision: (fields: Readonly<Record<string, string>>) => string): void {
  const payload = (path: string): unknown => JSON.parse(files.get(path)!);
  const one = <T>(schema: z.ZodType<T>, path: string): T => schema.array().length(1).parse(payload(path))[0]!;
  const articles = bundledArticleSchema.array().parse(payload("articles.en.json"));
  const translations = bundledArticleTranslationSchema.array().parse(payload("article-translations.ja.json"));
  const components = bundledArticleComponentSchema.array().parse(payload("article-components.en.json"));
  const artifacts = bundledArticleComponentArtifactSchema.array().parse(payload("article-component-translations.ja.json"));
  const bindings = bundledComponentBindingSchema.array().parse(payload("component-bindings.en.json"));
  const provenance = bundledComponentProvenanceSchema.array().parse(payload("component-provenance.en.json"));
  const equal = (left: unknown, right: unknown, message: string) => {
    if (JSON.stringify(left) !== JSON.stringify(right)) throw new Error(message);
  };
  const sameIds = (actual: readonly string[], expected: readonly string[], message: string) =>
    equal([...actual].sort(), [...expected].sort(), message);
  sameIds(bindings.map(({ id }) => id), Object.keys(articleComponentBlocks), "Component binding registration mismatch.");
  sameIds(provenance.map(({ id }) => id), bindings.map(({ id }) => id), "Component provenance registration mismatch.");
  sameIds(components.map(({ id }) => id), bindings.flatMap((binding) => binding.kind === "data" ? [binding.componentId] : []),
    "Component data registration mismatch.");
  for (const { component } of components) {
    if (component.kind === "japan-practical-basics") validateArticlePracticalBasics(component, articles.map(({ metadata }) => metadata.slug));
    else if (component.kind !== "residence-application-fees") validateArticleComponentTable(component, articles.map(({ metadata }) => metadata.slug));
  }
  for (const artifact of artifacts) {
    const component = components.find(({ id }) => id === artifact.contentId)?.component;
    if (!component || revision(translationSourceFields["article-component"](component)) !== artifact.sourceRevision
      || !areArticleComponentTranslationFieldsValid(component, artifact.fields)) {
      throw new Error("Component translation target, revision or complete field set mismatch.");
    }
  }
  one(bundledFeeDataSchema, "residence-application-fees.en.json");
  const regions = one(bundledOrientationRegionsSchema, "orientation-regions.en.json");
  const map = one(bundledPrefectureMapSchema, "prefecture-map-resources.en.json");
  const prefectures = administrativeGeographySchema.array().parse(payload("administrative-geographies.en.json"))
    .filter(({ type }) => type === "prefecture" || type === "metropolis")
    .map(({ id, code, names }) => ({ id, code, names: { en: names.en, ja: names.ja } }));
  parseOrientationMapData(regions.regions, map.paths, prefectures);
  if (map.license.text.includes("\r") || sha256(map.license.text) !== map.license.sha256) throw new Error("Map license must retain checksummed LF text.");
  const interfacePacks = interfaceMessagePackPairSchema.parse({
    english: one(englishInterfaceMessagePackSchema, "interface-messages.en.json"),
    japanese: one(japaneseInterfaceMessagePackSchema, "interface-messages.ja.json"),
  });
  const finder = one(bundledFinderBindingSchema, "finder-bindings.en.json");
  projectBundledFinder(files);
  for (const path of Object.values(finder.refs)) if (!files.has(path)) throw new Error("Missing finder payload reference.");
  equal(finder.messageIds, Object.keys(interfacePacks.english.messages).filter((key) => key.startsWith("finder.")), "Finder message binding mismatch.");
  const articleIds = new Set(articles.map(({ metadata }) => metadata.id));
  const adviceIds = new Set((payload("general-local-advice.en.json") as { id: string }[]).map(({ id }) => id));
  for (const [role, guides] of [["national", finder.nationalGuides], ["general", finder.generalGuides]] as const) {
    if (new Set(guides.map(({ articleId }) => articleId)).size !== guides.length
      || new Set(guides.map(({ messageId }) => messageId)).size !== guides.length) throw new Error("Duplicate finder guide binding.");
    for (const guide of guides) if (!articleIds.has(guide.articleId) || (role === "general" && !adviceIds.has(guide.articleId))
      || !guide.messageId.startsWith(`finder.${role}Guide.`) || !Object.hasOwn(interfacePacks.english.messages, guide.messageId)) {
      throw new Error("Unresolved finder guide binding.");
    }
  }
  if (!Object.keys(interfacePacks.english.messages).some((key) => key.startsWith("regionMap."))) throw new Error("Missing region-map interface group.");
  for (const binding of bindings) {
    const record = provenance.find(({ id }) => id === binding.id)!;
    const { direct, hosts } = componentHostArticles(binding.id, articles);
    equal(record.directArticleIds, direct.map(({ metadata }) => metadata.id), "Component direct occurrence mismatch.");
    equal(record.hostArticleIds, hosts.map(({ metadata }) => metadata.id), "Component host context mismatch.");
    equal(record.contextSourceIds, [...new Set(hosts.flatMap(({ metadata }) => metadata.sourceIds))], "Component source context mismatch.");
    equal(record.payloadRefs, componentPayloadRefs(binding), "Component resource binding mismatch.");
    for (const path of record.payloadRefs) if (!files.has(path)) throw new Error("Missing component resource.");
  }
  const registered = new Set(bindings.map(({ id }) => id));
  for (const article of [...articles, ...translations]) for (const block of article.blocks) {
    if (block.kind === "component" && !registered.has(block.component)) throw new Error("Unresolved article component.");
  }
}
