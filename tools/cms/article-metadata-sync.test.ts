// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { generatedArticleMetadataPath, refreshArticleMetadata } from "./article-metadata-sync";
import { gitSessionReport, startGitSession } from "./git-session";

const stale = "// stale\nexport const generatedArticleMetadata = [];\n";
const fresh = "// fresh\nexport const generatedArticleMetadata = [];\n";

async function fixture(initial = stale) {
  const root = await mkdtemp(join(tmpdir(), "nihonest-cms-article-metadata-"));
  await mkdir(resolve(root, generatedArticleMetadataPath, ".."), { recursive: true });
  await writeFile(resolve(root, generatedArticleMetadataPath), initial);
  await writeFile(resolve(root, "neighbor.txt"), "unchanged\n");
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "core.autocrlf", "false"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  execFileSync("git", ["-c", "user.name=CMS Fixture", "-c", "user.email=cms-fixture@example.invalid", "commit", "-qm", "baseline"], { cwd: root });
  return root;
}

describe("refreshArticleMetadata", () => {
  it("regenerates a stale module atomically and records it as a CMS write", async () => {
    const root = await fixture();
    try {
      await startGitSession(root);
      expect(await refreshArticleMetadata(root, async () => fresh)).toEqual({ status: "updated" });
      expect(await readFile(resolve(root, generatedArticleMetadataPath), "utf8")).toBe(fresh);
      expect(await readFile(resolve(root, "neighbor.txt"), "utf8")).toBe("unchanged\n");
      expect((await readdir(resolve(root, ".cms"))).filter((name) => name.endsWith(".tmp"))).toEqual([]);
      expect(JSON.stringify(await gitSessionReport(root))).toContain(generatedArticleMetadataPath);
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it("does not write when the module is already current", async () => {
    const root = await fixture(fresh);
    try {
      await startGitSession(root);
      expect(await refreshArticleMetadata(root, async () => fresh)).toEqual({ status: "current" });
      expect(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" })).toBe("");
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it("refuses a module that was dirty when the CMS started and reports instead of throwing", async () => {
    const root = await fixture();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      await writeFile(resolve(root, generatedArticleMetadataPath), "// someone else's edit\n");
      await startGitSession(root);
      const result = await refreshArticleMetadata(root, async () => fresh);
      expect(result.status).toBe("failed");
      expect(await readFile(resolve(root, generatedArticleMetadataPath), "utf8")).toBe("// someone else's edit\n");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("npm run content:metadata"));
    } finally { warn.mockRestore(); await rm(root, { recursive: true, force: true }); }
  });

  it("reports a generator failure without touching the module", async () => {
    const root = await fixture();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      await startGitSession(root);
      expect(await refreshArticleMetadata(root, async () => { throw new Error("unregistered MDX file"); })).toEqual({ status: "failed", message: "unregistered MDX file" });
      expect(await readFile(resolve(root, generatedArticleMetadataPath), "utf8")).toBe(stale);
    } finally { warn.mockRestore(); await rm(root, { recursive: true, force: true }); }
  });
});
