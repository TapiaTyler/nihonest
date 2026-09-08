import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResidenceStatusExplorer } from "./residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";

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

  it("filters draft records by category", () => {
    render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);

    fireEvent.click(screen.getByRole("button", { name: "Study, culture, and training" }));

    expect(screen.getByRole("link", { name: "Student" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Engineer/Specialist in Humanities/International Services",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Showing 3 of 29 draft statuses")).toBeInTheDocument();
    expect(screen.getAllByText("View status and related guidance →")).toHaveLength(3);
  });
});
