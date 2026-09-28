/** Local, gitignored activity and crash-recovery drafts for the editorial CMS. */
import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { lstat, mkdir, open, readFile, realpath, rename, unlink, writeFile, readdir } from "node:fs/promises";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";

export const recoveryRecordKinds = ["article", "faq", "residence-status", "glossary-term", "local-guidance-supplement", "source"] as const;
export type RecoveryRecordKind = typeof recoveryRecordKinds[number];

export const activityKinds = ["session", "draft", "article-body", "article-status", "article-review", "record-content", "record-status", "record-review", "local-guidance-content", "record-create", "check-start", "check-finish", "check-cancel"] as const;
export type ActivityKind = typeof activityKinds[number];
export type ActivityOutcome = "started" | "succeeded" | "failed" | "conflict" | "canceled" | "warning";

export type DraftContent = Readonly<
  | { body: string; updatedAt?: string }
  | { fields: Readonly<Record<string, unknown>>; updatedAt?: string }
>;

export type DraftInput = Readonly<{
  kind: RecoveryRecordKind;
  id: string;
  expectedRecordRevision: string;
  expectedSourceRevision?: string;
  content: DraftContent;
}>;

export type WriteDraftInput = DraftInput & Readonly<{ previousDraftRevision?: string }>;

export class RecoveryDraftConflictError extends Error {
  readonly statusCode = 409;
  constructor(message = "The recovery draft changed in another CMS session. Reload it before saving.") {
    super(message);
    this.name = "RecoveryDraftConflictError";
  }
}

export type DraftSnapshot = Readonly<DraftInput & {
  capturedAt: string;
  draftRevision: string;
}>;

export type ActivityEventInput = Readonly<{
  kind: ActivityKind;
  outcome: ActivityOutcome;
  recordKind?: RecoveryRecordKind;
  recordId?: string;
  checkId?: string;
  revision?: string;
}>;

export type ActivityEvent = Readonly<ActivityEventInput & { occurredAt: string }>;

export type RecoveryStore = Readonly<{
  appendActivity(event: ActivityEventInput): Promise<ActivityEvent>;
  readActivity(limit?: number): Promise<readonly ActivityEvent[]>;
  writeDraft(input: WriteDraftInput): Promise<DraftSnapshot>;
  readDraft(kind: RecoveryRecordKind, id: string): Promise<DraftSnapshot | null>;
  listDrafts(): Promise<readonly DraftSnapshot[]>;
  deleteDraft(identity: Pick<DraftSnapshot, "kind" | "id" | "draftRevision">): Promise<boolean>;
}>;

const maxDraftBytes = 1_500 * 1024;
const maxActivityLineBytes = 2 * 1024;
const maxActivityRead = 1000;
const revisionPattern = /^[a-f0-9]{64}$/;
const draftRevisionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validActivityKinds = new Set<string>(activityKinds);
const validRecordKinds = new Set<string>(recoveryRecordKinds);
const validOutcomes = new Set<string>(["started", "succeeded", "failed", "conflict", "canceled", "warning"]);

function fail(message: string): never { throw new TypeError(message); }

function validateKind(kind: unknown): asserts kind is RecoveryRecordKind {
  if (typeof kind !== "string" || !validRecordKinds.has(kind)) fail("Unsupported recovery record kind.");
}

function validateIdentity(kind: unknown, id: unknown): asserts kind is RecoveryRecordKind {
  validateKind(kind);
  if (typeof id !== "string" || id.length > 160 || !idPattern.test(id)) fail("Invalid recovery record ID.");
}

function validateRevision(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !revisionPattern.test(value)) fail(`Invalid ${label}.`);
}

function isJsonValue(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return !seen.has(value) && (seen.add(value), value.every((item) => isJsonValue(item, seen)));
  if (typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (seen.has(object)) return false;
    seen.add(object);
    return Object.values(object).every((item) => isJsonValue(item, seen));
  }
  return false;
}

function validateContent(content: unknown): asserts content is DraftContent {
  if (!content || typeof content !== "object" || Array.isArray(content)) fail("Draft content must be an object.");
  const value = content as Record<string, unknown>;
  const keys = Object.keys(value).filter((key) => key !== "updatedAt");
  if (keys.length !== 1 || (keys[0] !== "body" && keys[0] !== "fields")) fail("Draft content must contain either body or fields.");
  if (value.updatedAt !== undefined && (typeof value.updatedAt !== "string" || !Number.isFinite(Date.parse(value.updatedAt)))) fail("Invalid draft updatedAt.");
  if (keys[0] === "body" && typeof value.body !== "string") fail("Article draft body must be text.");
  if (keys[0] === "fields" && (!value.fields || typeof value.fields !== "object" || Array.isArray(value.fields))) fail("Structured draft fields must be an object.");
  if (!isJsonValue(content)) fail("Draft content must contain JSON-safe values without reserved keys.");
  if (Buffer.byteLength(JSON.stringify(content), "utf8") > maxDraftBytes) fail("Draft content exceeds the recovery size limit.");
}

function validateDraftInput(input: DraftInput | WriteDraftInput): void {
  if (!input || typeof input !== "object") fail("Draft payload must be an object.");
  if (Object.keys(input).some((key) => !["kind", "id", "expectedRecordRevision", "expectedSourceRevision", "content", "previousDraftRevision"].includes(key))) fail("Unexpected draft metadata.");
  validateIdentity(input.kind, input.id);
  validateRevision(input.expectedRecordRevision, "expected record revision");
  if (input.expectedSourceRevision !== undefined) validateRevision(input.expectedSourceRevision, "source-file revision");
  if ("previousDraftRevision" in input && input.previousDraftRevision !== undefined && (typeof input.previousDraftRevision !== "string" || !draftRevisionPattern.test(input.previousDraftRevision))) fail("Invalid previous draft revision.");
  validateContent(input.content);
}

function hash(text: string): string { return createHash("sha256").update(text).digest("hex"); }

function validateActivity(input: ActivityEventInput, stored = false): void {
  if (!input || typeof input !== "object" || typeof input.kind !== "string" || !validActivityKinds.has(input.kind)) fail("Unsupported activity event kind.");
  if (Object.keys(input).some((key) => !["kind", "outcome", "recordKind", "recordId", "checkId", "revision", ...(stored ? ["occurredAt"] : [])].includes(key))) fail("Unexpected activity metadata.");
  if (typeof input.outcome !== "string" || !validOutcomes.has(input.outcome)) fail("Unsupported activity outcome.");
  if (input.recordKind !== undefined) validateKind(input.recordKind);
  if (input.recordId !== undefined && (typeof input.recordId !== "string" || !idPattern.test(input.recordId))) fail("Invalid activity record ID.");
  if ((input.recordKind === undefined) !== (input.recordId === undefined)) fail("Activity record kind and ID must be supplied together.");
  if (input.checkId !== undefined && (typeof input.checkId !== "string" || !/^[a-z0-9][a-z0-9:-]{0,100}$/.test(input.checkId))) fail("Invalid validation check ID.");
  if (input.checkId !== undefined && !["check-start", "check-finish", "check-cancel"].includes(input.kind)) fail("A check ID is only valid for validation events.");
  if (["check-start", "check-finish", "check-cancel"].includes(input.kind) && !input.checkId) fail("Validation events require a check ID.");
  if (input.revision !== undefined) validateRevision(input.revision, "activity revision");
}

function isInside(root: string, candidate: string): boolean {
  const rel = relative(root, candidate);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
}

export function createRecoveryStore(projectRoot: string): RecoveryStore {
  const root = resolve(projectRoot);
  const runtimeDirectory = join(root, ".cms");
  const draftDirectory = join(runtimeDirectory, "drafts");
  const activityPath = join(runtimeDirectory, "activity.jsonl");
  const mutations = new Map<string, Promise<void>>();

  async function withMutation<T>(key: string, action: () => Promise<T>): Promise<T> {
    const previous = mutations.get(key) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
    const queued = previous.then(() => gate);
    mutations.set(key, queued);
    await previous;
    try { return await action(); }
    finally { release(); if (mutations.get(key) === queued) mutations.delete(key); }
  }

  async function secureDirectory(path: string): Promise<string> {
    const rootReal = await realpath(root);
    if (path !== runtimeDirectory && path !== draftDirectory) throw new Error("Unexpected recovery path.");
    // Validate .cms before touching its child path: otherwise recursive mkdir could follow
    // a pre-existing .cms symlink and create `drafts` outside the checkout.
    if (path === draftDirectory) await secureDirectory(runtimeDirectory);
    await mkdir(path, { recursive: true });
    const info = await lstat(path);
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error("The CMS recovery directory must be a real directory.");
    const resolved = await realpath(path);
    if (!isInside(rootReal, resolved)) throw new Error("The CMS recovery directory escapes the repository.");
    return resolved;
  }

  async function secureFile(path: string, directory: string): Promise<void> {
    if (basename(path) !== path.slice(directory.length + 1) || !isInside(directory, path)) throw new Error("Unsafe recovery file path.");
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink() || !info.isFile()) throw new Error("Recovery files must be regular files.");
      if (!isInside(directory, await realpath(path))) throw new Error("Recovery file escapes the CMS directory.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  async function draftPath(kind: RecoveryRecordKind, id: string): Promise<{ directory: string; path: string }> {
    validateIdentity(kind, id);
    const directory = await secureDirectory(draftDirectory);
    const path = join(directory, `${hash(`${kind}\0${id}`)}.json`);
    await secureFile(path, directory);
    return { directory, path };
  }

  async function readSnapshot(path: string): Promise<DraftSnapshot | null> {
    try {
      if ((await lstat(path)).size > maxDraftBytes + 4096) fail("Stored recovery draft exceeds the size limit.");
      const text = await readFile(path, "utf8");
      const snapshot = JSON.parse(text) as DraftSnapshot;
      const { capturedAt, draftRevision, ...input } = snapshot;
      validateDraftInput(input);
      if (typeof draftRevision !== "string" || !draftRevisionPattern.test(draftRevision)) fail("Invalid draft revision.");
      if (typeof capturedAt !== "string" || !Number.isFinite(Date.parse(capturedAt))) fail("Invalid stored draft timestamp.");
      return snapshot;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async function writeDraft(input: WriteDraftInput): Promise<DraftSnapshot> {
    validateDraftInput(input);
    const { directory, path } = await draftPath(input.kind, input.id);
    return withMutation(path, async () => {
      const current = await readSnapshot(path);
      if (current && input.previousDraftRevision !== current.draftRevision) throw new RecoveryDraftConflictError();
      if (!current && input.previousDraftRevision !== undefined) throw new RecoveryDraftConflictError("The recovery draft no longer exists. Reload before saving.");
      const { previousDraftRevision: ignoredPrevious, ...draftInput } = input;
      void ignoredPrevious;
      const snapshotBase = { ...draftInput, capturedAt: new Date().toISOString() };
      const draftRevision = randomUUID();
      const snapshot: DraftSnapshot = { ...snapshotBase, draftRevision };
      const temporary = join(directory, `.draft-${randomUUID()}.tmp`);
      await secureFile(temporary, directory);
      try {
        await writeFile(temporary, JSON.stringify(snapshot), { encoding: "utf8", flag: "wx", mode: 0o600 });
        await secureFile(path, directory);
        const latest = await readSnapshot(path);
        if ((current?.draftRevision ?? undefined) !== (latest?.draftRevision ?? undefined)) throw new RecoveryDraftConflictError();
        await rename(temporary, path);
        return snapshot;
      } finally { await unlink(temporary).catch(() => undefined); }
    });
  }

  async function appendActivity(input: ActivityEventInput): Promise<ActivityEvent> {
    validateActivity(input);
    const directory = await secureDirectory(runtimeDirectory);
    await secureFile(activityPath, directory);
    return withMutation(activityPath, async () => {
      const event: ActivityEvent = {
        kind: input.kind, outcome: input.outcome,
        ...(input.recordKind ? { recordKind: input.recordKind } : {}),
        ...(input.recordId ? { recordId: input.recordId } : {}),
        ...(input.checkId ? { checkId: input.checkId } : {}),
        ...(input.revision ? { revision: input.revision } : {}),
        occurredAt: new Date().toISOString(),
      };
      const line = `${JSON.stringify(event)}\n`;
      if (Buffer.byteLength(line, "utf8") > maxActivityLineBytes) fail("Activity event exceeds the log size limit.");
      const handle = await open(activityPath, constants.O_APPEND | constants.O_CREAT | constants.O_RDWR, 0o600);
      try {
        const { size } = await handle.stat();
        if (size > 0) {
          const lastByte = Buffer.alloc(1);
          await handle.read(lastByte, 0, 1, size - 1);
          if (lastByte[0] !== 0x0a) await handle.write("\n", undefined, "utf8");
        }
        await handle.write(line, undefined, "utf8");
        await handle.sync();
      }
      finally { await handle.close(); }
      return event;
    });
  }

  async function readActivity(limit = 100): Promise<readonly ActivityEvent[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > maxActivityRead) fail(`Activity limit must be between 1 and ${maxActivityRead}.`);
    const directory = await secureDirectory(runtimeDirectory);
    await secureFile(activityPath, directory);
    let text: string;
    // One extra line covers a read that begins in the middle of the oldest returned event.
    const maxBytes = (limit + 1) * maxActivityLineBytes;
    try {
      const handle = await open(activityPath, constants.O_RDONLY);
      try {
        const { size } = await handle.stat();
        const length = Math.min(size, maxBytes);
        const buffer = Buffer.alloc(length);
        await handle.read(buffer, 0, length, size - length);
        text = buffer.toString("utf8");
      } finally { await handle.close(); }
    }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
    const result: ActivityEvent[] = [];
    for (const line of text.split(/\r?\n/).filter(Boolean).slice(-limit)) {
      if (Buffer.byteLength(line, "utf8") > maxActivityLineBytes) continue;
      try {
        const event = JSON.parse(line) as ActivityEvent;
        validateActivity(event, true);
        if (typeof event.occurredAt !== "string" || !Number.isFinite(Date.parse(event.occurredAt))) continue;
        result.push(event);
      } catch { /* Ignore malformed or partial lines from an interrupted append. */ }
    }
    return result;
  }

  async function readDraft(kind: RecoveryRecordKind, id: string): Promise<DraftSnapshot | null> {
    const { path } = await draftPath(kind, id);
    return readSnapshot(path);
  }

  async function listDrafts(): Promise<readonly DraftSnapshot[]> {
    const directory = await secureDirectory(draftDirectory);
    const names = await readdir(directory);
    const result: DraftSnapshot[] = [];
    for (const name of names) {
      if (!/^[a-f0-9]{64}\.json$/.test(name)) continue;
      const path = join(directory, name);
      await secureFile(path, directory);
      const snapshot = await readSnapshot(path);
      if (snapshot && `${hash(`${snapshot.kind}\0${snapshot.id}`)}.json` === name) result.push(snapshot);
    }
    return result.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  }

  async function deleteDraft(identity: Pick<DraftSnapshot, "kind" | "id" | "draftRevision">): Promise<boolean> {
    validateIdentity(identity.kind, identity.id);
    if (typeof identity.draftRevision !== "string" || !draftRevisionPattern.test(identity.draftRevision)) fail("Invalid draft revision.");
    const { directory, path } = await draftPath(identity.kind, identity.id);
    return withMutation(path, async () => {
      const current = await readSnapshot(path);
      if (!current || current.draftRevision !== identity.draftRevision) return false;
      const before = await lstat(path);
      const reread = await readSnapshot(path);
      if (!reread || reread.draftRevision !== identity.draftRevision) return false;
      const after = await lstat(path);
      if (before.ino !== after.ino || before.mtimeMs !== after.mtimeMs) return false;
      await secureFile(path, directory);
      await unlink(path);
      return true;
    });
  }

  return { appendActivity, readActivity, writeDraft, readDraft, listDrafts, deleteDraft };
}
