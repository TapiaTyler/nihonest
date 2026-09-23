/**
 * Claude drafts of the structured guidance on residence-status pages, one isolated call per status.
 * Reader-facing snippets are extracted by path (see src/domain/residence-status/guidance-text.ts), translated
 * as one JSON object, checked for key parity, and written for review. `--integrate` then generates the
 * catalog from a reviewed draft directory.
 *
 *   npm run status:guidance:draft                        # all statuses without a current guidance translation
 *   npm run status:guidance:draft -- --ids professor,student
 *   npm run status:guidance:draft -- --integrate .glossary-drafts/guidance-<run>
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseProtectedTerminology } from "@/data/translations/ja/protected-terminology";
import { japaneseResidenceStatusGuidanceTranslations } from "@/data/translations/ja/residence-status-guidance-translations";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import { extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { defaultClaudeOptions, readOption, timestamp } from "./glossary-translation/cli-options";
import { draftRoot, runClaude } from "./glossary-translation/glossary-draft";

type Status = (typeof residenceStatuses)[number];
const structuredPromptPath = resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md");
const catalogPath = resolve(process.cwd(), "src/data/translations/ja/residence-status-guidance-translations.ts");

/** Mirrors createTranslationSourceRevision (server-only) over the extracted English snippets. */
export function guidanceSourceRevision(status: Status): string {
  const texts = extractGuidanceText(status.structuredGuidance!);
  const sorted = Object.fromEntries(Object.entries(texts).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, value.replace(/\r\n?/g, "\n")]));
  return createHash("sha256").update(JSON.stringify(sorted), "utf8").digest("hex");
}

function buildPrompt(status: Status): string {
  const record = japaneseResidenceStatusTranslations.find(({ contentId }) => contentId === status.id);
  const glossary = japaneseGlossaryTranslations.find(({ contentId }) => contentId === status.glossaryTermId);
  const statusNames = residenceStatuses.map(({ englishName, japaneseName }) => `${englishName} → 「${japaneseName}」`).join("\n");
  return [
    `Translate the reader-facing text of the structured guidance for the residence status 「${status.japaneseName}」 (${status.englishName}) into Japanese.`,
    "Return only one JSON object with exactly the same keys as the input and Japanese string values. Do not add, drop, rename, or merge keys.",
    "Rules: です・ます for sentences; keep list items and labels as concise noun phrases. Name statuses of residence with their official Japanese names in 「」 (list below). Prefer official Japanese terms. Durations such as \"5 years, 3 years, 1 year, or 3 months\" become 「5年、3年、1年または3月」. Keep every qualification (may, can, qualifying, applicable, generally) and do not add facts, dates, thresholds, or advice. In this site, a person's \"status\" or \"condition\" usually means their residence status; \"sponsor\" means 受入れ機関 for institution-based statuses and 身元保証人 for relationship-based ones.",
    "## Official status names",
    statusNames,
    "## Protected terminology",
    japaneseProtectedTerminology.map(({ value, replacement }) => `- ${value} → ${replacement ?? value}`).join("\n"),
    "## Accepted Japanese wording for this status (keep consistent)",
    `Glossary definition: ${glossary?.fields["short-definition"] ?? "none"}`,
    `Summary: ${record?.fields.summary ?? "none"}`,
    `Purpose: ${record?.fields.purpose ?? "none"}`,
    "## Text to translate",
    JSON.stringify(extractGuidanceText(status.structuredGuidance!), null, 1),
  ].join("\n\n");
}

async function draft(ids: readonly string[]): Promise<void> {
  const statuses = ids.map((id) => residenceStatuses.find((status) => status.id === id) ?? (() => { throw new Error(`Unknown status ${id}`); })());
  const outputDirectory = join(draftRoot, `guidance-${timestamp()}`);
  await mkdir(outputDirectory, { recursive: true });
  const options = { ...defaultClaudeOptions, model: "opus", budgetUsd: 1, systemPromptPath: structuredPromptPath, rawOnly: true };
  const problems: string[] = [];
  let cost = 0;
  const queue = [...statuses];
  // Eight isolated calls at a time keeps the batch fast without flooding the CLI.
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (let status = queue.shift(); status; status = queue.shift()) {
      const english = extractGuidanceText(status.structuredGuidance!);
      try {
        const run = await runClaude(buildPrompt(status), options);
        cost += run.costUsd;
        const result = (JSON.parse(run.raw) as { result: string }).result;
        const translated = z.record(z.string(), z.string().min(1)).parse(JSON.parse(result.slice(result.indexOf("{"), result.lastIndexOf("}") + 1)));
        const missing = Object.keys(english).filter((key) => !(key in translated));
        const extra = Object.keys(translated).filter((key) => !(key in english));
        if (missing.length || extra.length) problems.push(`${status.id}: missing ${missing.join(", ") || "none"}; extra ${extra.join(", ") || "none"}`);
        await writeFile(join(outputDirectory, `${status.id}.json`), `${JSON.stringify(translated, null, 1)}\n`);
      } catch (error) {
        problems.push(`${status.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }));
  console.log(`Drafted ${statuses.length} statuses · cost $${cost.toFixed(4)}\nProblems:\n${problems.join("\n") || "None."}\nOutput: ${outputDirectory}`);
  if (problems.length) process.exitCode = 2;
}

async function integrate(directory: string): Promise<void> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  const q = (value: unknown) => JSON.stringify(value);
  const entries = await Promise.all(files.map(async (file) => {
    const id = file.replace(/\.json$/, "");
    const status = residenceStatuses.find((candidate) => candidate.id === id)!;
    const english = extractGuidanceText(status.structuredGuidance!);
    const translated = JSON.parse(await readFile(join(directory, file), "utf8")) as Record<string, string>;
    // Keep only current keys so a stray key never enters the catalog; missing keys fall back to English.
    const fields = Object.fromEntries(Object.keys(english).filter((key) => translated[key]).map((key) => [key, translated[key]]));
    return `  defineGuidanceTranslation(${q(id)}, ${q(guidanceSourceRevision(status))}, ${q(fields)}),`;
  }));
  const source = `import { translationArtifactSchema } from "@/domain/translation/translation";

/**
 * Japanese overlays for the structured guidance on residence-status pages, keyed by guidance-text paths
 * (src/domain/residence-status/guidance-text.ts). Generated by \`npm run status:guidance:draft -- --integrate\`
 * from Claude Opus drafts reviewed by Claude; regenerate rather than hand-edit.
 */
const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;

function defineGuidanceTranslation(contentId: string, sourceRevision: string, fields: Record<string, string>) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "residence-status",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields,
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "${new Date().toISOString().slice(0, 19)}.000Z",
  });
}

export const japaneseResidenceStatusGuidanceTranslations = [
${entries.join("\n")}
] as const;
`;
  await writeFile(catalogPath, source);
  console.log(`Wrote ${entries.length} guidance translations to ${catalogPath}`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const integrateDirectory = readOption(argv, "integrate");
  if (integrateDirectory) return integrate(integrateDirectory);
  const current = new Set(japaneseResidenceStatusGuidanceTranslations.map(({ contentId, sourceRevision }) => `${contentId}:${sourceRevision}`));
  const ids = readOption(argv, "ids")?.split(",")
    ?? residenceStatuses.filter((status) => status.structuredGuidance && !current.has(`${status.id}:${guidanceSourceRevision(status)}`)).map(({ id }) => id);
  await draft(ids);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
