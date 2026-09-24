import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
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
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("shows Japanese step cards when Japanese is selected and a translation exists", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    const articleTranslations = [{ contentId: article.id, targetLocale: "ja", title: "就労資格を理解する", description: "仕事に関する在留の枠組みを確認します。" }];
    render(
      <ContentLocaleProvider>
        <ChecklistProgressProvider><MyJourney journeys={[journey]} groups={[group]} articles={[article]} articleTranslations={articleTranslations} /></ChecklistProgressProvider>
      </ContentLocaleProvider>,
    );

    expect(screen.getByRole("link", { name: "就労資格を理解する" })).toHaveAttribute("href", expect.stringContaining("/articles/understand-work-status"));
    expect(screen.getByText("仕事に関する在留の枠組みを確認します。")).toBeInTheDocument();
    expect(screen.queryByText("Understand your work status")).not.toBeInTheDocument();
    const reminderHref = document.querySelector("#journey-step-understand-work-status a[href^='/reminders']")!.getAttribute("href")!;
    const reminder = new URL(reminderHref, "https://example.test");
    expect(reminder.searchParams.get("title")).toBe("就労資格を理解する");
  });
});
