"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

function subscribe() {
  return () => undefined;
}

function glossaryHrefFromLocation() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo")
    ?? sessionStorage.getItem("nihonest:glossary-return");
  if (returnTo === "/saved") return returnTo;
  return returnTo?.startsWith("/glossary") && !returnTo.startsWith("//") ? returnTo : "/glossary";
}

export function BackToGlossaryLink() {
  const { message } = useInterfaceMessages();
  const href = useSyncExternalStore(subscribe, glossaryHrefFromLocation, () => "/glossary");

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-brand-link hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      {href === "/saved" ? message("glossary.backToSaved") : message("glossary.backToGlossary")}
    </Link>
  );
}
