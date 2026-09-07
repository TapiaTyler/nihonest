import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { articleGroupSchema } from "@/domain/discovery/discovery";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { ExploreDiscovery } from "./explore-discovery";

const bankArticle = articleMetadataSchema.parse({
  id: "opening-bank-account",
  slug: "opening-bank-account",
  title: "Opening a bank account",
  description: "Prepare identity and address records for bank screening.",
  journeyStageIds: ["recently-arrived"],
  topicIds: ["banking"],
  audienceIds: ["newcomer"],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  status: "needs-review",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

const group = articleGroupSchema.parse({
  id: "arrival-essentials",
  title: "Arrival essentials",
  description: "Shared early-settlement guidance.",
  articleIds: [bankArticle.id],
});

const laterAlphabeticalGroup = articleGroupSchema.parse({
  id: "zoning-guidance",
  title: "Zoning guidance",
  description: "Example guidance that should sort after arrival guidance.",
  articleIds: [bankArticle.id],
});

function renderDiscovery() {
  render(
    <ExploreDiscovery
      groups={[group]}
      articles={[bankArticle]}
      terms={glossaryTerms}
      residenceStatuses={residenceStatuses}
    />,
  );
}

describe("ExploreDiscovery", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/explore");
    sessionStorage.clear();
  });

  it("shows groups at a glance before a search is active", () => {
    renderDiscovery();

    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Opening a bank account" })).not.toBeInTheDocument();
  });

  it("uses predictable filter ordering and groups residence statuses by category", () => {
    renderDiscovery();

    expect(Array.from(screen.getByRole("combobox", { name: "Topic" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Banking", "Daily life", "Employment", "Healthcare", "Housing", "Immigration", "Language", "Municipal procedures", "Taxes", "Transportation",
    ]);
    expect(Array.from(screen.getByRole("combobox", { name: "Audience" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Newcomer", "Student", "Employee", "Freelancer", "Business owner", "Spouse", "Dependent", "Parent",
    ]);
    expect(Array.from(screen.getByRole("combobox", { name: "Content type" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Checklist", "Glossary", "Guide", "Official procedure", "Reference",
    ]);

    const residenceStatusSelect = screen.getByRole("combobox", { name: "Residence status" });
    const categoryGroups = Array.from(residenceStatusSelect.querySelectorAll("optgroup"));
    expect(categoryGroups.map((optionGroup) => optionGroup.label)).toEqual([
      "Work", "Business and high-skill", "Study, culture, and training", "Family", "Designated activities", "Visitor", "Diplomatic and official", "Status-based residence",
    ]);
    for (const optionGroup of categoryGroups) {
      const labels = Array.from(optionGroup.querySelectorAll("option"), (option) => option.textContent ?? "");
      expect(labels).toEqual([...labels].sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" })));
    }
  });

  it("alphabetizes the default content-group cards", () => {
    render(
      <ExploreDiscovery
        groups={[laterAlphabeticalGroup, group]}
        articles={[bankArticle]}
        terms={glossaryTerms}
        residenceStatuses={residenceStatuses}
      />,
    );

    expect(screen.getAllByRole("link", { name: /^Explore / }).map((link) => link.getAttribute("aria-label"))).toEqual([
      "Explore Arrival essentials",
      "Explore Zoning guidance",
    ]);
  });

  it("returns individual articles without opening a group", () => {
    renderDiscovery();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bank account" } });

    expect(screen.getByRole("link", { name: "Opening a bank account" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Groups (1)" })).toHaveAttribute("href", "#result-groups");
    expect(screen.getByRole("link", { name: "Guides (1)" })).toHaveAttribute("href", "#result-guides");
    expect(screen.getByRole("link", { name: "Glossary terms (1)" })).toHaveAttribute("href", "#result-terms");
    expect(screen.getByRole("heading", { name: "Content groups" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Guides" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Glossary terms" })).toBeInTheDocument();
  });

  it("can limit results to matching groups", () => {
    renderDiscovery();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bank account" } });
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));

    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Opening a bank account" })).not.toBeInTheDocument();
  });

  it("integrates glossary results and macron-free romanization", () => {
    renderDiscovery();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "juminhyo" } });

    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Glossary terms (1)" })).toHaveAttribute("href", "#result-terms");
    expect(screen.queryByRole("link", { name: /Groups \(/ })).not.toBeInTheDocument();
  });

  it("persists active discovery state in result links", () => {
    renderDiscovery();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bank account" } });

    expect(window.location.search).toBe("?q=bank+account");
    expect(screen.getByRole("link", { name: "Opening a bank account" })).toHaveAttribute(
      "href",
      "/articles/opening-bank-account?returnTo=%2Fexplore%3Fq%3Dbank%2Baccount",
    );
  });

  it("combines structured filters and provides zero-result recovery", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Guides" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Topic" }), { target: { value: "healthcare" } });

    expect(window.location.search).toBe("?kind=article&topic=healthcare");
    expect(screen.getByRole("heading", { name: "No matching guidance found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Browse all groups" }));
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
  });
});
