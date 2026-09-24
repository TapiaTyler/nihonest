import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import { localGuidanceLocationStorageKey } from "@/lib/storage/local-guidance-location";
import { PrefectureFinder } from "./prefecture-finder";

const data = getPrefectureFinderData();

describe("PrefectureFinder", () => {
  it("searches and selects without changing saved local context", () => {
    window.localStorage.setItem(localGuidanceLocationStorageKey, "nagoya");
    render(<PrefectureFinder locale="en" {...data} />);
    const search = screen.getByRole("searchbox", { name: "Search prefectures" });
    const select = screen.getByRole("combobox", { name: "Choose a prefecture" });
    expect(screen.getByRole("status")).toHaveTextContent("47 prefectures found");
    fireEvent.change(search, { target: { value: "東京都" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 prefecture found");
    fireEvent.change(select, { target: { value: "jp-13000" } });
    expect(screen.getByRole("heading", { name: "Shinjuku City" })).toBeInTheDocument();
    expect(screen.queryByText("Nagoya City")).not.toBeInTheDocument();
    expect(screen.getByText(/not the entire prefecture/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registering an address in Shinjuku" })).toHaveAttribute("href", "/articles/registering-your-address-after-arrival?local=jp-13104#local-guidance-heading");
    fireEvent.change(search, { target: { value: "no-such-prefecture" } });
    expect(screen.getByRole("status")).toHaveTextContent("0 prefectures found");
    expect(screen.getByText(/outside the current search results/)).toBeInTheDocument();
    expect(within(select).getByRole("option", { name: /Tokyo/ })).toHaveValue("jp-13000");
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(select).toHaveValue("jp-13000");
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(select).toHaveValue("");
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
  });

  it("shows an explicit local coverage gap and Japanese interface fallback", () => {
    render(<PrefectureFinder locale="ja" {...data} />);
    expect(screen.getByText(/currently in English/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a prefecture" }), { target: { value: "jp-01000" } });
    expect(screen.getByText(/does not yet have researched local supplements/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Hokkaido/ })).toHaveTextContent("北海道");
    expect(screen.getByText(/Prefecture-wide procedures for these articles have not been researched/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "National Health Insurance" }).map((link) => link.getAttribute("href"))).toContain("/articles/joining-national-health-insurance?local=jp-01000#local-guidance-heading");
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a mapped municipality or ward" }), { target: { value: "jp-01101" } });
    expect(screen.getByText(/Research for 札幌市中央区 on the guides below/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "National Health Insurance" }).map((link) => link.getAttribute("href"))).toContain("/articles/joining-national-health-insurance?local=jp-01101#local-guidance-heading");
  });
});
