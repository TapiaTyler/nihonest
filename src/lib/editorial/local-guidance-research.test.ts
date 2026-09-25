import { describe, expect, it } from "vitest";
import { checkConcreteClaims, decodeHtml, findUpdatedDate, htmlToText, matchingLinks } from "./local-guidance-research";

describe("local guidance research helpers", () => {
  it("decodes Shift_JIS municipal pages from their meta charset", () => {
    // 「国民健康保険」 in Shift_JIS.
    const shiftJis = Uint8Array.from([0x8d, 0x91, 0x96, 0xaf, 0x8c, 0x92, 0x8d, 0x4e, 0x95, 0xdb, 0x8c, 0xaf]);
    const head = new TextEncoder().encode('<meta charset="Shift_JIS"><p>');
    const html = decodeHtml(Uint8Array.from([...head, ...shiftJis]));
    expect(html).toContain("国民健康保険");
  });

  it("keeps the main content as headings, lists, and tables and drops navigation and scripts", () => {
    const page = htmlToText(`<html><head><title>国民健康保険の加入 | 例区</title><script>var x=1;</script></head><body>
      <nav><a href="/">ホーム</a></nav>
      <main><h1>国民健康保険の加入</h1><p>転入した日から14日以内に届け出てください。</p>
      <ul><li>在留カード</li><li>パスポート</li></ul>
      <table><tr><th>窓口</th><td>保険年金課</td></tr></table>
      <p><a href="kanyu.html">加入の手続き</a> <a href="/gomi/">ごみ</a></p><p>更新日：2026年5月20日</p></main>
      <footer>著作権</footer></body></html>`, "https://www.city.example.lg.jp/kokuho/index.html");

    expect(page.title).toBe("国民健康保険の加入 | 例区");
    expect(page.text).toContain("# 国民健康保険の加入");
    expect(page.text).toContain("- 在留カード");
    expect(page.text).toContain("| 窓口 | 保険年金課 |");
    expect(page.text).not.toContain("var x");
    expect(page.text).not.toContain("ホーム");
    expect(page.text).not.toContain("著作権");
    expect(page.updated).toBe("2026年5月20日");
    expect(matchingLinks(page.links, ["加入"])).toEqual([{ text: "加入の手続き", href: "https://www.city.example.lg.jp/kokuho/kanyu.html" }]);
  });

  it("labels image links by their alt text so image menus can be followed", () => {
    const page = htmlToText('<a href="/kurashi/index.html"><img src="gnb01.png" alt="暮らし・手続き"></a>', "https://www.city.example.lg.jp/");
    expect(matchingLinks(page.links, ["手続"])).toEqual([{ text: "暮らし・手続き", href: "https://www.city.example.lg.jp/kurashi/index.html" }]);
  });

  it("reads full-width and era dates", () => {
    expect(findUpdatedDate("最終更新日：２０２６年３月２４日")).toBe("2026年3月24日");
    expect(findUpdatedDate("更新日 令和8年4月1日")).toBe("令和8年4月1日");
  });

  it("checks that deadlines, times, and fees in the English appear in the source", () => {
    const english = "File within 14 days after moving in. The counter is open weekdays from 8:30 a.m. to 4 p.m. A certificate costs ¥300. Allow 30 days for the card.";
    const source = "転入後１４日以内に届け出てください。受付時間は8時半から午後4時までです。証明書は1通300円です。";
    expect(checkConcreteClaims(english, source)).toEqual([
      { claim: "14 days", found: true },
      { claim: "30 days", found: false },
      { claim: "8:30 a.m.", found: true },
      { claim: "4 p.m.", found: true },
      { claim: "¥300", found: true },
    ]);
  });

  it("reads hours written with readings, in kana, or as 4pm", () => {
    const english = "Open from 10 a.m. to 5 p.m.; consultation from 1 to 4 p.m.";
    expect(checkConcreteClaims(english, "午前(ごぜん)10時(じ)から午後(ごご)5時(じ)まで。1pm to 4pm")).toEqual([
      { claim: "10 a.m.", found: true },
      { claim: "5 p.m.", found: true },
      { claim: "4 p.m.", found: true },
    ]);
    expect(checkConcreteClaims("until 4 p.m.", "午後4じまで")).toEqual([{ claim: "4 p.m.", found: true }]);
    expect(checkConcreteClaims("1 to 5 p.m.", "午後1時～5時")).toEqual([{ claim: "5 p.m.", found: true }]);
    expect(checkConcreteClaims("by 8 a.m.", "Put it out by 8 a.m. on collection days.")).toEqual([{ claim: "8 a.m.", found: true }]);
  });
});
