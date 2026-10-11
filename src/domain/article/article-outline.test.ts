import { describe, expect, it } from "vitest";
import { articleOutline, headingId, headingPlainText } from "./article-outline";

describe("article outline", () => {
  it("reads visible heading text from inline Markdown", () => {
    expect(headingPlainText("Check your **residence card** and the [city office](/glossary/shiyakusho)")).toBe("Check your residence card and the city office");
  });

  it("builds readable anchors in any script", () => {
    expect(headingId("Before you arrive: what to bring")).toBe("before-you-arrive-what-to-bring");
    expect(headingId("住民登録（転入届）の手続き")).toBe("住民登録-転入届-の手続き");
    expect(headingId("!!!")).toBe("section");
  });

  it("lists only H2 and H3 headings in document order", () => {
    const outline = articleOutline("Intro paragraph.\n\n## First step\n\nText.\n\n### A detail\n\n- item\n\n:::japan-region-map\n\n## Second step");
    expect(outline).toEqual([
      { level: 2, id: "first-step", text: "First step" },
      { level: 3, id: "a-detail", text: "A detail" },
      { level: 2, id: "second-step", text: "Second step" },
    ]);
  });
});
