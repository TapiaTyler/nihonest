import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResidenceStatusExplorer } from "./residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";
import { viewModeStorageKey } from "@/lib/storage/view-mode";

describe("ResidenceStatusExplorer", () => {
  it("sorts category filters and places every status in one open category group", () => {
    const { container } = render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);

    const filters = screen.getByRole("group", { name: "Filter residence statuses by category" });
    expect(Array.from(filters.querySelectorAll("button"), (button) => button.textContent)).toEqual([
      "All statuses",
      "Business and high-skill",
      "Designated activities",
      "Diplomatic and official",
      "Family",
      "Status-based residence",
      "Study, culture, and training",
      "Visitor",
      "Work",
    ]);

    const statusNames = screen.getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/residence-statuses/"))
      .map((link) => link.getAttribute("aria-label") ?? "");
    expect(container.querySelectorAll("details[open]")).toHaveLength(8);
    expect(statusNames).toHaveLength(residenceStatuses.length);
    expect(new Set(statusNames).size).toBe(residenceStatuses.length);
  });

  it("filters records by category without labeling every status a draft", () => {
    render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);

    fireEvent.click(screen.getByRole("button", { name: "Study, culture, and training" }));

    expect(screen.getByRole("link", { name: "Student" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Engineer/Specialist in Humanities/International Services",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("3 / 30 statuses")).toBeInTheDocument();
    expect(screen.getAllByText("View status and related guidance")).toHaveLength(3);
  });

  it("shows the editorial status from each record", () => {
    const records = residenceStatuses.map((record) => record.id === "artist"
      ? { ...record, status: "verified" as const } : record);
    render(<ResidenceStatusExplorer residenceStatuses={records} />);
    fireEvent.click(screen.getByRole("button", { name: "Work" }));
    expect(screen.getByRole("link", { name: "Artist" })).toHaveTextContent("Reviewed");
    expect(screen.getByRole("link", { name: "Professor" })).toHaveTextContent("Draft");
  });

  it("shows the same statuses in the same order as a list and remembers the choice for this page", () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/residence-statuses");
    const statusLinks = () => screen.getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/residence-statuses/"))
      .map((link) => link.getAttribute("aria-label"));
    const { container, unmount } = render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);
    const toggle = screen.getByRole("group", { name: "Display as" });
    expect(screen.getByRole("button", { name: "Cards" })).toHaveAttribute("aria-pressed", "true");
    const cardOrder = statusLinks();
    expect(container.querySelector("details ul")).toBeNull();

    fireEvent.click(within(toggle).getByRole("button", { name: "List" }));
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    expect(statusLinks()).toEqual(cardOrder);
    expect(container.querySelectorAll("details ul")).toHaveLength(8);
    expect(window.localStorage.getItem(viewModeStorageKey("residence-statuses"))).toBe("list");
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBeNull();

    // Filtering still works in the list, and the remembered choice applies on the next visit.
    fireEvent.click(screen.getByRole("button", { name: "Work" }));
    expect(screen.getByRole("link", { name: "Artist" }).closest("li")).not.toBeNull();
    unmount();
    render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    window.localStorage.clear();
  });
});
