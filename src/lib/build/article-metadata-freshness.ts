import { spawnSync, type SpawnSyncReturns } from "node:child_process";

/** Set once a build process has checked, so Next's repeated config loads (and its workers) check only once. */
export const articleMetadataCheckedFlag = "NIHONEST_ARTICLE_METADATA_CHECKED";

export type ArticleMetadataCheckRunner = (command: string, args: readonly string[]) => Pick<SpawnSyncReturns<string>, "status" | "stdout" | "stderr" | "error">;

const defaultRunner: ArticleMetadataCheckRunner = (command, args) => spawnSync(command, [...args], { encoding: "utf8", timeout: 120_000 });

/**
 * Fails a production build when src/data/generated/article-metadata.ts no longer matches the canonical MDX and
 * registrations. Runs the generator's non-writing --check, so a build never rewrites source files. A direct
 * `next build` is covered even when Vitest and release:check are skipped.
 */
export function assertArticleMetadataFresh(env: Record<string, string | undefined> = process.env, run: ArticleMetadataCheckRunner = defaultRunner): void {
  if (env[articleMetadataCheckedFlag] === "1") return;
  const result = run(process.execPath, ["--import", "tsx", "scripts/build-article-metadata.ts", "--check"]);
  if (result.error || result.status !== 0) {
    const detail = (result.stderr || result.stdout || String(result.error ?? "")).trim();
    throw new Error(`Article metadata freshness check failed. Run \`npm run content:metadata\`, review the diff, and commit it.\n${detail}`);
  }
  env[articleMetadataCheckedFlag] = "1";
}
