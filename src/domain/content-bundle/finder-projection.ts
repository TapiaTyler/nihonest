import { administrativeGeographySchema, sortAdministrativeGeographies } from "@/domain/geography/administrative-geography";
import { englishGeographyName } from "@/domain/geography/english-name";
import { localGuidanceSupplementSchema, supportedGeographySchema } from "@/domain/geography/local-guidance";
import { bundledGeographyAliasSchema } from "./geography-payload";

/**
 * Reconstruct the static finder payload from verified bundle files. Selection/UI behavior stays with the
 * consumer; this preserves the web's ordering, canonical alias resolution and researched-only coverage.
 */
export function projectBundledFinder(files: ReadonlyMap<string, string>) {
  const payload = (path: string): unknown => JSON.parse(files.get(path)!);
  const records = administrativeGeographySchema.array().parse(payload("administrative-geographies.en.json"));
  const aliases = new Map(bundledGeographyAliasSchema.array().parse(payload("geography-aliases.en.json"))
    .map(({ id, geographyId }) => [id, geographyId]));
  const supplements = localGuidanceSupplementSchema.array().parse(payload("local-guidance.en.json"));
  const supported = supportedGeographySchema.array().parse(payload("supported-geographies.en.json"));
  const byId = new Map(records.map((record) => [record.id, record]));
  const get = (id: string) => byId.get(aliases.get(id) ?? id);
  const researched = new Set(supplements.map(({ geographyId }) => {
    const record = get(geographyId);
    if (!record) throw new Error("Finder supplement references an unknown municipality.");
    return record.id;
  }));
  const prefectures = sortAdministrativeGeographies(records.filter(({ type }) => type === "prefecture" || type === "metropolis"), "en")
    .map(({ id, code, names }) => ({ id, code, names: { en: names.en!, ja: names.ja } }));
  const municipalities = records.filter(({ type, id }) => type !== "prefecture" && type !== "metropolis" && researched.has(id))
    .map((record) => ({ id: record.id, code: record.code, parentId: record.parentId,
      name: englishGeographyName(record, record.parentId ? get(record.parentId) : undefined), japaneseName: record.names.ja,
      prefectureId: `jp-${record.prefectureCode}000`, isDesignatedCity: record.type === "designated-city" }));
  type MunicipalityCoverage = { id: string; name: string; supplements: { id: string; title: string; articleId: string; lastCheckedAt: string; status: "needs-review" }[] };
  const coverage: { prefectureId: string; municipalities: MunicipalityCoverage[] }[] = [];
  for (const geography of supported) {
    if (!geography.selectable) continue;
    const canonical = get(geography.id);
    if (!canonical?.parentId) throw new Error("Finder supported municipality has no canonical parent.");
    const entries = supplements.filter(({ geographyId }) => geographyId === geography.id)
      .map(({ id, title, articleId, lastCheckedAt, status }) => ({ id, title, articleId, lastCheckedAt, status }));
    if (!entries.length) continue;
    let group = coverage.find(({ prefectureId }) => prefectureId === canonical.parentId);
    if (!group) {
      group = { prefectureId: canonical.parentId, municipalities: [] };
      coverage.push(group);
    }
    group.municipalities.push({ id: canonical.id, name: geography.name, supplements: entries });
  }
  for (const group of coverage) group.municipalities.sort((left, right) => left.id.localeCompare(right.id, "en"));
  return { prefectures, municipalities, coverage };
}
