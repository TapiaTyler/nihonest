import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResidenceStatusExplorer } from "./residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";

describe("ResidenceStatusExplorer", () => {
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
