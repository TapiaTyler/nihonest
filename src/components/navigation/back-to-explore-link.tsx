"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

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
  const { message } = useInterfaceMessages();

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
    >
      {message(href === "/saved" ? "back.saved" : href === "/roadmap" ? "back.roadmap" : href === "/my-journey" ? "back.myJourney" : "back.explore")}
    </Link>
  );
}
