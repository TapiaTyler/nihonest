import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { glossaryTerms } from "@/data/glossary";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { writeContentLocale } from "@/lib/storage/content-locale";
import { GlossaryExplorer } from "./glossary-explorer";

describe("GlossaryExplorer", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/glossary");
    sessionStorage.clear();
    writeContentLocale("en");
  });

  it("searches across Japanese and macron-free romaji", () => {
    render(<GlossaryExplorer terms={glossaryTerms} />);
    const search = screen.getByRole("searchbox", { name: "Search Japanese or English" });

    fireEvent.change(search, { target: { value: "juminhyo" } });

    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toBeInTheDocument();
    expect(screen.getByText(`Showing 1 of ${glossaryTerms.length} terms`)).toBeInTheDocument();
  });

  it("sorts visible terms by English name", () => {
    render(<GlossaryExplorer terms={[glossaryTerms[2], glossaryTerms[0], glossaryTerms[1]]} />);

    expect(screen.getAllByRole("link").map((link) => link.getAttribute("aria-label"))).toEqual([
      "Period of Stay",
      "Residence Card",
      "Status of Residence",
    ]);
  });

  it("places each unfiltered term in one open primary browse group", () => {
    const { container } = render(<GlossaryExplorer terms={glossaryTerms} />);

    expect(container.querySelectorAll("details[open]").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Residence Card" })).toHaveLength(1);
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
    expect(screen.getByText("View term and context")).toBeInTheDocument();
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

  it("localizes the index controls and counts in Japanese", () => {
    writeContentLocale("ja");
    render(<ContentLocaleProvider><GlossaryExplorer terms={glossaryTerms} /></ContentLocaleProvider>);

    expect(screen.getByRole("searchbox", { name: "日本語または英語で検索" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "トピックで用語集を絞り込む" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "自治体の手続き" })).toBeInTheDocument();
    expect(screen.getByText(`全${glossaryTerms.length}件中${glossaryTerms.length}件`)).toBeInTheDocument();
    expect([...document.querySelectorAll("details summary")].some((summary) => summary.textContent?.includes("自治体の手続き"))).toBe(true);
  });
});
