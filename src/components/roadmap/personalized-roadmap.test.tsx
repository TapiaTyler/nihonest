import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GlossaryStudyProvider } from "@/components/glossary-study/glossary-study-provider";
import { SavedContentProvider } from "@/components/saved-content/saved-content-provider";
import { articleMetadataSchema } from "@/domain/article/article";
import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { checklistProgressStorageKey } from "@/lib/storage/checklist-progress";
import { ChecklistProgressProvider } from "./checklist-progress-provider";
import { PersonalizedRoadmap } from "./personalized-roadmap";

vi.mock("@/components/personalization/personalization-provider", () => ({
  usePersonalization: () => ({
    isReady: true,
    preferences: { version: 2, onboardingCompleted: true, journeyStage: "preparing", journeyId: "work-journey" },
  }),
}));

const article = (id: string, title: string) => articleMetadataSchema.parse({
  id,
  slug: id,
  title,
  description: `${title} guidance.`,
  journeyStageIds: ["preparing"],
  topicIds: ["immigration"],
  audienceIds: ["employee"],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  status: "draft",
  createdAt: "2026-09-07",
  updatedAt: "2026-09-07",
});
const firstArticle = article("choose-status", "Choose a work status");
const secondArticle = article("prepare-entry", "Prepare for entry");
const journey = guidedJourneySchema.parse({
  id: "work-journey",
  groupId: "work",
  title: "Professional worker journey",
  description: "Work journey.",
  introduction: "Follow the route matching the work.",
  phases: [
    { id: "choose", title: "Choose your status", steps: [{ id: firstArticle.id, type: "article", articleId: firstArticle.id }] },
    { id: "prepare", title: "Prepare to move", steps: [{ id: secondArticle.id, type: "article", articleId: secondArticle.id }] },
  ],
});

describe("PersonalizedRoadmap", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(checklistProgressStorageKey, JSON.stringify([{
      checklistId: firstArticle.id,
      state: "complete",
      updatedAt: "2026-09-07T12:00:00.000Z",
      completedAt: "2026-09-07T12:00:00.000Z",
    }]));
  });

  it("summarizes journey phases and identifies the next incomplete action", () => {
    render(
      <SavedContentProvider><GlossaryStudyProvider><ChecklistProgressProvider>
        <PersonalizedRoadmap definitions={[]} rules={[]} articles={[firstArticle, secondArticle]} journeys={[journey]} />
      </ChecklistProgressProvider></GlossaryStudyProvider></SavedContentProvider>,
    );

    expect(screen.getByRole("progressbar", { name: "Overall journey completion" })).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("heading", { name: "Journey phases" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prepare for entry" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Choose your status/ })).toHaveAttribute("href", "/my-journey#phase-choose");
  });
});
