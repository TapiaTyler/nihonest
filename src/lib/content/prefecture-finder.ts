import { administrativeGeographies, getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sortAdministrativeGeographies } from "@/domain/geography/administrative-geography";
import { englishGeographyName } from "@/domain/geography/english-name";
import type { FinderPrefecture } from "@/domain/geography/prefecture";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { getResearchedMunicipalityIds } from "./local-guidance";

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
  japaneseName: string;
  prefectureId: string;
  parentId?: string;
  /** Designated cities run procedures city-wide through ward offices whose details can differ. */
  isDesignatedCity: boolean;
}>;

export const prefectureNationalGuides = [
  { articleId: "registering-your-address-after-arrival", title: "Registering your address", japaneseTitle: "住所の登録" },
  { articleId: "joining-national-health-insurance", title: "National Health Insurance", japaneseTitle: "国民健康保険" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", title: "Disaster preparation and evacuation", japaneseTitle: "災害への備えと避難" },
  { articleId: "finding-japanese-language-and-local-support", title: "Japanese language and local support", japaneseTitle: "日本語学習と地域の支援" },
] as const;

export const prefectureGeneralGuides = [
  { articleId: "registering-your-address-after-arrival", title: "Address registration", japaneseTitle: "住所の登録" },
  { articleId: "joining-national-health-insurance", title: "National Health Insurance", japaneseTitle: "国民健康保険" },
  { articleId: "sorting-household-waste-and-arranging-disposal", title: "Household waste", japaneseTitle: "家庭ごみ" },
  { articleId: "preparing-for-disasters-and-evacuation-in-japan", title: "Disaster preparation", japaneseTitle: "災害への備え" },
  { articleId: "finding-japanese-language-and-local-support", title: "Language and local support", japaneseTitle: "日本語と地域の支援" },
  { articleId: "income-and-resident-tax-after-moving-to-japan", title: "Income and resident tax", japaneseTitle: "所得税と住民税" },
  { articleId: "national-pension-after-moving-to-japan", title: "National Pension", japaneseTitle: "国民年金" },
] as const satisfies readonly { articleId: keyof typeof generalLocalAdvice; title: string; japaneseTitle: string }[];

export function getPrefectureFinderData(): { prefectures: FinderPrefecture[]; municipalities: FinderMunicipality[]; coverage: FinderCoverage[] } {
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
