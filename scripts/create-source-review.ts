import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { sources } from "@/data/sources";
import { createSourceReviewRecord, addSourceReviewNote, sourceReviewRecordSchema } from "@/domain/source/source-review";
import { sourceMonitoringStateSchema } from "@/domain/source/source-monitoring";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { buildRepositorySourceRegistry } from "@/lib/source-monitoring/repository-source-registry";
import { renderSourceReviewMarkdown, summarizeSourceDifference } from "@/lib/source-monitoring/source-review-report";

const projectRoot = process.cwd();
const statePath = resolve(projectRoot, "content/source-monitoring/state.json");
const reviewDirectory = resolve(projectRoot, "content/source-reviews");
const cacheDirectory = resolve(projectRoot, ".source-monitoring/cache");

function option(name: string): string | undefined {
  const equals = process.argv.slice(2).find((argument) => argument.startsWith(`${name}=`));
  if (equals) return equals.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function cachedText(sourceId: string, fingerprint: string, textual: boolean): Promise<string | undefined> {
  if (!textual) return undefined;
  try {
    return await readFile(join(cacheDirectory, sourceId, fingerprint), "utf8");
  }
  catch {
    return undefined;
  }
}

async function main(): Promise<void> {
  const sourceId = option("--source");
  if (!sourceId) throw new Error("--source requires a source ID.");
  const source = sources.find(({ id }) => id === sourceId);
  if (!source) throw new Error(`Unknown source ID "${sourceId}".`);

  const state = sourceMonitoringStateSchema.parse(JSON.parse(await readFile(statePath, "utf8")));
  const entry = state.sources[sourceId];
  if (!entry?.candidate) throw new Error(`Source "${sourceId}" has no unresolved candidate revision.`);

  const articles = await loadArticleSourceMetadata(resolve(projectRoot, "content/articles"));
  const registry = buildRepositorySourceRegistry(articles);
  const errors = registry.findings.filter(({ severity }) => severity === "error");
  if (errors.length > 0) throw new Error(`Source registry has ${errors.length} error(s); resolve them before creating a review.`);
  const dependency = registry.graph.find((item) => item.sourceId === sourceId);
  if (!dependency) throw new Error(`Source "${sourceId}" is missing from the dependency graph.`);

  const textual = entry.candidate.contentKind === "html" || entry.candidate.contentKind === "text";
  const now = new Date().toISOString();
  let record = createSourceReviewRecord({
    source,
    dependency,
    articles,
    candidateFingerprint: entry.candidate.fingerprint,
    detectedAs: entry.lastCheck?.status === "redirected" ? "redirected" : "changed",
    detectedAt: entry.candidate.capturedAt,
    createdAt: now,
    difference: summarizeSourceDifference({
      accepted: entry.accepted,
      candidate: entry.candidate,
      acceptedText: entry.accepted ? await cachedText(sourceId, entry.accepted.fingerprint, textual) : undefined,
      candidateText: await cachedText(sourceId, entry.candidate.fingerprint, textual),
    }),
  });

  const jsonPath = join(reviewDirectory, `${record.id}.json`);
  try {
    const existing = sourceReviewRecordSchema.parse(JSON.parse(await readFile(jsonPath, "utf8")));
    if (existing.status === "resolved") throw new Error("The matching source review is already resolved.");
    record = sourceReviewRecordSchema.parse({ ...record, createdAt: existing.createdAt, notes: existing.notes });
  }
  catch (error) {
    if (error instanceof Error && !error.message.includes("ENOENT")) throw error;
  }

  const note = option("--note");
  if (note) record = addSourceReviewNote(record, {
    kind: option("--note-kind") === "codex-advisory" ? "codex-advisory" : "human",
    text: note,
    createdAt: now,
  });

  await mkdir(reviewDirectory, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  await writeFile(join(reviewDirectory, `${record.id}.md`), renderSourceReviewMarkdown(record), "utf8");
  console.log(`Created ${record.priority.level}-priority review ${record.id}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The source review could not be created.");
  process.exitCode = 1;
});
