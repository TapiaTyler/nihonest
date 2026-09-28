import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { glossaryTerms } from "@/data/glossary";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { GlossaryCard } from "./glossary-card";
import { LocalizedTermGloss } from "./localized-term-gloss";

const term = glossaryTerms.find(({ id }) => id === "zairyu-card")!;

describe("glossary term names by interface language", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("heads English cards with the English name", () => {
    render(<ContentLocaleProvider><GlossaryCard term={term} /></ContentLocaleProvider>);
    expect(screen.getByRole("heading", { name: term.englishName })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName(term.englishName);
  });

  it("heads Japanese cards with the term itself and no English name", async () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><GlossaryCard term={term} /></ContentLocaleProvider>);
    expect(await screen.findByRole("heading", { name: term.japanese })).toHaveAttribute("lang", "ja");
    expect(screen.queryByText(term.englishName)).not.toBeInTheDocument();
  });

  it("glosses chips and lists with the reading for Japanese readers", async () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><LocalizedTermGloss term={term} separator=" — " /></ContentLocaleProvider>);
    expect(await screen.findByText(term.kana!, { exact: false })).toHaveAttribute("lang", "ja");
  });
});
