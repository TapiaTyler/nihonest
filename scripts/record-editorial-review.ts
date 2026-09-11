import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createEditorialReviewRecord, editorialContentKindSchema } from "@/domain/editorial/editorial-review";
import { sourceReviewRecordSchema } from "@/domain/source/source-review";
import { loadEditorialReviewRecords, loadEditorialTargets } from "@/lib/editorial/editorial-catalog";

function values(name: string): readonly string[] {
  const args = process.argv.slice(2);
  return args.flatMap((argument, index) => {
    if (argument.startsWith(`${name}=`)) return [argument.slice(name.length + 1)];
    return argument === name && args[index + 1] ? [args[index + 1]!] : [];
  });
}

function required(name: string): string {
  const value = values(name)[0];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function main(): Promise<void> {
  if (!process.argv.includes("--approve")) throw new Error("Recording verified content requires --approve after explicit human editorial approval.");
  const kind = editorialContentKindSchema.parse(required("--kind"));
  const contentId = required("--id");
  const reviewedAt = required("--reviewed-at");
  const validationPerformed = values("--validation");
  if (validationPerformed.length === 0) throw new Error("At least one --validation description is required.");

  const projectRoot = process.cwd();
  const reviewDirectory = resolve(projectRoot, "content/editorial-reviews");
  const targets = await loadEditorialTargets(projectRoot);
  const target = targets.find((item) => item.kind === kind && item.id === contentId);
  if (!target) throw new Error(`Unknown editorial target "${kind}:${contentId}".`);
  const sourceReviewIds = values("--source-review");
  for (const sourceReviewId of sourceReviewIds) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sourceReviewId)) throw new Error(`Invalid source review ID "${sourceReviewId}".`);
    const path = resolve(projectRoot, "content/source-reviews", `${sourceReviewId}.json`);
    let sourceReview;
    try {
      sourceReview = sourceReviewRecordSchema.parse(JSON.parse(await readFile(path, "utf8")));
    }
    catch (error) {
      throw new Error(`Cannot validate linked source review "${sourceReviewId}".`, { cause: error });
    }
    if (sourceReview.status !== "resolved") throw new Error(`Linked source review "${sourceReviewId}" is not resolved.`);
  }
  const record = createEditorialReviewRecord({
    target,
    reviewedAt,
    changeNote: required("--change-note"),
    approvalNote: required("--approval-note"),
    validationPerformed,
    sourceReviewIds,
    recordedAt: new Date().toISOString(),
  });
  const existing = await loadEditorialReviewRecords(reviewDirectory);
  if (existing.some(({ id }) => id === record.id)) throw new Error(`Approval record "${record.id}" already exists.`);

  await mkdir(reviewDirectory, { recursive: true });
  await writeFile(join(reviewDirectory, `${record.id}.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log(`Recorded human approval for ${kind}:${contentId} at revision ${target.revision}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The editorial approval could not be recorded.");
  process.exitCode = 1;
});
