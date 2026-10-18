// @vitest-environment node
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readArticleCatalog } from "./catalog";
import { CmsEditError, previewArticleBody, saveArticleBody } from "./article-writer";
import { createCheckRunner } from "./check-runs";
import { approveArticleReview, changeArticleStatus } from "./editorial-writer";
import { createCmsServer } from "./server";
import { auditEditorialState } from "@/domain/editorial/editorial-review";
import { loadEditorialTargets } from "@/lib/editorial/editorial-catalog";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";

const root = resolve(import.meta.dirname, "../..");

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("local CMS foundation", { timeout: 30_000 }, () => {
  it("reads canonical articles and reports translation currency without writing files", async () => {
    const catalog = await readArticleCatalog(root);
    expect(catalog.failures).toEqual([]);
    expect(catalog.articles.length).toBeGreaterThan(90);
    const article = catalog.details.get("understanding-japan-geography-government-and-language");
    expect(article?.metadata.status).toBe("needs-review");
    expect(article?.summary.path).toBe("content/articles/understanding-japan-geography-government-and-language.mdx");
    expect(article?.summary.translation).toMatch(/^(current|stale|missing)$/);
    expect(article?.sources.length).toBeGreaterThan(0);
    expect(article?.blocks.some((block) => block.kind === "heading")).toBe(true);
    expect(article?.blocks.some((block) => block.kind === "component" && block.component === "japan-region-map")).toBe(true);
  });

  describe("HTTP boundary", () => {
    const server = createCmsServer(root);
    let base: string;

    beforeAll(async () => {
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
      base = `http://127.0.0.1:${address.port}`;
    });

    afterAll(async () => {
      server.close();
      await once(server, "close");
    });

    it("serves read-only article data from the local host", async () => {
      const response = await fetch(`${base}/api/articles`);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.editableKinds).toEqual(["article-body", "article-status", "article-review", "faq-content", "faq-review", "residence-status-content", "residence-status-review", "glossary-term-content", "glossary-term-review"]);
      expect(body.articles.length).toBeGreaterThan(90);
      expect(response.headers.get("cache-control")).toBe("no-store");
      const chevron = await fetch(`${base}/select-chevron.svg`);
      expect(chevron.status).toBe(200);
      expect(chevron.headers.get("content-type")).toContain("image/svg+xml");
      expect(chevron.headers.get("content-security-policy")).toContain("img-src 'self'");
      expect(await chevron.text()).toContain('d="m6 8 4 4 4-4"');
      // The dark chevron and the pre-paint theme script are served from the CMS itself, as the policy requires.
      expect((await fetch(`${base}/select-chevron-dark.svg`)).status).toBe(200);
      const themeInit = await fetch(`${base}/theme-init.js`);
      expect(themeInit.headers.get("content-type")).toContain("text/javascript");
      expect(await themeInit.text()).toContain("nihonest-cms:theme");
      const structured = await fetch(`${base}/api/records`);
      expect(structured.status).toBe(200);
      const records = await structured.json();
      expect(records.records).toHaveLength(faqs.length + residenceStatuses.length + glossaryTerms.length);
      expect(records.failures).toEqual([]);
    });

    it("serves source impact and a plain-text translation handoff without write capability", async () => {
      const impactResponse = await fetch(`${base}/api/impact/sources`);
      expect(impactResponse.status).toBe(200);
      const impact = await impactResponse.json();
      const source = impact.sources.find((item: { id: string }) => item.id === "isa-artist-status");
      expect(source.dependents.some((item: { kind: string }) => item.kind === "article")).toBe(true);
      expect(impact.coverageNote).toContain("FAQs");

      const contentResponse = await fetch(`${base}/api/impact/content/article/visa-and-status-of-residence-explained`);
      expect(contentResponse.status).toBe(200);
      const content = await contentResponse.json();
      expect(content.coverage).toBe("complete");
      expect(content.sources.length).toBeGreaterThan(0);
      const faq = await (await fetch(`${base}/api/impact/content/faq/work-in-japan-without-japanese`)).json();
      expect(faq.coverage).toBe("unknown");
      expect(faq.note).toContain("FAQs");

      const handoffResponse = await fetch(`${base}/api/translation-handoff`);
      expect(handoffResponse.status).toBe(200);
      const handoff = await handoffResponse.json();
      expect(handoff.complete).toBe(true);
      expect(handoff.items.every((item: { state: string }) => item.state === "stale" || item.state === "missing")).toBe(true);
      const textResponse = await fetch(`${base}/api/translation-handoff.txt`);
      expect(textResponse.headers.get("content-type")).toContain("text/plain");
      expect(await textResponse.text()).toBe(handoff.exportText);
    }, 20_000);

    it("serves all remaining catalogs as inspect-only references", async () => {
      const response = await fetch(`${base}/api/reference`);
      expect(response.status).toBe(200);
      const { records } = await response.json();
      for (const kind of ["source", "journey", "article-group", "annotated-document"]) {
        const summary = records.find((item: { kind: string }) => item.kind === kind);
        expect(summary).toMatchObject({ kind, capability: "inspect-only" });
        const detailResponse = await fetch(`${base}/api/reference/${kind}/${summary.id}`);
        expect(detailResponse.status).toBe(200);
        const detail = await detailResponse.json();
        expect(detail).toMatchObject({ kind, id: summary.id, title: summary.title, capability: "inspect-only" });
        expect(detail.value.id).toBe(summary.id);
        expect(detail.registryPath).toMatch(/^src\/data\//);
        const write = await fetch(`${base}/api/reference/${kind}/${summary.id}`, { method: "PUT" });
        expect(write.status).toBe(405);
      }
      expect((await fetch(`${base}/api/reference/source/not-a-real-source`)).status).toBe(404);
      expect((await fetch(`${base}/api/reference/not-a-kind/example`)).status).toBe(404);
    });

    it("shows registered municipality guidance while guarding the English edit route", async () => {
      const response = await fetch(`${base}/api/local-guidance`);
      expect(response.status).toBe(200);
      const matrix = await response.json();
      expect(matrix.failures).toEqual([]);
      expect(matrix.guides).toHaveLength(7);
      const kyoto = matrix.locations.find((location: { id: string }) => location.id === "jp-26100");
      expect(kyoto.supplements).toHaveLength(7);
      const detailResponse = await fetch(`${base}/api/local-guidance/kyoto-household-waste`);
      expect(detailResponse.status).toBe(200);
      const detail = await detailResponse.json();
      expect(detail).toMatchObject({ locationId: "jp-26100", id: "kyoto-household-waste", translation: expect.stringMatching(/^(current|stale|missing)$/) });
      expect(detail.value.status).toBe("needs-review");
      expect(detail.source.path).toBe("src/data/local-guidance/locations/kyoto/kyoto.ts");
      const denied = await fetch(`${base}/api/local-guidance/kyoto-household-waste/content`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: { title: "Unauthorized" } }),
      });
      expect(denied.status).toBe(403);
      expect((await fetch(`${base}/api/local-guidance/unknown-supplement`)).status).toBe(404);
      expect((await fetch(`${base}/api/local-guidance/kyoto-household-waste/status`, { method: "PUT" })).status).toBe(405);
    }, 20_000);

    it("rejects foreign host headers and write requests", async () => {
      const foreignHostStatus = await new Promise<number>((resolveStatus, reject) => {
        const call = request(`${base}/api/articles`, { headers: { Host: "example.com" } }, (response) => {
          response.resume();
          resolveStatus(response.statusCode ?? 0);
        });
        call.on("error", reject);
        call.end();
      });
      expect(foreignHostStatus).toBe(403);
      const write = await fetch(`${base}/api/articles`, { method: "POST" });
      expect(write.status).toBe(405);
      const unauthorized = await fetch(`${base}/api/articles/understanding-japan-geography-government-and-language/body`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Origin: base },
        body: JSON.stringify({ expectedRevision: "0".repeat(64), body: "Changed", updatedAt: "2026-09-26" }),
      });
      expect(unauthorized.status).toBe(403);
      for (const [suffix, method] of [["status", "PUT"], ["review", "POST"]]) {
        const blocked = await fetch(`${base}/api/articles/understanding-japan-geography-government-and-language/${suffix}`, {
          method,
          headers: { "Content-Type": "application/json", Origin: "http://example.com", "X-CMS-Token": (await (await fetch(`${base}/api/session`)).json()).token },
          body: JSON.stringify({ expectedRevision: "0".repeat(64), status: "draft" }),
        });
        expect(blocked.status).toBe(403);
      }
      const session = await (await fetch(`${base}/api/session`)).json();
      const structuredWrite = await fetch(`${base}/api/records/faq/work-in-japan-without-japanese/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "http://example.com", "X-CMS-Token": session.token },
        body: JSON.stringify({ expectedRevision: "0".repeat(64), expectedSourceRevision: "0".repeat(64) }),
      });
      expect(structuredWrite.status).toBe(403);
      const structuredContentWrite = await fetch(`${base}/api/records/faq/work-in-japan-without-japanese/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Origin: "http://example.com", "X-CMS-Token": session.token },
        body: JSON.stringify({ expectedRevision: "0".repeat(64), expectedSourceRevision: "0".repeat(64), fields: { summary: "Changed" } }),
      });
      expect(structuredContentWrite.status).toBe(403);
    });

    it("exposes fixed checks and rejects unauthenticated or client-supplied commands", async () => {
      const catalog = await fetch(`${base}/api/checks`);
      expect(catalog.status).toBe(200);
      const report = await catalog.json();
      expect(report.definitions.map((item: { id: string }) => item.id)).toContain("production-build");
      expect(report.definitions.every((item: { command: string }) => typeof item.command === "string")).toBe(true);
      expect(report.definitions.find((item: { id: string }) => item.id === "cms-tests").scope).toBe("focused");
      const token = (await (await fetch(`${base}/api/session`)).json()).token;
      const options = (payload: unknown, origin = base) => ({
        method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "X-CMS-Token": token }, body: JSON.stringify(payload),
      });
      expect((await fetch(`${base}/api/checks/start`, options({ id: "cms-tests" }, "http://example.com"))).status).toBe(403);
      expect((await fetch(`${base}/api/checks/start`, options({ id: "cms-tests", command: "whoami" }))).status).toBe(400);
      expect((await fetch(`${base}/api/checks/start`, options({ id: "not-a-check" }))).status).toBe(400);
      expect((await fetch(`${base}/api/checks/cancel`, options({ command: "whoami" }))).status).toBe(400);
    });

    it("validates an unsaved preview with the local session capability", async () => {
      const session = await (await fetch(`${base}/api/session`)).json();
      const wrongOrigin = await fetch(`${base}/api/articles/understanding-japan-geography-government-and-language/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "http://example.com", "X-CMS-Token": session.token },
        body: JSON.stringify({ body: "## Preview heading" }),
      });
      expect(wrongOrigin.status).toBe(403);
      const response = await fetch(`${base}/api/articles/understanding-japan-geography-government-and-language/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": session.token },
        body: JSON.stringify({ body: "## Preview heading\n\n**Bold** text.\n" }),
      });
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.blocks[0]).toEqual({ kind: "heading", level: 2, text: "Preview heading" });
      const rejected = await fetch(`${base}/api/articles/understanding-japan-geography-government-and-language/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": session.token },
        body: JSON.stringify({ body: "Inline {value} expression." }),
      });
      expect(rejected.status).toBe(422);
      expect(await rejected.json()).toMatchObject({ error: expect.stringMatching(/line 1, column \d+/) });
    });
  });

  it("starts and cancels only a named check through the guarded HTTP route", async () => {
    let complete!: (result: { exitCode: number | null }) => void;
    let killed = false;
    const result = new Promise<{ exitCode: number | null }>((resolveResult) => { complete = resolveResult; });
    const runner = createCheckRunner(root, () => ({ result, kill: () => { killed = true; } }));
    const server = createCmsServer(root, runner);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
      const base = `http://127.0.0.1:${address.port}`;
      const token = (await (await fetch(`${base}/api/session`)).json()).token;
      const headers = { "Content-Type": "application/json", Origin: base, "X-CMS-Token": token };
      const started = await fetch(`${base}/api/checks/start`, { method: "POST", headers, body: JSON.stringify({ id: "cms-tests" }) });
      expect(started.status).toBe(200);
      expect((await started.json()).active).toMatchObject({ id: "cms-tests", status: "running" });
      const busy = await fetch(`${base}/api/checks/start`, { method: "POST", headers, body: JSON.stringify({ id: "typecheck" }) });
      expect(busy.status).toBe(409);
      const canceled = await fetch(`${base}/api/checks/cancel`, { method: "POST", headers, body: "{}" });
      expect(canceled.status).toBe(200);
      expect((await canceled.json()).active.cancelRequested).toBe(true);
      expect(killed).toBe(true);
      complete({ exitCode: null });
      await new Promise<void>((resolveDone) => setImmediate(resolveDone));
      expect((await (await fetch(`${base}/api/checks`)).json()).active.status).toBe("canceled");
    } finally {
      server.close();
      await once(server, "close");
    }
  });

  it("refuses local-guidance verification when a generated document has existing edits", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    const recheck = join(fixtureRoot, "docs", "LOCAL-GUIDANCE-RECHECK.md");
    try {
      await mkdir(join(fixtureRoot, "docs"));
      await writeFile(recheck, "Original recheck notes.\n");
      await writeFile(join(fixtureRoot, "docs", "LOCAL-GUIDANCE-COVERAGE-PLAN.md"), "Original coverage plan.\n");
      for (const args of [["init", "-q"], ["config", "user.email", "cms-test@example.invalid"], ["config", "user.name", "CMS test"],
        ["add", "."], ["commit", "-q", "-m", "fixture"]]) execFileSync("git", args, { cwd: fixtureRoot, stdio: "ignore" });
      await writeFile(recheck, "Another editor's recheck notes.\n");
      let launched = false;
      const runner = createCheckRunner(fixtureRoot, () => { launched = true; throw new Error("A dirty document must block this command."); });
      const server = createCmsServer(fixtureRoot, runner);
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      try {
        const address = server.address();
        if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
        const base = `http://127.0.0.1:${address.port}`;
        const token = (await (await fetch(`${base}/api/session`)).json()).token;
        const response = await fetch(`${base}/api/checks/start`, {
          method: "POST", headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": token },
          body: JSON.stringify({ id: "local-guidance-verify" }),
        });
        expect(response.status).toBe(423);
        expect(launched).toBe(false);
        expect(await readFile(recheck, "utf8")).toBe("Another editor's recheck notes.\n");
      } finally {
        server.close();
        await once(server, "close");
      }
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });

  it("saves one body in an isolated fixture and rejects stale or invalid edits", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    const articleId = "understanding-japan-geography-government-and-language";
    const relativePath = `content/articles/${articleId}.mdx`;
    try {
      await mkdir(join(fixtureRoot, "content/articles"), { recursive: true });
      const original = await readFile(resolve(root, relativePath), "utf8");
      await writeFile(resolve(fixtureRoot, relativePath), original);
      const detail = (await readArticleCatalog(fixtureRoot)).details.get(articleId)!;
      await expect(saveArticleBody(fixtureRoot, articleId, {
        expectedRevision: detail.summary.revision,
        body: "Invalid inline {value} expression.",
        updatedAt: detail.metadata.updatedAt,
      })).rejects.toMatchObject({ status: 422 });
      expect(await readFile(resolve(fixtureRoot, relativePath), "utf8")).toBe(original);
      const revisedBody = `${detail.body.trimEnd()}\n\nA CMS fixture sentence.\n`;
      const edit = { expectedRevision: detail.summary.revision, body: revisedBody, updatedAt: detail.metadata.updatedAt };
      const saved = await saveArticleBody(fixtureRoot, articleId, edit);
      expect(saved.changed).toBe(true);
      expect(saved.revision).not.toBe(edit.expectedRevision);
      const written = await readFile(resolve(fixtureRoot, relativePath), "utf8");
      expect(written).toContain("A CMS fixture sentence.");
      expect(written.slice(0, written.indexOf("};") + 2)).toBe(original.slice(0, original.indexOf("};") + 2));
      await expect(saveArticleBody(fixtureRoot, articleId, edit)).rejects.toMatchObject({ status: 409 });
      expect(await readFile(resolve(fixtureRoot, relativePath), "utf8")).toBe(written);
      await expect(previewArticleBody("<script />")).rejects.toBeInstanceOf(CmsEditError);
      // The server's Git session needs a checkout; commit the fixture so its article starts clean.
      for (const args of [["init", "-q"], ["config", "user.email", "cms-test@example.invalid"], ["config", "user.name", "CMS test"],
        ["config", "core.autocrlf", "false"], ["add", "."], ["commit", "-q", "-m", "fixture"]]) {
        execFileSync("git", args, { cwd: fixtureRoot, stdio: "ignore" });
      }
      const fixtureServer = createCmsServer(fixtureRoot);
      fixtureServer.listen(0, "127.0.0.1");
      await once(fixtureServer, "listening");
      try {
        const address = fixtureServer.address();
        if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
        const fixtureBase = `http://127.0.0.1:${address.port}`;
        const session = await (await fetch(`${fixtureBase}/api/session`)).json();
        const response = await fetch(`${fixtureBase}/api/articles/${articleId}/body`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Origin: fixtureBase, "X-CMS-Token": session.token },
          body: JSON.stringify({ expectedRevision: saved.revision, body: `${revisedBody}\nAnother sentence.\n`, updatedAt: detail.metadata.updatedAt }),
        });
        expect(response.status).toBe(200);
        const savedThroughServer = await response.json();
        expect(savedThroughServer.changed).toBe(true);
        expect(await readFile(resolve(fixtureRoot, relativePath), "utf8")).toContain("Another sentence.");
        // This fixture has no article registry, so regeneration fails; the article save still stands and reports it.
        expect(savedThroughServer.generatedMetadata).toMatchObject({ status: "failed" });
        const metadataState = await (await fetch(`${fixtureBase}/api/generated-metadata`)).json();
        expect(metadataState).toMatchObject({ status: "unavailable", lastFailure: savedThroughServer.generatedMetadata.message });
        const refreshPath = `${fixtureBase}/api/generated-metadata/refresh`;
        expect((await fetch(refreshPath, { method: "POST", headers: { "Content-Type": "application/json", Origin: fixtureBase }, body: "{}" })).status).toBe(403);
        expect((await fetch(refreshPath, { method: "POST", headers: { "Content-Type": "application/json", Origin: fixtureBase, "X-CMS-Token": session.token }, body: '{"path":"x"}' })).status).toBe(400);
        const repair = await fetch(refreshPath, { method: "POST", headers: { "Content-Type": "application/json", Origin: fixtureBase, "X-CMS-Token": session.token }, body: "{}" });
        expect(repair.status).toBe(200);
        expect((await repair.json()).refresh).toMatchObject({ status: "failed" });
      } finally {
        fixtureServer.close();
        await once(fixtureServer, "close");
      }
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });

  it("regenerates article metadata after every article write path", async () => {
    const server = await readFile(resolve(root, "tools/cms/server.ts"), "utf8");
    for (const call of ["createArticle(", "changeArticleStatus(", "approveArticleReview(", "saveArticleBody("]) {
      const uses = server.split(call).length - 1;
      const wrapped = server.split(`withArticleMetadata(${call}`).length - 1;
      // Imports never contain "name(", so every call site of an article writer must be wrapped.
      expect({ call, uses, wrapped }).toEqual({ call, uses: wrapped, wrapped: Math.max(1, wrapped) });
    }
  });

  it("reports metadata regeneration on article status and review requests", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    const id = "understanding-japan-geography-government-and-language";
    try {
      await mkdir(resolve(fixtureRoot, "content/articles"), { recursive: true });
      await writeFile(resolve(fixtureRoot, "content/articles", `${id}.mdx`), await readFile(resolve(root, "content/articles", `${id}.mdx`), "utf8"));
      for (const args of [["init", "-q"], ["config", "user.email", "cms-test@example.invalid"], ["config", "user.name", "CMS test"],
        ["config", "core.autocrlf", "false"], ["add", "."], ["commit", "-q", "-m", "fixture"]]) {
        execFileSync("git", args, { cwd: fixtureRoot, stdio: "ignore" });
      }
      // Related checks pass immediately here; the approval gate still requires a passed run for the exact revision.
      const relatedRunner = createCheckRunner(fixtureRoot, () => ({ result: Promise.resolve({ exitCode: 0 }), kill: () => undefined }));
      const fixtureServer = createCmsServer(fixtureRoot, relatedRunner);
      fixtureServer.listen(0, "127.0.0.1");
      await once(fixtureServer, "listening");
      try {
        const address = fixtureServer.address();
        if (!address || typeof address === "string") throw new Error("Expected an IPv4 listener.");
        const base = `http://127.0.0.1:${address.port}`;
        const { token } = await (await fetch(`${base}/api/session`)).json();
        const send = async (path: string, method: string, body: unknown) => (await fetch(`${base}${path}`, {
          method, headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": token }, body: JSON.stringify(body),
        })).json();
        let revision = (await readArticleCatalog(fixtureRoot)).details.get(id)!.summary.revision;
        for (const status of ["draft", "needs-review"]) {
          const changed = await send(`/api/articles/${id}/status`, "PUT", { expectedRevision: revision, status });
          expect(changed.generatedMetadata).toMatchObject({ status: "failed" });
          revision = changed.revision;
        }
        const approval = { reviewedAt: "2026-09-26", changeNote: "Checked the fixture.", approvalNote: "Approved for the test.",
          validationPerformed: ["Focused CMS test passed."], sourceReviewIds: [], explicitHumanApproval: true };
        const unchecked = await send(`/api/articles/${id}/review`, "POST", { expectedRevision: revision, ...approval });
        expect(unchecked.error).toMatch(/checks have not passed/);
        const badTarget = await fetch(`${base}/api/checks/start`, { method: "POST", headers: { "Content-Type": "application/json", Origin: base, "X-CMS-Token": token },
          body: JSON.stringify({ id: "related-faq", target: { kind: "article", id, revision } }) });
        expect(badTarget.status).toBe(400);
        await send("/api/checks/start", "POST", { id: "related-article", target: { kind: "article", id, revision } });
        await new Promise<void>((resolveDone) => setTimeout(resolveDone, 20));
        const approved = await send(`/api/articles/${id}/review`, "POST", {
          expectedRevision: revision, reviewedAt: "2026-09-26", changeNote: "Checked the fixture.", approvalNote: "Approved for the test.",
          validationPerformed: ["Focused CMS test passed."], sourceReviewIds: [], explicitHumanApproval: true,
        });
        expect(approved.approvalRecord).toMatch(/^content\/editorial-reviews\//);
        expect(approved.generatedMetadata).toMatchObject({ status: "failed" });
      } finally {
        fixtureServer.close();
        await once(fixtureServer, "close");
      }
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });

  it("changes article status and records an exact-revision human approval in an isolated fixture", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "nihonest-cms-test-"));
    const id = "understanding-japan-geography-government-and-language";
    const path = resolve(fixtureRoot, "content/articles", `${id}.mdx`);
    try {
      await mkdir(resolve(fixtureRoot, "content/articles"), { recursive: true });
      await writeFile(path, await readFile(resolve(root, "content/articles", `${id}.mdx`), "utf8"));
      const detail = (await readArticleCatalog(fixtureRoot)).details.get(id)!;
      const first = await changeArticleStatus(fixtureRoot, id, { expectedRevision: detail.summary.revision, status: "draft" });
      expect((await readArticleCatalog(fixtureRoot)).details.get(id)?.metadata.status).toBe("draft");
      await expect(changeArticleStatus(fixtureRoot, id, { expectedRevision: detail.summary.revision, status: "archived" }))
        .rejects.toMatchObject({ status: 409 });
      await expect(changeArticleStatus(fixtureRoot, id, { expectedRevision: first.revision, status: "verified" as "draft" }))
        .rejects.toMatchObject({ status: 422 });
      const second = await changeArticleStatus(fixtureRoot, id, { expectedRevision: first.revision, status: "needs-review" });
      const input = {
        expectedRevision: second.revision, reviewedAt: "2026-09-26",
        changeNote: "Checked the fixture article and its source references.",
        approvalNote: "I reviewed and approve this exact fixture revision.",
        validationPerformed: ["Focused CMS test passed."], sourceReviewIds: [], explicitHumanApproval: true as const,
      };
      await expect(approveArticleReview(fixtureRoot, id, { ...input, explicitHumanApproval: false as true }))
        .rejects.toMatchObject({ status: 422 });
      const approved = await approveArticleReview(fixtureRoot, id, input);
      const reviewed = (await readArticleCatalog(fixtureRoot)).details.get(id)!;
      expect(reviewed.metadata.status).toBe("verified");
      expect(reviewed.metadata.lastReviewedAt).toBe("2026-09-26");
      expect(reviewed.summary.revision).toBe(approved.revision);
      const record = JSON.parse(await readFile(resolve(fixtureRoot, approved.approvalRecord), "utf8"));
      expect(record.contentRevision).toBe(approved.approvalRevision);
      expect(record.explicitHumanApproval).toBe(true);
      const target = (await loadEditorialTargets(fixtureRoot)).find((item) => item.kind === "article" && item.id === id)!;
      expect(auditEditorialState([target], [record], "2026-09-26")).toEqual([]);
      await expect(approveArticleReview(fixtureRoot, id, input)).rejects.toMatchObject({ status: 409 });
      const reopened = await changeArticleStatus(fixtureRoot, id, { expectedRevision: approved.revision, status: "needs-review" });
      expect(reopened.revision).not.toBe(approved.revision);
      expect((await readArticleCatalog(fixtureRoot)).details.get(id)?.metadata.lastReviewedAt).toBeUndefined();
      expect(JSON.parse(await readFile(resolve(fixtureRoot, approved.approvalRecord), "utf8")).contentRevision).toBe(approved.approvalRevision);
    } finally {
      if (!resolve(fixtureRoot).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(fixtureRoot).startsWith("nihonest-cms-test-")) {
        throw new Error("Refusing to remove a fixture outside the temporary directory.");
      }
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});
