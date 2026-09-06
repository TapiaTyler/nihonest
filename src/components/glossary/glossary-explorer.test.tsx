import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { GlossaryExplorer } from "./glossary-explorer";

describe("GlossaryExplorer", () => {
  it("searches across Japanese and macron-free romaji", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    const search = screen.getByRole("searchbox", { name: "Search Japanese or English" });

    fireEvent.change(search, { target: { value: "juminhyo" } });

    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 12 terms")).toBeInTheDocument();
  });

  it("offers a useful recovery when nothing matches", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "unrelated phrase" } });

    expect(screen.getByRole("heading", { name: "No glossary terms found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all terms" }));
    expect(screen.getByText("Showing 12 of 12 terms")).toBeInTheDocument();
  });

  it("uses one full-card link and shows a visible context prompt", () => {
    render(<GlossaryExplorer terms={[glossaryTerms[0]]} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Residence Card" })).toHaveAttribute("href", "/glossary/zairyu-card");
    expect(screen.getByText("View term and context →")).toBeInTheDocument();
  });
});
