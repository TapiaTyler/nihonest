import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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
});
