import { describe, expect, it, vi } from "vitest";
import { articleMetadataCheckedFlag, assertArticleMetadataFresh, type ArticleMetadataCheckRunner } from "./article-metadata-freshness";

describe("assertArticleMetadataFresh", () => {
  it("runs the non-writing generator check once per build process", () => {
    const env: Record<string, string | undefined> = {};
    const run = vi.fn<ArticleMetadataCheckRunner>(() => ({ status: 0, stdout: "Article metadata current: 97 records.", stderr: "", error: undefined }));
    assertArticleMetadataFresh(env, run);
    assertArticleMetadataFresh(env, run);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]![1]).toEqual(["--import", "tsx", "scripts/build-article-metadata.ts", "--check"]);
    expect(env[articleMetadataCheckedFlag]).toBe("1");
  });

  it("fails the build with the regeneration command when metadata is stale", () => {
    const env: Record<string, string | undefined> = {};
    const run = () => ({ status: 1, stdout: "", stderr: "Article metadata is stale or missing.", error: undefined });
    expect(() => assertArticleMetadataFresh(env, run)).toThrow(/npm run content:metadata[\s\S]*stale or missing/);
    expect(env[articleMetadataCheckedFlag]).toBeUndefined();
  });

  it("fails when the check cannot run", () => {
    expect(() => assertArticleMetadataFresh({}, () => ({ status: null, stdout: "", stderr: "", error: new Error("spawn failed") }))).toThrow(/spawn failed/);
  });
});
