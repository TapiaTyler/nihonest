import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaxResidenceScopeTable } from "./tax-residence-scope-table";

describe("TaxResidenceScopeTable", () => {
  it.each([
    ["en", /broad Japanese income-tax scope/i, "Non-permanent resident"],
    ["ja", /日本の所得税の一般的な課税範囲/, "非永住者"],
  ] as const)("renders the shared scope rows in %s", (locale, tableName, expectedRow) => {
    render(<TaxResidenceScopeTable locale={locale} />);
    const table = screen.getByRole("table", { name: tableName });
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    expect(within(table).getByRole("rowheader", { name: expectedRow })).toBeInTheDocument();
  });
});
