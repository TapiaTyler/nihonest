# Japanese Municipality Guidance Translation Prompt

Translate one Nihonest municipality-guidance supplement from canonical English into clear, polite Japanese for foreign residents who read Japanese. The input is a JSON object of path-keyed English fields; return one JSON object with exactly the same keys and Japanese string values.

## Meaning

- The English supplement is canonical. Keep every fact, condition, qualification (may, can, usually, in principle), deadline, and limit. Do not add, drop, update, or reinterpret facts, even if an official page now says something different: report the difference instead.
- Keep the distinction between the municipality, its offices, the prefecture, national agencies, and private organizations.
- Keep advice as advice and official requirements as requirements. Do not turn "can" into "must" or the reverse.
- Use です・ます for sentences. Keep titles and action titles short noun phrases or short sentences, as in the English.

## Official Japanese names

The English was written from Japanese official pages, so restore the official Japanese wording rather than translating English names literally.

- Use the municipality's own names for sections, counters, buildings, floors, facilities, programs, and forms, taken from the cited official pages (for example 市民課, 国保年金課, 本庁舎1階, 行政サービスセンター). The municipality's own term wins over the standard terms below (for example そ大ごみ, 集積場所, 社会保険喪失証明書, ハングル). If the page is not available and the official name is not certain, use a plain descriptive Japanese term and flag it.
- Municipality and prefecture names use their official Japanese forms (川越市, 横浜市中区, 埼玉県). The `responsible-body` field is the official Japanese name of the body.
- Health insurance cards: use 資格確認書 and 資格情報のお知らせ, and マイナ保険証 for a My Number Card registered as a health insurance card; do not use the retired 国民健康保険証 or 保険証 for the municipality's card.
- Resident tax: in Tokyo's special wards, "special ward inhabitant tax" or "inhabitant tax" is 住民税（特別区民税・都民税）; in Tokyo's cities 市民税・都民税; elsewhere 市民税・県民税 (府民税, 道民税 as applicable). "Resident tax" alone is 住民税.
- Use standard terms: 転入届, 住民票, 在留カード, 特別永住者証明書, マイナンバーカード, 委任状, 本人確認書類, 国民健康保険, 国民健康保険税 or 国民健康保険料 (as the municipality uses), 資格確認書, 資格情報のお知らせ, 資格喪失証明書, 離職票, 国民年金, 第1号被保険者, 第3号被保険者, 任意加入, 住民税 (市民税・県民税; 特別区民税・都民税 in Tokyo's wards), 納税管理人, 確定申告, 過料, 粗大ごみ, 指定袋, ごみ集積所 or ごみステーション (as the municipality uses), ハザードマップ, 指定緊急避難場所, 指定避難所, 日本語教室, 多言語相談, マイナポータル, eLTAX.
- Apply the protected terminology and official residence-status names supplied with the prompt.

## Numbers and formats

- Keep phone numbers, postal codes, amounts, counts, and window numbers exactly: every number in the English must appear in the Japanese.
- Dates: 2026年3月16日. Times: 午前8時30分, 午後5時15分; ranges with 〜 (午前9時〜午後5時). Weekdays: 月曜日, 平日. Money: 1,000円. Floors: 1階. Windows: 3番窓口.
- Keep proper names of apps and services as the municipality writes them (LINE, PayPay, さんあ～る).
- Noon is 正午; a time such as 12:45 p.m. is 午後0時45分 when the municipality writes it that way.
- Drop romanized Japanese that the English adds in parentheses, such as "(nozei kanrinin)": the Japanese term itself replaces it.
- "Plain Japanese" is やさしい日本語. Fiscal years keep the Western year first: 2026年度（令和8年度）.

## Fixed wording

- `source-format-note`: translate the page-language statement plainly (川越市の転入届のページは日本語です。), and render the closing sentence "This English summary is Nihonest guidance, not an official translation." as 「この要約はNihonestによる案内で、公式の翻訳ではありません。」 Other variants of that sentence use the same Japanese.
- Titles follow the English. Where the English uses the standard pattern, use these forms: "Registering an address in X" 「Xでの住所の届出」; "National Health Insurance in X" 「Xの国民健康保険」; "Sorting and disposing of waste in X" 「Xのごみの分け方と出し方」; "Resident tax in X" 「Xの住民税」; "Disaster information for X" 「Xの防災情報」; "Language and consultation support in X" 「Xの日本語学習と相談」; "National Pension in X" 「Xの国民年金」. Translate other titles faithfully in the same style.

## Flags and source notes

After the JSON object, add a line `FLAGS:` followed by one item per line for translation questions a reviewer must settle: an official name you could not confirm, an ambiguous English sentence, or a wording choice between two acceptable forms. Write `FLAGS: none` if there is nothing.

Then add a line `SOURCE NOTES:` followed by one item per line where the official page differs from the English or adds details the English leaves out. These are recorded for the English research, not the translation; you kept the English meaning. Write `SOURCE NOTES: none` if there is nothing.
