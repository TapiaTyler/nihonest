// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createRecoveryStore, type DraftInput } from "./recovery-store";

const roots: string[] = [];
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "nihonest-cms-recovery-"));
  roots.push(root);
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map(async (root) => {
    const absolute = resolve(root);
    const tempRoot = resolve(tmpdir());
    if (!absolute.startsWith(`${tempRoot}${sep}`) || !basename(absolute).startsWith("nihonest-cms-")) {
      throw new Error(`Refusing to remove unexpected recovery test path: ${absolute}`);
    }
    await rm(absolute, { recursive: true, force: true });
  }));
});

const articleDraft: DraftInput = {
  kind: "article", id: "sample-guide", expectedRecordRevision: "a".repeat(64),
  content: { body: "# Working copy\n", updatedAt: "2026-09-26" },
};

describe("CMS local recovery store", () => {
  it("persists drafts across store instances and lists only valid snapshots", async () => {
    const root = await fixture();
    const first = createRecoveryStore(root);
    const saved = await first.writeDraft(articleDraft);
    expect(saved.draftRevision).toMatch(/^[0-9a-f-]{36}$/);
    expect(saved.capturedAt).toBeTruthy();
    expect(saved.content.updatedAt).toBe("2026-09-26");

    await mkdir(join(root, ".cms", "drafts"), { recursive: true });
    await writeFile(join(root, ".cms", "drafts", ".draft-interrupted.tmp"), "partial snapshot");
    const restarted = createRecoveryStore(root);
    expect(await restarted.readDraft("article", "sample-guide")).toEqual(saved);
    expect(await restarted.listDrafts()).toEqual([saved]);
    expect(await readFile(join(root, ".cms", "drafts", ".draft-interrupted.tmp"), "utf8")).toBe("partial snapshot");
  });

  it("compare-and-deletes only the exact snapshot and never removes a newer autosave", async () => {
    const root = await fixture();
    const store = createRecoveryStore(root);
    const oldDraft = await store.writeDraft(articleDraft);
    const current = await store.writeDraft({ ...articleDraft, previousDraftRevision: oldDraft.draftRevision, content: { body: "Newer text" } });
    expect(current.draftRevision).not.toBe(oldDraft.draftRevision);
    expect(await store.deleteDraft(oldDraft)).toBe(false);
    expect(await store.readDraft("article", "sample-guide")).toEqual(current);
    expect(await store.deleteDraft(current)).toBe(true);
    expect(await store.readDraft("article", "sample-guide")).toBeNull();
  });

  it("serializes overlapping save and delete requests for the same snapshot", async () => {
    const root = await fixture();
    const store = createRecoveryStore(root);
    const original = await store.writeDraft(articleDraft);
    const newerPromise = store.writeDraft({ ...articleDraft, previousDraftRevision: original.draftRevision, content: { body: "new" } });
    const deletePromise = store.deleteDraft(original);
    const [newerResult, deleted] = await Promise.allSettled([newerPromise, deletePromise]);
    const current = await store.readDraft("article", "sample-guide");
    if (deleted.status === "fulfilled" && deleted.value) {
      expect(newerResult.status).toBe("rejected");
      expect(current).toBeNull();
    } else {
      expect(newerResult.status).toBe("fulfilled");
      expect(current).toEqual(newerResult.status === "fulfilled" ? newerResult.value : null);
    }
  });

  it("keeps activity append-only, metadata-only, and bounded on read", async () => {
    const root = await fixture();
    const store = createRecoveryStore(root);
    for (let index = 0; index < 5; index += 1) {
      await store.appendActivity({ kind: "article-body", outcome: "succeeded", recordKind: "article", recordId: "sample-guide", revision: String(index).padStart(64, "0") });
    }
    expect(await store.readActivity(2)).toHaveLength(2);
    expect(await store.readActivity(2)).toEqual(await createRecoveryStore(root).readActivity(2));
    const log = await readFile(join(root, ".cms", "activity.jsonl"), "utf8");
    expect(log.split("\n").filter(Boolean)).toHaveLength(5);
    expect(log).not.toContain("Working copy");
    await expect(store.appendActivity({ kind: "draft", outcome: "succeeded", ...( { content: "SECRET" } as object ) } as never)).rejects.toThrow();
    expect(await store.readActivity(1)).toHaveLength(1);
    await expect(store.readActivity(1001)).rejects.toThrow(/limit/);
  });

  it("ignores a partial trailing JSONL line left by an interrupted append", async () => {
    const root = await fixture();
    const store = createRecoveryStore(root);
    await store.appendActivity({ kind: "session", outcome: "started" });
    await writeFile(join(root, ".cms", "activity.jsonl"), `${JSON.stringify({ kind: "session", outcome: "started", occurredAt: "2026-09-26T00:00:00.000Z" })}\n{"kind":"article-body"`);
    expect(await store.readActivity()).toHaveLength(1);
    await store.appendActivity({ kind: "session", outcome: "succeeded" });
    const recovered = await store.readActivity();
    expect(recovered).toHaveLength(2);
    expect(recovered.at(-1)?.outcome).toBe("succeeded");
    const lines = (await readFile(join(root, ".cms", "activity.jsonl"), "utf8")).split("\n");
    expect(lines).toHaveLength(4);
    expect(lines[1]).toBe('{"kind":"article-body"');
  });

  it("rejects invalid kinds, IDs, revisions, oversized content, and unexpected fields", async () => {
    const store = createRecoveryStore(await fixture());
    await expect(store.writeDraft({ ...articleDraft, id: "../outside" })).rejects.toThrow();
    await expect(store.writeDraft({ ...articleDraft, expectedRecordRevision: "bad" })).rejects.toThrow();
    await expect(store.writeDraft({ ...articleDraft, kind: "unknown" as never })).rejects.toThrow();
    await expect(store.writeDraft({ ...articleDraft, content: { body: "x".repeat(1537 * 1024) } })).rejects.toThrow(/size limit/);
    await expect(store.writeDraft({ ...articleDraft, extra: "secret" } as never)).rejects.toThrow(/Unexpected/);
  });

  it("rejects a .cms symlink that escapes the worktree", async () => {
    const root = await fixture();
    const outside = await mkdtemp(join(tmpdir(), "nihonest-cms-outside-"));
    roots.push(outside);
    await symlink(outside, join(root, ".cms"), "junction");
    await expect(createRecoveryStore(root).readActivity()).rejects.toThrow(/real directory|escapes/);
  });

  it("does not create a drafts directory through an escaping .cms symlink", async () => {
    const root = await fixture();
    const outsideParent = await mkdtemp(join(tmpdir(), "nihonest-cms-outside-"));
    roots.push(outsideParent);
    const outsideTarget = join(outsideParent, "must-not-be-created");
    await symlink(outsideTarget, join(root, ".cms"), "junction");
    await expect(createRecoveryStore(root).writeDraft(articleDraft)).rejects.toThrow();
    await expect(stat(join(outsideTarget, "drafts"))).rejects.toMatchObject({ code: "ENOENT" });
  });
});
