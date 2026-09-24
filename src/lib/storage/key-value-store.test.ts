import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { readSavedContent, subscribeToSavedContent, writeSavedContent } from "./saved-content";
import {
  browserStorageEnvironment,
  parseStoredJson,
  setStorageEnvironment,
  storedValue,
  type KeyValueStore,
  type StorageEnvironment,
} from "./key-value-store";

function memoryStore(): KeyValueStore & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
  };
}

/** Stands in for a native binding: its own stores and an in-memory change emitter, no window. */
function memoryEnvironment(): StorageEnvironment {
  const stores = { persistent: memoryStore(), session: memoryStore() };
  const listeners = new Set<{ area: string; key: string; onChange: () => void }>();
  return {
    store: (area) => stores[area],
    subscribe(area, key, onChange) {
      const listener = { area, key, onChange };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify(area, key) {
      for (const listener of listeners) if (listener.area === area && listener.key === key) listener.onChange();
    },
  };
}

afterEach(() => {
  setStorageEnvironment(browserStorageEnvironment);
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("shared key-value storage", () => {
  it("writes, notifies subscribers of the same key, and removes values", () => {
    const value = storedValue("nihonest:test:v1");
    const other = storedValue("nihonest:other:v1");
    const onChange = vi.fn();
    const onOtherChange = vi.fn();
    const unsubscribe = value.subscribe(onChange);
    other.subscribe(onOtherChange);

    value.write("one");
    expect(value.snapshot()).toBe("one");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onOtherChange).not.toHaveBeenCalled();

    value.write(null);
    expect(value.read()).toBeNull();
    expect(value.snapshot("fallback")).toBe("fallback");
    unsubscribe();
    value.write("two");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("keeps writes to a caller-supplied store private", () => {
    const value = storedValue("nihonest:test:v1");
    const onChange = vi.fn();
    value.subscribe(onChange);
    const store = memoryStore();
    value.write("private", store);
    expect(store.values.get("nihonest:test:v1")).toBe("private");
    expect(value.snapshot()).toBe("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reacts to other browser tabs for persistent keys only", () => {
    const persistent = vi.fn();
    const session = vi.fn();
    storedValue("nihonest:test:v1").subscribe(persistent);
    storedValue("nihonest:test:v1", "session").subscribe(session);
    window.dispatchEvent(new StorageEvent("storage", { key: "nihonest:test:v1" }));
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    expect(persistent).toHaveBeenCalledTimes(2);
    expect(session).not.toHaveBeenCalled();
  });

  it("falls back when storage throws", () => {
    const broken: KeyValueStore = {
      getItem: () => { throw new Error("disabled"); },
      setItem: () => { throw new Error("full"); },
    };
    const value = storedValue("nihonest:test:v1");
    expect(value.read(broken)).toBeNull();
    expect(() => value.write("x", broken)).not.toThrow();
  });

  it("runs the existing storage modules on a non-browser environment", () => {
    const environment = memoryEnvironment();
    setStorageEnvironment(environment);
    const onChange = vi.fn();
    subscribeToSavedContent(onChange);
    const records = [{ kind: "article" as const, contentId: "banking-in-japan", state: "saved" as const, updatedAt: "2026-09-07T12:00:00.000Z" }];

    writeSavedContent(records);
    expect(readSavedContent()).toEqual(records);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(window.localStorage.length).toBe(0);
  });

  it("parses stored JSON against a schema", () => {
    const schema = z.object({ id: z.string() });
    expect(parseStoredJson("{\"id\":\"a\"}", schema)).toEqual({ id: "a" });
    expect(parseStoredJson("{\"id\":1}", schema)).toBeUndefined();
    expect(parseStoredJson("not json", schema)).toBeUndefined();
    expect(parseStoredJson(null, schema)).toBeUndefined();
  });
});
