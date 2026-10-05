// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { generatedArticleMetadataPath, inspectArticleMetadata, refreshArticleMetadata } from "./article-metadata-sync";
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

  it("never replaces a module edited externally while the regenerated copy was being prepared", async () => {
    const root = await fixture();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      await startGitSession(root);
      const target = resolve(root, generatedArticleMetadataPath);
      const result = await refreshArticleMetadata(root, async () => fresh, () => writeFile(target, "// external edit\n"));
      expect(result).toEqual({ status: "failed", message: expect.stringContaining("changed while it was being regenerated") });
      expect(await readFile(target, "utf8")).toBe("// external edit\n");
      expect((await readdir(resolve(root, ".cms"))).filter((name) => name.endsWith(".tmp"))).toEqual([]);
    } finally { warn.mockRestore(); await rm(root, { recursive: true, force: true }); }
  });

  it("never replaces a module created externally after it was found missing", async () => {
    const root = await fixture();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const target = resolve(root, generatedArticleMetadataPath);
      await unlink(target);
      execFileSync("git", ["-c", "user.name=CMS Fixture", "-c", "user.email=cms-fixture@example.invalid", "commit", "-qam", "remove generated module"], { cwd: root });
      await startGitSession(root);
      const result = await refreshArticleMetadata(root, async () => fresh, () => writeFile(target, "// created elsewhere\n"));
      expect(result.status).toBe("failed");
      expect(await readFile(target, "utf8")).toBe("// created elsewhere\n");
    } finally { warn.mockRestore(); await rm(root, { recursive: true, force: true }); }
  });

  it("creates a missing module when nothing else touches it", async () => {
    const root = await fixture();
    try {
      await unlink(resolve(root, generatedArticleMetadataPath));
      execFileSync("git", ["-c", "user.name=CMS Fixture", "-c", "user.email=cms-fixture@example.invalid", "commit", "-qam", "remove generated module"], { cwd: root });
      await startGitSession(root);
      expect(await refreshArticleMetadata(root, async () => fresh)).toEqual({ status: "updated" });
      expect(await readFile(resolve(root, generatedArticleMetadataPath), "utf8")).toBe(fresh);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});

describe("inspectArticleMetadata", () => {
  it("reports current, stale, and unavailable without writing", async () => {
    const root = await fixture();
    try {
      expect(await inspectArticleMetadata(root, async () => stale)).toEqual({ status: "current" });
      expect(await inspectArticleMetadata(root, async () => fresh)).toEqual({ status: "stale" });
      expect(await inspectArticleMetadata(root, async () => { throw new Error("unregistered MDX file"); })).toEqual({ status: "unavailable", message: "unregistered MDX file" });
      expect(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" })).toBe("");
    } finally { await rm(root, { recursive: true, force: true }); }
  });
});
