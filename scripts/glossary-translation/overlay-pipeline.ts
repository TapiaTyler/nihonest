/**
 * Shared pipeline for path-keyed Japanese overlays (structured status guidance, activity cross-references):
 * one isolated Claude call per item, key-parity checks, draft files for review, and catalog generation.
 * Each item's reader-facing snippets come from a text-path extractor in src/domain.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseProtectedTerminology } from "@/data/translations/ja/protected-terminology";
import { timestamp } from "./cli-options";
import { draftRoot, runClaude } from "./glossary-draft";

export type OverlayItem = Readonly<{
  id: string;
  /** Reader-facing English snippets keyed by path. */
  english: Readonly<Record<string, string>>;
  /** Item-specific instructions and accepted wording placed before the text to translate. */
  context: string;
}>;

const structuredPromptPath = resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md");

/** Mirrors createTranslationSourceRevision (server-only) over the extracted English snippets. */
export function overlaySourceRevision(english: Readonly<Record<string, string>>): string {
  const sorted = Object.fromEntries(Object.entries(english).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, value.replace(/\r\n?/g, "\n")]));
  return createHash("sha256").update(JSON.stringify(sorted), "utf8").digest("hex");
}

/** Site-wide translation rules and terminology shared by every overlay prompt. */
function sharedRules(): string {
  return [
    "Return only one JSON object with exactly the same keys as the input and Japanese string values. Do not add, drop, rename, or merge keys.",
    "Rules: です・ます for sentences; keep list items, labels, and choices as concise noun phrases. Name statuses of residence with their official Japanese names in 「」 (list below). Prefer official Japanese terms. Keep every qualification (may, can, qualifying, applicable, generally) and do not add facts, dates, thresholds, or advice. In this site, a person's \"status\" or \"condition\" usually means their residence status; \"sponsor\" means 受入れ機関 for institution-based statuses; for family routes it means the supporting family member in Japan (扶養者, or 日本にいる家族), and only a signed guarantee of support is 身元保証人.",
    "## Official status names",
    residenceStatuses.map(({ englishName, japaneseName }) => `${englishName} → 「${japaneseName}」`).join("\n"),
    "## Protected terminology",
    japaneseProtectedTerminology.map(({ value, replacement }) => `- ${value} → ${replacement ?? value}`).join("\n"),
  ].join("\n\n");
}

export async function draftOverlays(name: string, items: readonly OverlayItem[]): Promise<void> {
  const outputDirectory = join(draftRoot, `${name}-${timestamp()}`);
  await mkdir(outputDirectory, { recursive: true });
  const options = { model: "opus", effort: "high", budgetUsd: 1, systemPromptPath: structuredPromptPath, rawOnly: true };
  const problems: string[] = [];
  let cost = 0;
  const queue = [...items];
  // Eight isolated calls at a time keeps the batch fast without flooding the CLI.
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      try {
        const prompt = [item.context, sharedRules(), "## Text to translate", JSON.stringify(item.english, null, 1)].join("\n\n");
        const run = await runClaude(prompt, options);
        cost += run.costUsd;
        const result = (JSON.parse(run.raw) as { result: string }).result;
        const translated = z.record(z.string(), z.string().min(1)).parse(JSON.parse(result.slice(result.indexOf("{"), result.lastIndexOf("}") + 1)));
        const missing = Object.keys(item.english).filter((key) => !(key in translated));
        const extra = Object.keys(translated).filter((key) => !(key in item.english));
        if (missing.length || extra.length) problems.push(`${item.id}: missing ${missing.join(", ") || "none"}; extra ${extra.join(", ") || "none"}`);
        await writeFile(join(outputDirectory, `${item.id}.json`), `${JSON.stringify(translated, null, 1)}\n`);
      } catch (error) {
        problems.push(`${item.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }));
  console.log(`Drafted ${items.length} items · cost $${cost.toFixed(4)}\nProblems:\n${problems.join("\n") || "None."}\nOutput: ${outputDirectory}`);
  if (problems.length) process.exitCode = 2;
}

export async function integrateOverlays(directory: string, items: readonly OverlayItem[], catalog: Readonly<{
  path: string;
  exportName: string;
  contentKind: "residence-status" | "activity-cross-reference";
  description: string;
}>): Promise<void> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  const q = (value: unknown) => JSON.stringify(value);
  const drafts = await Promise.all(files.map(async (file) => {
    const item = items.find(({ id }) => `${id}.json` === file);
    if (!item) throw new Error(`No current item for ${file}`);
    return { item, translated: JSON.parse(await readFile(join(directory, file), "utf8")) as Record<string, string> };
  }));
  // Each item is drafted in its own call, so identical English (e.g. a shared question) can come back worded
  // differently. Use the most common Japanese for each identical English snippet across all items.
  const votes = new Map<string, Map<string, number>>();
  for (const { item, translated } of drafts) {
    for (const [key, english] of Object.entries(item.english)) {
      if (!translated[key]) continue;
      const counts = votes.get(english) ?? new Map<string, number>();
      counts.set(translated[key], (counts.get(translated[key]) ?? 0) + 1);
      votes.set(english, counts);
    }
  }
  const preferred = new Map([...votes].map(([english, counts]) => [english, [...counts].sort((left, right) => right[1] - left[1])[0]![0]]));
  const entries = drafts.map(({ item, translated: draft }) => {
    const translated = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, item.english[key] ? preferred.get(item.english[key]) ?? value : value]));
    // Keep only current keys so a stray key never enters the catalog; missing keys fall back to English.
    const fields = Object.fromEntries(Object.keys(item.english).filter((key) => translated[key]).map((key) => [key, translated[key]]));
    return `  defineOverlayTranslation(${q(item.id)}, ${q(overlaySourceRevision(item.english))}, ${q(fields)}),`;
  });
  const source = `import { translationArtifactSchema } from "@/domain/translation/translation";

/**
 * ${catalog.description}
 * Generated from Claude Opus drafts reviewed by Claude; regenerate with the draft command's \`--integrate\` rather than hand-editing.
 */
const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;

function defineOverlayTranslation(contentId: string, sourceRevision: string, fields: Record<string, string>) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: ${q(catalog.contentKind)},
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

export const ${catalog.exportName} = [
${entries.join("\n")}
] as const;
`;
  await writeFile(resolve(process.cwd(), catalog.path), source);
  console.log(`Wrote ${entries.length} overlays to ${catalog.path}`);
}
