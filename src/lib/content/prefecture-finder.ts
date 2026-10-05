import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sortAdministrativeGeographies } from "@/domain/geography/administrative-geography";
import { englishGeographyName } from "@/domain/geography/english-name";
import type { FinderPrefecture } from "@/domain/geography/prefecture";
import { getResearchedMunicipalityIds } from "./local-guidance";
import type { FinderCoverage, FinderMunicipality } from "./prefecture-finder-guides";

export type { FinderCoverage, FinderMunicipality };
export { prefectureGeneralGuides, prefectureNationalGuides } from "./prefecture-finder-guides";

export type PrefectureFinderData = Readonly<{ prefectures: FinderPrefecture[]; municipalities: FinderMunicipality[]; coverage: FinderCoverage[] }>;

let finderData: PrefectureFinderData | undefined;

/**
 * Finder payload derived from the static catalogs. It is built once and reused, so a page that renders the
 * English and Japanese finders passes the same objects to both and React serializes them once.
 */
export function getPrefectureFinderData(): PrefectureFinderData {
  finderData ??= buildPrefectureFinderData();
  return finderData;
}

function buildPrefectureFinderData(): PrefectureFinderData {
  const prefectures = sortAdministrativeGeographies(
    administrativeGeographies.filter((record) => record.type === "prefecture" || record.type === "metropolis"),
    "en",
  ).map((record) => ({ id: record.id, code: record.code, names: { en: record.names.en!, ja: record.names.ja } }));

  // Only municipalities with researched guidance are offered; "Other" in the finder covers the rest of the prefecture.
  const researched = getResearchedMunicipalityIds();
  const municipalities = administrativeGeographies
    .filter((record) => record.type !== "prefecture" && record.type !== "metropolis" && researched.has(record.id))
    .map((record) => ({
      id: record.id,
      code: record.code,
      parentId: record.parentId,
      name: englishGeographyName(record, record.parentId ? getAdministrativeGeography(record.parentId) : undefined),
      japaneseName: record.names.ja,
      prefectureId: `jp-${record.prefectureCode}000`,
      isDesignatedCity: record.type === "designated-city",
    }));

  const coverage = supportedGeographies.flatMap((geography) => {
    if (!geography.selectable) return [];
    const municipality = getAdministrativeGeography(geography.id);
    if (!municipality) throw new Error(`Missing canonical municipality ${geography.id}.`);
    const prefectureId = municipality.parentId;
    if (!prefectureId) throw new Error(`Missing prefecture parent for ${geography.id}.`);
    const supplements = localGuidanceSupplements.filter(({ geographyId }) => geographyId === geography.id)
      .map(({ id, title, articleId, lastCheckedAt, status }) => ({ id, title, articleId, lastCheckedAt, status }));
    return supplements.length ? [{ prefectureId, municipality: { id: municipality.id, name: geography.name, supplements } }] : [];
  }).reduce<FinderCoverage[]>((result, entry) => {
    const group = result.find(({ prefectureId }) => prefectureId === entry.prefectureId);
    if (group) result[result.indexOf(group)] = { ...group, municipalities: [...group.municipalities, entry.municipality] };
    else result.push({ prefectureId: entry.prefectureId, municipalities: [entry.municipality] });
    return result;
  }, []).map((group) => ({
    ...group,
    municipalities: [...group.municipalities].sort((left, right) => left.id.localeCompare(right.id, "en")),
  }));

  return { prefectures, municipalities, coverage };
}
