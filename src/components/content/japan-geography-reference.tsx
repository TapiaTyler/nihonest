import "server-only";

import { japanPrefectureRegions } from "@/data/geography/regions";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import Link from "next/link";
import { LazyJapanRegionMapView, LazyPrefectureFinder } from "./lazy-geography";

export { japanPrefectureRegions };

const practicalBasics = {
  en: [
    <><strong>Time:</strong> Japan uses Japan Standard Time (JST), UTC+9, without seasonal daylight-saving changes.</>,
    <><strong>Money:</strong> The national currency is the Japanese yen (JPY), written ¥ or 円.</>,
    <><strong>Measurements:</strong> Official and everyday measurements generally use metric units such as kilometres, metres, kilograms, litres, and Celsius.</>,
    <><strong>Emergencies:</strong> Call 110 for urgent police response and 119 for fire, rescue, or ambulance. Read the <Link className="font-semibold text-teal-900 underline" href="/articles/calling-police-fire-and-ambulance-services-in-japan">emergency-call guide</Link> and prepare with the <Link className="font-semibold text-teal-900 underline" href="/articles/preparing-for-disasters-and-evacuation-in-japan">disaster and evacuation guide</Link>.</>,
  ],
  ja: [
    <><strong>時刻：</strong>日本は日本標準時（JST、UTC+9）を使用し、季節による夏時間の変更はありません。</>,
    <><strong>通貨：</strong>日本の通貨は日本円（JPY）で、記号は「¥」または「円」です。</>,
    <><strong>単位：</strong>公的な場面と日常生活では、キロメートル、メートル、キログラム、リットル、摂氏などのメートル法が一般的です。</>,
    <><strong>緊急時：</strong>警察への緊急通報は110番、火災・救助・救急車は119番です。<Link className="font-semibold text-teal-900 underline" href="/articles/calling-police-fire-and-ambulance-services-in-japan">緊急通報のガイド</Link>を読み、<Link className="font-semibold text-teal-900 underline" href="/articles/preparing-for-disasters-and-evacuation-in-japan">災害・避難のガイド</Link>で備えてください。</>,
  ],
} as const;

type Locale = "en" | "ja";
type SupplementTitles = Readonly<Record<string, string>>;

/**
 * Server entry points for the geography blocks. They assemble catalog-derived payloads here and pass only those to
 * client components, so browser code never imports the geography registry or municipality guidance catalogs.
 */
export function JapanRegionMap({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  return <LazyJapanRegionMapView regions={japanPrefectureRegions} locale={locale} />;
}

export { JapanRegionMap as JapanPrefectureRegionCards };

export function JapanPrefectureRegionGrid({ locale = "en", japaneseSupplementTitles }: Readonly<{ locale?: Locale; japaneseSupplementTitles?: SupplementTitles }>) {
  return (
    <div className="not-prose space-y-4">
      <JapanPrefectureFinder locale={locale} japaneseSupplementTitles={japaneseSupplementTitles} />
      <JapanRegionMap locale={locale} />
    </div>
  );
}

export function JapanPrefectureFinder({ locale = "en", japaneseSupplementTitles }: Readonly<{ locale?: Locale; japaneseSupplementTitles?: SupplementTitles }>) {
  const { prefectures, municipalities, coverage } = getPrefectureFinderData();
  return <LazyPrefectureFinder locale={locale} prefectures={prefectures} municipalities={municipalities} coverage={coverage} japaneseSupplementTitles={japaneseSupplementTitles} />;
}

export function JapanPracticalBasics({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  return (
    <div className="not-prose mt-4 space-y-4 text-slate-700">
      {practicalBasics[locale].map((item, index) => <p key={index} className="leading-8">{item}</p>)}
    </div>
  );
}
