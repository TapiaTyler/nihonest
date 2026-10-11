"use client";

import { useEffect } from "react";

/** Added to the link that sends someone back to choose a different route. */
export const routeChoiceHash = "#choose-route";

/**
 * Takes a visitor who followed "Change route" to the route choices. The link passes `scroll={false}` so Next does not
 * jump to the top or to the anchor first (the site's `data-scroll-behavior` makes it scroll instantly), which lets this
 * scroll start from where the visitor is. The browser's own hash scrolling only works once
 * the target exists, and the personal journey renders after its saved route loads, so this scrolls on mount and moves
 * focus to the section heading so keyboard and screen-reader users land there too.
 */
export function ScrollToRouteChoice() {
  useEffect(() => {
    if (window.location.hash !== routeChoiceHash) return;
    const section = document.querySelector<HTMLElement>("[data-route-choice]");
    if (!section) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    section.querySelector<HTMLElement>("[data-route-choice-heading]")?.focus({ preventScroll: true });
  }, []);
  return null;
}
