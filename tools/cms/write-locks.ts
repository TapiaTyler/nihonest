/** Process-local locks: run one CMS server per checkout, as required by the operator guide. */
import { AsyncLocalStorage } from "node:async_hooks";
import { realpath } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const queues = new Map<string, Promise<void>>();
const heldLocks = new AsyncLocalStorage<ReadonlySet<string>>();

async function canonicalPath(path: string): Promise<string> {
  const absolute = resolve(path);
  try { return await realpath(absolute); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return resolve(await realpath(dirname(absolute)), absolute.slice(dirname(absolute).length + 1));
  }
}

async function withLock<T>(key: string, action: () => Promise<T>): Promise<T> {
  // Approval transactions and rollback call the same guarded replacement while holding their file lock.
  if (heldLocks.getStore()?.has(key)) return action();
  const previous = queues.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((done) => { release = done; });
  const queued = previous.then(() => gate);
  queues.set(key, queued);
  await previous;
  try {
    return await heldLocks.run(new Set([...(heldLocks.getStore() ?? []), key]), action);
  } finally {
    release();
    if (queues.get(key) === queued) queues.delete(key);
  }
}

/** Hold through revision re-read, replacement, bookkeeping, and any transaction rollback. */
export async function withCmsFileLock<T>(target: string, action: () => Promise<T>): Promise<T> {
  return withLock(`file:${await canonicalPath(target)}`, action);
}

/** Collection validation, persistence, and registration must finish before another creation validates. */
export async function withCmsCreationLock<T>(projectRoot: string, action: () => Promise<T>): Promise<T> {
  return withLock(`creation:${await realpath(projectRoot)}`, action);
}
