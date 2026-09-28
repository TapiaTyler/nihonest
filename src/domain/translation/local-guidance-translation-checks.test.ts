import { describe, expect, it } from "vitest";
import { checkLocalGuidanceTranslation, significantNumbers } from "./local-guidance-translation-checks";

describe("local guidance translation checks", () => {
  it("finds the numbers a translation must keep", () => {
    expect(significantNumbers("Call 0985-25-2111, weekdays 8:30 a.m. to 5:15 p.m.; 1,000 yen per item, up to 5.")).toEqual(
      ["0985", "25", "2111", "8", "30", "5", "15", "1,000"],
    );
    expect(significantNumbers("Open 9 a.m. to 12 p.m., or 12:30 p.m. on Saturdays.")).toEqual(["9", "30"]);
  });

  it("accepts a faithful translation and reports structural and factual slips", () => {
    const english = { title: "Registering an address in Kawagoe", summary: "File within 14 days, weekdays 8:45 a.m. to 4:30 p.m.; the fine is up to 50,000 yen." };
    expect(checkLocalGuidanceTranslation(english, {
      title: "川越市での住所の届出",
      summary: "１４日以内に、平日午前8時45分〜午後4時30分に届け出てください。過料は最大50,000円です。",
    })).toEqual([]);
    const issues = checkLocalGuidanceTranslation(english, { summary: "14日以内に届け出てください。This English summary is Nihonest guidance.", extra: "余分" });
    expect(issues.map(({ key, message }) => `${key}: ${message}`)).toEqual([
      "title: Missing Japanese text for this field.",
      "summary: The number 8 from the English is missing.",
      "summary: The number 45 from the English is missing.",
      "summary: The number 4 from the English is missing.",
      "summary: The number 30 from the English is missing.",
      "summary: The number 50,000 from the English is missing.",
      "summary: English boilerplate was left in the Japanese.",
      "extra: No English field has this key.",
    ]);
    expect(checkLocalGuidanceTranslation({ title: "Kawagoe" }, { title: "Kawagoe" })[0]?.message).toMatch(/untranslated/);
    expect(checkLocalGuidanceTranslation({ hours: "8:30 to 11:30 a.m. and 12:45 to 4 p.m." }, { hours: "午前8時30分〜11時30分と午後0時45分〜4時" })).toEqual([]);
    expect(checkLocalGuidanceTranslation({ hours: "Monday to Saturday, 8:00 to 19:00" }, { hours: "月曜日〜土曜日の午前8時〜午後7時" })).toEqual([]);
    expect(checkLocalGuidanceTranslation({ hours: "8:00 to 19:00" }, { hours: "8時〜7時" })[0]?.message).toBe("The number 19 from the English is missing.");
    expect(checkLocalGuidanceTranslation({ ages: "residents aged 20 to 59" }, { ages: "20歳以上60歳未満の人" })).toEqual([]);
    expect(checkLocalGuidanceTranslation({ fine:"a fine of up to 50,000 yen" }, { fine: "5万円以下の過料" })).toEqual([]);
    expect(checkLocalGuidanceTranslation({ office: "Taxation Division, 2nd floor of Kita City Office Building 1" }, { office: "北区役所第一庁舎2階 税務課" })).toEqual([]);
  });
});
