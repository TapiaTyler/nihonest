import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { themeStorageKey } from "@/lib/storage/theme";
import { ThemeEffects } from "./theme-effects";
import { ThemeOptions } from "./theme-options";

function renderOptions(onSelect = vi.fn()) {
  render(<ContentLocaleProvider><ThemeEffects /><ThemeOptions onSelect={onSelect} /></ContentLocaleProvider>);
  return onSelect;
}

describe("ThemeOptions", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("offers System, Light and Dark, with System selected by default", () => {
    renderOptions();
    const group = screen.getByRole("radiogroup", { name: "Theme" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "System" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Light" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Dark" })).not.toBeChecked();
  });

  it("applies a manual choice to the document and remembers it", () => {
    const onSelect = renderOptions();
    fireEvent.click(screen.getByRole("radio", { name: "Dark" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("returns control to the device when System is chosen again", () => {
    renderOptions();
    fireEvent.click(screen.getByRole("radio", { name: "Light" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    fireEvent.click(screen.getByRole("radio", { name: "System" }));
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
  });

  it("is available in Japanese", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderOptions();
    expect(await screen.findByRole("radiogroup", { name: "テーマ" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "システム設定" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "ダーク" })).toBeInTheDocument();
  });
});
