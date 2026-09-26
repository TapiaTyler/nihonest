import { describe, expect, it } from "vitest";
import { getAllFaqEntries } from "./faqs";

describe("FAQ related-target presentation labels", () => {
  it("resolves Japanese labels for active translated and canonically Japanese targets", () => {
    const entry = getAllFaqEntries().find(({ faq }) => faq.id === "prepare-for-permanent-residence");
    expect(entry).toBeDefined();

    const japaneseLabel = (kind: string, id: string) => entry?.targets.find((target) => target.kind === kind && target.id === id)?.japaneseLabel;
    expect(japaneseLabel("guide", "permanent-residence-in-japan")).toBeTruthy();
    expect(japaneseLabel("group", "family-and-long-term-residence")).toBeTruthy();
    expect(japaneseLabel("journey", "preparing-for-permanent-residence")).toBeTruthy();
    expect(japaneseLabel("glossary", "eiju-kyoka")).toBe("永住許可");
    expect(japaneseLabel("residence-status", "permanent-resident")).toBe("永住者");
  });

  it("uses the existing Japanese short labels for every FAQ activity link", () => {
    const activityTargets = getAllFaqEntries().flatMap(({ targets }) => targets.filter(({ kind }) => kind === "activity"));
    expect(activityTargets.length).toBeGreaterThan(0);
    expect(activityTargets.every(({ japaneseLabel }) => Boolean(japaneseLabel))).toBe(true);
    expect(activityTargets.find(({ id }) => id === "add-side-work-or-freelancing")?.japaneseLabel).toBe("副業・フリーランス");
  });
});
