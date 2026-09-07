import { fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalizationProvider } from "./personalization-provider";
import { OnboardingForm } from "./onboarding-form";
import { anonymousPreferencesStorageKey } from "@/lib/storage/anonymous-preferences";
import { articleGroups, guidedJourneys } from "@/data/discovery";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("OnboardingForm", () => {
  function renderForm() {
    render(
      <PersonalizationProvider>
        <Link href="/home">Back home</Link>
        <OnboardingForm
          journeys={guidedJourneys}
          groups={articleGroups}
          articles={[]}
        />
      </PersonalizationProvider>,
    );
  }

  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
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
