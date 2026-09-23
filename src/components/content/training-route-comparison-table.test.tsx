import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrainingRouteComparisonTable } from "./training-route-comparison-table";

const routeHrefs = [
  "/articles/cultural-activities-visa",
  "/articles/student-visa-and-certificate-of-eligibility",
  "/articles/training-visa",
  "/articles/technical-intern-training-status",
  "/articles/employment-for-skill-development-system",
  "/articles/specified-skilled-worker-status",
  "/articles/choosing-a-work-status-and-coe",
];

describe("TrainingRouteComparisonTable", () => {
  it.each([
    ["en", /activities and the training, study, or work routes/i, "Proposed activity", "Route to examine first"],
    ["ja", /活動内容から最初に確認する研修・就学・就労経路/, "予定する活動", "最初に確認する経路"],
  ] as const)("renders seven shared routes in %s", (locale, tableName, activityHeading, routeHeading) => {
    render(<TrainingRouteComparisonTable locale={locale} />);
    const table = screen.getByRole("table", { name: tableName });

    expect(within(table).getAllByRole("row")).toHaveLength(8);
    expect(within(table).getByRole("columnheader", { name: activityHeading })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: routeHeading })).toBeInTheDocument();
    expect(within(table).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(routeHrefs);

    if (locale === "ja") {
      expect(within(table).getByRole("rowheader", { name: "無報酬の日本文化の学習または研究" })).toBeInTheDocument();
      expect(within(table).getByRole("link", { name: "育成就労" })).toBeInTheDocument();
      expect(within(table).getByRole("link", { name: "活動内容に基づく就労資格を比較" })).toBeInTheDocument();
    }
  });
});
