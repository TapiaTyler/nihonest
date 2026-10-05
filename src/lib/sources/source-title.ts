/** Turns an official page's <title> into the source title Japanese readers see (scripts/source-titles.ts). */
const japaneseText = /[\u3040-\u30ff\u3400-\u9fff]/;
/** Site names that national pages put in their titles, beyond the source's own organization. */
const commonSiteNames = ["法務省", "出入国在留管理庁", "厚生労働省", "日本年金機構", "デジタル庁", "e-Gov法令検索", "e-Gov 法令検索"];
/** Titles that mean the fetch reached an error page rather than the source. */
export const errorPageTitle = /見つかりません|Not Found|Access Denied|Forbidden|エラー/i;

/** The page's own title without the site name, or undefined when nothing usable remains. */
export function cleanSourceTitle(raw: string, siteNames: readonly string[]): string | undefined {
  const names = [...siteNames, ...commonSiteNames].filter(Boolean);
  const isSiteName = (part: string) => names.some((name) => [name, `${name}ホームページ`, `${name}公式ホームページ`, `${name}公式ウェブサイト`].includes(part.trim()))
    || /^(?:トップページ|ホーム|ホームページ)$/.test(part.trim());
  let title = raw.replace(/\s+/g, " ").trim()
    // Breadcrumb suffixes such as "（…>市税について>個人市民税）".
    .replace(/\s*[（(]…?>.*[）)]\s*$/, "");
  const stripSiteNames = () => {
    for (let changed = true; changed;) {
    changed = false;
    const leading = title.match(/^(.+?)\s*(?:[：／|｜]|\s[-－–]\s)\s*(.+)$/);
    if (leading && isSiteName(leading[1]!)) { title = leading[2]!; changed = true; continue; }
    const trailing = title.match(/^(.+?)\s*(?:[：／|｜]|\s[-－–]\s|\s)\s*(\S+?)$/);
    if (trailing && isSiteName(trailing[2]!)) { title = trailing[1]!; changed = true; }
    }
  };
  stripSiteNames();
  // Bilingual titles ("Support Groups／支援団体"): keep the Japanese half.
  const halves = title.split(/\s*／\s*/);
  if (halves.length === 2 && japaneseText.test(halves[1]!) !== japaneseText.test(halves[0]!)) {
    title = japaneseText.test(halves[0]!) ? halves[0]! : halves[1]!;
  }
  stripSiteNames();
  title = title.trim();
  if (!title || isSiteName(title) || errorPageTitle.test(title) || !japaneseText.test(title)) return undefined;
  return title;
}
