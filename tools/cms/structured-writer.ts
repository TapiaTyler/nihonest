import { withCmsFileLock } from "./write-locks";
/** Revision-checked metadata writes for FAQ, residence-status, and glossary source entries. */
import { randomUUID } from "node:crypto";
import { link, mkdir, open, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import { createEditorialReviewRecord } from "@/domain/editorial/editorial-review";
import { sourceReviewRecordSchema } from "@/domain/source/source-review";
import { loadEditorialReviewRecords } from "@/lib/editorial/editorial-catalog";
import { CmsEditError } from "./article-writer";
import { guardCmsWrite, noteCmsWrite } from "./git-session";
import { noteCmsSourceWrite, proposedStructuredValue, readStructuredCatalog, type StructuredKind, type StructuredRecord } from "./structured-catalog";
import { structuredEditorialRevision } from "@/lib/editorial/editorial-catalog";

type StatusInput = Readonly<{ expectedRevision: string; expectedSourceRevision: string; status: string }>;
type ContentInput = Readonly<{ expectedRevision: string; expectedSourceRevision: string;
  fields: Record<string, unknown>; updatedAt?: string }>;
type ReviewInput = Readonly<{
  expectedRevision: string; expectedSourceRevision: string; reviewedAt: string;
  changeNote: string; approvalNote: string; validationPerformed: string[];
  sourceReviewIds: string[]; explicitHumanApproval: true;
}>;
const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const revision = /^[a-f0-9]{64}$/;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

function validStatus(kind: StructuredKind, status: string): boolean {
  return kind === "residence-status" ? ["draft", "needs-review", "archived"].includes(status)
    : ["draft", "needs-review"].includes(status);
}

async function current(projectRoot: string, kind: StructuredKind, id: string, expectedRevision: string, expectedSourceRevision: string) {
  if (!stableId.test(id) || !revision.test(expectedRevision) || !revision.test(expectedSourceRevision)) {
    throw new CmsEditError("Invalid ID or revision.", 400);
  }
  const record = (await readStructuredCatalog(projectRoot)).records.get(`${kind}:${id}`);
  if (!record) throw new CmsEditError("Record not found or cannot be parsed. Restart the CMS after external source changes.", 404);
  if (record.revision !== expectedRevision || record.source.sourceRevision !== expectedSourceRevision) {
    throw new CmsEditError("The record or its source file changed. Refresh before editing again.", 409);
  }
  const sourceDirectory = await realpath(resolve(projectRoot, "src/data"));
  const target = await realpath(resolve(projectRoot, record.source.path));
  if (!target.startsWith(`${sourceDirectory}${sep}`)) throw new CmsEditError("Record path escapes the canonical data directory.", 403);
  const original = await readFile(target, "utf8");
  if (hash(original) !== expectedSourceRevision) throw new CmsEditError("The source file changed while loading. Refresh.", 409);
  return { record, target, original };
}

function sourceLiteral(value: string | string[]): string {
  return Array.isArray(value) ? `[${value.map((item) => JSON.stringify(item)).join(", ")}]` : JSON.stringify(value);
}

function patchSource(record: StructuredRecord, original: string, status: string, date?: string,
  extra: Readonly<Record<string, string | string[]>> = {}) {
  const location = record.source;
  const edits: { start: number; end: number; text: string }[] = [];
  const missing: string[] = [];
  if (location.statusValue) edits.push({ start: location.statusValue[0], end: location.statusValue[1], text: JSON.stringify(status) });
  else missing.push(`status: ${JSON.stringify(status)}`);
  if (location.reviewDateValue) edits.push({ start: location.reviewDateValue[0], end: location.reviewDateValue[1], text: date ? JSON.stringify(date) : "undefined" });
  else if (date) missing.push(`lastReviewedAt: ${JSON.stringify(date)}`);
  for (const [field, value] of Object.entries(extra)) {
    const range = location.fieldValues[field];
    if (range) edits.push({ start: range[0], end: range[1], text: sourceLiteral(value) });
    else missing.push(`${field}: ${sourceLiteral(value)}`);
  }
  if (missing.length) {
    let insertion = location.objectEnd - 1;
    while (insertion > location.objectStart && /\s/.test(original[insertion - 1]!)) insertion -= 1;
    const inner = original.slice(location.objectStart + 1, insertion);
    const comma = inner.trim() && !inner.trimEnd().endsWith(",") ? "," : "";
    const multiline = original.slice(location.objectStart, location.objectEnd).includes("\n");
    const closeLine = original.slice(original.lastIndexOf("\n", location.objectEnd - 1) + 1, location.objectEnd - 1);
    const indent = /^\s*$/.test(closeLine) ? `${closeLine}  ` : "  ";
    const text = multiline ? `${comma}\n${indent}${missing.join(`,\n${indent}`)},` : `${comma} ${missing.join(", ")}`;
    edits.push({ start: insertion, end: insertion, text });
  }
  let next = original;
  for (const edit of edits.sort((a, b) => b.start - a.start)) next = `${next.slice(0, edit.start)}${edit.text}${next.slice(edit.end)}`;
  return next;
}

export async function saveStructuredContent(projectRoot: string, kind: StructuredKind, id: string, input: ContentInput) {
  const { record, target, original } = await current(projectRoot, kind, id, input.expectedRevision, input.expectedSourceRevision);
  return withCmsFileLock(target, async () => {
    if (hash(await readFile(target, "utf8")) !== input.expectedSourceRevision) {
      throw new CmsEditError("The source file changed while waiting to save. Refresh.", 409);
    }
    if (!input.fields || typeof input.fields !== "object" || Array.isArray(input.fields)) {
      throw new CmsEditError("Provide the editable content fields.", 422);
    }
    const submitted: Record<string, string | string[]> = {};
    for (const [field, value] of Object.entries(input.fields)) {
      if (!record.editableFields.includes(field)) throw new CmsEditError(`Field ${field} is not editable for this record.`, 422);
      if (typeof value === "string" && value.trim() && Buffer.byteLength(value, "utf8") <= 20_000) submitted[field] = value;
      else if (Array.isArray(value) && value.length <= 100 && value.every((item) => typeof item === "string" && item.trim() && item.length <= 2000)) {
        submitted[field] = value;
      } else throw new CmsEditError(`Field ${field} must contain valid text or a list of text items.`, 422);
    }
    if (!Object.keys(submitted).length) throw new CmsEditError("Choose a content field to change.", 422);
    const changed = Object.entries(submitted).some(([field, value]) => JSON.stringify(record.value[field as keyof typeof record.value]) !== JSON.stringify(value));
    if (!changed) return { changed: false, revision: record.revision, sourceRevision: record.source.sourceRevision };
    if (kind === "faq") {
      if (typeof input.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.updatedAt)
        || Number.isNaN(Date.parse(input.updatedAt)) || new Date(input.updatedAt).toISOString().slice(0, 10) !== input.updatedAt
        || input.updatedAt < record.updatedAt! || input.updatedAt < (record.value as { createdAt: string }).createdAt) {
        throw new CmsEditError("Choose a valid FAQ update date that does not precede its existing dates.", 422);
      }
      submitted.updatedAt = input.updatedAt;
    }
    const status = record.status === "draft" ? "draft" : "needs-review";
    const date = kind === "residence-status" ? record.lastReviewedAt : undefined;
    let value;
    try { value = proposedStructuredValue(record, status, date, submitted); }
    catch (error) { throw new CmsEditError(error instanceof Error ? error.message : "Invalid structured content.", 422); }
    const next = patchSource(record, original, status, date, submitted);
    await replaceSource(projectRoot, target, original, next);
    noteCmsSourceWrite(projectRoot, record.source.path, hash(next));
    return { changed: true, revision: structuredEditorialRevision(value), sourceRevision: hash(next), status };
  });
}

async function cmsDirectory(projectRoot: string) {
  const expected = join(await realpath(projectRoot), ".cms");
  await mkdir(expected, { recursive: true });
  if (await realpath(expected) !== expected) throw new CmsEditError("CMS temporary directory escapes the checkout.", 403);
  return expected;
}

export async function replaceSource(projectRoot: string, target: string, original: string, next: string) {
  return withCmsFileLock(target, async () => {
    await guardCmsWrite(projectRoot, target);
    const temporaryPath = join(await cmsDirectory(projectRoot), `${randomUUID()}.tmp`);
    try {
      const handle = await open(temporaryPath, "wx", (await stat(target)).mode);
      try { await handle.writeFile(next, "utf8"); await handle.sync(); }
      finally { await handle.close(); }
      if (hash(await readFile(target, "utf8")) !== hash(original)) throw new CmsEditError("The source file changed during saving. Refresh.", 409);
      await rename(temporaryPath, target);
    } finally { await rm(temporaryPath, { force: true }); }
    await noteCmsWrite(projectRoot, target);
  });
}

export async function changeStructuredStatus(projectRoot: string, kind: StructuredKind, id: string, input: StatusInput) {
  if (!validStatus(kind, input.status)) throw new CmsEditError("Choose a supported status. Use Mark reviewed for verified content.", 422);
  const { record, target, original } = await current(projectRoot, kind, id, input.expectedRevision, input.expectedSourceRevision);
  return withCmsFileLock(target, async () => {
    if (hash(await readFile(target, "utf8")) !== input.expectedSourceRevision) {
      throw new CmsEditError("The source file changed while waiting to save. Refresh.", 409);
    }
    if (record.status === input.status) return { changed: false, revision: record.revision, sourceRevision: record.source.sourceRevision };
    const date = kind === "residence-status" ? record.lastReviewedAt : undefined;
    const value = proposedStructuredValue(record, input.status, date);
    const next = patchSource(record, original, input.status, date);
    await replaceSource(projectRoot, target, original, next);
    noteCmsSourceWrite(projectRoot, record.source.path, hash(next));
    return { changed: true, revision: structuredEditorialRevision(value), sourceRevision: hash(next) };
  });
}

async function validateReviewInput(projectRoot: string, input: ReviewInput, updatedAt?: string) {
  if (input.explicitHumanApproval !== true) throw new CmsEditError("Explicit human approval is required.", 422);
  const date = input.reviewedAt;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))
    || new Date(date).toISOString().slice(0, 10) !== date || date > new Date().toISOString().slice(0, 10)
    || (updatedAt && date < updatedAt)) throw new CmsEditError("Choose a valid review date after the last update and no later than today.", 422);
  if (typeof input.changeNote !== "string" || !input.changeNote.trim()
    || typeof input.approvalNote !== "string" || !input.approvalNote.trim()
    || !Array.isArray(input.validationPerformed) || !input.validationPerformed.length
    || input.validationPerformed.some((item) => typeof item !== "string" || !item.trim())
    || !Array.isArray(input.sourceReviewIds)
    || input.sourceReviewIds.some((item) => typeof item !== "string" || !stableId.test(item))) {
    throw new CmsEditError("Describe the review, approval, and validation. Use valid source review IDs.", 422);
  }
  if (!input.sourceReviewIds.length) return;
  const contentDirectory = await realpath(resolve(projectRoot, "content"));
  const sourceDirectory = await realpath(resolve(projectRoot, "content/source-reviews"));
  if (sourceDirectory !== join(contentDirectory, "source-reviews")) throw new CmsEditError("Source review directory escapes content.", 403);
  for (const sourceId of input.sourceReviewIds) {
    try {
      const path = join(sourceDirectory, `${sourceId}.json`);
      if (await realpath(path) !== path) throw new Error("Invalid source review path.");
      const source = sourceReviewRecordSchema.parse(JSON.parse(await readFile(path, "utf8")));
      if (source.status !== "resolved") throw new Error("Unresolved source review.");
    } catch { throw new CmsEditError(`Linked source review ${sourceId} is missing or unresolved.`, 422); }
  }
}

export async function approveStructuredReview(projectRoot: string, kind: StructuredKind, id: string, input: ReviewInput) {
  const { record, target, original } = await current(projectRoot, kind, id, input.expectedRevision, input.expectedSourceRevision);
  return withCmsFileLock(target, async () => {
    if (hash(await readFile(target, "utf8")) !== input.expectedSourceRevision) {
      throw new CmsEditError("The source file changed while waiting to save. Refresh.", 409);
    }
    if (record.status !== "needs-review") throw new CmsEditError("Move the record to editorial review before marking it reviewed.", 422);
    await validateReviewInput(projectRoot, input, record.updatedAt);
    const value = proposedStructuredValue(record, "verified", input.reviewedAt);
    const next = patchSource(record, original, "verified", input.reviewedAt);
    const nextRevision = structuredEditorialRevision(value);
    const approval = createEditorialReviewRecord({
      target: { kind, id, status: "verified", revision: nextRevision, updatedAt: record.updatedAt, lastReviewedAt: input.reviewedAt },
      reviewedAt: input.reviewedAt, changeNote: input.changeNote.trim(), approvalNote: input.approvalNote.trim(),
      validationPerformed: input.validationPerformed.map((item) => item.trim()), sourceReviewIds: input.sourceReviewIds,
      recordedAt: new Date().toISOString(),
    });
    const reviewDirectory = resolve(projectRoot, "content/editorial-reviews");
    const existing = await loadEditorialReviewRecords(reviewDirectory);
    if (existing.some((item) => item.id === approval.id)) throw new CmsEditError("Approval already exists for this revision.", 409);
    await mkdir(reviewDirectory, { recursive: true });
    if (await realpath(reviewDirectory) !== join(await realpath(resolve(projectRoot, "content")), "editorial-reviews")) {
      throw new CmsEditError("Approval directory escapes content.", 403);
    }
    const recordPath = join(reviewDirectory, `${approval.id}.json`);
    const temporaryRecord = join(await cmsDirectory(projectRoot), `${approval.id}-${randomUUID()}.tmp`);
    try {
      await writeFile(temporaryRecord, `${JSON.stringify(approval, null, 2)}\n`, { flag: "wx" });
      await replaceSource(projectRoot, target, original, next);
      try { await link(temporaryRecord, recordPath); await noteCmsWrite(projectRoot, recordPath); }
      catch (error) {
        if (hash(await readFile(target, "utf8")) === hash(next)) await replaceSource(projectRoot, target, next, original);
        throw error;
      }
    } finally { await rm(temporaryRecord, { force: true }); }
    noteCmsSourceWrite(projectRoot, record.source.path, hash(next));
    return { changed: true, revision: nextRevision, sourceRevision: hash(next),
      approvalRecord: `content/editorial-reviews/${approval.id}.json` };
  });
}
