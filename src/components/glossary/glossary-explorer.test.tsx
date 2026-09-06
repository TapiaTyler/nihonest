import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { GlossaryExplorer } from "./glossary-explorer";

describe("GlossaryExplorer", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/glossary");
    sessionStorage.clear();
  });

  it("searches across Japanese and macron-free romaji", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    const search = screen.getByRole("searchbox", { name: "Search Japanese or English" });

    fireEvent.change(search, { target: { value: "juminhyo" } });

    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toBeInTheDocument();
    expect(screen.getByText(`Showing 1 of ${glossaryTerms.length} terms`)).toBeInTheDocument();
  });

  it("offers a useful recovery when nothing matches", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "unrelated phrase" } });

    expect(screen.getByRole("heading", { name: "No glossary terms found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all terms" }));
    expect(screen.getByText(`Showing ${glossaryTerms.length} of ${glossaryTerms.length} terms`)).toBeInTheDocument();
  });

  it("uses one full-card link and shows a visible context prompt", () => {
    render(<GlossaryExplorer terms={[glossaryTerms[0]]} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Residence Card" })).toHaveAttribute("href", "/glossary/zairyu-card");
    expect(screen.getByText("View term and context →")).toBeInTheDocument();
  });

  it("persists its query and topic in term links", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "juminhyo" } });
    fireEvent.click(screen.getByRole("button", { name: "Municipal procedures" }));

    expect(window.location.search).toBe("?q=juminhyo&topic=municipal-procedures");
    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toHaveAttribute(
      "href",
      "/glossary/juminhyo?returnTo=%2Fglossary%3Fq%3Djuminhyo%26topic%3Dmunicipal-procedures",
    );
  });
});
