import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChecklistProgressProvider } from "@/components/roadmap/checklist-progress-provider";
import { articleMetadataSchema } from "@/domain/article/article";
import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";
import { MyJourney } from "./my-journey";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("@/components/personalization/personalization-provider", () => ({
  usePersonalization: () => ({
    isReady: true,
    preferences: { version: 2, onboardingCompleted: true, journeyStage: "planning", journeyId: "work-journey" },
    saveJourneyRoute: vi.fn(),
  }),
}));

const article = articleMetadataSchema.parse({
  id: "understand-work-status",
  slug: "understand-work-status",
  title: "Understand your work status",
  description: "Review the residence framework for your work.",
  journeyStageIds: ["planning"],
  topicIds: ["immigration"],
  audienceIds: ["employee"],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  status: "draft",
  createdAt: "2026-09-07",
  updatedAt: "2026-09-07",
});
const group = articleGroupSchema.parse({ id: "work", title: "Work", description: "Work guidance.", articleIds: [article.id] });
const journey = guidedJourneySchema.parse({
  id: "work-journey",
  groupId: group.id,
  title: "Professional worker journey",
  description: "Follow the professional work route.",
  introduction: "Use the route matching the real work.",
  phases: [{ id: "understand", title: "Understand", steps: [{ id: article.id, type: "article", articleId: article.id }] }],
});

describe("MyJourney", () => {
  it("opens the saved guided journey as the default plan", () => {
    render(<ChecklistProgressProvider><MyJourney journeys={[journey]} groups={[group]} articles={[article]} /></ChecklistProgressProvider>);

    expect(screen.getByRole("heading", { level: 1, name: "Professional worker journey" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Understand your work status" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Progress for this journey step" })).toBeInTheDocument();
  });
});
