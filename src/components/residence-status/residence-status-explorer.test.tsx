import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResidenceStatusExplorer } from "./residence-status-explorer";
import { residenceStatuses } from "@/data/residence-statuses";

describe("ResidenceStatusExplorer", () => {
  it("filters the sample records by category", () => {
    render(<ResidenceStatusExplorer residenceStatuses={residenceStatuses} />);

    fireEvent.click(screen.getByRole("button", { name: "Study" }));

    expect(screen.getByRole("link", { name: "Student" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Engineer/Specialist in Humanities/International Services",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 3 sample statuses")).toBeInTheDocument();
    expect(screen.getByText("View status details →")).toBeInTheDocument();
  });
});
