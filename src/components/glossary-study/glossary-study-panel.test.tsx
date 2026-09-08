import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { glossaryStudyStorageKey } from "@/lib/storage/glossary-study";
import { GlossaryStudyPanel } from "./glossary-study-panel";
import { GlossaryStudyProvider } from "./glossary-study-provider";

describe("GlossaryStudyPanel", () => {
  beforeEach(() => localStorage.clear());

  it("reveals a saved term and records an understood review locally", () => {
    render(
      <GlossaryStudyProvider>
        <GlossaryStudyPanel terms={[glossaryTerms[0]]} />
      </GlossaryStudyProvider>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Show kana" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Show romaji" }));
    expect(screen.queryByText(glossaryTerms[0].kana ?? "missing kana")).not.toBeInTheDocument();
    expect(screen.queryByText(glossaryTerms[0].romaji ?? "missing romaji")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox", { name: "Progress status" }), { target: { value: "learning" } });
    expect(JSON.parse(localStorage.getItem(glossaryStudyStorageKey) ?? "[]")[0]).toMatchObject({ state: "learning" });

    fireEvent.click(screen.getByRole("button", { name: "Show meaning" }));
    expect(screen.getByText(glossaryTerms[0].englishName)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "I understand this" }));
    expect(JSON.parse(localStorage.getItem(glossaryStudyStorageKey) ?? "[]")[0]).toMatchObject({
      termId: glossaryTerms[0].id,
      state: "reviewed",
      reviewCount: 1,
    });
  });

  it("changes the prompt side and jumps directly to another term", () => {
    render(
      <GlossaryStudyProvider>
        <GlossaryStudyPanel terms={[glossaryTerms[0], glossaryTerms[1]]} />
      </GlossaryStudyProvider>,
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Prompt side" }), { target: { value: "english" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Jump to term" }), { target: { value: glossaryTerms[1].id } });

    expect(screen.getByText(glossaryTerms[1].englishName)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show meaning" }));
    expect(screen.getByText(glossaryTerms[1].japanese)).toBeInTheDocument();
  });
});
