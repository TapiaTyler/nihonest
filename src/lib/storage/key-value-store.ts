import type { z } from "zod";

/**
 * The one storage interface for anonymous, on-device state. It is synchronous so that React's
 * `useSyncExternalStore` snapshots stay synchronous: the browser binds it to localStorage and sessionStorage, and
 * a native client can bind it to Expo SQLite's synchronous key-value store through `setStorageEnvironment`.
 * Storage is always optional: every read falls back and every write is best-effort.
 */

/** A store callers may pass in explicitly (tests, migrations). Writes that remove a value also need `removeItem`. */
export type KeyValueStore = Readonly<{
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}>;

/** Persistent state survives restarts; session state lasts for the current tab or app session. */
export type StorageArea = "persistent" | "session";

/** A platform binding: which stores exist and how changes to a key are observed. */
export type StorageEnvironment = Readonly<{
  store(area: StorageArea): KeyValueStore | undefined;
  /** Calls `onChange` when the key changes here or in another context (another browser tab). */
  subscribe(area: StorageArea, key: string, onChange: () => void): () => void;
  /** Announces a change made in this context. */
  notify(area: StorageArea, key: string): void;
}>;

const changeEvent = "nihonest:storage-changed";
type ChangeDetail = Readonly<{ area: StorageArea; key: string }>;

export const browserStorageEnvironment: StorageEnvironment = {
  store(area) {
    if (typeof window === "undefined") return undefined;
    try {
      return area === "persistent" ? window.localStorage : window.sessionStorage;
    } catch {
      // Access itself throws when storage is disabled.
      return undefined;
    }
  },
  subscribe(area, key, onChange) {
    if (typeof window === "undefined") return () => undefined;
    const onLocalChange = (event: Event) => {
      const detail = (event as CustomEvent<ChangeDetail>).detail;
      if (detail?.area === area && detail.key === key) onChange();
    };
    // Other tabs report persistent changes through the storage event; a null key means storage was cleared.
    const onOtherTab = (event: StorageEvent) => {
      if (event.key === key || event.key === null) onChange();
    };
    window.addEventListener(changeEvent, onLocalChange);
    if (area === "persistent") window.addEventListener("storage", onOtherTab);
    return () => {
      window.removeEventListener(changeEvent, onLocalChange);
      if (area === "persistent") window.removeEventListener("storage", onOtherTab);
    };
  },
  notify(area, key) {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<ChangeDetail>(changeEvent, { detail: { area, key } }));
  },
};

let environment: StorageEnvironment = browserStorageEnvironment;

/** Replaces the platform binding, for a native client or a test. Returns the previous environment. */
export function setStorageEnvironment(next: StorageEnvironment): StorageEnvironment {
  const previous = environment;
  environment = next;
  return previous;
}

/**
 * One stored key. `read` and `write` accept an explicit store; without one they use the environment's store and
 * only then announce the change, so writes to a caller-supplied store stay private to that store.
 */
export function storedValue(key: string, area: StorageArea = "persistent") {
  const store = () => environment.store(area);
  return {
    key,
    store,
    read(target: KeyValueStore | undefined = store()): string | null {
      try {
        return target?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    /** The raw string for `useSyncExternalStore`; `fallback` when the key is absent or storage is unavailable. */
    snapshot(fallback = ""): string {
      try {
        return store()?.getItem(key) ?? fallback;
      } catch {
        return fallback;
      }
    },
    subscribe(onChange: () => void): () => void {
      return environment.subscribe(area, key, onChange);
    },
    /** Stores `value`, or removes the key when `value` is null. */
    write(value: string | null, target: KeyValueStore | undefined = store()): void {
      if (!target) return;
      try {
        if (value === null) target.removeItem?.(key);
        else target.setItem(key, value);
        if (target === store()) environment.notify(area, key);
      } catch {
        // Storage is optional; a full or disabled store must not break the page.
      }
    },
  };
}

/** Parses stored JSON against a schema; undefined when absent, malformed, or invalid. */
export function parseStoredJson<T>(raw: string | null, schema: z.ZodType<T>): T | undefined {
  if (!raw) return undefined;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}
