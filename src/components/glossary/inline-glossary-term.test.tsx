import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { InlineGlossaryTerm } from "./inline-glossary-term";

afterEach(() => vi.restoreAllMocks());

describe("InlineGlossaryTerm", () => {
  it("links directly to the glossary and exposes pronunciation on focus", () => {
    const term = glossaryTerms[0];
    render(<InlineGlossaryTerm term={term} />);

    expect(screen.getByRole("link", { name: term.japanese })).toHaveAttribute("href", `/glossary/${term.slug}`);
    expect(screen.getByRole("tooltip")).toHaveTextContent(`${term.kana} · ${term.romaji}`);
  });

  it("uses the first coarse-pointer tap to reveal context", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true } as MediaQueryList)),
    });
    const term = glossaryTerms[0];
    render(<InlineGlossaryTerm term={term} />);
    const link = screen.getByRole("link", { name: term.japanese });

    fireEvent.click(link);
    expect(link).toHaveAttribute("aria-expanded", "true");
  });
});
