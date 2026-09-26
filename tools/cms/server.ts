/** Local-only CMS HTTP boundary. Writes require an origin check and process-scoped session capability. */
import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { readArticleCatalog } from "./catalog";
import { CmsEditError, previewArticleBody, saveArticleBody, type BodyEdit } from "./article-writer";
import { approveArticleReview, changeArticleStatus, type ReviewApproval, type StatusChange } from "./editorial-writer";
import { readStructuredCatalog, type StructuredKind } from "./structured-catalog";
import { approveStructuredReview, changeStructuredStatus, saveStructuredContent } from "./structured-writer";

const execFileAsync = promisify(execFile);
const assets = new Map<string, readonly [string, string]>([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/app.css", ["app.css", "text/css; charset=utf-8"]],
] as const);

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function setSecurityHeaders(response: ServerResponse): void {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  if (!request.headers["content-type"]?.startsWith("application/json")) {
    throw new CmsEditError("Expected JSON content.", 415);
  }
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > 1_200_000) throw new CmsEditError("Request is too large.", 413);
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new CmsEditError("Invalid JSON body.", 400);
  }
}

export function createCmsServer(projectRoot: string) {
  const root = resolve(projectRoot);
  const staticDirectory = resolve(import.meta.dirname, "static");
  const sessionToken = randomBytes(32).toString("hex");
  return createServer(async (request: IncomingMessage, response: ServerResponse) => {
    setSecurityHeaders(response);
    const port = (request.socket.address() as { port: number }).port;
    if (request.headers.host !== `127.0.0.1:${port}`) {
      sendJson(response, 403, { error: "Invalid local host." });
      return;
    }
    const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;
    const origin = `http://127.0.0.1:${port}`;
    try {
      if (request.method === "GET" && pathname === "/api/session") {
        sendJson(response, 200, { token: sessionToken, editableKinds: ["article-body", "article-status", "article-review", "faq-content", "faq-review", "residence-status-content", "residence-status-review", "glossary-term-content", "glossary-term-review"] });
        return;
      }
      const previewMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/preview$/.exec(pathname);
      const saveMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/body$/.exec(pathname);
      const statusMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/status$/.exec(pathname);
      const reviewMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/review$/.exec(pathname);
      const structuredStatusMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/status$/.exec(pathname);
      const structuredReviewMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/review$/.exec(pathname);
      const structuredContentMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/content$/.exec(pathname);
      if ((request.method === "POST" && (previewMatch || reviewMatch)) || (request.method === "PUT" && (saveMatch || statusMatch))) {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object") throw new CmsEditError("Invalid edit request.", 400);
        if (previewMatch) {
          sendJson(response, 200, { blocks: previewArticleBody((payload as { body?: unknown }).body) });
        } else if (statusMatch) {
          const edit = payload as StatusChange;
          if (typeof edit.expectedRevision !== "string" || typeof edit.status !== "string") throw new CmsEditError("Expected revision and status.", 400);
          sendJson(response, 200, await changeArticleStatus(root, statusMatch[1]!, edit));
        } else if (reviewMatch) {
          const approval = payload as ReviewApproval;
          if (typeof approval.expectedRevision !== "string") throw new CmsEditError("Expected article revision.", 400);
          sendJson(response, 200, await approveArticleReview(root, reviewMatch[1]!, approval));
        } else {
          const edit = payload as BodyEdit;
          if (typeof edit.expectedRevision !== "string" || typeof edit.body !== "string" || typeof edit.updatedAt !== "string") {
            throw new CmsEditError("Expected revision, body, and update date.", 400);
          }
          sendJson(response, 200, await saveArticleBody(root, saveMatch![1]!, edit));
        }
        return;
      }
      if ((request.method === "PUT" && (structuredStatusMatch || structuredContentMatch)) || (request.method === "POST" && structuredReviewMatch)) {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object") throw new CmsEditError("Invalid edit request.", 400);
        const edit = payload as { expectedRevision?: unknown; expectedSourceRevision?: unknown; status?: unknown };
        if (typeof edit.expectedRevision !== "string" || typeof edit.expectedSourceRevision !== "string") {
          throw new CmsEditError("Expected record and source revisions.", 400);
        }
        if (structuredStatusMatch) {
          if (typeof edit.status !== "string") throw new CmsEditError("Expected editorial status.", 400);
          sendJson(response, 200, await changeStructuredStatus(root, structuredStatusMatch[1] as StructuredKind, structuredStatusMatch[2]!, payload as Parameters<typeof changeStructuredStatus>[3]));
        } else if (structuredContentMatch) {
          sendJson(response, 200, await saveStructuredContent(root, structuredContentMatch[1] as StructuredKind, structuredContentMatch[2]!, payload as Parameters<typeof saveStructuredContent>[3]));
        } else {
          sendJson(response, 200, await approveStructuredReview(root, structuredReviewMatch![1] as StructuredKind, structuredReviewMatch![2]!, payload as Parameters<typeof approveStructuredReview>[3]));
        }
        return;
      }
      if (request.method !== "GET") {
        sendJson(response, 405, { error: "Method not allowed." });
        return;
      }
      if (pathname === "/api/articles") {
        const { articles, failures } = await readArticleCatalog(root);
        sendJson(response, 200, { articles, failures, editableKinds: ["article-body", "article-status", "article-review", "faq-content", "faq-review", "residence-status-content", "residence-status-review", "glossary-term-content", "glossary-term-review"] });
        return;
      }
      if (pathname === "/api/records") {
        const catalog = await readStructuredCatalog(root);
        sendJson(response, 200, { records: catalog.summaries, failures: catalog.failures });
        return;
      }
      const recordMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (recordMatch) {
        const catalog = await readStructuredCatalog(root);
        const record = catalog.records.get(`${recordMatch[1]}:${recordMatch[2]}`);
        sendJson(response, record ? 200 : 404, record ?? { error: "Record not found." });
        return;
      }
      const articleMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (articleMatch) {
        const { details } = await readArticleCatalog(root);
        const detail = details.get(articleMatch[1]!);
        sendJson(response, detail ? 200 : 404, detail ?? { error: "Article not found." });
        return;
      }
      if (pathname === "/api/git") {
        const { stdout } = await execFileAsync("git", ["status", "--short", "--branch"], { cwd: root, timeout: 5000 });
        sendJson(response, 200, { status: stdout.trimEnd() });
        return;
      }
      const asset = assets.get(pathname);
      if (asset) {
        const [filename, contentType] = asset;
        const body = await readFile(join(staticDirectory, filename));
        response.writeHead(200, { "Content-Type": contentType });
        response.end(body);
        return;
      }
      sendJson(response, 404, { error: "Not found." });
    } catch (error) {
      if (error instanceof CmsEditError) {
        sendJson(response, error.status, { error: error.message });
        return;
      }
      console.error("CMS request failed:", error);
      sendJson(response, 500, { error: "The local CMS could not load this view. Check the terminal for details." });
    }
  });
}
