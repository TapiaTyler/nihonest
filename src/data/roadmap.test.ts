import { describe, expect, it } from "vitest";
import { checklistDefinitionSchema, validateRoadmapContracts } from "@/domain/roadmap/personalized-roadmap";
import { roadmapRecommendationRules } from "./roadmap";

describe("roadmap recommendation data", () => {
  it("uses unique rules that reference canonical checklist definitions", () => {
    const referencedDefinitions = [...new Set(roadmapRecommendationRules.map(({ checklistId }) => checklistId))]
      .map((id) => checklistDefinitionSchema.parse({ id, title: id, description: id, relatedArticleIds: [id] }));

    expect(() => validateRoadmapContracts(referencedDefinitions, roadmapRecommendationRules)).not.toThrow();
  });
});
