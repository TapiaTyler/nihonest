import type { AdministrativeGeography } from "./administrative-geography";

/**
 * English display labels for administrative geographies. A record's own `names.en` always wins. Otherwise the
 * label is romanized from the official kana reading in modified Hepburn without macrons, the convention the
 * existing English names follow ("Koto City", not "Kōtō City"), and given the unit's English suffix. This is a
 * display label, never an identity: IDs and codes stay the only keys.
 */

const digraphs: Readonly<Record<string, string>> = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho", じゃ: "ja", じゅ: "ju", じょ: "jo",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho", ぢゃ: "ja", ぢゅ: "ju", ぢょ: "jo",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo", りゃ: "rya", りゅ: "ryu", りょ: "ryo",
};

const monographs: Readonly<Record<string, string>> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko", が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to", だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo", や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n",
  ゃ: "ya", ゅ: "yu", ょ: "yo", ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o", ゔ: "vu",
};

/** Romanizes hiragana (katakana is converted first). Long vowels ou, oo, and uu are shortened, as in "Tokyo". */
export function romanizeKana(kana: string): string {
  const hiragana = kana.replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60));
  let result = "";
  let doubleNext = false;
  for (let index = 0; index < hiragana.length; index += 1) {
    const pair = hiragana.slice(index, index + 2);
    const single = hiragana[index]!;
    if (single === "っ") {
      doubleNext = true;
      continue;
    }
    if (single === "ー") continue;
    const syllable = digraphs[pair] ?? monographs[single];
    if (syllable === undefined) throw new Error(`Cannot romanize "${single}" in "${kana}".`);
    if (digraphs[pair]) index += 1;
    result += doubleNext ? (syllable.startsWith("ch") ? "t" : syllable[0]) + syllable : syllable;
    doubleNext = false;
  }
  // Traditional Hepburn writes n as m before b, m, and p, as official names do ("Tempaku").
  return result.replace(/o[ou]/g, "o").replace(/uu/g, "u").replace(/n(?=[bmp])/g, "m");
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const unitSuffix: Readonly<Partial<Record<AdministrativeGeography["type"], { kana: readonly string[]; en: string }>>> = {
  "special-ward": { kana: ["く"], en: "City" },
  "designated-city": { kana: ["し"], en: "City" },
  city: { kana: ["し"], en: "City" },
  town: { kana: ["ちょう", "まち"], en: "Town" },
  village: { kana: ["むら", "そん"], en: "Village" },
  "administrative-ward": { kana: ["く"], en: "Ward" },
};

/**
 * The English label for a record. An administrative ward needs its designated-city parent, whose reading
 * prefixes the ward's, and is labeled with it ("Chuo Ward, Sapporo"). Records without a reading fall back to the
 * Japanese name.
 */
export function englishGeographyName(record: AdministrativeGeography, parent?: AdministrativeGeography): string {
  if (record.names.en) return record.names.en;
  const suffix = unitSuffix[record.type];
  let kana = record.names.kana;
  if (!suffix || !kana) return record.names.ja;
  if (record.type === "administrative-ward") {
    if (!parent?.names.kana || !kana.startsWith(parent.names.kana)) return record.names.ja;
    kana = kana.slice(parent.names.kana.length);
  }
  // Town and village readings vary (ちょう/まち, むら/そん); only a recognized suffix is replaced.
  const ending = suffix.kana.find((candidate) => kana.endsWith(candidate));
  const stem = ending ? kana.slice(0, -ending.length) : kana;
  const label = `${capitalize(romanizeKana(stem))} ${suffix.en}`;
  if (record.type !== "administrative-ward" || !parent) return label;
  const cityLabel = englishGeographyName(parent).replace(/ City$/, "");
  return `${label}, ${cityLabel}`;
}
