/** Local-only CMS HTTP boundary. Writes require an origin check and process-scoped session capability. */
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { join, resolve } from "node:path";
import { readArticleCatalog } from "./catalog";
import { CmsEditError, previewArticleBody, saveArticleBody, type BodyEdit } from "./article-writer";
import { CheckRunError, createCheckRunner } from "./check-runs";
import { approveArticleReview, changeArticleStatus, type ReviewApproval, type StatusChange } from "./editorial-writer";
import { gitFileDiff, gitSessionReport, guardCmsWrite, startGitSession } from "./git-session";
import { readStructuredCatalog, type StructuredKind } from "./structured-catalog";
import { approveStructuredReview, changeStructuredStatus, saveStructuredContent } from "./structured-writer";
import { loadCmsSourceImpactCatalog } from "./source-impact";
import { readTranslationHandoff } from "./translation-handoff";
import { createRecoveryStore, RecoveryDraftConflictError, type RecoveryRecordKind } from "./recovery-store";
import { readReferenceCatalog, type ReferenceKind } from "./reference-catalog";
import { readLocalGuidanceCatalog } from "./local-guidance-catalog";
import { saveLocalGuidanceContent } from "./local-guidance-writer";
import { createRecord, creationOptions, planRecordCreation, type CreatableKind } from "./record-creator";
import { articleCreationOptions, createArticle, planArticleCreation } from "./article-creator";

const assets = new Map<string, readonly [string, string]>([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/formatted-article.js", ["formatted-article.js", "text/javascript; charset=utf-8"]],
  ["/app.css", ["app.css", "text/css; charset=utf-8"]],
  ["/select-chevron.svg", ["select-chevron.svg", "image/svg+xml"]],
] as const);

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function setSecurityHeaders(response: ServerResponse): void {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
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

export function createCmsServer(projectRoot: string, checkRunner?: ReturnType<typeof createCheckRunner>) {
  const root = resolve(projectRoot);
  const staticDirectory = resolve(import.meta.dirname, "static");
  const sessionToken = randomBytes(32).toString("hex");
  const recovery = createRecoveryStore(root);
  const referenceCatalog = readReferenceCatalog();
  const checks = checkRunner ?? createCheckRunner(root, undefined, {
    onFinish: (run) => recordOperation("check-finish", run.status === "passed" ? "succeeded" : run.status === "canceled" ? "canceled" : run.status === "warning" ? "warning" : "failed", undefined, undefined, run.id),
  });
  async function recordOperation(kind: Parameters<typeof recovery.appendActivity>[0]["kind"], outcome: Parameters<typeof recovery.appendActivity>[0]["outcome"], recordKind?: RecoveryRecordKind, recordId?: string, checkId?: string) {
    try { await recovery.appendActivity({ kind, outcome, ...(recordKind ? { recordKind } : {}), ...(recordId ? { recordId } : {}), ...(checkId ? { checkId } : {}) }); }
    catch (error) { console.error("CMS activity log could not be updated:", error); }
  }
  async function tracked<T>(kind: Parameters<typeof recovery.appendActivity>[0]["kind"], recordKind: RecoveryRecordKind, recordId: string, action: () => Promise<T>): Promise<T> {
    try {
      const result = await action();
      await recordOperation(kind, "succeeded", recordKind, recordId);
      return result;
    } catch (error) {
      await recordOperation(kind, error instanceof CmsEditError && error.status === 409 || error instanceof RecoveryDraftConflictError ? "conflict" : "failed", recordKind, recordId);
      throw error;
    }
  }
  // Snapshot the checkout before any request can write, so pre-existing changes stay separate from CMS edits.
  const gitSession = startGitSession(root);
  gitSession.catch((error: unknown) => console.error("CMS could not read the Git checkout:", error));
  void gitSession.then(() => recordOperation("session", "started")).catch(() => undefined);
  const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    setSecurityHeaders(response);
    const port = (request.socket.address() as { port: number }).port;
    if (request.headers.host !== `127.0.0.1:${port}`) {
      sendJson(response, 403, { error: "Invalid local host." });
      return;
    }
    const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;
    const origin = `http://127.0.0.1:${port}`;
    try {
      if (request.method === "GET" && pathname === "/api/checks") {
        sendJson(response, 200, checks.report());
        return;
      }
      if (request.method === "GET" && pathname === "/api/activity") {
        sendJson(response, 200, { events: await recovery.readActivity() });
        return;
      }
      if (request.method === "GET" && pathname === "/api/recovery/drafts") {
        sendJson(response, 200, await recovery.listDrafts());
        return;
      }
      const draftMatch = /^\/api\/recovery\/drafts\/(article|faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (draftMatch && request.method === "GET") {
        sendJson(response, 200, await recovery.readDraft(draftMatch[1] as "article" | StructuredKind, draftMatch[2]!));
        return;
      }
      if (draftMatch && (request.method === "PUT" || request.method === "DELETE")) {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const kind = draftMatch[1] as "article" | StructuredKind;
        const id = draftMatch[2]!;
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new CmsEditError("Invalid recovery request.", 400);
        if (request.method === "DELETE") {
          if (Object.keys(payload).length !== 1 || typeof (payload as { draftRevision?: unknown }).draftRevision !== "string"
            || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test((payload as { draftRevision: string }).draftRevision)) {
            throw new CmsEditError("Choose the exact recovery draft to discard.", 400);
          }
          const deleted = await recovery.deleteDraft({ kind, id, draftRevision: (payload as { draftRevision: string }).draftRevision });
          await recordOperation("draft", deleted ? "succeeded" : "conflict", kind, id);
          sendJson(response, 200, { deleted });
          return;
        }
        const input = payload as { expectedRecordRevision?: unknown; expectedSourceRevision?: unknown; previousDraftRevision?: unknown; content?: unknown };
        if (typeof input.expectedRecordRevision !== "string" || !/^[a-f0-9]{64}$/.test(input.expectedRecordRevision)
          || input.previousDraftRevision !== undefined && (typeof input.previousDraftRevision !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.previousDraftRevision))
          || !input.content || typeof input.content !== "object" || Array.isArray(input.content)) {
          throw new CmsEditError("Recovery draft needs a valid base revision and content.", 400);
        }
        if (kind === "article") {
          const record = (await readArticleCatalog(root)).details.get(id);
          if (!record) throw new CmsEditError("Article not found.", 404);
          const content = input.content as { body?: unknown; updatedAt?: unknown };
          if (input.expectedSourceRevision !== undefined || Object.keys(content).some((key) => !["body", "updatedAt"].includes(key))
            || typeof content.body !== "string" || Buffer.byteLength(content.body, "utf8") > 1_000_000
            || typeof content.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(content.updatedAt)) {
            throw new CmsEditError("Invalid article recovery content.", 422);
          }
        } else {
          const record = (await readStructuredCatalog(root)).records.get(`${kind}:${id}`);
          if (!record) throw new CmsEditError("Record not found.", 404);
          const content = input.content as { fields?: unknown; updatedAt?: unknown };
          if (typeof input.expectedSourceRevision !== "string" || !/^[a-f0-9]{64}$/.test(input.expectedSourceRevision)
            || Object.keys(content).some((key) => !["fields", "updatedAt"].includes(key))
            || !content.fields || typeof content.fields !== "object" || Array.isArray(content.fields)) {
            throw new CmsEditError("Invalid structured recovery content.", 422);
          }
          const fields = content.fields as Record<string, unknown>;
          if (!Object.keys(fields).length || Object.entries(fields).some(([key, value]) => !record.editableFields.includes(key)
            || !(typeof value === "string" || Array.isArray(value) && value.every((item) => typeof item === "string")))) {
            throw new CmsEditError("Recovery fields must be editable English fields for this record.", 422);
          }
          if (content.updatedAt !== undefined && (kind !== "faq" || typeof content.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(content.updatedAt))) {
            throw new CmsEditError("Invalid recovery update date.", 422);
          }
        }
        const draft = await tracked("draft", kind, id, () => recovery.writeDraft({ kind, id, expectedRecordRevision: input.expectedRecordRevision as string,
          ...(kind === "article" ? {} : { expectedSourceRevision: input.expectedSourceRevision as string }),
          ...(input.previousDraftRevision ? { previousDraftRevision: input.previousDraftRevision as string } : {}),
          content: input.content as { body: string; updatedAt: string } }));
        sendJson(response, 200, draft);
        return;
      }
      if (request.method === "POST" && (pathname === "/api/checks/start" || pathname === "/api/checks/cancel")) {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new CmsEditError("Invalid check request.", 400);
        const fields = Object.keys(payload);
        if (pathname === "/api/checks/start") {
          if (fields.length !== 1 || fields[0] !== "id" || typeof (payload as { id?: unknown }).id !== "string") {
            throw new CmsEditError("Choose one named check; commands and arguments cannot be supplied.", 400);
          }
          const id = (payload as { id: string }).id;
          if (id === "local-guidance-verify") {
            const generated = ["docs/LOCAL-GUIDANCE-RECHECK.md", "docs/LOCAL-GUIDANCE-COVERAGE-PLAN.md"];
            for (const path of generated) await guardCmsWrite(root, resolve(root, path));
            const current = await gitSessionReport(root);
            const changed = [...current.cmsChanges, ...current.preexistingChanges, ...current.otherChanges];
            if (generated.some((path) => changed.includes(path))) {
              throw new CmsEditError("Local-guidance verification rewrites generated documents. Commit or set aside changes to its coverage and recheck documents, then restart the CMS before running it.", 423);
            }
          }
          sendJson(response, 200, checks.start(id));
          await recordOperation("check-start", "started", undefined, undefined, id);
        } else {
          if (fields.length !== 0) throw new CmsEditError("Cancellation takes no command or arguments.", 400);
          sendJson(response, 200, checks.cancel());
          await recordOperation("check-cancel", "canceled", undefined, undefined, checks.report().active?.id);
        }
        return;
      }
      if (request.method === "GET" && pathname === "/api/session") {
        sendJson(response, 200, { token: sessionToken, editableKinds: ["article-body", "article-status", "article-review", "faq-content", "faq-review", "residence-status-content", "residence-status-review", "glossary-term-content", "glossary-term-review", "local-guidance-content"] });
        return;
      }
      const previewMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/preview$/.exec(pathname);
      const saveMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/body$/.exec(pathname);
      const statusMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/status$/.exec(pathname);
      const reviewMatch = /^\/api\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\/review$/.exec(pathname);
      const structuredStatusMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/status$/.exec(pathname);
      const structuredReviewMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/review$/.exec(pathname);
      const structuredContentMatch = /^\/api\/records\/(faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/content$/.exec(pathname);
      const localGuidanceContentMatch = /^\/api\/local-guidance\/([a-z0-9]+(?:-[a-z0-9]+)*)\/content$/.exec(pathname);
      const createMatch = /^\/api\/create\/(article|faq|glossary-term|source)(\/preview)?$/.exec(pathname);
      if (createMatch && request.method === "POST") {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)
          || Object.keys(payload).some((field) => !["fields", "expectedSourceRevision"].includes(field))) {
          throw new CmsEditError("Expected the new record's fields and, to create it, the previewed source revision.", 400);
        }
        const kind = createMatch[1] as CreatableKind | "article";
        const { fields, expectedSourceRevision } = payload as { fields?: unknown; expectedSourceRevision?: unknown };
        if (createMatch[2]) {
          sendJson(response, 200, kind === "article" ? await planArticleCreation(root, fields) : await planRecordCreation(root, kind, fields));
          return;
        }
        const id = fields && typeof fields === "object" && typeof (fields as { id?: unknown }).id === "string"
          && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test((fields as { id: string }).id) ? (fields as { id: string }).id : null;
        if (!id) throw new CmsEditError("The ID must be lowercase words separated by hyphens.", 422);
        sendJson(response, 200, await tracked<unknown>("record-create", kind, id, () => kind === "article"
          ? createArticle(root, fields, expectedSourceRevision)
          : createRecord(root, kind, fields, expectedSourceRevision)));
        return;
      }
      if (localGuidanceContentMatch && request.method === "PUT") {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new CmsEditError("Invalid supplement edit request.", 400);
        const edit = payload as { expectedRevision?: unknown; expectedSourceRevision?: unknown; fields?: unknown };
        if (Object.keys(edit).some((field) => !["expectedRevision", "expectedSourceRevision", "fields"].includes(field))
          || typeof edit.expectedRevision !== "string" || typeof edit.expectedSourceRevision !== "string"
          || !edit.fields || typeof edit.fields !== "object" || Array.isArray(edit.fields)) {
          throw new CmsEditError("Expected record revision, source revision, and English fields.", 400);
        }
        sendJson(response, 200, await tracked("local-guidance-content", "local-guidance-supplement", localGuidanceContentMatch[1]!, () =>
          saveLocalGuidanceContent(root, localGuidanceContentMatch[1]!, edit as Parameters<typeof saveLocalGuidanceContent>[2])));
        return;
      }
      if ((request.method === "POST" && (previewMatch || reviewMatch)) || (request.method === "PUT" && (saveMatch || statusMatch))) {
        if (request.headers.origin !== origin || request.headers["x-cms-token"] !== sessionToken) {
          throw new CmsEditError("This action requires the local CMS session.", 403);
        }
        const payload = await readJson(request);
        if (!payload || typeof payload !== "object") throw new CmsEditError("Invalid edit request.", 400);
        if (previewMatch) {
          sendJson(response, 200, { blocks: await previewArticleBody((payload as { body?: unknown }).body) });
        } else if (statusMatch) {
          const edit = payload as StatusChange;
          if (typeof edit.expectedRevision !== "string" || typeof edit.status !== "string") throw new CmsEditError("Expected revision and status.", 400);
          sendJson(response, 200, await tracked("article-status", "article", statusMatch[1]!, () => changeArticleStatus(root, statusMatch[1]!, edit)));
        } else if (reviewMatch) {
          const approval = payload as ReviewApproval;
          if (typeof approval.expectedRevision !== "string") throw new CmsEditError("Expected article revision.", 400);
          sendJson(response, 200, await tracked("article-review", "article", reviewMatch[1]!, () => approveArticleReview(root, reviewMatch[1]!, approval)));
        } else {
          const edit = payload as BodyEdit;
          if (typeof edit.expectedRevision !== "string" || typeof edit.body !== "string" || typeof edit.updatedAt !== "string") {
            throw new CmsEditError("Expected revision, body, and update date.", 400);
          }
          sendJson(response, 200, await tracked("article-body", "article", saveMatch![1]!, () => saveArticleBody(root, saveMatch![1]!, edit)));
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
          sendJson(response, 200, await tracked("record-status", structuredStatusMatch[1] as StructuredKind, structuredStatusMatch[2]!, () => changeStructuredStatus(root, structuredStatusMatch[1] as StructuredKind, structuredStatusMatch[2]!, payload as Parameters<typeof changeStructuredStatus>[3])));
        } else if (structuredContentMatch) {
          sendJson(response, 200, await tracked("record-content", structuredContentMatch[1] as StructuredKind, structuredContentMatch[2]!, () => saveStructuredContent(root, structuredContentMatch[1] as StructuredKind, structuredContentMatch[2]!, payload as Parameters<typeof saveStructuredContent>[3])));
        } else {
          sendJson(response, 200, await tracked("record-review", structuredReviewMatch![1] as StructuredKind, structuredReviewMatch![2]!, () => approveStructuredReview(root, structuredReviewMatch![1] as StructuredKind, structuredReviewMatch![2]!, payload as Parameters<typeof approveStructuredReview>[3])));
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
      if (pathname === "/api/create/options") {
        sendJson(response, 200, { ...await creationOptions(root), article: await articleCreationOptions(root) });
        return;
      }
      if (pathname === "/api/records") {
        const catalog = await readStructuredCatalog(root);
        sendJson(response, 200, { records: catalog.summaries, failures: catalog.failures });
        return;
      }
      if (pathname === "/api/reference") {
        sendJson(response, 200, { records: referenceCatalog.summaries });
        return;
      }
      if (pathname === "/api/local-guidance") {
        const catalog = await readLocalGuidanceCatalog(root);
        sendJson(response, 200, { locations: catalog.locations, guides: catalog.guides, failures: catalog.failures });
        return;
      }
      const localGuidanceMatch = /^\/api\/local-guidance\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (localGuidanceMatch) {
        const catalog = await readLocalGuidanceCatalog(root);
        const detail = catalog.details.get(localGuidanceMatch[1]!);
        sendJson(response, detail ? 200 : 404, detail ?? { error: "Local guidance supplement not found." });
        return;
      }
      const referenceMatch = /^\/api\/reference\/(source|journey|article-group|annotated-document)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (referenceMatch) {
        const record = referenceCatalog.getRecord(referenceMatch[1] as ReferenceKind, referenceMatch[2]!);
        sendJson(response, record ? 200 : 404, record ?? { error: "Reference record not found." });
        return;
      }
      if (pathname === "/api/impact/sources") {
        const impact = await loadCmsSourceImpactCatalog(join(root, "content", "articles"));
        sendJson(response, 200, { sources: impact.sources, findings: impact.findings, coverageNote: impact.coverageNote });
        return;
      }
      const impactContentMatch = /^\/api\/impact\/content\/(article|faq|residence-status|glossary-term)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
      if (impactContentMatch) {
        const kind = impactContentMatch[1]!;
        const id = impactContentMatch[2]!;
        const impact = await loadCmsSourceImpactCatalog(join(root, "content", "articles"));
        let declaredSourceIds: readonly string[] | undefined;
        if (kind === "article") {
          const article = (await readArticleCatalog(root)).details.get(id);
          if (!article) { sendJson(response, 404, { error: "Article not found." }); return; }
          declaredSourceIds = article.metadata.sourceIds;
        } else {
          const record = (await readStructuredCatalog(root)).records.get(`${kind}:${id}`);
          if (!record) { sendJson(response, 404, { error: "Record not found." }); return; }
          declaredSourceIds = "sourceIds" in record.value ? record.value.sourceIds : undefined;
        }
        sendJson(response, 200, impact.findContentSources({ kind, id, declaredSourceIds }));
        return;
      }
      if (pathname === "/api/translation-handoff" || pathname === "/api/translation-handoff.txt") {
        const handoff = await readTranslationHandoff(root);
        if (pathname.endsWith(".txt")) {
          response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": "attachment; filename=\"nihonest-translation-handoff.txt\"" });
          response.end(handoff.exportText);
        } else sendJson(response, 200, handoff);
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
        sendJson(response, 200, await gitSessionReport(root));
        return;
      }
      if (pathname === "/api/git/diff") {
        sendJson(response, 200, await gitFileDiff(root, new URL(request.url ?? "/", origin).searchParams.get("path")));
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
      if (error instanceof CmsEditError || error instanceof CheckRunError || error instanceof RecoveryDraftConflictError) {
        sendJson(response, error instanceof RecoveryDraftConflictError ? error.statusCode : error.status, { error: error.message });
        return;
      }
      console.error("CMS request failed:", error);
      sendJson(response, 500, { error: "The local CMS could not load this view. Check the terminal for details." });
    }
  });
  server.on("close", () => { void checks.dispose().catch((error: unknown) => console.error("CMS check shutdown failed:", error)); });
  return server;
}
