"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";

/** The first focusable element on every page; its text follows the selected interface language. */
export function SkipLink() {
  const { locale, message } = useInterfaceMessages();
  return <a className="skip-link" href="#main-content" lang={locale}>{message("navigation.skipToContent")}</a>;
}
