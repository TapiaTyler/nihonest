import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";
import { SiteHeader } from "@/components/site-header";

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

  it("provides an accessible primary navigation without active future links", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(navigation).queryByRole("link", { name: /Explore/i })).not.toBeInTheDocument();
    expect(within(navigation).getByText("Explore")).toHaveAttribute("title", "Coming soon");
  });
});
