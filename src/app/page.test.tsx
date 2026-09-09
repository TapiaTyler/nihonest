import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";
import { PersonalizationProvider } from "@/components/personalization/personalization-provider";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/components/account/account-session-provider", () => ({
  useAccountSession: () => ({
    status: "signed-out",
    endSession: vi.fn(),
    updateDisplayName: vi.fn(),
  }),
}));

vi.mock("@/lib/content/articles", () => ({
  getAllArticles: () => [],
  getAllGuidedJourneys: () => [],
}));

describe("Nihonest foundation", () => {
  it("renders the product name and tagline", () => {
    render(
      <PersonalizationProvider>
        <SiteHeader />
        <Home />
      </PersonalizationProvider>,
    );

    expect(screen.getByText("Nihonest")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Find your place in Japan." })).toBeInTheDocument();
  });

  it("provides accessible primary navigation", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(navigation).getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
    expect(within(navigation).getByRole("link", { name: "Login" })).toHaveAttribute("href", "/account");

    fireEvent.click(within(navigation).getByRole("button", { name: "Resources" }));
    expect(within(navigation).getByRole("link", { name: /Glossary/ })).toHaveAttribute("href", "/glossary");
  });
});
