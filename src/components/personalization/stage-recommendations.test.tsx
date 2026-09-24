import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { getAllArticles, getAllGuidedJourneys } from "@/lib/content/articles";
import { getArticleSearchTranslations, getJourneyTitleTranslations } from "@/lib/content/translations";
import { anonymousPreferencesStorageKey } from "@/lib/storage/anonymous-preferences";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { HomeHero } from "./home-hero";
import { PersonalizationProvider } from "./personalization-provider";
import { StageRecommendations } from "./stage-recommendations";

const articles = getAllArticles().map(({ metadata }) => metadata);
const journeys = getAllGuidedJourneys();
const articleTranslations = getArticleSearchTranslations();
const journeyTitles = getJourneyTitleTranslations();
const journeyTitle = (locale: "en" | "ja") => locale === "ja"
  ? journeyTitles.find(({ contentId }) => contentId === "accepting-foreign-workers")!.title
  : journeys.find(({ id }) => id === "accepting-foreign-workers")!.title;
const focusedTitle = (locale: "en" | "ja") => locale === "ja"
  ? articleTranslations.find(({ contentId }) => contentId === "engineer-specialist-humanities-international-services-status")!.title
  : articles.find(({ id }) => id === "engineer-specialist-humanities-international-services-status")!.title;

function renderHome() {
  render(
    <ContentLocaleProvider>
      <PersonalizationProvider>
        <HomeHero journeys={journeys} articles={articles} articleTranslations={articleTranslations} journeyTitles={journeyTitles} />
        <StageRecommendations articles={articles} journeys={journeys} location="home" articleTranslations={articleTranslations} journeyTitles={journeyTitles} />
      </PersonalizationProvider>
    </ContentLocaleProvider>,
  );
}

describe("personalized home recommendations", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(anonymousPreferencesStorageKey, JSON.stringify({
      version: 2,
      journeyStage: "preparing",
      journeyId: "accepting-foreign-workers",
      focusedArticleId: "engineer-specialist-humanities-international-services-status",
      onboardingCompleted: true,
    }));
  });

  it("names the journey, the selected guide, and each recommended guide in Japanese when Japanese is selected", async () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    renderHome();

    await screen.findAllByRole("heading", { level: 2, name: new RegExp(journeyTitle("ja")) });
    const section = document.getElementById("home-recommendations-heading")!.closest("section")!;
    expect(section.querySelector("h2")).toHaveTextContent(journeyTitle("ja"));
    expect(section).not.toHaveTextContent(journeyTitle("en"));
    // Both the selected-guide link and that guide's card use the Japanese title.
    expect(within(section).getAllByRole("link", { name: new RegExp(focusedTitle("ja")) })).toHaveLength(2);
    expect(within(section).queryByText(focusedTitle("en"))).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: journeyTitle("ja") })).toBeInTheDocument();
  });

  it("keeps the canonical English titles when English is selected", async () => {
    renderHome();
    await screen.findAllByRole("heading", { level: 2, name: new RegExp(journeyTitle("en")) });
    expect(document.getElementById("home-recommendations-heading")).toHaveTextContent(journeyTitle("en"));
    expect(screen.getAllByText(focusedTitle("en")).length).toBeGreaterThan(0);
  });
});
