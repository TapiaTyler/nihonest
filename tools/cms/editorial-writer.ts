import { withCmsFileLock } from "./write-locks";
/** Guarded article status changes and exact-revision human approvals. */
import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, open, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { runInNewContext } from "node:vm";
import { articleMetadataSchema, type ArticleMetadata } from "@/domain/article/article";
import { createEditorialReviewRecord } from "@/domain/editorial/editorial-review";
import { sourceReviewRecordSchema } from "@/domain/source/source-review";
import { splitArticleSource } from "@/domain/article/article-source";
import { articleSourceRevision } from "@/lib/content/content-bundle";
import { loadEditorialReviewRecords } from "@/lib/editorial/editorial-catalog";
import { CmsEditError } from "./article-writer";
import { readArticleCatalog } from "./catalog";
import { guardCmsWrite, noteCmsWrite } from "./git-session";

type UnverifiedStatus = Exclude<ArticleMetadata["status"], "verified">;
export type StatusChange = Readonly<{ expectedRevision: string; status: UnverifiedStatus }>;
export type ReviewApproval = Readonly<{
  expectedRevision: string;
  reviewedAt: string;
  changeNote: string;
  approvalNote: string;
  validationPerformed: string[];
  sourceReviewIds: string[];
  explicitHumanApproval: true;
}>;
const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const revisionPattern = /^[a-f0-9]{64}$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const editorialRevision = (source: string) => createHash("sha256").update(source.replaceAll("\r\n", "\n")).digest("hex");

async function localTempDirectory(projectRoot: string) {
  const expected = join(await realpath(projectRoot), ".cms");
  await mkdir(expected, { recursive: true });
  if (await realpath(expected) !== expected) throw new CmsEditError("CMS temporary directory escapes the checkout.", 403);
  return expected;
}

async function currentArticle(projectRoot: string, id: string, expectedRevision: string) {
  if (!stableId.test(id) || !revisionPattern.test(expectedRevision)) throw new CmsEditError("Invalid article ID or expected revision.", 400);
  const detail = (await readArticleCatalog(projectRoot)).details.get(id);
  if (!detail) throw new CmsEditError("Article not found or cannot be parsed.", 404);
  const directory = await realpath(resolve(projectRoot, "content/articles"));
  const target = await realpath(resolve(projectRoot, detail.summary.path));
  if (!target.startsWith(`${directory}${sep}`)) throw new CmsEditError("Article path escapes the canonical directory.", 403);
  const original = await readFile(target, "utf8");
  if (articleSourceRevision(original) !== expectedRevision) throw new CmsEditError("The article changed since it was loaded. Refresh before editing again.", 409);
  return { detail, target, original };
}

function changeMetadata(original: string, id: string, status: ArticleMetadata["status"], reviewedAt?: string) {
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  if (/\r(?!\n)/.test(original) || (newline === "\r\n" && /(?<!\r)\n/.test(original))) {
    throw new CmsEditError("Mixed line endings need manual source editing.", 422);
  }
  const normalized = original.replace(/\r\n/g, "\n");
  const { metadataLiteral, body } = splitArticleSource(normalized);
  const metadata = articleMetadataSchema.parse(runInNewContext(`(${metadataLiteral})`, {}, { timeout: 1000 }));
  if (metadata.id !== id) throw new CmsEditError("Article ID does not match its file.", 422);
  let prefix = normalized.slice(0, normalized.length - body.length);
  const statusField = /^([ \t]*status:[ \t]*["'])(?:draft|needs-review|verified|archived)(["'][ \t]*,?)/gm;
  if ([...prefix.matchAll(statusField)].length !== 1) throw new CmsEditError("Cannot safely update article status.", 422);
  prefix = prefix.replace(statusField, (_match, start: string, end: string) => `${start}${status}${end}`);
  const reviewField = /^[ \t]*lastReviewedAt:[ \t]*["']\d{4}-\d{2}-\d{2}["'][ \t]*,?[ \t]*\n/gm;
  if ([...prefix.matchAll(reviewField)].length > 1) throw new CmsEditError("Cannot safely update article review date.", 422);
  prefix = prefix.replace(reviewField, "");
  if (reviewedAt) {
    const updatedField = /^([ \t]*)updatedAt:[ \t]*["']\d{4}-\d{2}-\d{2}["'][ \t]*,?[ \t]*\n/gm;
    if ([...prefix.matchAll(updatedField)].length !== 1) throw new CmsEditError("Cannot safely place article review date.", 422);
    prefix = prefix.replace(updatedField, (line, indent: string) => `${line}${indent}lastReviewedAt: "${reviewedAt}",\n`);
  }
  articleMetadataSchema.parse({ ...metadata, status, lastReviewedAt: reviewedAt });
  return `${prefix}${body}`.replace(/\n/g, newline);
}

async function atomicReplace(projectRoot: string, id: string, target: string, original: string, next: string, expectedRevision: string) {
  return withCmsFileLock(target, async () => {
    await guardCmsWrite(projectRoot, target);
    const tempDirectory = await localTempDirectory(projectRoot);
    const temporaryPath = join(tempDirectory, `${id}-${randomUUID()}.tmp`);
    try {
      const handle = await open(temporaryPath, "wx", (await stat(target)).mode);
      try { await handle.writeFile(next, "utf8"); await handle.sync(); }
      finally { await handle.close(); }
      if (articleSourceRevision(await readFile(target, "utf8")) !== expectedRevision) {
        throw new CmsEditError("The article changed during saving. Refresh before editing again.", 409);
      }
      await rename(temporaryPath, target);
    } finally {
      await rm(temporaryPath, { force: true });
    }
    await noteCmsWrite(projectRoot, target);
    return { changed: next !== original, revision: articleSourceRevision(next) };
  });
}

export async function changeArticleStatus(projectRoot: string, id: string, input: StatusChange) {
  if (!["draft", "needs-review", "archived"].includes(input.status)) {
    throw new CmsEditError("Use the human review action to mark an article reviewed.", 422);
  }
  const { detail, target, original } = await currentArticle(projectRoot, id, input.expectedRevision);
  return withCmsFileLock(target, async () => {
    if (articleSourceRevision(await readFile(target, "utf8")) !== input.expectedRevision) {
      throw new CmsEditError("The article changed while waiting to save. Refresh.", 409);
    }
    if (detail.metadata.status === input.status) return { changed: false, revision: input.expectedRevision };
    const next = changeMetadata(original, id, input.status);
    return atomicReplace(projectRoot, id, target, original, next, input.expectedRevision);
  });
}

export async function approveArticleReview(projectRoot: string, id: string, input: ReviewApproval) {
  if (input.explicitHumanApproval !== true) throw new CmsEditError("Explicit human approval is required.", 422);
  if (!isoDate.test(input.reviewedAt) || Number.isNaN(Date.parse(input.reviewedAt))
    || new Date(input.reviewedAt).toISOString().slice(0, 10) !== input.reviewedAt
    || input.reviewedAt > new Date().toISOString().slice(0, 10)) {
    throw new CmsEditError("Choose a valid review date that is not in the future.", 422);
  }
  if (typeof input.changeNote !== "string" || !input.changeNote.trim()
    || typeof input.approvalNote !== "string" || !input.approvalNote.trim()
    || !Array.isArray(input.validationPerformed)
    || !input.validationPerformed.length || input.validationPerformed.some((item) => typeof item !== "string" || !item.trim())
    || !Array.isArray(input.sourceReviewIds) || input.sourceReviewIds.some((item) => typeof item !== "string" || !stableId.test(item))) {
    throw new CmsEditError("Describe the review, approval, and at least one validation. Source review IDs must be valid.", 422);
  }
  const { detail, target, original } = await currentArticle(projectRoot, id, input.expectedRevision);
  return withCmsFileLock(target, async () => {
    if (articleSourceRevision(await readFile(target, "utf8")) !== input.expectedRevision) {
      throw new CmsEditError("The article changed while waiting to approve. Refresh.", 409);
    }
    if (detail.metadata.status === "verified") throw new CmsEditError("This article is already reviewed. Move it to editorial review before approving a new revision.", 422);
    if (detail.metadata.status !== "needs-review") throw new CmsEditError("Move the article to editorial review before marking it reviewed.", 422);
    if (input.reviewedAt < detail.metadata.updatedAt) throw new CmsEditError("Review date cannot precede the article update date.", 422);
    for (const sourceId of input.sourceReviewIds) {
      const sourcePath = resolve(projectRoot, "content/source-reviews", `${sourceId}.json`);
      try {
        const contentDirectory = await realpath(resolve(projectRoot, "content"));
        const sourceDirectory = await realpath(resolve(projectRoot, "content/source-reviews"));
        if (sourceDirectory !== join(contentDirectory, "source-reviews")) throw new Error("Source review directory escapes content.");
        if ((await realpath(sourcePath)) !== join(sourceDirectory, `${sourceId}.json`)) throw new Error("Source review path escapes its directory.");
        const source = sourceReviewRecordSchema.parse(JSON.parse(await readFile(sourcePath, "utf8")));
        if (source.status !== "resolved") throw new Error("Source review is not resolved.");
      } catch { throw new CmsEditError(`Linked source review ${sourceId} is missing or unresolved.`, 422); }
    }
    const next = changeMetadata(original, id, "verified", input.reviewedAt);
    const nextRevision = articleSourceRevision(next);
    const nextEditorialRevision = editorialRevision(next);
    const record = createEditorialReviewRecord({
      target: { kind: "article", id, status: "verified", revision: nextEditorialRevision,
        updatedAt: detail.metadata.updatedAt, lastReviewedAt: input.reviewedAt },
      reviewedAt: input.reviewedAt,
      changeNote: input.changeNote.trim(),
      approvalNote: input.approvalNote.trim(),
      validationPerformed: input.validationPerformed.map((item) => item.trim()),
      sourceReviewIds: input.sourceReviewIds,
      recordedAt: new Date().toISOString(),
    });
    const reviewDirectory = resolve(projectRoot, "content/editorial-reviews");
    const existing = await loadEditorialReviewRecords(reviewDirectory);
    if (existing.some((item) => item.id === record.id)) throw new CmsEditError("An approval for this exact revision already exists.", 409);
    await mkdir(reviewDirectory, { recursive: true });
    const contentDirectory = await realpath(resolve(projectRoot, "content"));
    if (await realpath(reviewDirectory) !== join(contentDirectory, "editorial-reviews")) {
      throw new CmsEditError("Approval directory escapes the canonical content directory.", 403);
    }
    const recordPath = join(reviewDirectory, `${record.id}.json`);
    const temporaryRecord = join(await localTempDirectory(projectRoot), `${record.id}-${randomUUID()}.tmp`);
    try {
      await writeFile(temporaryRecord, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
      await atomicReplace(projectRoot, id, target, original, next, input.expectedRevision);
      try {
        // Hard-link creation is atomic and refuses to replace an existing approval.
        await link(temporaryRecord, recordPath);
        await noteCmsWrite(projectRoot, recordPath);
      } catch (error) {
        if (articleSourceRevision(await readFile(target, "utf8")) === nextRevision) {
          await atomicReplace(projectRoot, id, target, next, original, nextRevision);
        }
        throw error;
      }
    } finally { await rm(temporaryRecord, { force: true }); }
    return { changed: true, revision: nextRevision, approvalRevision: nextEditorialRevision,
      approvalRecord: `content/editorial-reviews/${record.id}.json` };
  });
}
