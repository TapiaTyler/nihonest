"use client";

import { useEffect } from "react";
import { themeColors } from "@/domain/theme/theme";
import { useThemePreference } from "./use-theme-preference";

/**
 * Applies the saved choice to the document. "system" removes `data-theme` so the `prefers-color-scheme` rules in
 * `tokens.css` decide; "light" and "dark" set it and win over the device. The browser bar colour follows too: the
 * viewport export gives one value per device scheme, and a manual choice replaces both until it is set back.
 */
export function ThemeEffects() {
  const { preference } = useThemePreference();
  useEffect(() => {
    const root = document.documentElement;
    if (preference === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", preference);

    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      if (meta.dataset.systemContent === undefined) meta.dataset.systemContent = meta.content;
      meta.content = preference === "system" ? meta.dataset.systemContent : themeColors[preference];
    }
  }, [preference]);
  return null;
}
