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
    // Researched guidance appears only after a municipality or ward is chosen, and only for that area.
    expect(screen.queryByRole("heading", { name: "Researched local guidance" })).not.toBeInTheDocument();
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    expect(within(municipalitySelect).getByRole("option", { name: "Chiyoda City" })).toHaveValue("jp-13101");
    fireEvent.change(municipalitySelect, { target: { value: "jp-13104" } });
    expect(screen.getByRole("heading", { name: "Researched local guidance" })).toBeInTheDocument();
    expect(screen.getByText(/cover only Shinjuku City, not the entire prefecture/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registering an address in Shinjuku" })).toHaveAttribute("href", "/articles/registering-your-address-after-arrival?local=jp-13104#local-guidance-heading");
    expect(screen.queryByRole("link", { name: "Registering an address in Chiyoda" })).not.toBeInTheDocument();
    fireEvent.change(municipalitySelect, { target: { value: "" } });
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
    expect(screen.queryByText(/does not yet have researched local supplements/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Hokkaido/ })).toHaveTextContent("北海道");
    expect(screen.getByText(/Prefecture-wide procedures for these articles have not been researched/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "National Health Insurance" }).map((link) => link.getAttribute("href"))).toContain("/articles/joining-national-health-insurance?local=jp-01000#local-guidance-heading");
    // No municipality in Hokkaido has researched guidance, so no municipality selector is offered.
    expect(screen.queryByRole("combobox", { name: "Choose a municipality or ward" })).not.toBeInTheDocument();
  });

  it("lists only researched municipalities and offers Other for general starting points", () => {
    render(<PrefectureFinder locale="en" {...data} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a prefecture" }), { target: { value: "jp-13000" } });
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    expect(within(municipalitySelect).queryByRole("option", { name: "Chofu City" })).not.toBeInTheDocument();
    expect(within(municipalitySelect).getAllByRole("option").at(-1)).toHaveTextContent("Other");
    fireEvent.change(municipalitySelect, { target: { value: "other" } });
    expect(screen.queryByRole("heading", { name: "Researched local guidance" })).not.toBeInTheDocument();
    expect(screen.getByText(/Prefecture-wide procedures for these articles have not been researched/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "National Health Insurance" }).map((link) => link.getAttribute("href"))).toContain("/articles/joining-national-health-insurance?local=jp-13000#local-guidance-heading");
  });

  it("lists a designated city once and notes that its wards may differ", () => {
    render(<PrefectureFinder locale="en" {...data} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a prefecture" }), { target: { value: "jp-23000" } });
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    expect(within(municipalitySelect).getAllByRole("option").map(({ textContent }) => textContent)).toEqual(["Select a municipality or ward", "Nagoya City", "Other"]);
    fireEvent.change(municipalitySelect, { target: { value: "jp-23100" } });

    expect(screen.getByText(/Nagoya City is divided into wards. Each ward office may have its own procedures/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "National Health Insurance in Nagoya" })).toHaveAttribute("href", "/articles/joining-national-health-insurance?local=jp-23100#local-guidance-heading");
  });
});
