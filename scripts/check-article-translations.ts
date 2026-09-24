/**
 * Tier-1 mechanical check of Japanese article translations against their canonical English MDX (no model
 * calls): heading and list-item parity, identical link targets, numbers present, leftover English prose, and
 * heading lines the Japanese renderer would show as literal text (it renders only "## " and "### ").
 * Findings are signals for review, not proof of error. The full report goes to .glossary-drafts/article-check.json.
 *
 *   npm run localization:articles:check
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { draftRoot, stripMetadata } from "./glossary-translation/glossary-draft";

type Finding = Readonly<{ check: string; detail: string }>;

/** Extra Japanese links reviewed and kept by editorial decision (2026-09-23); the English sentence names the status without linking it. */
const acceptedExtraLinks: Readonly<Record<string, readonly string[]>> = {
  "artist-status": ["/articles/engineer-specialist-humanities-international-services-status"],
  "journalist-status": ["/articles/engineer-specialist-humanities-international-services-status"],
};

// H2-H6 only: an H1 in an English body repeats the page title and is reported separately as english-body-title.
const headings = (body: string) => body.split("\n").filter((line) => /^#{2,6}\s/.test(line)).length;
const listItems = (body: string) => body.split("\n").filter((line) => /^\s*(?:[-*]|\d+\.)\s/.test(line)).length;
const links = (body: string) => [...body.matchAll(/\]\(([^)\s]+)\)/g)].map(([, href]) => href).sort();
// Full-width digits are normalized so １０ and 10 compare equal.
const normalizeDigits = (text: string) => text.replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0)).replace(/,/g, "");
/** Amounts compare by value: "¥30 million" and 「3,000万円」 both become 30000000, and 「20万円」 matches ¥200,000. */
const numbers = (body: string) => {
  const text = normalizeDigits(body.replace(/\]\([^)]*\)/g, ""))
    .replace(/(\d+(?:\.\d+)?)\s*(million|billion)\b/gi, (_, value: string, unit: string) => String(Math.round(Number(value) * (unit.toLowerCase() === "million" ? 1e6 : 1e9))))
    .replace(/(\d+(?:\.\d+)?)(億|万)/g, (_, value: string, unit: string) => String(Math.round(Number(value) * (unit === "億" ? 1e8 : 1e4))));
  return [...new Set([...text.matchAll(/\d+(?:\.\d+)?/g)].map(([value]) => value))];
};
/** Runs of six or more English words outside links and code, which suggest untranslated prose. */
const englishRuns = (body: string) => [...body.replace(/\]\([^)]*\)|`[^`]*`|https?:\/\/\S+/g, "").matchAll(/(?:\b[A-Za-z][A-Za-z'’-]*\b[\s,]+){5,}\b[A-Za-z][A-Za-z'’-]*\b/g)].map(([run]) => run.trim());

async function main(): Promise<void> {
  const directory = resolve(process.cwd(), "content/articles");
  const english = new Map<string, string>();
  for (const file of (await readdir(directory)).filter((name) => name.endsWith(".mdx"))) {
    const source = (await readFile(join(directory, file), "utf8")).replace(/\r\n?/g, "\n");
    const id = source.match(/\bid:\s*"([a-z0-9-]+)"/)?.[1];
    if (id) english.set(id, stripMetadata(source));
  }

  const report: Record<string, Finding[]> = {};
  for (const artifact of currentJapaneseArticleTranslations) {
    const en = english.get(artifact.contentId);
    const ja = artifact.fields.body ?? "";
    const findings: Finding[] = [];
    if (!en) findings.push({ check: "missing-english", detail: "No canonical MDX for this translation." });
    else {
      if (headings(en) !== headings(ja)) findings.push({ check: "headings", detail: `EN ${headings(en)} vs JA ${headings(ja)}` });
      if (listItems(en) !== listItems(ja)) findings.push({ check: "list-items", detail: `EN ${listItems(en)} vs JA ${listItems(ja)}` });
      const enLinks = links(en);
      const jaLinks = links(ja);
      const missingLinks = enLinks.filter((href) => !jaLinks.includes(href));
      const extraLinks = jaLinks.filter((href) => !enLinks.includes(href) && !acceptedExtraLinks[artifact.contentId]?.includes(href));
      if (missingLinks.length || extraLinks.length) findings.push({ check: "links", detail: `missing ${[...new Set(missingLinks)].join(", ") || "none"}; extra ${[...new Set(extraLinks)].join(", ") || "none"}` });
      const jaNumbers = new Set(numbers(ja));
      const missingNumbers = numbers(en).filter((value) => !jaNumbers.has(value));
      if (missingNumbers.length) findings.push({ check: "numbers", detail: `missing ${missingNumbers.join(", ")}` });
      for (const run of englishRuns(ja)) findings.push({ check: "english-prose", detail: run.slice(0, 120) });
      // The Japanese renderer only treats "## " and "### " as headings; anything else starting with # shows as literal text.
      for (const line of ja.split("\n").map((text) => text.trim()).filter((text) => text.startsWith("#") && !/^#{2,3}\s+\S/.test(text))) {
        findings.push({ check: "unrenderable-heading", detail: line.slice(0, 120) });
      }
      if (/^#\s/m.test(en)) findings.push({ check: "english-body-title", detail: "English body repeats the page title as an H1." });
    }
    if (findings.length) report[artifact.contentId] = findings;
  }

  await mkdir(draftRoot, { recursive: true });
  await writeFile(join(draftRoot, "article-check.json"), `${JSON.stringify(report, null, 1)}\n`);
  const counts: Record<string, number> = {};
  for (const findings of Object.values(report)) for (const { check } of findings) counts[check] = (counts[check] ?? 0) + 1;
  console.log(`Checked ${currentJapaneseArticleTranslations.length} articles; ${Object.keys(report).length} have findings.`);
  console.log(Object.entries(counts).map(([check, count]) => `${check}: ${count}`).join("\n") || "No findings.");
  console.log(`Full report: ${join(draftRoot, "article-check.json")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
