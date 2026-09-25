import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getLocalGuidanceForArticle, getSelectableLocalGuidanceLocations } from "@/lib/content/local-guidance";
import { localGuidanceLocationStorageKey } from "@/lib/storage/local-guidance-location";
import { LocalGuidancePanel } from "./local-guidance-panel";

describe("LocalGuidancePanel", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps national guidance available and persists an explicit pilot location", () => {
    render(<LocalGuidancePanel options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} locations={getSelectableLocalGuidanceLocations()} />);

    expect(screen.getByText(/national guidance above remains available/i)).toBeInTheDocument();
    const prefecture = screen.getByLabelText("Prefecture");
    const prefectureOptions = [...prefecture.querySelectorAll("option")].map(({ textContent }) => textContent);
    expect(prefectureOptions).toHaveLength(48);
    expect(prefectureOptions).toContain("Aichi");
    expect(prefectureOptions).toContain("Tokyo");
    expect(prefectureOptions).toContain("Hokkaido");

    fireEvent.change(prefecture, { target: { value: "aichi" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "nagoya" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
    expect(screen.getByRole("heading", { name: "Registering an address in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText(/designated city · Aichi/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Nagoya City: Moving procedures/i })).toHaveAttribute("lang", "ja");
  });

  it("shows a linked municipality without replacing the saved location", () => {
    window.localStorage.setItem(localGuidanceLocationStorageKey, "nagoya");
    render(<LocalGuidancePanel
      options={getLocalGuidanceForArticle("registering-your-address-after-arrival")}
      locations={getSelectableLocalGuidanceLocations()}
      linkedLocationId="shinjuku"
    />);

    expect(screen.getByLabelText("Prefecture")).toHaveValue("tokyo");
    expect(screen.getByLabelText("Municipality")).toHaveValue("shinjuku");
    expect(screen.getByRole("heading", { name: "Registering an address in Shinjuku" })).toBeInTheDocument();
    expect(screen.getByText(/saved local guidance location has not changed/)).toBeInTheDocument();
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "aichi" } });
    expect(screen.getByLabelText("Municipality")).toHaveValue("");
    expect(screen.queryByText(/saved local guidance location has not changed/)).not.toBeInTheDocument();
    expect(screen.getByText(/Research for Aichi on this article has not been done yet/)).toBeInTheDocument();
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("aichi");
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "nagoya" } });
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
  });

  it("offers general article advice for an unresearched prefecture and a designated-city ward", () => {
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-01000" } });
    expect(screen.getByText(/Research for Hokkaido on this article has not been done yet/)).toBeInTheDocument();
    expect(screen.getByText(/municipality's official site, look up enrollment/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "jp-01101" } });
    expect(screen.getByText(/Research for Chuo Ward, Sapporo on this article has not been done yet/)).toBeInTheDocument();
    expect(screen.getByText(/ward of a designated city/)).toBeInTheDocument();
  });
  it("lists municipalities in English, each designated city followed by its wards, and all of Tokyo", () => {
    render(<LocalGuidancePanel options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} locations={getSelectableLocalGuidanceLocations()} />);
    const municipalityNames = () => [...screen.getByLabelText("Municipality").querySelectorAll("option")].slice(1).map(({ textContent }) => textContent);

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-27000" } });
    const osaka = municipalityNames();
    expect(osaka[0]).toBe("Osaka City");
    expect(osaka.indexOf("Sakai City")).toBe(osaka.findIndex((name) => name?.endsWith(", Sakai")) - 1);
    expect(osaka.slice(1, osaka.indexOf("Sakai City")).every((name) => name?.endsWith("Ward, Osaka"))).toBe(true);

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "tokyo" } });
    const tokyo = municipalityNames();
    expect(tokyo).toHaveLength(62);
    expect(tokyo[0]).toBe("Chiyoda City");
    expect(tokyo.indexOf("Hachioji City")).toBe(23);
    expect(tokyo.at(-1)).toBe("Ogasawara Village");
    const groups = [...screen.getByLabelText("Municipality").querySelectorAll("optgroup")];
    expect(groups.map((group) => [group.label, group.querySelectorAll("option").length])).toEqual([["Special wards", 23], ["Tama area", 30], ["Island area", 9]]);
  });
  it("disables the municipality selector with a prefecture-wide note when no municipalities are mapped", () => {
    render(<LocalGuidancePanel articleId="registering-your-address-after-arrival" options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} locations={getSelectableLocalGuidanceLocations()} />);
    const municipality = screen.getByLabelText("Municipality");
    expect(municipality).toBeDisabled();
    expect(screen.queryByText(/have not been mapped yet/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-10000" } });
    expect(municipality).toBeDisabled();
    expect(municipality).toHaveAccessibleDescription(/Municipalities in this prefecture have not been mapped yet/);
    expect(municipality.querySelector("option")).toHaveTextContent("Prefecture-wide only");

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-27000" } });
    expect(municipality).toBeEnabled();
    expect(screen.queryByText(/have not been mapped yet/)).not.toBeInTheDocument();
  });

  it("shows a designated city's supplement for its wards, labeled as city-wide", () => {
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "aichi" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "jp-23101" } });

    expect(screen.getByRole("heading", { name: "National Health Insurance in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText("Applies city-wide, including Chikusa Ward, Nagoya.")).toBeInTheDocument();
    expect(screen.queryByText(/has not been done yet/)).not.toBeInTheDocument();
  });
});
