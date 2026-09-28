import type { generalLocalAdvice } from "@/data/local-guidance/general-advice";

/**
 * Lightweight finder constants and payload types for the browser. This module must not import geography or
 * guidance catalogs; the server assembles finder data in ./prefecture-finder and passes only the payload.
 */
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
