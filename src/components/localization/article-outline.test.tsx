import { render, screen } from "@testing-library/react";
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
  render(<ContentLocaleProvider><ArticleOutline {...props} /></ContentLocaleProvider>);
}

describe("ArticleOutline", () => {
  beforeEach(() => localStorage.clear());

  it("lists the headings as in-page links, collapsed until opened", () => {
    renderOutline({ english });
    const nav = screen.getByRole("navigation", { name: "On this page" });
    expect(nav.querySelector("details")).not.toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "A detail" })).toHaveAttribute("href", "#detail");
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("stays hidden for short guides", () => {
    renderOutline({ english: english.slice(0, 3) });
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("follows the language the body is shown in", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderOutline({ english, japanese });
    expect(screen.getByRole("navigation", { name: "このページの内容" })).toHaveAttribute("lang", "ja");
    expect(screen.getByRole("link", { name: "手順2" })).toHaveAttribute("href", "#ja-1");
    expect(screen.queryByRole("link", { name: "First step" })).not.toBeInTheDocument();
  });

  it("keeps the English outline for a guide with no Japanese translation", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderOutline({ english });
    expect(screen.getByRole("link", { name: "First step" })).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveAttribute("lang", "en");
  });
});
