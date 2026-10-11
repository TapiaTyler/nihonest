import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  beforeEach(() => localStorage.clear());

  it("targets the main content in English", () => {
    render(<ContentLocaleProvider><SkipLink /></ContentLocaleProvider>);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
  });

  it("is announced in Japanese when Japanese is selected", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><SkipLink /></ContentLocaleProvider>);
    const link = await screen.findByRole("link", { name: "メインコンテンツへ移動" });
    expect(link).toHaveAttribute("lang", "ja");
  });
});
