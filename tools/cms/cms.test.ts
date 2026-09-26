// @vitest-environment node
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { basename, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readArticleCatalog } from "./catalog";
import { CmsEditError, previewArticleBody, saveArticleBody } from "./article-writer";
import { approveArticleReview, changeArticleStatus } from "./editorial-writer";
import { createCmsServer } from "./server";
import { auditEditorialState } from "@/domain/editorial/editorial-review";
import { loadEditorialTargets } from "@/lib/editorial/editorial-catalog";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";

const root = resolve(import.meta.dirname, "../..");

describe("local CMS foundation", () => {
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
      const structured = await fetch(`${base}/api/records`);
      expect(structured.status).toBe(200);
      const records = await structured.json();
      expect(records.records).toHaveLength(faqs.length + residenceStatuses.length + glossaryTerms.length);
      expect(records.failures).toEqual([]);
    });

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
    });
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
      expect(() => previewArticleBody("<script />")).toThrow(CmsEditError);
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
        expect((await response.json()).changed).toBe(true);
        expect(await readFile(resolve(fixtureRoot, relativePath), "utf8")).toContain("Another sentence.");
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
