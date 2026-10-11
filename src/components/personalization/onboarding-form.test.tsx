import { fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalizationProvider } from "./personalization-provider";
import { OnboardingForm } from "./onboarding-form";
import { anonymousPreferencesStorageKey } from "@/lib/storage/anonymous-preferences";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { getArticleGroupSearchTranslations, getJourneyTranslations } from "@/lib/content/translations";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("OnboardingForm", () => {
  function renderForm(returnTo: "/" | "/roadmap" | "/my-journey" = "/") {
    render(
      <ContentLocaleProvider>
        <PersonalizationProvider>
          <Link href="/home">Back home</Link>
          <OnboardingForm
            journeys={guidedJourneys}
            groups={articleGroups}
            articles={[]}
            returnTo={returnTo}
            journeyTranslations={getJourneyTranslations()}
            groupTranslations={getArticleGroupSearchTranslations()}
          />
        </PersonalizationProvider>
      </ContentLocaleProvider>,
    );
  }

  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it("explains why saving is unavailable until a stage is chosen, without making the button unreachable", () => {
    renderForm();

    const save = screen.getByRole("button", { name: "Save my starting point" });
    expect(save).toHaveAttribute("aria-disabled", "true");
    expect(save).toHaveAccessibleDescription("Choose a stage above to save your starting point.");
    fireEvent.click(save);
    expect(push).not.toHaveBeenCalled();
    expect(localStorage.getItem(anonymousPreferencesStorageKey)).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: /Recently arrived/ }));
    expect(save).toHaveAttribute("aria-disabled", "false");
    expect(save).not.toHaveAccessibleDescription("Choose a stage above to save your starting point.");
  });

  it("returns to the roadmap after saving an adjustment made from there", () => {
    renderForm("/roadmap");

    fireEvent.click(screen.getByRole("radio", { name: /Recently arrived/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save my starting point" }));

    expect(push).toHaveBeenCalledWith("/roadmap");
  });

  it("saves the selected journey stage locally", () => {
    renderForm();

    fireEvent.click(screen.getByRole("radio", { name: /Recently arrived/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save my starting point" }));

    expect(JSON.parse(localStorage.getItem(anonymousPreferencesStorageKey) ?? "null")).toEqual({
      version: 2,
      journeyStage: "recently-arrived",
      onboardingCompleted: true,
    });
    expect(push).toHaveBeenCalledWith("/");
  });

  it("supports the general experience without storing a stage", () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Skip and browse everything" }));

    expect(JSON.parse(localStorage.getItem(anonymousPreferencesStorageKey) ?? "null")).toEqual({
      version: 2,
      onboardingCompleted: true,
    });
    expect(push).toHaveBeenCalledWith("/explore");
  });

  it("presents and searches translated journey choices without changing their stable selection IDs", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderForm();

    expect(screen.getByText("留学生のためのジャーニー")).toBeInTheDocument();
    const search = screen.getByRole("searchbox", { name: "ジャーニーと経路を検索" });
    fireEvent.change(search, { target: { value: "短期留学" } });
    expect(screen.getByText("留学生のためのジャーニー")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /留学生のためのジャーニー/ })).toHaveAttribute("value", "student-moving-to-japan");
  });

  it("warns before an internal navigation would discard changed selections", () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderForm();

    fireEvent.click(screen.getByRole("radio", { name: /Recently arrived/ }));
    expect(fireEvent.click(screen.getByRole("link", { name: "Back home" }))).toBe(false);
    expect(confirm).toHaveBeenCalledWith(
      "You have unsaved changes to your starting point. Leave without saving them?",
    );

    confirm.mockRestore();
  });
});
