"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";

type Field = HTMLInputElement | HTMLSelectElement;

/** The value the server-rendered HTML gave the field, before any reader input. */
function serverRenderedValue(field: Field): string {
  if (field instanceof HTMLInputElement) return field.defaultValue;
  const option = Array.from(field.options).find((candidate) => candidate.defaultSelected) ?? field.options[0];
  return option?.value ?? "";
}

const subscribeNever = () => () => undefined;

/**
 * Server-rendered fields work before their component hydrates, so a fast reader (or a slow device) can type or
 * choose while the JavaScript is still loading. React then keeps its own initial state while the browser keeps
 * showing the reader's input, and the two disagree. After hydration, this applies a value the reader already
 * entered through the field's normal change handler. It does nothing for client-only renders, and a value that
 * still matches the server HTML is left alone, so state restored after mount (such as a saved location) is kept.
 */
export function usePreHydrationInput<T extends Field>(apply: (value: string) => void): RefObject<T | null> {
  const ref = useRef<T>(null);
  const applyRef = useRef(apply);
  // The server snapshot is used only while hydrating, so this is true exactly when the field came from server HTML.
  const hydrating = useSyncExternalStore(subscribeNever, () => false, () => true);
  const hydrated = useRef(hydrating);
  useEffect(() => { applyRef.current = apply; });
  useEffect(() => {
    const field = ref.current;
    if (hydrated.current && field && field.value !== serverRenderedValue(field)) applyRef.current(field.value);
  }, []);
  return ref;
}
