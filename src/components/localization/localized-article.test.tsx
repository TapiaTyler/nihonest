import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLanguageOptions } from "./content-language-options";
import { ContentLocaleProvider } from "./content-locale-provider";
import {
  ArticleTranslationNotice,
  LocalizedArticleBody,
  LocalizedArticleHeading,
  TranslatedArticleBody,
} from "./localized-article";

const translation = {
  sourceLocale: "en",
  targetLocale: "ja",
  reviewState: "machine-translated",
  fields: {
    title: "日本語の題名",
    description: "日本語の説明",
    body: "## 見出し\n\n[在留資格](/glossary/zairyu-shikaku)の本文です。\n\n- 項目\n\n> **注意：** 確認してください。",
  },
} as const;

describe("localized article presentation", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders Japanese pilot content and its review notice when selected", () => {
    render(
      <ContentLocaleProvider>
        <ContentLanguageOptions />
        <ArticleTranslationNotice translation={translation} />
        <LocalizedArticleHeading canonicalTitle="English title" canonicalDescription="English description" translation={translation} />
        <LocalizedArticleBody translation={translation}><p>English body</p></LocalizedArticleBody>
      </ContentLocaleProvider>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "日本語（試験版）" }));
    expect(screen.getByRole("heading", { name: "日本語の題名" })).toBeInTheDocument();
    expect(screen.getByText("機械翻訳された日本語")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "見出し" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "在留資格" })).toHaveAttribute("href", "/glossary/zairyu-shikaku");
    expect(screen.queryByText("English body")).not.toBeInTheDocument();
  });

  it("falls back to English when Japanese is unavailable", () => {
    render(
      <ContentLocaleProvider>
        <ContentLanguageOptions />
        <ArticleTranslationNotice />
        <LocalizedArticleBody><p>Canonical English body</p></LocalizedArticleBody>
      </ContentLocaleProvider>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "日本語（試験版）" }));
    expect(screen.getByText("日本語訳はまだありません")).toBeInTheDocument();
    expect(screen.getByText("Canonical English body")).toBeInTheDocument();
  });

  it("cycles the guide language with Alt+Shift+G and wraps to English", () => {
    render(
      <ContentLocaleProvider>
        <ContentLanguageOptions />
      </ContentLocaleProvider>,
    );

    fireEvent.keyDown(window, { key: "ג", code: "KeyG", altKey: true, shiftKey: true });
    expect(screen.getByRole("radio", { name: "日本語（試験版）" })).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(window, { key: "G", code: "KeyG", altKey: true, shiftKey: true });
    expect(screen.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Shortcut: Alt+Shift+G cycles languages.")).toBeInTheDocument();
  });

  it("does not cycle from editable targets or when another handler prevented the shortcut", () => {
    render(
      <ContentLocaleProvider>
        <ContentLanguageOptions />
        <input aria-label="Search" />
      </ContentLocaleProvider>,
    );

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Search" }), { key: "G", altKey: true, shiftKey: true });
    expect(screen.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(window, { key: "G", code: "", altKey: true, shiftKey: true });
    expect(screen.getByRole("radio", { name: "日本語（試験版）" })).toHaveAttribute("aria-checked", "true");

    const event = new KeyboardEvent("keydown", { key: "G", code: "KeyG", altKey: true, shiftKey: true, bubbles: true, cancelable: true });
    event.preventDefault();
    window.dispatchEvent(event);
    expect(screen.getByRole("radio", { name: "日本語（試験版）" })).toHaveAttribute("aria-checked", "true");
  });

  it("renders glossary links inside bold text and escaped link syntax", () => {
    render(
      <TranslatedArticleBody markdown={String.raw`1. **[在留資格認定証明書](/glossary/certificate-of-eligibility)（COE）。**

対象者には[在留カード]\(/glossary/zairyu-card)も交付されます。`} />,
    );

    expect(screen.getByRole("link", { name: "在留資格認定証明書" })).toHaveAttribute(
      "href",
      "/glossary/certificate-of-eligibility",
    );
    expect(screen.getByRole("link", { name: "在留カード" })).toHaveAttribute(
      "href",
      "/glossary/zairyu-card",
    );
  });

  it("renders official external links from translated Markdown", () => {
    render(<TranslatedArticleBody markdown={"[外国人生活支援ポータルサイト](https://www.moj.go.jp/isa/support/portal/)を確認します。"} />);
    expect(screen.getByRole("link", { name: "外国人生活支援ポータルサイト" })).toHaveAttribute("href", "https://www.moj.go.jp/isa/support/portal/");
  });

  it("renders Japanese geography blocks from their supported directives", () => {
    render(<TranslatedArticleBody markdown={":::japan-region-map\n\n:::japan-prefecture-finder\n\n:::japan-practical-basics"} />);
    fireEvent.click(screen.getAllByRole("button", { name: "東北" })[1]);
    expect(screen.getByRole("status")).toHaveTextContent("青森県、岩手県、宮城県");
    expect(screen.getByRole("heading", { name: "Guidance by location" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "緊急通報のガイド" })).toHaveAttribute("href", "/articles/calling-police-fire-and-ambulance-services-in-japan");
  });

  it("renders the shared residence-application fee schedule from a translation directive", () => {
    render(<TranslatedArticleBody markdown={"前の段落です。\n\n:::residence-application-fees\n\n後の段落です。"} />);

    expect(screen.getByRole("heading", { name: "手数料は受付日、申請方法、許可された期間によって異なる" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /在留資格変更および在留期間更新/ })).toBeInTheDocument();
    expect(screen.getByText("前の段落です。")).toBeInTheDocument();
    expect(screen.getByText("後の段落です。")).toBeInTheDocument();
  });

  it("renders the shared tax-residence comparison from a translation directive", () => {
    render(<TranslatedArticleBody markdown={":::tax-residence-scope"} />);

    expect(screen.getByRole("table", { name: /日本の所得税の一般的な課税範囲/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "非永住者" })).toBeInTheDocument();
  });

  it("renders the shared training-route comparison from a translation directive", () => {
    render(<TranslatedArticleBody markdown={":::training-route-comparison"} />);

    expect(screen.getByRole("table", { name: /活動内容から最初に確認する研修・就学・就労経路/ })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "2027年4月から始まる3年間の雇用による育成" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "育成就労" })).toHaveAttribute("href", "/articles/employment-for-skill-development-system");
  });

});
