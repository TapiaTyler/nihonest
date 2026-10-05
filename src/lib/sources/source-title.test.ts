import { describe, expect, it } from "vitest";
import { cleanSourceTitle } from "./source-title";

describe("cleanSourceTitle", () => {
  it.each([
    ["永住者の在留資格の取消しに関するガイドライン | 出入国在留管理庁", ["出入国在留管理庁"], "永住者の在留資格の取消しに関するガイドライン"],
    ["千代田区ホームページ - 国民年金", ["千代田区"], "国民年金"],
    ["千葉市：国外から千葉市へ住所を変更したとき（転入届）", ["千葉市"], "国外から千葉市へ住所を変更したとき（転入届）"],
    ["大阪市：各区の防災マップ （…>災害に備える>日頃からの備え）", ["大阪市"], "各区の防災マップ"],
    ["粗大ごみ 新潟市", ["新潟市"], "粗大ごみ"],
    ["Support Groups／支援団体：徳島市公式ウェブサイト", ["徳島市"], "支援団体"],
    ["Details about Residents Tax／外国語による市民税・県民税納税通知書の説明｜名古屋市公式ウェブサイト", ["名古屋市"], "外国語による市民税・県民税納税通知書の説明"],
    ["令和８年度 個人市・県民税(個人住民税)申告について", ["久留米市"], "令和８年度 個人市・県民税(個人住民税)申告について"],
  ])("keeps the page title from %j", (raw, names, expected) => {
    expect(cleanSourceTitle(raw, names)).toBe(expected);
  });

  it.each(["法務省", "e-Gov 法令検索", "Answer (Q1～Q79） | 出入国在留管理庁", "お探しのページが見つかりません。｜厚生労働省", "Access Denied"])(
    "proposes nothing for %j",
    (raw) => expect(cleanSourceTitle(raw, [])).toBeUndefined(),
  );
});
