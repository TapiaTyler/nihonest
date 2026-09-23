import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "./page";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { ReadingAidProvider } from "@/components/localization/reading-aid-provider";
import { PersonalizationProvider } from "@/components/personalization/personalization-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { writeContentLocale } from "@/lib/storage/content-locale";

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
  afterEach(() => writeContentLocale("en"));

  it("renders the product name and tagline", () => {
    render(
      <ContentLocaleProvider>
        <ReadingAidProvider>
          <PersonalizationProvider>
            <SiteHeader />
            <Home />
          </PersonalizationProvider>
        </ReadingAidProvider>
      </ContentLocaleProvider>,
    );

    expect(screen.getByText("Nihonest")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Find your place in Japan." })).toBeInTheDocument();
  });

  it("localizes the Home page and footer when Japanese is selected", () => {
    writeContentLocale("ja");

    render(
      <ContentLocaleProvider>
        <ReadingAidProvider>
          <PersonalizationProvider>
            <Home />
            <SiteFooter />
          </PersonalizationProvider>
        </ReadingAidProvider>
      </ContentLocaleProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "日本で、自分らしい暮らしを。" })).toBeInTheDocument();
    expect(screen.getByText("大切な情報を、分かりやすく丁寧に。")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "ガイドを探す" })).toBeInTheDocument();
    expect(screen.getByText("公開ガイドは、アカウントがなくてもすべて利用できます。")).toBeInTheDocument();

  });

  it("provides accessible primary navigation", () => {
    render(
      <ContentLocaleProvider>
        <ReadingAidProvider><SiteHeader /></ReadingAidProvider>
      </ContentLocaleProvider>,
    );

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(navigation).getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
    expect(within(navigation).getByRole("link", { name: "Login" })).toHaveAttribute("href", "/account");

    fireEvent.click(within(navigation).getByRole("button", { name: "Resources" }));
    expect(within(navigation).getByRole("link", { name: /Glossary/ })).toHaveAttribute("href", "/glossary");
  });
});
