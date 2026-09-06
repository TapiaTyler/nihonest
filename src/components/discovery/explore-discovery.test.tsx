import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
  it("shows groups at a glance before a search is active", () => {
    renderDiscovery();

    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Opening a bank account" })).not.toBeInTheDocument();
  });

  it("returns individual articles without opening a group", () => {
    renderDiscovery();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bank account" } });

    expect(screen.getByRole("link", { name: "Opening a bank account" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
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
  });

  it("combines structured filters and provides zero-result recovery", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Guides" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Topic" }), { target: { value: "healthcare" } });

    expect(screen.getByRole("heading", { name: "No matching guidance found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Browse all groups" }));
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
  });
});
