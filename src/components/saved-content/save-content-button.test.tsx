import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { savedContentStorageKey } from "@/lib/storage/saved-content";
import { SaveContentButton } from "./save-content-button";
import { SavedContentProvider } from "./saved-content-provider";

describe("SaveContentButton", () => {
  beforeEach(() => localStorage.clear());

  it("saves and removes an article locally", () => {
    render(<SavedContentProvider><SaveContentButton kind="article" contentId="opening-a-bank-account" /></SavedContentProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Save guide" }));
    expect(screen.getByRole("button", { name: "Remove guide from saved content" })).toBePressed();
    expect(screen.getByRole("status")).toHaveTextContent("Guide added to saved list");
    expect(JSON.parse(localStorage.getItem(savedContentStorageKey) ?? "[]")[0]).toMatchObject({ contentId: "opening-a-bank-account", state: "saved" });

    fireEvent.click(screen.getByRole("button", { name: "Remove guide from saved content" }));
    expect(JSON.parse(localStorage.getItem(savedContentStorageKey) ?? "[]")[0]).toMatchObject({ state: "removed" });
  });

  it("uses Japanese labels and feedback when Japanese is selected", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><SavedContentProvider><SaveContentButton kind="residence-status" contentId="student" /></SavedContentProvider></ContentLocaleProvider>);

    fireEvent.click(screen.getByRole("button", { name: "在留資格を保存する" }));
    expect(screen.getByRole("button", { name: "在留資格を保存から外す" })).toBePressed();
    expect(screen.getByRole("status")).toHaveTextContent("在留資格を保存リストに追加しました");
  });
});
