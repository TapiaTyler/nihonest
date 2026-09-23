/**
 * One-command Claude glossary batch: selects terms, builds the prompt from repository data, runs an
 * isolated Claude call, checks the draft, and writes a summary with paste-ready catalog entries.
 * Nothing in the repository is edited; integration stays a deliberate step.
 *
 *   npm run glossary:draft -- --next 5 [--topic taxes] [--model sonnet] [--dry-run]
 *   npm run glossary:draft -- --ids honnin-kakunin,futsu-yokin
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultClaudeOptions, hasFlag, readOption, timestamp } from "./glossary-translation/cli-options";
import {
  buildUserPrompt,
  checkDraft,
  currentGlossaryPromptRevision,
  draftRoot,
  blockingAmbiguities,
  formatAmbiguities,
  formatFindings,
  getTerm,
  glossarySourceRevision,
  runClaude,
  selectUntranslatedIds,
  type DraftEntry,
} from "./glossary-translation/glossary-draft";

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const explicitIds = readOption(argv, "ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const ids = explicitIds ?? selectUntranslatedIds(Number(readOption(argv, "next") ?? 5), readOption(argv, "topic"));
  if (!ids.length) throw new Error("No untranslated terms matched.");
  ids.forEach(getTerm);

  // The first ID keeps parallel runs started in the same millisecond from sharing a directory.
  const runId = `${timestamp()}-${ids[0]}`;
  const outputDirectory = join(draftRoot, runId);
  await mkdir(outputDirectory, { recursive: true });
  const userPrompt = buildUserPrompt(ids);
  await writeFile(join(outputDirectory, "prompt.md"), userPrompt);
  console.log(`Terms: ${ids.join(", ")}`);

  if (hasFlag(argv, "dry-run")) {
    console.log(`Prompt written to ${outputDirectory} (dry run; Claude not called).`);
    return;
  }

  const options = {
    model: readOption(argv, "model") ?? defaultClaudeOptions.model,
    effort: readOption(argv, "effort") ?? defaultClaudeOptions.effort,
    budgetUsd: Number(readOption(argv, "budget") ?? defaultClaudeOptions.budgetUsd),
  };
  const run = await runClaude(userPrompt, options);
  await writeFile(join(outputDirectory, "claude-output.json"), run.raw);
  await writeFile(join(outputDirectory, "draft.json"), `${JSON.stringify(run.draft, null, 2)}\n`);

  const findings = checkDraft(ids, run.draft);
  const blocked = run.draft.filter((entry) => blockingAmbiguities(entry).length);
  const escape = (value: string) => JSON.stringify(value);
  const catalogLine = (entry: DraftEntry) =>
    `  defineGlossaryTranslation(${escape(entry.id)}, ${escape(glossarySourceRevision(entry.id))}, ${escape(entry.shortDefinition)}, ${escape(entry.detailedExplanation)}, ${escape(entry.commonContext)}, pipelineGenerator, <generatedAt>, <promptRevision>),`;

  const summary = [
    `# Glossary draft ${runId}`,
    "",
    `Model: ${run.model} · effort ${options.effort} · cost $${run.costUsd.toFixed(4)}`,
    `Prompt revision: ${currentGlossaryPromptRevision()} (add it to japaneseGlossaryPromptRevisions if new)`,
    "",
    "## Mechanical checks",
    formatFindings(findings),
    "",
    "## Ambiguities (BLOCKING: ask the user which meaning is intended; resolved by article: informational)",
    formatAmbiguities(run.draft),
    "",
    "## Catalog entries for terms without errors or blocking ambiguities",
    "```ts",
    ...run.draft
      .filter((entry) => !blockingAmbiguities(entry).length && !findings.some(({ id, level }) => id === entry.id && level === "error"))
      .map(catalogLine),
    "```",
  ].join("\n");
  await writeFile(join(outputDirectory, "summary.md"), `${summary}\n`);
  console.log(summary);
  console.log(`\nOutput: ${outputDirectory}`);

  if (findings.some(({ level }) => level === "error")) process.exitCode = 1;
  else if (blocked.length) process.exitCode = 2;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
