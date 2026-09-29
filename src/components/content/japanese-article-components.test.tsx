import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TranslatedArticleBody } from "@/components/localization/localized-article";
import { renderJapaneseArticleComponents } from "./japanese-article-components";

describe("renderJapaneseArticleComponents", () => {
  it("renders only the component blocks the Japanese body uses", async () => {
    const body = "## 地域\n\n:::japan-region-map\n\n本文です。\n\n:::japan-practical-basics";
    const components = renderJapaneseArticleComponents(body);
    expect(Object.keys(components).sort()).toEqual(["japan-practical-basics", "japan-region-map"]);

    const { container } = render(<TranslatedArticleBody markdown={body} components={components} />);
    await screen.findByRole("button", { name: "沖縄を表示" });
    expect(container.querySelectorAll('svg[aria-label="日本の地方区分の地図"] > g[role="button"]')).toHaveLength(8);
    expect(screen.getByRole("link", { name: "緊急通報のガイド" })).toHaveAttribute("href", "/articles/calling-police-fire-and-ambulance-services-in-japan");
    expect(screen.getByText("本文です。")).toBeInTheDocument();
  });

  it("renders the Japanese prefecture finder with its server-assembled payload", async () => {
    const body = ":::japan-prefecture-finder";
    render(<TranslatedArticleBody markdown={body} components={renderJapaneseArticleComponents(body)} />);
    expect(await screen.findByRole("combobox", { name: "都道府県を選択" })).toBeInTheDocument();
  });

  it("returns nothing for a body without component blocks", () => {
    expect(renderJapaneseArticleComponents("## 見出し\n\n本文")).toEqual({});
  });

  it("fails clearly instead of dropping a block that was not rendered", () => {
    expect(() => render(<TranslatedArticleBody markdown=":::japan-region-map" />)).toThrow(/japan-region-map/);
  });
});
