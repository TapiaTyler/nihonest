import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleTerminology } from "@/components/content/article-terminology";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { glossaryTerms } from "@/data/glossary";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";

const term = glossaryTerms.find(({ id }) => id === "zairyu-card")!;
const localized = { "zairyu-card": { ja: { shortDefinition: "中長期在留者に交付される身分証明書です。" } } };

describe("ArticleTerminology", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("glosses terms with their English names for English readers", () => {
    render(<ContentLocaleProvider><ArticleTerminology terms={[term]} localized={localized} /></ContentLocaleProvider>);
    expect(screen.getByRole("heading", { name: "Key Japanese terminology" })).toBeInTheDocument();
    expect(screen.getAllByText(term.englishName).length).toBeGreaterThan(0);
    expect(screen.queryByText("中長期在留者に交付される身分証明書です。")).not.toBeInTheDocument();
  });

  it("localizes the panel, glosses terms with their reading, and shows the Japanese definition for Japanese readers", async () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><ArticleTerminology terms={[term]} localized={localized} /></ContentLocaleProvider>);
    expect(await screen.findByRole("heading", { name: "主な日本語の用語" })).toBeInTheDocument();
    expect(screen.getByText(/読み方と意味が表示されます/)).toBeInTheDocument();
    // The reading replaces the English name, which would be an untranslated label for a Japanese reader.
    const gloss = screen.getAllByText(term.kana!).find((element) => element.closest("li") && !element.closest("[role='tooltip']"))!;
    expect(gloss).toHaveAttribute("lang", "ja");
    expect(screen.queryByText(term.englishName)).not.toBeInTheDocument();
    await act(async () => { fireEvent.focus(screen.getByRole("link")); });
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("中長期在留者に交付される身分証明書です。");
    expect(tooltip).toHaveTextContent("用語を選ぶと、用語集の項目が開きます。");
  });
});
