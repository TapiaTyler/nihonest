import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLanguageOptions } from "./content-language-options";
import { ContentLocaleProvider } from "./content-locale-provider";
import {
  ArticleTranslationNotice,
  LocalizedArticleBody,
  LocalizedArticleHeading,
  parseTranslatedArticleMarkdown,
} from "./localized-article";

const translation = {
  sourceLocale: "en",
  targetLocale: "ja",
  reviewState: "machine-translated",
  fields: {
    title: "日本語の題名",
    description: "日本語の説明",
    body: "## 見出し\n\n本文です。\n\n- 項目\n\n> **注意：** 確認してください。",
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
    expect(screen.getByText("Machine-translated Japanese")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "見出し" })).toBeInTheDocument();
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
    expect(screen.getByText("Japanese translation unavailable")).toBeInTheDocument();
    expect(screen.getByText("Canonical English body")).toBeInTheDocument();
  });

  it("parses the supported translation Markdown structures", () => {
    expect(parseTranslatedArticleMarkdown(translation.fields.body).map(({ kind }) => kind)).toEqual([
      "heading",
      "paragraph",
      "unordered-list",
      "blockquote",
    ]);
  });
});
