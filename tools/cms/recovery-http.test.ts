// @vitest-environment node
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { readArticleCatalog } from "./catalog";
import { createCmsServer } from "./server";
import { readStructuredCatalog } from "./structured-catalog";

const projectRoot = resolve(import.meta.dirname, "../..");
const articleId = "artist-status";
const articlePath = `content/articles/${articleId}.mdx`;

/** Runs a fixture Git command; a failure reports Git's output (for example "nothing to commit"), not just the command. */
function git(root: string, ...args: string[]) {
  try {
    execFileSync("git", args, { cwd: root, stdio: "pipe", encoding: "utf8" });
  }
  catch (error) {
    const { stdout = "", stderr = "" } = error as { stdout?: string; stderr?: string };
    throw new Error(`git ${args.join(" ")} failed:
${`${stderr}${stdout}`.trim()}`, { cause: error });
  }
}

async function start(root: string) {
  const server = createCmsServer(root);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected local IPv4 listener.");
  const base = `http://127.0.0.1:${address.port}`;
  const token = (await (await fetch(`${base}/api/session`)).json()).token as string;
  return { base, token, close: async () => { server.close(); await once(server, "close"); } };
}

function options(base: string, token: string, method: string, body: unknown) {
  return { method, headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": token }, body: JSON.stringify(body) };
}

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("CMS HTTP recovery", { timeout: 30_000 }, () => {
  it("captures only editable structured fields in a temporary Git checkout", async () => {
    const root = await mkdtemp(join(tmpdir(), "nihonest-cms-recovery-"));
    try {
      const originalRecord = [...(await readStructuredCatalog(projectRoot)).records.values()].find((item) => item.kind === "faq" && item.editableFields.includes("summary"))!;
      const sourcePath = resolve(root, originalRecord.source.path);
      await mkdir(resolve(sourcePath, ".."), { recursive: true });
      const original = await readFile(resolve(projectRoot, originalRecord.source.path), "utf8");
      await writeFile(sourcePath, original);
      await writeFile(resolve(root, ".gitignore"), ".cms/\n");
      git(root, "init", "-q");
      git(root, "config", "user.email", "cms-test@example.invalid");
      git(root, "config", "user.name", "CMS test");
      git(root, "add", ".");
      git(root, "commit", "-q", "-m", "fixture");
      const record = (await readStructuredCatalog(root)).records.get(`faq:${originalRecord.id}`)!;
      const server = await start(root);
      try {
        const route = `${server.base}/api/recovery/drafts/faq/${record.id}`;
        const payload = { expectedRecordRevision: record.revision, expectedSourceRevision: record.source.sourceRevision,
          content: { fields: { summary: "Unfinished English summary." }, updatedAt: record.updatedAt } };
        const invalid = await fetch(route, options(server.base, server.token, "PUT", {
          ...payload, content: { fields: { sourceIds: ["unapproved-source"] } },
        }));
        expect(invalid.status).toBe(422);
        const response = await fetch(route, options(server.base, server.token, "PUT", payload));
        expect(response.status).toBe(200);
        expect((await response.json()).content.fields).toEqual({ summary: "Unfinished English summary." });
        expect(await readFile(sourcePath, "utf8")).toBe(original);
      } finally { await server.close(); }
    } finally {
      if (!resolve(root).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(root).startsWith("nihonest-cms-recovery-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
    }
  });

  it("retains a draft through failed save and restart, then compares it with newer canonical content", async () => {
    const root = await mkdtemp(join(tmpdir(), "nihonest-cms-recovery-"));
    try {
      await mkdir(resolve(root, "content/articles"), { recursive: true });
      await writeFile(resolve(root, ".gitignore"), ".cms/\n");
      const original = await readFile(resolve(projectRoot, articlePath), "utf8");
      await writeFile(resolve(root, articlePath), original);
      git(root, "init", "-q");
      git(root, "config", "user.email", "cms-test@example.invalid");
      git(root, "config", "user.name", "CMS test");
      git(root, "config", "core.autocrlf", "false");
      git(root, "add", ".");
      git(root, "commit", "-q", "-m", "fixture");
      const initial = (await readArticleCatalog(root)).details.get(articleId)!;
      const changedBody = `${initial.body.trimEnd()}\n\nRecoverable fixture text.\n`;
      const first = await start(root);
      let draftRevision!: string;
      try {
        expect((await fetch(`${first.base}/api/recovery/drafts/${articleId}`)).status).toBe(404);
        const unauthorized = await fetch(`${first.base}/api/recovery/drafts/article/${articleId}`, {
          method: "PUT", headers: { "Content-Type": "application/json", Origin: "http://example.com", "X-CMS-Token": first.token },
          body: JSON.stringify({ expectedRecordRevision: initial.summary.revision, content: { body: changedBody, updatedAt: initial.metadata.updatedAt } }),
        });
        expect(unauthorized.status).toBe(403);
        const saved = await fetch(`${first.base}/api/recovery/drafts/article/${articleId}`, options(first.base, first.token, "PUT", {
          expectedRecordRevision: initial.summary.revision, content: { body: changedBody, updatedAt: initial.metadata.updatedAt },
        }));
        expect(saved.status).toBe(200);
        const snapshot = await saved.json();
        draftRevision = snapshot.draftRevision;
        expect(snapshot.content.body).toBe(changedBody);
        const competing = await fetch(`${first.base}/api/recovery/drafts/article/${articleId}`, options(first.base, first.token, "PUT", {
          expectedRecordRevision: initial.summary.revision, content: { body: "Competing unsaved edit", updatedAt: initial.metadata.updatedAt },
        }));
        expect(competing.status).toBe(409);
        expect((await (await fetch(`${first.base}/api/recovery/drafts/article/${articleId}`)).json()).draftRevision).toBe(draftRevision);
        // Simulate a process stopping after an atomic writer created its temporary file but before rename.
        await writeFile(resolve(root, ".cms", `${articleId}-interrupted.tmp`), "partial canonical replacement");
        expect(await readFile(resolve(root, articlePath), "utf8")).toBe(original);
        const invalidSave = await fetch(`${first.base}/api/articles/${articleId}/body`, options(first.base, first.token, "PUT", {
          expectedRevision: initial.summary.revision, body: "<script />", updatedAt: initial.metadata.updatedAt,
        }));
        expect(invalidSave.status).toBe(422);
        expect((await (await fetch(`${first.base}/api/recovery/drafts/article/${articleId}`)).json()).draftRevision).toBe(draftRevision);
        expect(await readFile(resolve(root, articlePath), "utf8")).toBe(original);
      } finally { await first.close(); }

      const externallyChanged = original.replace(initial.body, `${initial.body.trimEnd()}\n\nExternal fixture change.\n`);
      await writeFile(resolve(root, articlePath), externallyChanged);
      git(root, "add", articlePath);
      git(root, "commit", "-q", "-m", "external change");
      const second = await start(root);
      try {
        const recovered = await (await fetch(`${second.base}/api/recovery/drafts/article/${articleId}`)).json();
        const current = await (await fetch(`${second.base}/api/articles/${articleId}`)).json();
        expect(recovered.content.body).toBe(changedBody);
        expect(recovered.expectedRecordRevision).not.toBe(current.summary.revision);
        expect(current.body).toContain("External fixture change.");
        expect(await readFile(resolve(root, ".cms", `${articleId}-interrupted.tmp`), "utf8")).toBe("partial canonical replacement");
        const staleSave = await fetch(`${second.base}/api/articles/${articleId}/body`, options(second.base, second.token, "PUT", {
          expectedRevision: recovered.expectedRecordRevision, body: recovered.content.body, updatedAt: initial.metadata.updatedAt,
        }));
        expect(staleSave.status).toBe(409);
        expect(await readFile(resolve(root, articlePath), "utf8")).toBe(externallyChanged);
        const wrongDelete = await fetch(`${second.base}/api/recovery/drafts/article/${articleId}`, options(second.base, second.token, "DELETE", { draftRevision: "00000000-0000-4000-8000-000000000000" }));
        expect((await wrongDelete.json()).deleted).toBe(false);
        expect((await (await fetch(`${second.base}/api/recovery/drafts/article/${articleId}`)).json()).draftRevision).toBe(draftRevision);
        const events = (await (await fetch(`${second.base}/api/activity`)).json()).events as Array<{ kind: string; outcome: string }>;
        expect(events.some((event) => event.kind === "article-body" && event.outcome === "conflict")).toBe(true);
        expect(JSON.stringify(events)).not.toContain("Recoverable fixture text");
        const checkStart = await fetch(`${second.base}/api/checks/start`, options(second.base, second.token, "POST", { id: "cms-tests" }));
        expect(checkStart.status).toBe(200);
        let checkEvents: Array<{ kind: string; outcome: string; checkId?: string }> = [];
        for (let attempt = 0; attempt < 40; attempt += 1) {
          checkEvents = (await (await fetch(`${second.base}/api/activity`)).json()).events;
          if (checkEvents.some((event) => event.kind === "check-finish")) break;
          await new Promise((resolveWait) => setTimeout(resolveWait, 50));
        }
        expect(checkEvents.some((event) => event.kind === "check-start" && event.checkId === "cms-tests")).toBe(true);
        expect(checkEvents.some((event) => event.kind === "check-finish" && event.checkId === "cms-tests" && event.outcome === "failed")).toBe(true);
        const deleted = await fetch(`${second.base}/api/recovery/drafts/article/${articleId}`, options(second.base, second.token, "DELETE", { draftRevision }));
        expect((await deleted.json()).deleted).toBe(true);
        expect(await (await fetch(`${second.base}/api/recovery/drafts/article/${articleId}`)).json()).toBeNull();
      } finally { await second.close(); }
    } finally {
      if (!resolve(root).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(root).startsWith("nihonest-cms-recovery-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
    }
  });
});
