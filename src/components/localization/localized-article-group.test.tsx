import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "./content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { LocalizedArticleGroupHeading } from "./localized-article-group";

describe("localized article-group heading", () => {
  it("presents matching Japanese fields while retaining the stable group record", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(
      <ContentLocaleProvider>
        <LocalizedArticleGroupHeading
          group={{ id: "arrival-essentials", title: "Arrival essentials", description: "Canonical description", articleIds: ["one", "two"] }}
          guideCount={2}
          translations={[{ contentId: "arrival-essentials", targetLocale: "ja", title: "来日後の生活手続き", description: "来日直後の共通手続きです。" }]}
        />
      </ContentLocaleProvider>,
    );

    expect(screen.getByRole("heading", { name: "来日後の生活手続き" })).toBeInTheDocument();
    expect(screen.getByText("2 件のガイド")).toBeInTheDocument();
  });
});
