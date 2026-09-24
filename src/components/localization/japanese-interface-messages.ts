"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { InterfaceMessageCatalog } from "@/domain/localization/interface-message-lookup";
import { readContentLocale } from "@/lib/storage/content-locale";

/**
 * Loads the Japanese interface catalog as a separate chunk, so English readers never download it. Until it
 * arrives, messages fall back to English. A failed load is retried the next time Japanese is requested.
 */

let catalog: InterfaceMessageCatalog | undefined;
let pending: Promise<void> | undefined;
const listeners = new Set<() => void>();

export function loadJapaneseInterfaceMessages(): Promise<void> {
  pending ??= import("@/domain/localization/interface-message-catalogs/japanese")
    .then(({ japaneseInterfaceMessages }) => {
      catalog = japaneseInterfaceMessages;
      for (const listener of listeners) listener();
    })
    .catch(() => {
      pending = undefined;
    });
  return pending;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The Japanese catalog once loaded; starts loading when `requested` is true. */
export function useJapaneseInterfaceMessages(requested: boolean): InterfaceMessageCatalog | undefined {
  const loaded = useSyncExternalStore(subscribe, () => catalog, () => undefined);
  useEffect(() => {
    if (requested) void loadJapaneseInterfaceMessages();
  }, [requested]);
  return loaded;
}

/** Makes the catalog available synchronously, for tests that render Japanese without waiting for a chunk. */
export function provideJapaneseInterfaceMessages(messages: InterfaceMessageCatalog): void {
  catalog = messages;
  pending = Promise.resolve();
}

// A returning Japanese reader starts the download while the page hydrates rather than after it.
if (typeof window !== "undefined" && readContentLocale() === "ja") void loadJapaneseInterfaceMessages();
