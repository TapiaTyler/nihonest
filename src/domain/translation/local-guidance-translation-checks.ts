/**
 * Mechanical checks for a Japanese municipality-guidance artifact against its English fields. They catch structural
 * and factual slips (missing keys, dropped numbers, untranslated text); they do not judge meaning or wording.
 */
export type LocalGuidanceTranslationIssue = Readonly<{ key: string; level: "error" | "warning"; message: string }>;

const japaneseScript = /[぀-ヿ㐀-鿿]/;

function toHalfWidthDigits(text: string): string {
  return text.replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0));
}

/** Numbers that must survive translation: phone and postal segments, amounts, counts, dates, and times. */
export function significantNumbers(english: string): readonly string[] {
  const numbers = new Set<string>();
  for (const match of english.matchAll(/\d+(?:,\d{3})*(?:\.\d+)?/g)) {
    const value = match[0];
    // "12 p.m." is written 正午 and "12:30 p.m." 午後0時30分 in Japanese, so 12 before p.m. is not required.
    if (value === "12" && /^(?::\d{2})?\s*p\.?m\.?/i.test(english.slice(match.index + value.length))) continue;
    // ":00" minutes vanish in 午前8時, and a 24-hour "19:00" is written 午後7時, so it may appear as its 12-hour hour.
    if (value === "00" && english[match.index - 1] === ":") continue;
    const hour = Number(value);
    if (/^:\d{2}/.test(english.slice(match.index + value.length)) && hour >= 13 && hour <= 23) {
      numbers.add(`${value}|${hour - 12}`);
      continue;
    }
    numbers.add(value);
  }
  return [...numbers];
}

export function checkLocalGuidanceTranslation(english: Readonly<Record<string, string>>, japanese: Readonly<Record<string, string>>): LocalGuidanceTranslationIssue[] {
  const issues: LocalGuidanceTranslationIssue[] = [];
  for (const key of Object.keys(english)) {
    if (!(key in japanese)) issues.push({ key, level: "error", message: "Missing Japanese text for this field." });
  }
  for (const [key, value] of Object.entries(japanese)) {
    const source = english[key];
    if (source === undefined) {
      issues.push({ key, level: "error", message: "No English field has this key." });
      continue;
    }
    if (!value.trim()) {
      issues.push({ key, level: "error", message: "Japanese text is empty." });
      continue;
    }
    if (!japaneseScript.test(value)) issues.push({ key, level: "error", message: "No Japanese text; the field looks untranslated." });
    // Whole numbers in the Japanese, so "4" is not found inside "14". A month or day written "09" in English is
    // 9月 or 9日 in Japanese; phone segments keep their zeros either way.
    const present = new Set([...toHalfWidthDigits(value).matchAll(/\d+(?:,\d{3})*(?:\.\d+)?/g)]
      .flatMap(([match]) => { const plain = match.replace(/,/g, ""); return [plain, String(Number(plain))]; }));
    for (const number of significantNumbers(source)) {
      // A 24-hour time ("19|7") is kept either way; the 12-hour hour must come with 午後.
      const [twentyFour, twelve] = number.split("|");
      if (twelve && /午後/.test(value) && present.has(twelve)) continue;
      const plain = twentyFour!.replace(/,/g, "");
      // Japanese writes the noon hour as 正午 or 午後0時 (12:45 p.m. is 午後0時45分).
      if (plain === "12" && /正午|午後[0０]時/.test(value)) continue;
      // An upper age is often written as the next age with 未満: "20 to 59" is 20歳以上60歳未満.
      if (/^\d+$/.test(plain) && toHalfWidthDigits(value).includes(`${Number(plain) + 1}歳未満`)) continue;
      // Amounts are often written with 万: 50,000 yen is 5万円.
      const amount = Number(plain);
      if (amount >= 10_000 && amount % 1_000 === 0 && toHalfWidthDigits(value).includes(`${amount / 10_000}万`)) continue;
      // Official names often write small numbers in kanji: "Building 1" is 第一庁舎, "Block 2" 二丁目.
      if (/^(?:[1-9]|10)$/.test(plain) && value.includes("一二三四五六七八九十"[Number(plain) - 1]!)) continue;
      if (!present.has(plain) && !present.has(String(Number(plain)))) {
        issues.push({ key, level: "error", message: `The number ${twentyFour} from the English is missing.` });
      }
    }
    if (/\bThis English summary\b|\bNihonest guidance\b/.test(value)) {
      issues.push({ key, level: "error", message: "English boilerplate was left in the Japanese." });
    }
  }
  return issues;
}
