/**
 * Tier-2 glossary consistency check (no model calls). Two parts:
 *   1. Every glossary link in a Japanese article, `[text](/glossary/slug)`, shows the glossary's Japanese headword.
 *   2. Wording settled in content/translations/CLAUDE-TRANSLATION-REPORT.md does not reappear in any Japanese catalog.
 * Findings are signals for review, not proof of error. The full report goes to .glossary-drafts/glossary-consistency.json.
 *
 *   npm run localization:glossary:check
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { glossaryTerms } from "@/data/glossary";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { draftRoot } from "./glossary-translation/glossary-draft";

type Finding = Readonly<{ check: string; detail: string }>;

/** Wording the translation report rejects; each rule says what to use instead. `review` rules need a reader's judgement. */
const decisionRules: readonly Readonly<{ pattern: RegExp; rule: string; review?: true }>[] = [
  { pattern: /技術移転|技能移転/g, rule: "Technical Intern Training transfers 技能等 (技能等の移転), not 技術移転 or 技能移転.", review: true },
  { pattern: /完全帰国/g, rule: "A permanent departure is 日本を完全に離れる or 日本からの完全な出国; 帰国 assumes going to one's home country." },
  { pattern: /帰国期限/g, rule: "The special re-entry deadline is 日本に戻る期限; 帰国 means going to one's home country." },
  { pattern: /身元保証人/g, rule: "Use 身元保証人 only for an actual signed guarantee. \"Sponsor\" is 受入れ機関 or the supporting family member (日本にいる家族, 扶養者); a Medical Stay guarantor is 身元保証機関.", review: true },
];

/** Reviewed uses of review-rule wording (2026-09-23). The 身元保証人 entries name a real guarantor (spouse, Permanent Resident, visitor, Designated Activities, and status-term templates). */
const reviewedContexts: readonly string[] = [
  "婚姻期間、身元保証人だけで",
  "特別永住者である身元保証人",
  "雇用主や身元保証人の書類",
  "身元保証人・了解書",
  "生計と身元保証人",
  "招へい人や身元保証人",
  "受入れ機関、身元保証人、雇用主",
  // Trainee (研修), not Technical Intern Training: the English says "skills-transfer frameworks" generically.
  "技能移転の枠組み",
];

/** Link text may add particles or context around the headword (「在留カードの」) but must contain it. */
const linkTextMatches = (text: string, headword: string) => text.replace(/\*\*/g, "").includes(headword);

async function main(): Promise<void> {
  const headwords = new Map(glossaryTerms.map((term) => [term.slug, term.japanese]));
  const report: Record<string, Finding[]> = {};
  const add = (key: string, finding: Finding) => (report[key] ??= []).push(finding);

  for (const artifact of currentJapaneseArticleTranslations) {
    const body = artifact.fields.body ?? "";
    for (const [, text, slug] of body.matchAll(/\[([^\]]+)\]\(\/glossary\/([a-z0-9-]+)\)/g)) {
      const headword = headwords.get(slug);
      if (!headword) add(`article:${artifact.contentId}`, { check: "unknown-term", detail: `[${text}](/glossary/${slug})` });
      else if (!linkTextMatches(text, headword)) add(`article:${artifact.contentId}`, { check: "headword", detail: `「${text}」 links to ${slug}, headword 「${headword}」` });
    }
  }

  const directory = resolve(process.cwd(), "src/data/translations/ja");
  for (const file of (await readdir(directory)).filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"))) {
    const lines = (await readFile(join(directory, file), "utf8")).split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const { pattern, rule, review } of decisionRules) {
        if (review && reviewedContexts.some((context) => line.includes(context))) continue;
        for (const match of line.matchAll(pattern)) {
          const start = Math.max(0, (match.index ?? 0) - 30);
          add(`file:${file}:${index + 1}`, { check: review ? "decision-review" : "decision", detail: `…${line.slice(start, (match.index ?? 0) + match[0].length + 30).trim()}… — ${rule}` });
        }
      }
    });
  }

  await mkdir(draftRoot, { recursive: true });
  await writeFile(join(draftRoot, "glossary-consistency.json"), `${JSON.stringify(report, null, 1)}\n`);
  const counts: Record<string, number> = {};
  for (const findings of Object.values(report)) for (const { check } of findings) counts[check] = (counts[check] ?? 0) + 1;
  console.log(`Checked ${currentJapaneseArticleTranslations.length} articles and the Japanese catalogs; ${Object.keys(report).length} locations have findings.`);
  console.log(Object.entries(counts).map(([check, count]) => `${check}: ${count}`).join("\n") || "No findings.");
  console.log(`Full report: ${join(draftRoot, "glossary-consistency.json")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
