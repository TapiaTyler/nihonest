import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  resolveSourceReview,
  sourceReviewDecisionSchema,
  sourceReviewOutcomeSchema,
  sourceReviewRecordSchema,
} from "@/domain/source/source-review";
import { SOURCE_DEPENDENT_KINDS } from "@/domain/source/source-dependency";
import { sourceMonitoringStateSchema } from "@/domain/source/source-monitoring";
import { renderSourceReviewMarkdown } from "@/lib/source-monitoring/source-review-report";

const projectRoot = process.cwd();
const statePath = resolve(projectRoot, "content/source-monitoring/state.json");
const reviewDirectory = resolve(projectRoot, "content/source-reviews");

function values(name: string): readonly string[] {
  const argumentsToParse = process.argv.slice(2);
  return argumentsToParse.flatMap((argument, index) => {
    if (argument.startsWith(`${name}=`)) return [argument.slice(name.length + 1)];
    return argument === name && argumentsToParse[index + 1] ? [argumentsToParse[index + 1]!] : [];
  });
}

function required(name: string): string {
  const value = values(name)[0];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function dependent(value: string, name: string) {
  const separator = value.indexOf(":");
  const kind = value.slice(0, separator);
  const id = value.slice(separator + 1);
  if (separator < 1 || !id || !SOURCE_DEPENDENT_KINDS.includes(kind as (typeof SOURCE_DEPENDENT_KINDS)[number])) {
    throw new Error(`Invalid ${name} value "${value}"; use kind:id.`);
  }
  return { kind: kind as (typeof SOURCE_DEPENDENT_KINDS)[number], id };
}

async function main(): Promise<void> {
  if (!process.argv.includes("--approve")) {
    throw new Error("Resolution requires --approve after explicit human editorial approval.");
  }
  const sourceId = required("--source");
  const decision = sourceReviewDecisionSchema.parse(required("--decision"));
  const outcome = sourceReviewOutcomeSchema.parse(required("--outcome"));
  const reviewedAt = required("--reviewed-at");
  const approvalNote = required("--approval-note");
  const unresolvedUncertainty = required("--uncertainty");
  const validationPerformed = values("--validation");
  if (validationPerformed.length === 0) throw new Error("At least one --validation description is required.");
  const state = sourceMonitoringStateSchema.parse(JSON.parse(await readFile(statePath, "utf8")));
  const candidate = state.sources[sourceId]?.candidate;
  if (!candidate) throw new Error(`Source "${sourceId}" has no unresolved candidate revision.`);
  const reviewId = `${sourceId}-${candidate.fingerprint.slice(0, 12)}`;
  const jsonPath = join(reviewDirectory, `${reviewId}.json`);
  const record = sourceReviewRecordSchema.parse(JSON.parse(await readFile(jsonPath, "utf8")));
  const reviewedDependencies = process.argv.includes("--reviewed-all") ? record.dependencies : values("--reviewed").map((value) => {
    const parsed = dependent(value, "--reviewed");
    const registered = record.dependencies.find(({ kind, id }) => kind === parsed.kind && id === parsed.id);
    if (!registered) throw new Error(`Reviewed dependency "${value}" is not registered for this source.`);
    return registered;
  });
  const reviewedKeys = new Set(reviewedDependencies.map(({ kind, id }) => `${kind}:${id}`));
  const unreviewedDependencies = record.dependencies.filter(({ kind, id }) => !reviewedKeys.has(`${kind}:${id}`));
  if (unreviewedDependencies.length > 0) {
    throw new Error(`Resolution requires every registered dependency to be reviewed. Missing: ${unreviewedDependencies.map(({ kind, id }) => `${kind}:${id}`).join(", ")}.`);
  }
  const associatedContentChanges = values("--content").map((value) => {
    const parsed = dependent(value, "--content");
    return { ...parsed, note: "Updated during this source review; see the approval note." };
  });
  const resolved = resolveSourceReview({
    record,
    monitoringState: state,
    decision,
    outcome,
    reviewedAt,
    approvalNote,
    unresolvedUncertainty,
    validationPerformed,
    resolvedAt: new Date().toISOString(),
    reviewedDependencies,
    associatedContentChanges,
  });

  // Write the auditable resolution before advancing the accepted monitoring state.
  await writeFile(jsonPath, `${JSON.stringify(resolved.record, null, 2)}\n`, "utf8");
  await writeFile(join(reviewDirectory, `${reviewId}.md`), renderSourceReviewMarkdown(resolved.record), "utf8");
  await writeFile(statePath, `${JSON.stringify(resolved.monitoringState, null, 2)}\n`, "utf8");
  console.log(`${decision === "accept" ? "Accepted" : "Rejected"} candidate ${candidate.fingerprint} for ${sourceId}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The source review could not be resolved.");
  process.exitCode = 1;
});
