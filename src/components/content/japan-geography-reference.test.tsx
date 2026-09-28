import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JapanPrefectureRegionGrid, JapanPracticalBasics, JapanRegionMap, japanPrefectureRegions } from "./japan-geography-reference";

describe("Japan geography reference blocks", () => {
  it("maps eight bilingual regions covering all 47 prefectures", () => {
    const prefectures = japanPrefectureRegions.flatMap(({ prefectures }) => prefectures.en.split(", "));
    expect(japanPrefectureRegions).toHaveLength(8);
    expect(prefectures).toHaveLength(47);
    expect(new Set(prefectures).size).toBe(47);

    const { container, rerender } = render(<JapanRegionMap />);
    expect(container.querySelectorAll('svg[aria-label="Map of Japan\'s regions"] > g[role="button"]')).toHaveLength(8);
    expect(container.querySelectorAll('svg[aria-label="Map of Japan\'s regions"] > g > path')).toHaveLength(46);
    fireEvent.click(screen.getByRole("button", { name: "View Okinawa" }));
    expect(container.querySelectorAll('svg[aria-label="Map of Okinawa"] > g > path')).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Kyushu and Okinawa");
    fireEvent.click(screen.getByRole("button", { name: "Full Japan map" }));
    expect(container.querySelectorAll('svg[aria-label="Map of Japan\'s regions"] > g > path')).toHaveLength(46);
    expect(screen.getByText("Kansai or Kinki")).toBeInTheDocument();
    fireEvent.keyDown(screen.getAllByRole("button", { name: "Hokkaido" })[0], { key: "Enter" });
    expect(screen.getByRole("status")).toHaveTextContent("Region: Hokkaido · Prefectures: Hokkaido");
    fireEvent.click(screen.getAllByRole("button", { name: "Kansai or Kinki" })[1]);
    expect(screen.getByRole("status")).toHaveTextContent("Mie, Shiga, Kyoto");

    rerender(<JapanRegionMap locale="ja" />);
    expect(container.querySelectorAll('svg[aria-label="日本の地方区分の地図"] > g[role="button"]')).toHaveLength(8);
    expect(screen.getAllByText("関西または近畿")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("地方：関西または近畿 · 都道府県：三重県、滋賀県、京都府");
    expect(screen.getByText("地図または凡例から地方を選ぶと、その地方の都道府県が表示されます。")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "沖縄を表示" }));
    expect(container.querySelector('svg[aria-label="沖縄の地図"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: "日本全体の地図" })).toBeInTheDocument();
    rerender(<JapanPrefectureRegionGrid locale="ja" />);
    expect(container.querySelectorAll("details")).toHaveLength(1);
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
