import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { activityCrossReferences } from "@/data/activity-cross-references";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { ActivityCrossReferenceExplorer } from "./activity-cross-reference-explorer";

const handoff = activityCrossReferences.find(({ mode }) => mode === "handoff")!;
const link = handoff.rules[0].links[0];

function renderExplorer() {
  return render(
    <ContentLocaleProvider>
      <ActivityCrossReferenceExplorer
        activities={[handoff]}
        officialSources={[]}
        initialAnswers={{}}
        returnTo="/explore"
        translations={{ [handoff.id]: { "short-label": "翻訳した活動名" } }}
        linkTitles={{ [`${link.kind}:${link.id}`]: "翻訳したリンク" }}
      />
    </ContentLocaleProvider>,
  );
}

describe("ActivityCrossReferenceExplorer", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("keeps canonical English by default", () => {
    renderExplorer();
    expect(screen.getByRole("heading", { name: "What are you trying to do?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(handoff.shortLabel) }));
    expect(screen.getByRole("link", { name: `${link.label}` })).toBeInTheDocument();
  });

  it("applies overlays, translated link titles, and Japanese interface text, falling back per snippet", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    renderExplorer();
    expect(screen.getByRole("heading", { name: "何をしようとしていますか？" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /翻訳した活動名/ }));
    expect(screen.getByRole("heading", { name: "確認が必要なこと" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "翻訳したリンク" })).toBeInTheDocument();
    // Description has no overlay in this fixture, so it stays English.
    expect(screen.getByText(handoff.description)).toBeInTheDocument();
  });
});
