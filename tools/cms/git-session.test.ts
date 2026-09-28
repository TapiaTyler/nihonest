// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, realpath, rm, utimes, writeFile } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { gitFileDiff, gitSessionReport, guardCmsWrite, noteCmsWrite, parsePorcelain, startGitSession } from "./git-session";

function git(root: string, ...args: string[]) {
  execFileSync("git", args, { cwd: root, stdio: "ignore" });
}

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("CMS Git session", { timeout: 30_000 }, () => {
  it("parses porcelain entries, including both paths of a rename", () => {
    expect(parsePorcelain(" M src/a.ts\0?? new file.md\0R  moved.ts\0old.ts\0")).toEqual([
      { path: "src/a.ts", code: " M" },
      { path: "new file.md", code: "??" },
      { path: "moved.ts", code: "R " },
      { path: "old.ts", code: "R " },
    ]);
  });

  it("reads status without refreshing the index, so it never holds index.lock during an editor's git add", async () => {
    const root = await realpath(await mkdtemp(join(tmpdir(), "nihonest-cms-git-")));
    try {
      git(root, "init", "-q");
      git(root, "config", "user.email", "cms-test@example.invalid");
      git(root, "config", "user.name", "CMS test");
      git(root, "config", "core.autocrlf", "false");
      await writeFile(join(root, "tracked.ts"), "export const tracked = 1;\n");
      git(root, "add", ".");
      git(root, "commit", "-q", "-m", "fixture");
      // Same content, new timestamps: a locking `git status` would refresh and rewrite the index.
      const staleStat = async () => utimes(join(root, "tracked.ts"), new Date(Date.now() + 60_000), new Date(Date.now() + 60_000));
      await staleStat();
      const before = await readFile(join(root, ".git", "index"));
      expect((await gitSessionReport(root)).status).toContain("##");
      expect(await readFile(join(root, ".git", "index"))).toEqual(before);

      // Control: plain `git status` does take the lock and rewrite the index in the same situation.
      await staleStat();
      git(root, "status", "--short");
      expect(await readFile(join(root, ".git", "index"))).not.toEqual(before);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("refuses files that were dirty at start and separates CMS writes from other changes", async () => {
    const root = await realpath(await mkdtemp(join(tmpdir(), "nihonest-cms-git-")));
    try {
      git(root, "init", "-q");
      git(root, "config", "user.email", "cms-test@example.invalid");
      git(root, "config", "user.name", "CMS test");
      git(root, "config", "core.autocrlf", "false");
      for (const name of ["dirty.ts", "clean.ts", "other.ts"]) await writeFile(join(root, name), `export const ${name.split(".")[0]} = 1;\n`);
      git(root, "add", ".");
      git(root, "commit", "-q", "-m", "fixture");
      await writeFile(join(root, "dirty.ts"), "export const dirty = 2;\n");

      const { identity } = await startGitSession(root);
      expect(identity.worktree).toBe(root);
      expect(identity.startCommit).toMatch(/^[a-f0-9]{40}$/);
      expect(identity.dirtyAtStart).toEqual(["dirty.ts"]);

      await expect(guardCmsWrite(root, join(root, "dirty.ts"))).rejects.toMatchObject({ status: 423 });
      await expect(guardCmsWrite(root, join(root, "clean.ts"))).resolves.toBeUndefined();
      await expect(guardCmsWrite(root, resolve(root, "..", "outside.ts"))).rejects.toMatchObject({ status: 403 });

      await writeFile(join(root, "clean.ts"), "export const clean = 2;\n");
      await noteCmsWrite(root, join(root, "clean.ts"));
      await writeFile(join(root, "other.ts"), "export const other = 2;\n");
      await writeFile(join(root, "new.json"), "{}\n");

      const report = await gitSessionReport(root);
      expect(report.cmsChanges).toEqual(["clean.ts"]);
      expect(report.preexistingChanges).toEqual(["dirty.ts"]);
      expect(report.otherChanges).toEqual(["new.json", "other.ts"]);

      const diff = await gitFileDiff(root, "clean.ts");
      expect(diff.diff).toContain("+export const clean = 2;");
      expect((await gitFileDiff(root, "new.json")).diff).toContain("New untracked file new.json");
      await expect(gitFileDiff(root, "unchanged.ts")).rejects.toMatchObject({ status: 404 });
      await expect(gitFileDiff(root, "../outside.ts")).rejects.toMatchObject({ status: 404 });
      expect(await readFile(join(root, "dirty.ts"), "utf8")).toBe("export const dirty = 2;\n");
    } finally {
      if (!root.startsWith(`${await realpath(tmpdir())}${sep}`) || !basename(root).startsWith("nihonest-cms-git-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(root, { recursive: true, force: true });
    }
  });
});
