import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { checklistProgressStorageKey } from "@/lib/storage/checklist-progress";
import { ChecklistProgressProvider } from "./checklist-progress-provider";
import { JourneyChecklistControl } from "./journey-checklist-control";
import { JourneyProgressSummary } from "./journey-progress-summary";

describe("journey checklist progress", () => {
  beforeEach(() => localStorage.clear());

  it("stores progress and updates the journey summary", () => {
    render(
      <ChecklistProgressProvider>
        <JourneyProgressSummary checklistIds={["prepare-entry", "register-address"]} />
        <JourneyChecklistControl checklistId="prepare-entry" />
      </ChecklistProgressProvider>,
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Progress for this journey step" }), { target: { value: "complete" } });

    expect(screen.getByText("1 of 2 complete")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(checklistProgressStorageKey) ?? "[]")[0]).toMatchObject({
      checklistId: "prepare-entry",
      state: "complete",
    });
  });
});
