"use client";

import { useEffect, useRef } from "react";
import { useInterfaceMessages } from "./interface-text";

/**
 * Keeps the browser-tab title in the selected language. Page metadata is generated on the server in
 * canonical English, while the language choice lives in the browser, so the Japanese title is applied on
 * the client and the English title is restored when the reader switches back. Renders nothing.
 *
 * Next streams metadata and can write the English <title> after this component hydrates, so while Japanese
 * is selected the head is observed: each English title Next writes is remembered and replaced again.
 */
export function LocalizedDocumentTitle({ japanese }: Readonly<{ japanese?: string }>) {
  const { locale } = useInterfaceMessages();
  const englishTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!japanese) return;
    if (locale !== "ja") {
      if (englishTitle.current && document.title === japanese) document.title = englishTitle.current;
      return;
    }
    const apply = () => {
      if (document.title === japanese) return;
      englishTitle.current = document.title;
      document.title = japanese;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [japanese, locale]);

  return null;
}
