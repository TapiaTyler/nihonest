type BilingualLabel = Readonly<{ en: string; ja: string }>;
type BilingualRegion = Readonly<{ name: BilingualLabel; prefectures: BilingualLabel }>;

/** Shared regional labels keep the English reference and Japanese localization in sync. */
export const japanPrefectureRegions = [
  { name: { en: "Hokkaido", ja: "北海道" }, prefectures: { en: "Hokkaido", ja: "北海道" } },
  { name: { en: "Tohoku", ja: "東北" }, prefectures: { en: "Aomori, Iwate, Miyagi, Akita, Yamagata, Fukushima", ja: "青森県、岩手県、宮城県、秋田県、山形県、福島県" } },
  { name: { en: "Kanto", ja: "関東" }, prefectures: { en: "Ibaraki, Tochigi, Gunma, Saitama, Chiba, Tokyo, Kanagawa", ja: "茨城県、栃木県、群馬県、埼玉県、千葉県、東京都、神奈川県" } },
  { name: { en: "Chubu", ja: "中部" }, prefectures: { en: "Niigata, Toyama, Ishikawa, Fukui, Yamanashi, Nagano, Gifu, Shizuoka, Aichi", ja: "新潟県、富山県、石川県、福井県、山梨県、長野県、岐阜県、静岡県、愛知県" } },
  { name: { en: "Kansai or Kinki", ja: "関西または近畿" }, prefectures: { en: "Mie, Shiga, Kyoto, Osaka, Hyogo, Nara, Wakayama", ja: "三重県、滋賀県、京都府、大阪府、兵庫県、奈良県、和歌山県" } },
  { name: { en: "Chugoku", ja: "中国地方" }, prefectures: { en: "Tottori, Shimane, Okayama, Hiroshima, Yamaguchi", ja: "鳥取県、島根県、岡山県、広島県、山口県" } },
  { name: { en: "Shikoku", ja: "四国" }, prefectures: { en: "Tokushima, Kagawa, Ehime, Kochi", ja: "徳島県、香川県、愛媛県、高知県" } },
  { name: { en: "Kyushu and Okinawa", ja: "九州・沖縄" }, prefectures: { en: "Fukuoka, Saga, Nagasaki, Kumamoto, Oita, Miyazaki, Kagoshima, Okinawa", ja: "福岡県、佐賀県、長崎県、熊本県、大分県、宮崎県、鹿児島県、沖縄県" } },
] as const satisfies readonly BilingualRegion[];

const practicalBasics = {
  en: [
    <><strong>Time:</strong> Japan uses Japan Standard Time (JST), UTC+9, without seasonal daylight-saving changes.</>,
    <><strong>Money:</strong> The national currency is the Japanese yen (JPY), written ¥ or 円.</>,
    <><strong>Measurements:</strong> Official and everyday measurements generally use metric units such as kilometres, metres, kilograms, litres, and Celsius.</>,
    <><strong>Emergencies:</strong> Call 110 for urgent police response and 119 for fire, rescue, or ambulance. Read the <a className="font-semibold text-teal-900 underline" href="/articles/calling-police-fire-and-ambulance-services-in-japan">emergency-call guide</a> and prepare with the <a className="font-semibold text-teal-900 underline" href="/articles/preparing-for-disasters-and-evacuation-in-japan">disaster and evacuation guide</a>.</>,
  ],
  ja: [
    <><strong>時刻：</strong>日本は日本標準時（JST、UTC+9）を使用し、季節による夏時間の変更はありません。</>,
    <><strong>通貨：</strong>日本の通貨は日本円（JPY）で、記号は「¥」または「円」です。</>,
    <><strong>単位：</strong>公的な場面と日常生活では、キロメートル、メートル、キログラム、リットル、摂氏などのメートル法が一般的です。</>,
    <><strong>緊急時：</strong>警察への緊急通報は110番、火災・救助・救急車は119番です。<a className="font-semibold text-teal-900 underline" href="/articles/calling-police-fire-and-ambulance-services-in-japan">緊急通報のガイド</a>を読み、<a className="font-semibold text-teal-900 underline" href="/articles/preparing-for-disasters-and-evacuation-in-japan">災害・避難のガイド</a>で備えてください。</>,
  ],
} as const;

type Locale = "en" | "ja";

export function JapanPrefectureRegionGrid({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  return (
    <div className="not-prose grid gap-3 sm:grid-cols-2">
      {japanPrefectureRegions.map((region) => (
        <details key={region.name.en} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="min-h-11 cursor-pointer font-semibold text-slate-950">{region.name[locale]}</summary>
          <p className="mt-2 leading-7 text-slate-700">{region.prefectures[locale]}</p>
        </details>
      ))}
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
