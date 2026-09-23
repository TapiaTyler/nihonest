import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JapanPrefectureRegionGrid, JapanPracticalBasics, japanPrefectureRegions } from "./japan-geography-reference";

describe("Japan geography reference blocks", () => {
  it("keeps eight bilingual region cards covering all 47 prefectures", () => {
    const prefectures = japanPrefectureRegions.flatMap(({ prefectures }) => prefectures.en.split(", "));
    expect(japanPrefectureRegions).toHaveLength(8);
    expect(prefectures).toHaveLength(47);
    expect(new Set(prefectures).size).toBe(47);

    const { container, rerender } = render(<JapanPrefectureRegionGrid />);
    expect(container.querySelectorAll("details")).toHaveLength(8);
    expect(screen.getByText("Kansai or Kinki")).toBeInTheDocument();

    rerender(<JapanPrefectureRegionGrid locale="ja" />);
    expect(container.querySelectorAll("details")).toHaveLength(8);
    expect(screen.getByText("関西または近畿")).toBeInTheDocument();
    expect(screen.getByText(/三重県、滋賀県、京都府/)).toBeInTheDocument();
  });

  it("keeps emergency guide destinations in both language presentations", () => {
    const { rerender } = render(<JapanPracticalBasics />);
    expect(screen.getByRole("link", { name: "emergency-call guide" })).toHaveAttribute("href", "/articles/calling-police-fire-and-ambulance-services-in-japan");
    expect(screen.getByRole("link", { name: "disaster and evacuation guide" })).toHaveAttribute("href", "/articles/preparing-for-disasters-and-evacuation-in-japan");

    rerender(<JapanPracticalBasics locale="ja" />);
    expect(screen.getByRole("link", { name: "緊急通報のガイド" })).toHaveAttribute("href", "/articles/calling-police-fire-and-ambulance-services-in-japan");
    expect(screen.getByRole("link", { name: "災害・避難のガイド" })).toHaveAttribute("href", "/articles/preparing-for-disasters-and-evacuation-in-japan");
  });
});
