import { describe, expect, it, vi } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseResidenceStatusGuidanceTranslations } from "./residence-status-guidance-translations";

vi.mock("server-only", () => ({}));

describe("Japanese residence-status guidance translations", () => {
  it("covers every status with current, machine-translated overlays", () => {
    expect(japaneseResidenceStatusGuidanceTranslations).toHaveLength(residenceStatuses.length);
    expect(new Set(japaneseResidenceStatusGuidanceTranslations.map(({ contentId }) => contentId)).size).toBe(residenceStatuses.length);
    expect(japaneseResidenceStatusGuidanceTranslations.every(({ availability, reviewState }) => availability === "active" && reviewState === "machine-translated")).toBe(true);
  });

  it("matches the current English guidance text and its paths", () => {
    for (const artifact of japaneseResidenceStatusGuidanceTranslations) {
      const guidance = residenceStatuses.find(({ id }) => id === artifact.contentId)?.structuredGuidance;
      expect(guidance).toBeDefined();
      const english = extractGuidanceText(guidance!);
      expect(artifact.sourceRevision).toBe(createTranslationSourceRevision(english));
      expect(Object.keys(artifact.fields).sort()).toEqual(Object.keys(english).sort());
    }
  });
});
