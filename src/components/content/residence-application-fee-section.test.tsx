import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { residenceApplicationFees } from "@/data/residence-application-fees";
import { ResidenceApplicationFeeSection } from "./residence-application-fee-section";

describe("ResidenceApplicationFeeSection", () => {
  it("renders the canonical schedule in English", () => {
    render(<ResidenceApplicationFeeSection locale="en" />);
    const table = screen.getByRole("table", { name: /change-of-status and extension fees/i });
    expect(within(table).getAllByRole("row")).toHaveLength(residenceApplicationFees.currentSchedule.bands.length + 1);
    expect(within(table).getByText("JPY 65,550")).toBeInTheDocument();
  });

  it("renders the same canonical schedule with Japanese labels", () => {
    render(<ResidenceApplicationFeeSection locale="ja" />);
    const table = screen.getByRole("table", { name: /在留資格変更および在留期間更新/ });
    expect(within(table).getAllByRole("row")).toHaveLength(residenceApplicationFees.currentSchedule.bands.length + 1);
    expect(within(table).getByText("65,550円")).toBeInTheDocument();
    expect(screen.getByText(/@service-dgft\.com/)).toBeInTheDocument();
  });
});
