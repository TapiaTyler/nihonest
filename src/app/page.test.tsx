import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Nihonest foundation", () => {
  it("renders the product name and tagline", () => {
    render(
      <>
        <SiteHeader />
        <Home />
      </>,
    );

    expect(screen.getByText("Nihonest")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Find your place in Japan." })).toBeInTheDocument();
  });

  it("provides accessible primary navigation and labels future destinations", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(navigation).getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
    expect(within(navigation).queryByRole("link", { name: /Glossary/i })).not.toBeInTheDocument();
    expect(within(navigation).getByText("Glossary")).toHaveAttribute("title", "Coming soon");
  });
});
