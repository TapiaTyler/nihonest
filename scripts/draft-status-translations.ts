/**
 * Claude drafts of Japanese residence-status record fields (summary, purpose, typical activities, examples).
 * Reuses the isolated glossary-pipeline Claude call with the shared structured-content prompt, which the
 * status catalog records as its prompt revision. The shared considerations are already translated for all
 * statuses and are not drafted. Nothing in the repository is edited.
 *
 *   npm run status:draft                  # every untranslated status, five per parallel call
 *   npm run status:draft -- --ids artist,journalist
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseProtectedTerminology } from "@/data/translations/ja/protected-terminology";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import { defaultClaudeOptions, readOption, timestamp } from "./glossary-translation/cli-options";
import { draftRoot, runClaude } from "./glossary-translation/glossary-draft";

type Status = (typeof residenceStatuses)[number];
const structuredPromptPath = resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md");

const draftSchema = z.array(z.object({
  id: z.string(),
  summary: z.string().min(1),
  purpose: z.string().min(1),
  typicalActivities: z.array(z.string()),
  examples: z.array(z.string()),
  ambiguities: z.array(z.string()).default([]),
}));
type Draft = z.infer<typeof draftSchema>[number];

/** Mirrors the status catalog test's source revision. */
function sourceRevision(status: Status): string {
  const fields = Object.fromEntries(Object.entries({
    summary: status.summary,
    purpose: status.purpose,
    typicalActivities: JSON.stringify(status.typicalActivities),
    examples: JSON.stringify(status.examples),
    considerations: JSON.stringify(status.considerations),
  }).sort(([left], [right]) => left.localeCompare(right)));
  return createHash("sha256").update(JSON.stringify(fields), "utf8").digest("hex");
}

const glossaryJapanese = (status: Status) =>
  japaneseGlossaryTranslations.find(({ contentId }) => contentId === status.glossaryTermId)?.fields["short-definition"] ?? "none";

function recordBlock(status: Status): string {
  return [
    `### ${status.id} — 「${status.japaneseName}」 (${status.englishName})`,
    `Accepted Japanese glossary definition of this status (keep consistent): ${glossaryJapanese(status)}`,
    `summary: ${status.summary}`,
    `purpose: ${status.purpose}`,
    `typicalActivities: ${JSON.stringify(status.typicalActivities)}`,
    `examples: ${JSON.stringify(status.examples)}`,
  ].join("\n");
}

function buildPrompt(batch: readonly Status[]): string {
  const examples = japaneseResidenceStatusTranslations.slice(0, 3).map((artifact) => {
    const status = residenceStatuses.find(({ id }) => id === artifact.contentId)!;
    return `${recordBlock(status)}\nJA summary: ${artifact.fields.summary}\nJA purpose: ${artifact.fields.purpose}\nJA typicalActivities: ${artifact.fields["typical-activities"]}\nJA examples: ${artifact.fields.examples}`;
  });
  return [
    "Translate these canonical Nihonest residence-status records into Japanese. Return only a JSON array of objects: {id, summary, purpose, typicalActivities, examples, ambiguities}. Keep each array the same length and order as the English. `ambiguities` lists English words whose meaning you could not settle (an empty array otherwise).",
    "Rules: です・ます for summary and purpose; noun-phrase list items like the accepted examples. Write status names as 「名称」 using official Japanese names. Keep each status's activity scope consistent with its accepted glossary definition. Prefer official Japanese terms. Do not add facts, dates, thresholds, or advice, and keep all qualifications (may, can, qualifying, applicable).",
    "## Protected terminology",
    japaneseProtectedTerminology.map(({ value, replacement }) => `- ${value} → ${replacement ?? value}`).join("\n"),
    "## Accepted translations (style reference; do not translate)",
    examples.join("\n\n"),
    `## Records to translate (${batch.length})`,
    batch.map(recordBlock).join("\n\n"),
  ].join("\n\n");
}

function check(batch: readonly Status[], drafts: readonly Draft[]): string[] {
  const problems: string[] = [];
  for (const status of batch) {
    const draft = drafts.find(({ id }) => id === status.id);
    if (!draft) problems.push(`${status.id}: missing`);
    else {
      if (draft.typicalActivities.length !== status.typicalActivities.length) problems.push(`${status.id}: typicalActivities length`);
      if (draft.examples.length !== status.examples.length) problems.push(`${status.id}: examples length`);
      for (const ambiguity of draft.ambiguities) problems.push(`${status.id}: ambiguity: ${ambiguity}`);
    }
  }
  return problems;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const done = new Set<string>(japaneseResidenceStatusTranslations.map(({ contentId }) => contentId));
  const ids = readOption(argv, "ids")?.split(",") ?? residenceStatuses.filter(({ id }) => !done.has(id)).map(({ id }) => id);
  const statuses = ids.map((id) => residenceStatuses.find((status) => status.id === id) ?? (() => { throw new Error(`Unknown status ${id}`); })());
  const batches = Array.from({ length: Math.ceil(statuses.length / 5) }, (_, index) => statuses.slice(index * 5, index * 5 + 5));
  const options = { ...defaultClaudeOptions, model: readOption(argv, "model") ?? "opus", systemPromptPath: structuredPromptPath, rawOnly: true };

  const runs = await Promise.all(batches.map(async (batch) => {
    const run = await runClaude(buildPrompt(batch), options);
    const result = (JSON.parse(run.raw) as { result: string }).result;
    const drafts = draftSchema.parse(JSON.parse(result.slice(result.indexOf("["), result.lastIndexOf("]") + 1)));
    return { batch, drafts, cost: run.costUsd };
  }));

  const q = (value: unknown) => JSON.stringify(value);
  const problems = runs.flatMap(({ batch, drafts }) => check(batch, drafts));
  const lines = runs.flatMap(({ batch, drafts }) => batch.map((status) => {
    const draft = drafts.find(({ id }) => id === status.id)!;
    return `  defineResidenceStatusTranslation(${q(status.id)}, ${q(sourceRevision(status))}, ${q(draft.summary)}, ${q(draft.purpose)}, ${q(draft.typicalActivities)}, ${q(draft.examples)}, pipelineGenerator, pipelineGeneratedAt),`;
  }));
  const outputDirectory = join(draftRoot, `status-${timestamp()}`);
  await mkdir(outputDirectory, { recursive: true });
  const cost = runs.reduce((total, run) => total + run.cost, 0);
  const summary = [`# Status drafts (${statuses.length}) · cost $${cost.toFixed(4)}`, "", "## Problems", problems.join("\n") || "None.", "", "## Catalog lines", "```ts", ...lines, "```"].join("\n");
  await writeFile(join(outputDirectory, "summary.md"), `${summary}\n`);
  await writeFile(join(outputDirectory, "drafts.json"), `${q(runs.flatMap(({ drafts }) => drafts))}\n`);
  console.log(summary);
  console.log(`\nOutput: ${outputDirectory}`);
  if (problems.length) process.exitCode = 2;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
