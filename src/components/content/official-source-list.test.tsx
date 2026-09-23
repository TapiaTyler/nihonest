import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText(/最終リンク確認日/)).toHaveTextContent("最終内容確認日");
    expect(screen.getByText(/最終リンク確認日/)).toHaveTextContent("国の機関 · 英語");
  });
});
