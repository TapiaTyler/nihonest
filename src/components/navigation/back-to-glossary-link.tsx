"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

function glossaryHrefFromLocation() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo")
    ?? sessionStorage.getItem("nihonest:glossary-return");
  return returnTo?.startsWith("/glossary") && !returnTo.startsWith("//") ? returnTo : "/glossary";
}

export function BackToGlossaryLink() {
  const href = useSyncExternalStore(subscribe, glossaryHrefFromLocation, () => "/glossary");

  return (
    <Link
      href={href}
      className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
    >
      ← Back to Glossary
    </Link>
  );
}
