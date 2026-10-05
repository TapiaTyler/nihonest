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

export type ArticleMetadataRefresh = Readonly<{ status: "current" | "updated" } | { status: "failed"; message: string }>;

/**
 * Regenerates the checked-in article metadata module after a CMS article write, so status changes, approvals,
 * body saves (which move updatedAt), and new articles never leave a production build stale. Follows the shared
 * write rules: file lock, dirty-at-start guard, temporary file in .cms, atomic rename, and write bookkeeping.
 * Never throws: the article write already succeeded, so a failure is reported for the editor to resolve and the
 * production build's freshness check still blocks shipping stale metadata.
 */
export async function refreshArticleMetadata(projectRoot: string, generate: ArticleMetadataGenerator = generateFromCanonicalSources): Promise<ArticleMetadataRefresh> {
  const target = resolve(projectRoot, generatedArticleMetadataPath);
  try {
    return await withCmsFileLock(target, async () => {
      const expected = await generate(projectRoot);
      let current: string | undefined;
      try { current = await readFile(target, "utf8"); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
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
