import { describe, expect, it } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { applyGuidanceText, extractGuidanceText } from "./guidance-text";

const professor = residenceStatuses.find(({ id }) => id === "professor")!.structuredGuidance!;

describe("structured guidance text paths", () => {
  it("extracts reader-facing snippets as valid artifact field IDs", () => {
    const texts = extractGuidanceText(professor);
    expect(texts["route-kind-label"]).toBe(professor.routeKindLabel);
    expect(texts["work-authorization.summary"]).toBe(professor.workAuthorization.summary);
    expect(texts["activity-scope.included.0"]).toBe(professor.activityScope.included[0]);
    for (const status of residenceStatuses) {
      for (const path of Object.keys(extractGuidanceText(status.structuredGuidance!))) {
        expect(path).toMatch(/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/);
      }
    }
  });

  it("never exposes identifiers, enums, search terms, or source provenance for translation", () => {
    const paths = Object.keys(extractGuidanceText(professor));
    expect(paths.some((path) => path.startsWith("search-terms") || path.startsWith("source-assertions"))).toBe(false);
    expect(paths.some((path) => /(^|\.)(route-kind|mode|kind|type|id|source-ids|target-status-id)(\.|$)/.test(path))).toBe(false);
  });

  it("applies translations snippet by snippet and keeps English where none exists", () => {
    const translated = applyGuidanceText(professor, { "route-kind-label": "高等教育機関での教育・研究の在留資格" });
    expect(translated.routeKindLabel).toBe("高等教育機関での教育・研究の在留資格");
    expect(translated.workAuthorization.summary).toBe(professor.workAuthorization.summary);
    expect(translated.searchTerms).toEqual(professor.searchTerms);
    expect(applyGuidanceText(professor, {})).toEqual(professor);
  });
});
