import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { residenceStatuses } from "@/data/residence-statuses";
import { getGlossaryTermById } from "@/lib/content/glossary";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import {
  LocalizedLastReviewed,
  LocalizedRelatedGuidance,
  LocalizedStatusBackLink,
  LocalizedStatusBadges,
  LocalizedStatusHeading,
} from "./localized-residence-status-chrome";

const status = residenceStatuses.find(({ id }) => id === "dependent")!;
const glossaryTerm = getGlossaryTermById(status.glossaryTermId)!;
const articles = [
  { id: "translated", href: "/articles/translated", title: "Translated guide" },
  { id: "untranslated", href: "/articles/untranslated", title: "Untranslated guide" },
];

function Chrome() {
  return (
    <>
      <LocalizedStatusBackLink href="/residence-statuses" className="" />
      <LocalizedStatusBadges category={status.category} status={status.status} />
      <LocalizedStatusHeading status={status} glossaryTerm={glossaryTerm} reading="reading" />
      <LocalizedRelatedGuidance articles={articles} articleTitles={{ translated: "翻訳済みのガイド" }} />
      <LocalizedLastReviewed date="2026-09-06" />
    </>
  );
}

describe("localized residence-status chrome", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("keeps canonical English chrome by default", () => {
    render(<Chrome />);
    expect(screen.getByRole("link", { name: "← Back to residence statuses" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(status.englishName);
    expect(screen.getByRole("link", { name: "Translated guide" })).toBeInTheDocument();
    expect(screen.getByText("September 6, 2026")).toBeInTheDocument();
  });

  it("localizes labels, promotes the Japanese name, and falls back per title in Japanese", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><Chrome /></ContentLocaleProvider>);
    expect(screen.getByRole("link", { name: "← 在留資格一覧に戻る" })).toBeInTheDocument();
    expect(screen.getByText("編集確認が必要")).toBeInTheDocument();
    expect(screen.getByText("家族")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(status.japaneseName);
    // The glossary popover also contains the English name; the subtitle is the paragraph marked as English.
    expect(screen.getAllByText(status.englishName).some((element) => element.tagName === "P" && element.getAttribute("lang") === "en")).toBe(true);
    expect(screen.getByRole("link", { name: "翻訳済みのガイド" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Untranslated guide" }).closest("li")).toHaveAttribute("lang", "en");
    expect(screen.getByText("2026年9月6日")).toBeInTheDocument();
  });

  it("shows the reviewed badge when a residence status is verified", () => {
    render(<LocalizedStatusBadges category={status.category} status="verified" />);
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
  });
});
