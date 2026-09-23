/**
 * Shared pieces of the Claude glossary-draft pipeline: prompt assembly from repository data, the isolated
 * one-shot Claude call, parsing of its JSON output, and mechanical checks. The pipeline exists so that a
 * coordinating agent runs one command instead of reading and pasting translation context itself.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { z } from "zod";
import { glossaryTerms } from "@/data/glossary";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseProtectedTerminology } from "@/data/translations/ja/protected-terminology";

export const glossaryPromptPath = resolve(process.cwd(), "content/translations/JAPANESE-GLOSSARY-PROMPT.md");
export const draftRoot = resolve(process.cwd(), ".glossary-drafts");

type GlossaryTerm = (typeof glossaryTerms)[number];
const translatedFields = ["shortDefinition", "detailedExplanation", "commonContext"] as const;

export function getTerm(id: string): GlossaryTerm {
  const term = glossaryTerms.find((candidate) => candidate.id === id);
  if (!term) throw new Error(`Unknown glossary term ID: ${id}`);
  return term;
}

const translatedIds = () => new Set<string>(japaneseGlossaryTranslations.map(({ contentId }) => contentId));

/** Untranslated canonical terms in catalog order, optionally limited to one topic. */
export function selectUntranslatedIds(count: number, topicId?: string): string[] {
  const done = translatedIds();
  return glossaryTerms
    .filter((term) => !done.has(term.id) && (!topicId || (term.topicIds as readonly string[]).includes(topicId)))
    .slice(0, count)
    .map(({ id }) => id);
}

/**
 * Picks previously accepted Japanese artifacts as style examples, preferring shared topics.
 */
function selectExamples(batch: readonly GlossaryTerm[], limit = 6) {
  const batchIds = new Set(batch.map(({ id }) => id));
  const batchTopics = new Set(batch.flatMap(({ topicIds }) => topicIds as readonly string[]));
  return japaneseGlossaryTranslations
    .filter(({ contentId }) => !batchIds.has(contentId))
    .map((artifact) => ({ artifact, term: getTerm(artifact.contentId) }))
    .map((entry) => ({ ...entry, overlap: (entry.term.topicIds as readonly string[]).filter((topic) => batchTopics.has(topic)).length }))
    .sort((left, right) => right.overlap - left.overlap)
    .slice(0, limit);
}

/**
 * Removes the `export const metadata = {...}` object, which is written either on one line or across many.
 * Braces are balanced outside string literals so the prose that follows is kept intact.
 */
function stripMetadata(source: string): string {
  const start = source.indexOf("export const metadata");
  const open = source.indexOf("{", start);
  if (start < 0 || open < 0) return source;
  let depth = 0;
  let quote: string | undefined;
  for (let index = open; index < source.length; index += 1) {
    const character = source[index]!;
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = undefined;
    } else if (character === "\"" || character === "'" || character === "`") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return source.slice(index + 1).replace(/^;?[ \t]*\n/, "");
  }
  return source;
}

/** Canonical English article bodies keyed by article ID, loaded once. */
const englishArticleBodies = (() => {
  const directory = resolve(process.cwd(), "content/articles");
  return new Map(readdirSync(directory).filter((file) => file.endsWith(".mdx")).map((file) => {
    const source = readFileSync(join(directory, file), "utf8").replace(/\r\n?/g, "\n");
    const id = source.match(/\bid:\s*"([a-z0-9-]+)"/)?.[1] ?? file;
    return [id, stripMetadata(source)] as const;
  }));
})();
const japaneseArticleBodies = new Map(currentJapaneseArticleTranslations.map((artifact) => [artifact.contentId, artifact.fields.body]));

const normalize = (text: string) => text.toLowerCase().replace(/[-‐–]/g, " ").replace(/\s+/g, " ");

/**
 * Whether an article block mentions the term: its glossary link, its headword, or the core of its English
 * name ("Non-permanent Resident for Individual Income Tax" → "non permanent resident"). The English-name
 * match finds explanatory sections that never repeat the Japanese headword.
 */
function mentionsTerm(block: string, term: GlossaryTerm): boolean {
  if (block.includes(`/glossary/${term.id}`) || block.includes(term.japanese)) return true;
  const englishCore = normalize(term.englishName.split(/\s+(?:for|of)\s+/i)[0]!);
  return englishCore.length >= 8 && normalize(block).includes(englishCore);
}

/**
 * Each block that mentions a term plus the rest of its section, up to a total cap. Clarifications usually
 * follow the mention (e.g. "departure" is resolved by a later "if you leave Japan" bullet), so sections
 * are kept whole where the cap allows.
 */
function excerpt(body: string | undefined, term: GlossaryTerm, maxLength = 1800): string | undefined {
  if (!body) return undefined;
  const blocks = body.split(/\n{2,}/);
  const included = new Set<number>();
  let length = 0;
  for (const [start, block] of blocks.entries()) {
    if (included.has(start) || !mentionsTerm(block, term)) continue;
    for (let index = start; index < blocks.length; index += 1) {
      const candidate = blocks[index]!;
      if ((index > start && /^#{1,6}\s/.test(candidate)) || length + candidate.length > maxLength) break;
      if (!included.has(index)) {
        included.add(index);
        length += candidate.length;
      }
    }
  }
  return included.size ? [...included].sort((left, right) => left - right).map((index) => blocks[index]).join("\n\n") : undefined;
}

function articleContext(term: GlossaryTerm): string {
  const blocks = term.relatedArticleIds.slice(0, 2).flatMap((articleId) => {
    const english = excerpt(englishArticleBodies.get(articleId), term);
    const japanese = excerpt(japaneseArticleBodies.get(articleId), term);
    if (!english && !japanese) return [];
    return [[
      `Article ${articleId}:`,
      english ? `EN excerpt:\n${english}` : undefined,
      japanese ? `JA excerpt (current machine translation):\n${japanese}` : undefined,
    ].filter(Boolean).join("\n")];
  });
  return blocks.length ? blocks.join("\n\n") : "No linked article mentions this term.";
}

function relatedHeadwords(term: GlossaryTerm): string {
  const related = term.relatedTermIds
    .map((id) => glossaryTerms.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is GlossaryTerm => Boolean(candidate))
    .map((candidate) => `${candidate.japanese} (${candidate.englishName})`);
  return related.length ? related.join(", ") : "none";
}

/** Builds the user message: protected terms, accepted examples, then the records to translate. */
export function buildUserPrompt(ids: readonly string[]): string {
  const batch = ids.map(getTerm);
  const examples = selectExamples(batch);
  const protectedLines = japaneseProtectedTerminology
    .map(({ value, replacement }) => `- ${value} → ${replacement ?? value}`)
    .join("\n");
  const exampleBlocks = examples.map(({ artifact, term }) => [
    `### ${term.id} — ${term.japanese} (${term.englishName})`,
    `EN shortDefinition: ${term.shortDefinition}`,
    `JA shortDefinition: ${artifact.fields["short-definition"]}`,
    `EN detailedExplanation: ${term.detailedExplanation}`,
    `JA detailedExplanation: ${artifact.fields["detailed-explanation"]}`,
  ].join("\n"));
  const recordBlocks = batch.map((term) => [
    `### ${term.id} — ${term.japanese}（${term.kana}） — ${term.englishName}`,
    `Related terms: ${relatedHeadwords(term)}`,
    `shortDefinition: ${term.shortDefinition}`,
    `detailedExplanation: ${term.detailedExplanation}`,
    `commonContext: ${term.commonContext}`,
    "Linked-article context (for meaning and established wording; do not translate):",
    articleContext(term),
  ].join("\n"));

  return [
    "## Protected terminology (English → required Japanese)",
    protectedLines,
    "",
    "## Accepted translations for style reference (do not translate these)",
    exampleBlocks.join("\n\n"),
    "",
    `## Records to translate (${batch.length})`,
    recordBlocks.join("\n\n"),
  ].join("\n");
}

const ambiguitySchema = z.object({
  field: z.string(),
  english: z.string(),
  chosen: z.string(),
  alternatives: z.array(z.string()),
  /** Set when a linked article settled the meaning; informational only. */
  resolvedBy: z.literal("article").optional(),
});
const draftEntrySchema = z.object({
  id: z.string(),
  shortDefinition: z.string().min(1),
  detailedExplanation: z.string().min(1),
  commonContext: z.string().min(1),
  ambiguities: z.array(ambiguitySchema).default([]),
});
export const draftSchema = z.array(draftEntrySchema);
export type DraftEntry = z.infer<typeof draftEntrySchema>;

export type ClaudeRun = Readonly<{ draft: DraftEntry[]; costUsd: number; model: string; raw: string }>;

function resolveClaudeBinary(): string {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const localInstall = join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");
  return existsSync(localInstall) ? localInstall : "claude";
}

/** Extracts the JSON array from Claude's `--output-format json` envelope or from bare model text. */
export function parseDraftText(text: string): DraftEntry[] {
  let body = text.trim();
  try {
    const envelope = JSON.parse(body) as { result?: unknown };
    if (typeof envelope === "object" && envelope && typeof envelope.result === "string") body = envelope.result;
  } catch {
    // Not an envelope; treat as model text.
  }
  const start = body.indexOf("[");
  const end = body.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("No JSON array found in Claude output.");
  return draftSchema.parse(JSON.parse(body.slice(start, end + 1)));
}

/**
 * Runs one isolated, tool-free Claude call. It runs from a temporary directory with a replacement system
 * prompt so no repository CLAUDE.md/AGENTS.md or default agent instructions enter the context.
 */
export async function runClaude(userPrompt: string, options: Readonly<{ model: string; effort: string; budgetUsd: number; systemPromptPath?: string; rawOnly?: boolean }>): Promise<ClaudeRun> {
  const workdir = await mkdtemp(join(tmpdir(), "nihonest-glossary-"));
  // Asynchronous so callers can run several isolated calls in parallel.
  const child = spawn(resolveClaudeBinary(), [
    "-p",
    "--model", options.model,
    "--effort", options.effort,
    "--tools", "",
    "--strict-mcp-config",
    "--no-session-persistence",
    "--max-budget-usd", String(options.budgetUsd),
    "--output-format", "json",
    "--system-prompt-file", options.systemPromptPath ?? glossaryPromptPath,
  ], { cwd: workdir });
  const result = await new Promise<{ status: number | null; stdout: string; stderr: string }>((resolvePromise, reject) => {
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (status) => resolvePromise({ status, stdout, stderr }));
    child.stdin.end(userPrompt);
  });
  if (result.status !== 0) throw new Error(`Claude exited with ${result.status}: ${result.stderr || result.stdout}`);
  const envelope = JSON.parse(result.stdout) as { is_error?: boolean; result?: string; total_cost_usd?: number; modelUsage?: Record<string, unknown> };
  if (envelope.is_error) throw new Error(`Claude reported an error: ${envelope.result}`);
  return {
    // rawOnly lets other content kinds parse their own JSON shape from `raw`.
    draft: options.rawOnly ? [] : parseDraftText(result.stdout),
    costUsd: envelope.total_cost_usd ?? 0,
    model: Object.keys(envelope.modelUsage ?? {})[0] ?? options.model,
    raw: result.stdout,
  };
}

export type CheckFinding = Readonly<{ id: string; level: "error" | "warning"; message: string }>;

/**
 * Mechanical checks only: ID set, circular short definitions, protected terminology, sentence form, and
 * length drift. They cannot judge meaning; a clean result is necessary, not sufficient.
 */
export function checkDraft(ids: readonly string[], draft: readonly DraftEntry[]): CheckFinding[] {
  const findings: CheckFinding[] = [];
  const draftIds = draft.map(({ id }) => id);
  for (const id of ids) if (!draftIds.includes(id)) findings.push({ id, level: "error", message: "Missing from draft." });
  for (const id of draftIds) if (!ids.includes(id)) findings.push({ id, level: "error", message: "Not requested." });
  if (new Set(draftIds).size !== draftIds.length) findings.push({ id: "*", level: "error", message: "Duplicate IDs in draft." });

  for (const entry of draft) {
    if (!ids.includes(entry.id)) continue;
    const term = getTerm(entry.id);
    // Only the whole headword is mechanical; reusing a category word such as 年金 or 役所 is allowed by the prompt.
    if (entry.shortDefinition.includes(term.japanese)) {
      findings.push({ id: entry.id, level: "error", message: `shortDefinition repeats the headword ${term.japanese}.` });
    }
    if (!entry.shortDefinition.endsWith("です。")) findings.push({ id: entry.id, level: "warning", message: "shortDefinition does not end with 「です。」." });

    for (const field of translatedFields) {
      const english = term[field];
      const japanese = entry[field];
      for (const { value, replacement } of japaneseProtectedTerminology) {
        // Whole-word match so acronyms such as ISA do not match inside "disability".
        const pattern = new RegExp(`\\b${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (pattern.test(english) && !japanese.includes(replacement ?? value)) {
          findings.push({ id: entry.id, level: "error", message: `${field}: "${value}" must appear as ${replacement ?? value}.` });
        }
      }
      const ratio = japanese.length / english.length;
      if (ratio < 0.2 || ratio > 0.9) findings.push({ id: entry.id, level: "warning", message: `${field}: unusual length ratio ${ratio.toFixed(2)} (Japanese/English characters).` });
    }
  }
  return findings;
}

export function formatFindings(findings: readonly CheckFinding[]): string {
  if (!findings.length) return "No mechanical findings.";
  return findings.map(({ id, level, message }) => `${level.toUpperCase()} ${id}: ${message}`).join("\n");
}

/** Ambiguities no linked article settles; the user decides the intended meaning before integration. */
export function blockingAmbiguities(entry: DraftEntry) {
  return entry.ambiguities.filter(({ resolvedBy }) => !resolvedBy);
}

export function formatAmbiguities(draft: readonly DraftEntry[]): string {
  const lines = draft.flatMap(({ id, ambiguities }) => ambiguities.map(({ field, english, chosen, alternatives, resolvedBy }) =>
    `${resolvedBy ? "[resolved by article] " : "[BLOCKING: ask the user] "}${id}.${field}: "${english}" → used "${chosen}"; alternatives: ${alternatives.join(" / ")}`));
  return lines.length ? lines.join("\n") : "No ambiguities flagged.";
}

/** Revision of the glossary prompt as it is now; record it in `japaneseGlossaryPromptRevisions` for each batch. */
export function currentGlossaryPromptRevision(): string {
  const source = readFileSync(glossaryPromptPath, "utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(JSON.stringify({ source }), "utf8").digest("hex");
}

/**
 * Source revision for a glossary artifact. Mirrors `createTranslationSourceRevision`, which cannot be
 * imported here because it is marked server-only.
 */
export function glossarySourceRevision(id: string): string {
  const term = getTerm(id);
  const fields = Object.fromEntries(translatedFields
    .map((field) => [field, term[field].replace(/\r\n?/g, "\n")] as const)
    .sort(([left], [right]) => left.localeCompare(right)));
  return createHash("sha256").update(JSON.stringify(fields), "utf8").digest("hex");
}
