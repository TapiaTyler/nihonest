import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sortAdministrativeGeographies } from "@/domain/geography/administrative-geography";
import { englishGeographyName } from "@/domain/geography/english-name";
import type { FinderPrefecture } from "@/domain/geography/prefecture";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";

export type FinderCoverage = Readonly<{
  prefectureId: string;
  municipalities: readonly Readonly<{
    id: string;
    name: string;
    supplements: readonly Readonly<{
      id: string;
      title: string;
      articleId: string;
      lastCheckedAt: string;
      status: "needs-review";
    }>[];
  }>[];
}>;

export type FinderMunicipality = Readonly<{
  id: string;
  code: string;
  name: string;
  prefectureId: string;
  parentId?: string;
}>;

export const prefectureNationalGuides = [
  { articleId: "registering-your-address-after-arrival", title: "Registering your address" },
  { articleId: "joining-national-health-insurance", title: "National Health Insurance" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", title: "Disaster preparation and evacuation" },
  { articleId: "finding-japanese-language-and-local-support", title: "Japanese language and local support" },
] as const;

export const prefectureGeneralGuides = [
  { articleId: "registering-your-address-after-arrival", title: "Address registration" },
  { articleId: "joining-national-health-insurance", title: "National Health Insurance" },
  { articleId: "sorting-household-waste-and-arranging-disposal", title: "Household waste" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", title: "Disaster preparation" },
  { articleId: "finding-japanese-language-and-local-support", title: "Language and local support" },
  { articleId: "income-and-resident-tax-after-moving-to-japan", title: "Income and resident tax" },
  { articleId: "national-pension-after-moving-to-japan", title: "National Pension" },
] as const satisfies readonly { articleId: keyof typeof generalLocalAdvice; title: string }[];

export function getPrefectureFinderData(): { prefectures: FinderPrefecture[]; municipalities: FinderMunicipality[]; coverage: FinderCoverage[] } {
  const prefectures = sortAdministrativeGeographies(
    administrativeGeographies.filter((record) => record.type === "prefecture" || record.type === "metropolis"),
    "en",
  ).map((record) => ({ id: record.id, code: record.code, names: { en: record.names.en!, ja: record.names.ja } }));

  const municipalities = administrativeGeographies
    .filter((record) => record.type !== "prefecture" && record.type !== "metropolis")
    .map((record) => ({
      id: record.id,
      code: record.code,
      parentId: record.parentId,
      name: englishGeographyName(record, record.parentId ? getAdministrativeGeography(record.parentId) : undefined),
      prefectureId: `jp-${record.prefectureCode}000`,
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
