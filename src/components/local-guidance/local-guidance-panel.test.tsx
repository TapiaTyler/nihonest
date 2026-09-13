import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getLocalGuidanceForArticle } from "@/lib/content/local-guidance";
import { localGuidanceLocationStorageKey } from "@/lib/storage/local-guidance-location";
import { LocalGuidancePanel } from "./local-guidance-panel";

describe("LocalGuidancePanel", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps national guidance available and persists an explicit pilot location", () => {
    render(<LocalGuidancePanel options={getLocalGuidanceForArticle("registering-your-address-after-arrival")} />);

    expect(screen.getByText(/national guidance above remains available/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Your location"), { target: { value: "nagoya" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
    expect(screen.getByRole("heading", { name: "Registering an address in Nagoya" })).toBeInTheDocument();
    expect(screen.getByText(/designated city · Aichi Prefecture/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Nagoya City: Moving procedures/i })).toHaveAttribute("lang", "ja");
  });
});
