/**
 * Git session boundary for the local CMS (docs/LOCAL-CMS-REQUIREMENTS.md §8).
 *
 * When the server starts it records the repository, branch, worktree, starting commit, and every file that already had
 * uncommitted changes. The CMS then refuses to write those files, so its edits never mix with someone else's unreviewed
 * work in the same file, and it reports its own writes separately from other changes. Writers call `guardCmsWrite` and
 * `noteCmsWrite`; both are no-ops for roots without a session (for example, test fixtures).
 */
import { execFile } from "node:child_process";
import { readFile, realpath, stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { promisify } from "node:util";
import { CmsEditError } from "./article-writer";

const execFileAsync = promisify(execFile);

export type GitSessionIdentity = Readonly<{
  repository: string;
  worktree: string;
  branch: string;
  startCommit: string;
  startedAt: string;
  /** Files that had uncommitted changes (or were untracked) when the session started. The CMS will not write them. */
  dirtyAtStart: readonly string[];
}>;

type Session = { identity: GitSessionIdentity; cmsWrites: Set<string> };
const sessions = new Map<string, Promise<Session>>();

/**
 * Every CMS Git call only reads. `--no-optional-locks` keeps `git status` from taking index.lock to refresh the
 * index, so the once-a-minute checkout check never makes an editor's own `git add` or `git commit` fail.
 */
async function git(root: string, args: readonly string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", ["--no-optional-locks", ...args], { cwd: root, timeout: 10_000, maxBuffer: 16 * 1024 * 1024 });
  return stdout;
}

/** Paths from `git status --porcelain=v1 -z`, relative to the worktree root with forward slashes. */
export function parsePorcelain(output: string): { path: string; code: string }[] {
  const entries: { path: string; code: string }[] = [];
  const parts = output.split("\0");
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]!;
    if (part.length < 4) continue;
    const code = part.slice(0, 2);
    entries.push({ path: part.slice(3), code });
    // A rename or copy is followed by its original path, which also counts as changed.
    if (code.includes("R") || code.includes("C")) {
      const original = parts[index + 1];
      if (original) entries.push({ path: original, code });
      index += 1;
    }
  }
  return entries;
}

async function statusEntries(worktree: string) {
  return parsePorcelain(await git(worktree, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]));
}

async function openSession(projectRoot: string): Promise<Session> {
  const worktree = await realpath((await git(projectRoot, ["rev-parse", "--show-toplevel"])).trim());
  const commonDirectory = resolve(worktree, (await git(worktree, ["rev-parse", "--git-common-dir"])).trim());
  const branch = (await git(worktree, ["rev-parse", "--abbrev-ref", "HEAD"])).trim();
  const startCommit = (await git(worktree, ["rev-parse", "HEAD"])).trim();
  const dirtyAtStart = [...new Set((await statusEntries(worktree)).map(({ path }) => path))].sort();
  return {
    identity: {
      repository: commonDirectory.endsWith(`${sep}.git`) ? commonDirectory.slice(0, -5) : commonDirectory,
      worktree, branch, startCommit, startedAt: new Date().toISOString(), dirtyAtStart,
    },
    cmsWrites: new Set(),
  };
}

/** Starts (once) the Git session for a CMS server root. */
export function startGitSession(projectRoot: string): Promise<Session> {
  const key = resolve(projectRoot);
  let session = sessions.get(key);
  if (!session) {
    session = openSession(key);
    sessions.set(key, session);
  }
  return session;
}

async function sessionFor(projectRoot: string): Promise<Session | undefined> {
  const session = sessions.get(resolve(projectRoot));
  if (!session) return undefined;
  try { return await session; }
  catch {
    // Fail closed: without a Git snapshot the CMS cannot keep its edits separate from other work.
    throw new CmsEditError("The CMS could not read this Git checkout, so it will not write files. Start it from a Git worktree.", 503);
  }
}

async function worktreePath(session: Session, absolutePath: string): Promise<string> {
  const real = await realpath(absolutePath).catch(() => absolutePath);
  const path = relative(session.identity.worktree, real);
  if (!path || path.startsWith("..") || resolve(session.identity.worktree, path) !== real) {
    throw new CmsEditError("The file is outside this CMS session's worktree.", 403);
  }
  return path.split(sep).join("/");
}

/** Refuses a write to a file that already had uncommitted changes when the session started. */
export async function guardCmsWrite(projectRoot: string, absolutePath: string): Promise<void> {
  const session = await sessionFor(projectRoot);
  if (!session) return;
  const path = await worktreePath(session, absolutePath);
  if (session.identity.dirtyAtStart.includes(path)) {
    throw new CmsEditError(`${path} already had uncommitted changes when the CMS started, so the CMS will not mix its edit with them. `
      + "Commit or set aside those changes and restart the CMS, or run the CMS from a separate worktree.", 423);
  }
}

/** Records a successful CMS write so the Git view can separate it from other changes. */
export async function noteCmsWrite(projectRoot: string, absolutePath: string): Promise<void> {
  const session = await sessionFor(projectRoot);
  if (!session) return;
  session.cmsWrites.add(await worktreePath(session, absolutePath));
}

export type GitSessionReport = Readonly<{
  identity: GitSessionIdentity;
  currentBranch: string;
  currentCommit: string;
  /** Changed now and written by this CMS session. */
  cmsChanges: readonly string[];
  /** Changed now, already dirty at session start, and not written by the CMS. */
  preexistingChanges: readonly string[];
  /** Changed now, clean at session start, and not written by the CMS: another editor or agent changed them. */
  otherChanges: readonly string[];
  status: string;
}>;

export async function gitSessionReport(projectRoot: string): Promise<GitSessionReport> {
  const session = await startGitSession(projectRoot);
  const { worktree, dirtyAtStart } = session.identity;
  const changed = [...new Set((await statusEntries(worktree)).map(({ path }) => path))].sort();
  return {
    identity: session.identity,
    currentBranch: (await git(worktree, ["rev-parse", "--abbrev-ref", "HEAD"])).trim(),
    currentCommit: (await git(worktree, ["rev-parse", "HEAD"])).trim(),
    cmsChanges: changed.filter((path) => session.cmsWrites.has(path)),
    preexistingChanges: changed.filter((path) => !session.cmsWrites.has(path) && dirtyAtStart.includes(path)),
    otherChanges: changed.filter((path) => !session.cmsWrites.has(path) && !dirtyAtStart.includes(path)),
    status: (await git(worktree, ["status", "--short", "--branch"])).trimEnd(),
  };
}

const maxDiffBytes = 400_000;

/** The diff of one currently changed file against HEAD. Only paths Git reports as changed are accepted. */
export async function gitFileDiff(projectRoot: string, requestedPath: unknown): Promise<Readonly<{ path: string; diff: string; truncated: boolean }>> {
  if (typeof requestedPath !== "string" || !requestedPath || requestedPath.length > 500) throw new CmsEditError("Choose a changed file.", 400);
  const session = await startGitSession(projectRoot);
  const { worktree } = session.identity;
  const entry = (await statusEntries(worktree)).find(({ path }) => path === requestedPath);
  if (!entry) throw new CmsEditError("That file has no uncommitted changes.", 404);
  let diff: string;
  if (entry.code === "??") {
    // Resolve links before the containment check so an untracked symlink cannot expose a file outside the worktree.
    const [absolute, root] = await Promise.all([realpath(resolve(worktree, entry.path)), realpath(worktree)]);
    if (!absolute.startsWith(`${root}${sep}`) || !(await stat(absolute)).isFile()) throw new CmsEditError("Not a file in this worktree.", 403);
    diff = `New untracked file ${entry.path}:\n\n${await readFile(absolute, "utf8")}`;
  } else {
    diff = await git(worktree, ["diff", "--no-color", "--no-ext-diff", "HEAD", "--", entry.path]);
  }
  const truncated = Buffer.byteLength(diff, "utf8") > maxDiffBytes;
  return { path: entry.path, diff: truncated ? `${diff.slice(0, maxDiffBytes)}\n… diff truncated; inspect it with git diff.` : diff, truncated };
}
