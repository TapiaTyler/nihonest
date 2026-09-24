/**
 * Helpers for researching municipality-specific guidance from official pages: decoding Japanese municipal HTML,
 * reducing it to compact readable text, finding topic links, and checking that the concrete claims in an English
 * supplement (deadlines, times, fees) appear in its cited sources. Used by `scripts/local-guidance.ts`; the
 * checks are signals for a researcher, not proof that a summary is correct.
 */

export type PageLink = Readonly<{ text: string; href: string }>;
export type PageText = Readonly<{ title: string; updated?: string; text: string; links: readonly PageLink[] }>;

/** Decodes HTML bytes using the HTTP charset, then the meta charset; Japanese municipal sites still use Shift_JIS and EUC-JP. */
export function decodeHtml(bytes: Uint8Array, contentType = ""): string {
  const head = new TextDecoder("latin1").decode(bytes.slice(0, 4096));
  const declared = contentType.match(/charset=([\w-]+)/i)?.[1] ?? head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ?? "utf-8";
  const label = declared.toLowerCase().replace(/^(x-)?sjis$|^windows-31j$|^ms932$/, "shift_jis");
  try {
    return new TextDecoder(label).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

const entities: Readonly<Record<string, string>> = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", ensp: " ", emsp: " " };

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name.startsWith("#x") || name.startsWith("#X")) return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
    if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)));
    return entities[name.toLowerCase()] ?? entity;
  });
}

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/** Full-width digits and letters become ASCII so dates, times, and amounts compare reliably. */
export function normalizeWidth(text: string): string {
  return text.replace(/[０-９Ａ-Ｚａ-ｚ：／．，]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0xfee0));
}

/** The page's own "updated" or "published" date when it states one. */
export function findUpdatedDate(text: string): string | undefined {
  const normalized = normalizeWidth(text);
  return normalized.match(/(?:最終更新日|更新日|掲載日|公開日|Last updated|Updated)[:：\s]*((?:令和|平成)?\s*\d{1,4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}[/.-]\d{1,2}[/.-]\d{1,2}|[A-Z][a-z]+ \d{1,2},? \d{4})/)?.[1]?.replace(/\s+/g, "");
}

/**
 * Reduces a page to its readable content as Markdown-like text: headings, list items, table rows, and paragraphs.
 * Scripts, styles, and site navigation are removed; the main region is used when the page marks one.
 */
export function htmlToText(html: string, baseUrl: string): PageText {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const documentHtml = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, "");
  let body = documentHtml;
  const main = body.match(/<main\b[\s\S]*?<\/main>/i)?.[0]
    ?? body.match(/<(div|section|article)\b[^>]*\bid=["'](?:main|contents?|main-?contents?|tmp_contents|content-main)["'][\s\S]*$/i)?.[0];
  if (main) body = main;
  body = body.replace(/<(header|footer|nav|aside)\b[\s\S]*?<\/\1>/gi, "");

  const links: PageLink[] = [];
  // Links come from the whole page: on a portal or home page the topic links sit in navigation menus.
  for (const [, href, inner] of documentHtml.matchAll(/<a\b[^>]*\bhref=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    // Menus are often image links whose label is only in the alt text (e.g. <img alt="暮らし・手続き">).
    const text = stripTags((inner ?? "").replace(/<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/gi, " $1 "));
    if (!text || /^(javascript|mailto|tel):/i.test(href ?? "")) continue;
    try {
      links.push({ text, href: new URL(decodeEntities(href!), baseUrl).href });
    } catch {
      // Malformed links are skipped.
    }
  }

  // One line per table row keeps each procedure's documents next to the case they apply to.
  const tableRow = (row: string) => {
    const cells = [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map(([, cell]) => stripTags((cell ?? "").replace(/<(br|\/p|\/li)\b[^>]*>/gi, " / ")).replace(/^(\s*\/\s*)+|(\s*\/\s*)+$/g, ""));
    return `\n| ${cells.join(" | ")} |\n`;
  };
  const text = decodeEntities(body
    .replace(/<tr\b[\s\S]*?<\/tr>/gi, tableRow)
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, inner: string) => `\n\n${"#".repeat(Number(level))} ${stripTags(inner)}\n\n`)
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<(tr|br)\b[^>]*>/gi, "\n")
    .replace(/<\/(p|div|section|article|table|ul|ol|dl|dd|dt|caption|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, ""))
    .split("\n")
    .map((line) => line.replace(/[ \t　]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return { title, updated: findUpdatedDate(text) ?? findUpdatedDate(html), text, links };
}

/** Links whose text or URL contains any keyword, de-duplicated by URL, for finding the right sub-page. */
export function matchingLinks(links: readonly PageLink[], keywords: readonly string[]): PageLink[] {
  const seen = new Set<string>();
  return links.filter(({ text, href }) => {
    if (seen.has(href) || !keywords.some((keyword) => text.includes(keyword) || href.toLowerCase().includes(keyword.toLowerCase()))) return false;
    seen.add(href);
    return true;
  });
}

export type ClaimCheck = Readonly<{ claim: string; found: boolean }>;

function to24Hour(hour: number, meridiem: string): number {
  if (/p/i.test(meridiem) && hour < 12) return hour + 12;
  if (/a/i.test(meridiem) && hour === 12) return 0;
  return hour;
}

/**
 * Finds concrete claims in English guidance (periods in days, clock times, yen amounts) and reports whether each
 * appears in the source text in a Japanese or English form. A missing claim deserves a look: it may come from
 * another source, a different page, or a misreading.
 */
export function checkConcreteClaims(english: string, sourceText: string): ClaimCheck[] {
  const source = normalizeWidth(sourceText).replace(/,/g, "");
  const results: ClaimCheck[] = [];
  const add = (claim: string, candidates: readonly string[]) => {
    if (!results.some((result) => result.claim === claim)) results.push({ claim, found: candidates.some((candidate) => source.includes(candidate)) });
  };

  for (const [claim, days] of english.matchAll(/\b(\d{1,3})(?:-day| (?:calendar |business |working )?days?)\b/g)) {
    add(claim, [`${days}日`, `${days} day`]);
  }
  for (const [claim, hour, minute, meridiem] of english.matchAll(/\b(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?/gi)) {
    const h12 = Number(hour);
    const h24 = to24Hour(h12, meridiem!);
    const mm = minute ?? "00";
    const japaneseMinutes = minute && minute !== "00" ? `${Number(minute)}分` : "";
    add(claim.trim(), [
      `${h24}:${mm}`, `${h24}時${japaneseMinutes}`, `${h12}:${mm}`,
      `${/p/i.test(meridiem!) ? "午後" : "午前"}${h12}時${japaneseMinutes}`,
      // Half past is often written 半 (8時半).
      ...(mm === "30" ? [`${h24}時半`, `${h12}時半`] : []),
    ]);
  }
  for (const [claim, amount] of english.matchAll(/¥\s?([\d,]+)/g)) {
    const plain = amount!.replace(/,/g, "");
    add(claim, [`${plain}円`, `¥${plain}`, `${plain} yen`]);
  }
  return results;
}
