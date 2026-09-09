import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

const accountMocks = vi.hoisted(() => ({
  useAccountSession: vi.fn(),
  endSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/roadmap", useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/components/account/account-session-provider", () => ({
  useAccountSession: accountMocks.useAccountSession,
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    accountMocks.endSession.mockReset().mockResolvedValue({ ok: true });
    accountMocks.useAccountSession.mockReturnValue({
      status: "signed-out",
      endSession: accountMocks.endSession,
      updateDisplayName: vi.fn(),
    });
  });

  it("keeps key destinations visible and groups related desktop links", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(navigation).getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
    expect(within(navigation).getByRole("link", { name: "Saved" })).toHaveAttribute("href", "/saved");
    expect(within(navigation).getByRole("link", { name: "Login" })).toHaveAttribute("href", "/account");

    const journeyButton = within(navigation).getByRole("button", { name: "Journey" });
    fireEvent.click(journeyButton);
    expect(journeyButton).toHaveAttribute("aria-expanded", "true");
    expect(within(navigation).getByRole("link", { name: /My Journey/ })).toHaveAttribute("href", "/my-journey");
    expect(within(navigation).getByRole("link", { name: /Adjust Starting Point/ })).toHaveAttribute("href", "/onboarding");

    const resourcesButton = within(navigation).getByRole("button", { name: "Resources" });
    fireEvent.click(resourcesButton);
    expect(journeyButton).toHaveAttribute("aria-expanded", "false");
    expect(resourcesButton).toHaveAttribute("aria-expanded", "true");
    expect(within(navigation).getByRole("link", { name: /Glossary/ })).toHaveAttribute("href", "/glossary");
    expect(within(navigation).getByRole("link", { name: /Residence Statuses/ })).toHaveAttribute("href", "/residence-statuses");
  });

  it("shows account actions and signs out from the desktop account menu", async () => {
    accountMocks.useAccountSession.mockReturnValue({
      status: "signed-in",
      userId: "30000000-0000-4000-8000-000000000003",
      displayName: "Tyler",
      endSession: accountMocks.endSession,
      updateDisplayName: vi.fn(),
    });
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    fireEvent.click(within(navigation).getByRole("button", { name: "Tyler" }));
    expect(within(navigation).getByRole("link", { name: "Account settings" })).toHaveAttribute("href", "/account");
    fireEvent.click(within(navigation).getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(accountMocks.endSession).toHaveBeenCalledOnce());
  });

  it("opens and closes an accessible mobile navigation drawer", async () => {
    render(<SiteHeader />);

    const openButton = screen.getByRole("button", { name: "Open navigation menu" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();

    fireEvent.click(openButton);
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
    expect(within(mobileNavigation).getByRole("link", { name: "Roadmap" })).toHaveAttribute("aria-current", "page");

    fireEvent(screen.getByRole("dialog", { name: "Navigation" }), new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument());
    await waitFor(() => expect(openButton).toHaveFocus());
  });

  it("closes the drawer when a destination is selected", async () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    fireEvent.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Saved" }));
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument());
  });
});
