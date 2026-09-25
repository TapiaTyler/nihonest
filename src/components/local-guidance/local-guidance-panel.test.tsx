import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("offers general article advice for an unresearched prefecture and an unlisted city", () => {
    const { unmount } = render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-01000" } });
    expect(screen.getByText(/Research for Hokkaido on this article has not been done yet/)).toBeInTheDocument();
    expect(screen.getByText(/municipality's official site, look up enrollment/)).toBeInTheDocument();
    unmount();

    // A saved municipality that is not listed still gets general guidance; only designated cities get the ward note.
    window.localStorage.setItem(localGuidanceLocationStorageKey, "jp-13208");
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    expect(screen.getByLabelText("Prefecture")).toHaveValue("tokyo");
    expect(screen.getByText(/Research for Chofu City on this article has not been done yet/)).toBeInTheDocument();
    expect(screen.queryByText(/is divided into wards/)).not.toBeInTheDocument();
  });

  it("lists only researched municipalities and offers Other for the rest of the prefecture", () => {
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "tokyo" } });
    const municipality = screen.getByLabelText("Municipality");
    expect(municipality).toHaveValue("");
    expect(municipality).toHaveAccessibleDescription(/Only municipalities with researched guidance are listed/);
    expect(within(municipality).queryByRole("option", { name: "Chofu City" })).not.toBeInTheDocument();

    fireEvent.change(municipality, { target: { value: "other" } });
    expect(municipality).toHaveValue("other");
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("tokyo");
    expect(screen.getByText(/Research for Tokyo on this article has not been done yet/)).toBeInTheDocument();

    fireEvent.change(municipality, { target: { value: "jp-13201" } });
    expect(screen.getByRole("heading", { name: /Hachioji/ })).toBeInTheDocument();
  });

  it("shows a saved municipality that is no longer listed as Other", () => {
    window.localStorage.setItem(localGuidanceLocationStorageKey, "jp-13208");
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    expect(screen.getByLabelText("Prefecture")).toHaveValue("tokyo");
    expect(screen.getByLabelText("Municipality")).toHaveValue("other");
    expect(screen.getByText(/Research for Chofu City on this article has not been done yet/)).toBeInTheDocument();
  });
  it("lists researched municipalities in English by official code, then Other", () => {
    render(<LocalGuidancePanel options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} locations={getSelectableLocalGuidanceLocations()} />);
    const municipalityNames = () => [...screen.getByLabelText("Municipality").querySelectorAll("option")].slice(1).map(({ textContent }) => textContent);

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-27000" } });
    expect(municipalityNames()).toEqual(["Osaka City", "Sakai City", "Other"]);

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "tokyo" } });
    const tokyo = municipalityNames();
    expect(tokyo).toHaveLength(28);
    expect(tokyo[0]).toBe("Chiyoda City");
    expect(tokyo.slice(23)).toEqual(["Hachioji City", "Tachikawa City", "Fuchu City", "Machida City", "Other"]);
    const groups = [...screen.getByLabelText("Municipality").querySelectorAll("optgroup")];
    expect(groups.map((group) => [group.label, group.querySelectorAll("option").length])).toEqual([["Special wards", 23], ["Tama area", 4]]);
  });
  it("disables the municipality selector with a prefecture-wide note when no municipality is researched", () => {
    render(<LocalGuidancePanel articleId="registering-your-address-after-arrival" options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} locations={getSelectableLocalGuidanceLocations()} />);
    const municipality = screen.getByLabelText("Municipality");
    expect(municipality).toBeDisabled();
    expect(screen.queryByText(/has researched guidance yet/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-10000" } });
    expect(municipality).toBeDisabled();
    expect(municipality).toHaveAccessibleDescription(/No municipality in this prefecture has researched guidance yet/);
    expect(municipality.querySelector("option")).toHaveTextContent("Prefecture-wide only");

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "jp-27000" } });
    expect(municipality).toBeEnabled();
    expect(screen.queryByText(/has researched guidance yet/)).not.toBeInTheDocument();
  });

  it("notes that each ward of a designated city may have its own procedures", () => {
    render(<LocalGuidancePanel articleId="joining-national-health-insurance" options={getLocalGuidanceForArticle("joining-national-health-insurance")} locations={getSelectableLocalGuidanceLocations()} />);
    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "aichi" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "nagoya" } });

    expect(screen.getByRole("heading", { name: "National Health Insurance in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText(/Nagoya City is divided into wards. Each ward office may have its own procedures/)).toBeInTheDocument();
    expect(screen.queryByText(/has not been done yet/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Prefecture"), { target: { value: "tokyo" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "shinjuku" } });
    expect(screen.queryByText(/is divided into wards/)).not.toBeInTheDocument();
  });
});
