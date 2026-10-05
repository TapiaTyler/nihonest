import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { GroupArticleList } from "@/components/discovery/group-article-list";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";
import { glossaryTerms } from "@/data/glossary";
import { articleMetadataSchema } from "@/domain/article/article";
import { viewModeStorageKey } from "@/lib/storage/view-mode";

const article = articleMetadataSchema.parse({
  id: "opening-bank-account", slug: "opening-bank-account", title: "Opening a bank account",
  description: "Prepare identity and address records for bank screening.", journeyStageIds: ["recently-arrived"],
  topicIds: ["banking"], audienceIds: ["newcomer"], geographicScopes: ["national"], importance: "important",
  contentType: "guide", status: "needs-review", createdAt: "2026-09-06", updatedAt: "2026-09-06",
});

describe("list view on group and glossary pages", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("lists a group's guides and remembers the choice for group pages only", () => {
    render(<GroupArticleList articles={[article]} translations={[]} />);
    expect(screen.getByRole("link", { name: "Opening a bank account" }).closest("li")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("link", { name: "Opening a bank account" }).closest("li")).not.toBeNull();
    expect(window.localStorage.getItem(viewModeStorageKey("explore-group"))).toBe("list");
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBeNull();
  });

  it("lists glossary terms with the same entries as the cards", () => {
    window.history.replaceState(null, "", "/glossary");
    const { container } = render(<GlossaryExplorer terms={glossaryTerms} />);
    const termLinks = () => Array.from(container.querySelectorAll("a[href^='/glossary/']"), (link) => link.getAttribute("href"));
    const cardOrder = termLinks();
    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(termLinks()).toEqual(cardOrder);
    expect(container.querySelectorAll("details ul").length).toBeGreaterThan(0);
    expect(window.localStorage.getItem(viewModeStorageKey("glossary"))).toBe("list");
  });
});
