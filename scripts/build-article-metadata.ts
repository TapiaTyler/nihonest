/** Explicit generation or a non-writing stale-output check; no lifecycle/build/CMS hooks in checkpoint 1. */
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { parseArgs } from "node:util";
import { readOrderedArticleMetadata, serializeArticleMetadataModule } from "@/lib/content/article-metadata-producer";
import { validateArticleMetadataReferences } from "@/lib/content/article-metadata-validation";

async function main() {
  const { values } = parseArgs({ options: { check: { type: "boolean", default: false } } });
  const target = resolve("src/data/generated/article-metadata.ts");
  const metadata = await readOrderedArticleMetadata(process.cwd());
  validateArticleMetadataReferences(metadata);
  const expected = serializeArticleMetadataModule(metadata);
  let existing: string | undefined;
  try { existing = await readFile(target, "utf8"); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  if (existing === expected) { console.log(`Article metadata current: ${metadata.length} records.`); return; }
  if (values.check) throw new Error("Article metadata is stale or missing. Run: node --import tsx scripts/build-article-metadata.ts");
  await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, expected, { flag: "wx" }); await rename(temporary, target); }
  finally { await rm(temporary, { force: true }); }
  console.log(`Generated article metadata: ${metadata.length} records.`);
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
