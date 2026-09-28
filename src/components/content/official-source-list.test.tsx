import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import type { OfficialSource } from "@/domain/source/source";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { OfficialSourceList } from "./official-source-list";

const source: OfficialSource = {
  id: "sample-source",
  organization: "Sample Agency",
  title: "Sample guidance",
  url: "https://example.com/guidance",
  authorityLevel: "national-government",
  language: "en",
  lastCheckedAt: "2026-09-12",
  lastReviewedAt: "2026-08-01",
  checkMethod: "manual",
};

describe("OfficialSourceList", () => {
  beforeEach(() => localStorage.clear());

  it("distinguishes link checks from substantive reviews in Japanese", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><OfficialSourceList sources={[source]} /></ContentLocaleProvider>);

    expect(screen.getByRole("heading", { name: "公式情報" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /新しいタブで開きます/ })).toHaveAttribute("href", source.url);
    const sourceMetadata = within(screen.getByRole("listitem")).getByText(/最終リンク確認日/);
    expect(sourceMetadata).toHaveTextContent("最終内容確認日");
    expect(sourceMetadata).toHaveTextContent("国の機関 · 英語");
  });

  it("shows Japanese readers the page's Japanese title and the organization's Japanese name", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><OfficialSourceList sources={[{ ...source, language: "ja", japaneseTitle: "見本の案内", japaneseOrganization: "見本庁" }]} /></ContentLocaleProvider>);
    expect(await screen.findByText("見本の案内")).toHaveAttribute("lang", "ja");
    expect(screen.getByText("見本庁")).toHaveAttribute("lang", "ja");
    expect(screen.queryByText(/Sample guidance/)).not.toBeInTheDocument();
  });

  it("marks English titles as English for Japanese readers when no Japanese title is recorded", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><OfficialSourceList sources={[{ ...source, language: "ja" }]} /></ContentLocaleProvider>);
    expect(await screen.findByText("Sample guidance")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Sample Agency")).toHaveAttribute("lang", "en");
  });

  it("shows long lists in batches of four", () => {
    const sources = Array.from({ length: 9 }, (_, index) => ({
      ...source,
      id: `source-${index}`,
      title: `Guidance ${index}`,
      url: `https://example.com/guidance-${index}`,
    }));
    render(<ContentLocaleProvider><OfficialSourceList sources={sources} /></ContentLocaleProvider>);

    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByText("Showing 4 of 9 official sources.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show 4 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: "Show 1 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(9);
    expect(screen.queryByRole("button", { name: /Show .* more/ })).not.toBeInTheDocument();
  });
});
