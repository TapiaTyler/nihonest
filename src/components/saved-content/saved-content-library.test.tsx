import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { residenceStatuses } from "@/data/residence-statuses";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { savedContentStorageKey } from "@/lib/storage/saved-content";
import { SavedContentLibrary } from "./saved-content-library";
import { SavedContentProvider } from "./saved-content-provider";

const status = residenceStatuses.find(({ id }) => id === "student")!;

function renderLibrary() {
  return render(
    <ContentLocaleProvider>
      <SavedContentProvider>
        <SavedContentLibrary
          articles={[]}
          residenceStatuses={[status]}
          terms={[]}
          translations={{ statuses: [{ contentId: "student", targetLocale: "ja", summary: "留学の概要", purpose: "目的", typicalActivities: [], examples: [], considerations: [] }] }}
        />
      </SavedContentProvider>
    </ContentLocaleProvider>,
  );
}

describe("SavedContentLibrary", () => {
  beforeEach(() => localStorage.clear());

  it("shows a Japanese empty state when nothing is saved", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderLibrary();
    expect(await screen.findByRole("heading", { name: "まだ何も保存していません" })).toBeInTheDocument();
  });

  it("localizes saved-status headings, names, and summaries in Japanese", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    localStorage.setItem(savedContentStorageKey, JSON.stringify([{ kind: "residence-status", contentId: "student", state: "saved", updatedAt: "2026-09-23T00:00:00.000Z" }]));
    renderLibrary();
    expect(await screen.findByRole("heading", { name: "保存した在留資格" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: status.japaneseName })).toBeInTheDocument();
    expect(screen.getByText("留学の概要")).toHaveAttribute("lang", "ja");
  });

  it("keeps canonical English by default", async () => {
    localStorage.setItem(savedContentStorageKey, JSON.stringify([{ kind: "residence-status", contentId: "student", state: "saved", updatedAt: "2026-09-23T00:00:00.000Z" }]));
    renderLibrary();
    expect(await screen.findByRole("heading", { name: "Saved residence statuses" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: status.englishName })).toBeInTheDocument();
    expect(screen.getByText(status.summary)).toBeInTheDocument();
  });
});
