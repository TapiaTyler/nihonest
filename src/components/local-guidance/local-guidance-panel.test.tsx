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
    expect([...prefecture.querySelectorAll("option")].map(({ textContent }) => textContent)).toEqual(["Not selected", "Aichi Prefecture", "Tokyo Metropolis"]);

    fireEvent.change(prefecture, { target: { value: "aichi" } });
    fireEvent.change(screen.getByLabelText("Municipality"), { target: { value: "nagoya" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
    expect(screen.getByRole("heading", { name: "Registering an address in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText(/designated city · Aichi Prefecture/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Nagoya City: Moving procedures/i })).toHaveAttribute("lang", "ja");
  });
});
