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
    expect(prefectureOptions).toContain("Aichi Prefecture");
    expect(prefectureOptions).toContain("Tokyo Metropolis");
    expect(prefectureOptions).toContain("Hokkaido");

    fireEvent.change(prefecture, { target: { value: "aichi" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "nagoya" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
    expect(screen.getByRole("heading", { name: "Registering an address in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText(/designated city · Aichi Prefecture/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Research for Aichi Prefecture on this article has not been done yet/)).toBeInTheDocument();
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
    expect(screen.getByText(/Research for 札幌市中央区 on this article has not been done yet/)).toBeInTheDocument();
    expect(screen.getByText(/ward of a designated city/)).toBeInTheDocument();
  });
});
