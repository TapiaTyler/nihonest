import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "./content-locale-provider";
import { ArticleOutline } from "./article-outline";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import type { ArticleOutlineEntry } from "@/domain/article/article-outline";

const english: ArticleOutlineEntry[] = [
  { level: 2, id: "first", text: "First step" },
  { level: 3, id: "detail", text: "A detail" },
  { level: 2, id: "second", text: "Second step" },
  { level: 2, id: "third", text: "Third step" },
];
const japanese: ArticleOutlineEntry[] = english.map((entry, index) => ({ ...entry, id: `ja-${index}`, text: `手順${index + 1}` }));

function renderOutline(props: { english: ArticleOutlineEntry[]; japanese?: ArticleOutlineEntry[] }) {
  return render(<ContentLocaleProvider><ArticleOutline {...props} /></ContentLocaleProvider>);
}

// The inline row, the wide-screen rail and the phone sheet each render the list; CSS decides which one shows.
const inlineRow = () => screen.getAllByRole("navigation", { hidden: true })[0]!;

describe("ArticleOutline", () => {
  beforeEach(() => localStorage.clear());

  it("lists the headings as in-page links, collapsed until opened", () => {
    renderOutline({ english });
    const row = inlineRow();
    expect(row).toHaveAccessibleName("On this page");
    expect(row.querySelector("details")).not.toHaveAttribute("open");
    expect(within(row).getByRole("link", { name: "A detail" })).toHaveAttribute("href", "#detail");
    expect(within(row).getAllByRole("link")).toHaveLength(4);
  });

  it("offers the same links in the wide-screen rail and the phone sheet", () => {
    renderOutline({ english });
    const navigations = screen.getAllByRole("navigation", { hidden: true });
    expect(navigations).toHaveLength(3);
    for (const navigation of navigations) expect(within(navigation).getAllByRole("link", { hidden: true })).toHaveLength(4);
  });

  it("stays hidden for short guides", () => {
    renderOutline({ english: english.slice(0, 3) });
    expect(screen.queryAllByRole("navigation", { hidden: true })).toHaveLength(0);
  });

  it("follows the language the body is shown in", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderOutline({ english, japanese });
    const row = inlineRow();
    expect(row).toHaveAccessibleName("このページの内容");
    expect(row).toHaveAttribute("lang", "ja");
    expect(within(row).getByRole("link", { name: "手順2" })).toHaveAttribute("href", "#ja-1");
    expect(within(row).queryByRole("link", { name: "First step" })).not.toBeInTheDocument();
  });

  it("keeps the English outline for a guide with no Japanese translation", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderOutline({ english });
    expect(within(inlineRow()).getByRole("link", { name: "First step" })).toBeInTheDocument();
    expect(inlineRow()).toHaveAttribute("lang", "en");
  });
});
