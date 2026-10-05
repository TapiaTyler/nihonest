import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, realpath, rename, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { readOrderedArticleMetadata, serializeArticleMetadataModule } from "@/lib/content/article-metadata-producer";
import { CmsEditError } from "./article-writer";
import { guardCmsWrite, noteCmsWrite } from "./git-session";
import { withCmsFileLock } from "./write-locks";

export const generatedArticleMetadataPath = "src/data/generated/article-metadata.ts";

/** The owner's generator; tests inject a fixture generator instead of building a full article registry. */
export type ArticleMetadataGenerator = (projectRoot: string) => Promise<string>;
const generateFromCanonicalSources: ArticleMetadataGenerator = async (projectRoot) =>
  serializeArticleMetadataModule(await readOrderedArticleMetadata(projectRoot));

async function readTarget(target: string): Promise<string | undefined> {
  try { return await readFile(target, "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export type ArticleMetadataRefresh = Readonly<{ status: "current" | "updated" } | { status: "failed"; message: string }>;

/**
 * Regenerates the checked-in article metadata module after a CMS article write, so status changes, approvals,
 * body saves (which move updatedAt), and new articles never leave a production build stale. Follows the shared
 * write rules: file lock, dirty-at-start guard, temporary file in .cms, atomic rename, and write bookkeeping.
 * Never throws: the article write already succeeded, so a failure is reported for the editor to resolve and the
 * production build's freshness check still blocks shipping stale metadata.
 */
export async function refreshArticleMetadata(projectRoot: string, generate: ArticleMetadataGenerator = generateFromCanonicalSources,
  /** Test seam: runs after the temporary file is written, where an external edit could race the replacement. */
  beforeReplace: () => Promise<void> = async () => undefined): Promise<ArticleMetadataRefresh> {
  const target = resolve(projectRoot, generatedArticleMetadataPath);
  try {
    return await withCmsFileLock(target, async () => {
      const expected = await generate(projectRoot);
      // Capture the exact bytes (or absence) so an external edit made meanwhile is never replaced.
      const current = await readTarget(target);
      if (current === expected) return { status: "current" as const };
      await guardCmsWrite(projectRoot, target);
      const cmsDirectory = join(await realpath(projectRoot), ".cms");
      await mkdir(cmsDirectory, { recursive: true });
      if (await realpath(cmsDirectory) !== cmsDirectory) throw new CmsEditError("CMS temporary directory escapes the checkout.", 403);
      const temporary = join(cmsDirectory, `article-metadata-${randomUUID()}.tmp`);
      try {
        const handle = await open(temporary, "wx");
        try { await handle.writeFile(expected, "utf8"); await handle.sync(); }
        finally { await handle.close(); }
        await beforeReplace();
        // The lock excludes only CMS writers; recheck right before replacing, as every CMS writer does.
        if (await readTarget(target) !== current) {
          throw new CmsEditError(`${generatedArticleMetadataPath} changed while it was being regenerated, so it was not replaced.`, 409);
        }
        await mkdir(resolve(target, ".."), { recursive: true });
        await rename(temporary, target);
      } finally { await rm(temporary, { force: true }); }
      await noteCmsWrite(projectRoot, target);
      return { status: "updated" as const };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Article metadata was not regenerated: ${message} Run \`npm run content:metadata\` before building.`);
    return { status: "failed", message };
  }
}

export type ArticleMetadataState = Readonly<{ status: "current" | "stale" } | { status: "unavailable"; message: string }>;

/** Read-only comparison for the editor's warning banner; never writes. */
export async function inspectArticleMetadata(projectRoot: string, generate: ArticleMetadataGenerator = generateFromCanonicalSources): Promise<ArticleMetadataState> {
  try {
    return { status: await readTarget(resolve(projectRoot, generatedArticleMetadataPath)) === await generate(projectRoot) ? "current" : "stale" };
  } catch (error) {
    return { status: "unavailable", message: error instanceof Error ? error.message : String(error) };
  }
}
