import { japanPrefectureRegions } from "@/data/geography/regions";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import Link from "next/link";
import { PrefectureFinder } from "./prefecture-finder";

export { japanPrefectureRegions } from "@/data/geography/regions";

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

export function JapanPrefectureRegionGrid({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { prefectures, municipalities, coverage } = getPrefectureFinderData();
  return (
    <div className="not-prose space-y-4">
      <PrefectureFinder locale={locale} prefectures={prefectures} municipalities={municipalities} coverage={coverage} />
      <div className="grid gap-3 sm:grid-cols-2">
      {japanPrefectureRegions.map((region) => (
        <details key={region.name.en} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="min-h-11 cursor-pointer font-semibold text-slate-950">{region.name[locale]}</summary>
          <p className="mt-2 leading-7 text-slate-700">{region.prefectures[locale]}</p>
        </details>
      ))}
      </div>
    </div>
  );
}

export function JapanPracticalBasics({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  return (
    <div className="not-prose rounded-2xl border border-teal-200 bg-teal-50 p-5 text-sm leading-7 text-teal-950">
      <ul className="space-y-2">
        {practicalBasics[locale].map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );
}
