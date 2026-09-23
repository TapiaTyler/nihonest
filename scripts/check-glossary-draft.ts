/**
 * Re-runs the mechanical checks on a saved draft, e.g. after hand-editing `draft.json`.
 *
 *   npm run glossary:check -- .glossary-drafts/<run>/draft.json
 */
import { readFile } from "node:fs/promises";
import { checkDraft, formatAmbiguities, formatFindings, parseDraftText } from "./glossary-translation/glossary-draft";

async function main(): Promise<void> {
  const path = process.argv[2];
  if (!path) throw new Error("Pass the path to draft.json or claude-output.json.");
  const draft = parseDraftText(await readFile(path, "utf8"));
  const findings = checkDraft(draft.map(({ id }) => id), draft);
  console.log(formatFindings(findings));
  console.log(formatAmbiguities(draft));
  if (findings.some(({ level }) => level === "error")) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
