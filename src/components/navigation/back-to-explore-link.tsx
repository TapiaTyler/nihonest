"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

function exploreHrefFromLocation() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo")
    ?? sessionStorage.getItem("nihonest:explore-return");
  if (returnTo === "/saved") return returnTo;
  if (returnTo === "/roadmap") return returnTo;
  if (returnTo === "/my-journey") return returnTo;
  return returnTo?.startsWith("/explore") && !returnTo.startsWith("//") ? returnTo : "/explore";
}

export function BackToExploreLink() {
  const href = useSyncExternalStore(subscribe, exploreHrefFromLocation, () => "/explore");

  return (
    <Link
      href={href}
      className="rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
    >
      ← Back to {href === "/saved" ? "Saved" : href === "/roadmap" ? "Roadmap" : href === "/my-journey" ? "My Journey" : "Explore"}
    </Link>
  );
}
