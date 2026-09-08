import { describe, expect, it } from "vitest";
import { checklistProgressSchema, resolvePersonalizedRoadmap, selectRoadmapRules, validateRoadmapContracts } from "./personalized-roadmap";

const definitions = [
  { id: "register-address", title: "Register your address", description: "Complete municipal registration.", relatedArticleIds: ["registering-your-address"], applicability: { journeyStageIds: ["recently-arrived" as const] } },
  { id: "prepare-entry", title: "Prepare for entry", description: "Collect entry documents.", relatedArticleIds: ["preparing-for-entry"], applicability: { journeyStageIds: ["preparing" as const] } },
];

const rules = [
  { id: "recommend-address", checklistId: "register-address", reason: "You recently arrived.", priority: 1, when: { journeyStageIds: ["recently-arrived" as const] } },
  { id: "recommend-entry", checklistId: "prepare-entry", reason: "You are preparing.", priority: 1, when: { journeyStageIds: ["preparing" as const] } },
];

describe("personalized roadmap contracts", () => {
  it("resolves only applicable rules and retains completed guidance", () => {
    const items = resolvePersonalizedRoadmap(definitions, rules, [{ checklistId: "register-address", state: "complete", updatedAt: "2026-09-07T12:00:00.000Z", completedAt: "2026-09-07T12:00:00.000Z" }], { journeyStageId: "recently-arrived", audienceIds: [] });

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ progressState: "complete", reason: "You recently arrived." });
  });

  it("requires completion time only for completed progress", () => {
    expect(checklistProgressSchema.safeParse({ checklistId: "register-address", state: "complete", updatedAt: "2026-09-07T12:00:00.000Z" }).success).toBe(false);
    expect(checklistProgressSchema.safeParse({ checklistId: "register-address", state: "in-progress", updatedAt: "2026-09-07T12:00:00.000Z", completedAt: "2026-09-07T12:00:00.000Z" }).success).toBe(false);
  });

  it("rejects recommendation rules that reference unknown checklist definitions", () => {
    expect(() => validateRoadmapContracts(definitions, [{ ...rules[0], checklistId: "missing-checklist" }])).toThrow(/unknown checklist/);
  });

  it("uses the most specific matching rule without duplicating a checklist item", () => {
    const duplicateRules = [
      { id: "stage-address", checklistId: "register-address", reason: "Stage recommendation", priority: 1, when: { journeyStageIds: ["recently-arrived" as const] } },
      { id: "journey-address", checklistId: "register-address", reason: "Journey recommendation", priority: 10, when: { journeyIds: ["newcomer-journey"] } },
    ];

    const items = resolvePersonalizedRoadmap(definitions, duplicateRules, [], {
      journeyStageId: "recently-arrived",
      journeyId: "newcomer-journey",
      audienceIds: [],
    });

    expect(items).toHaveLength(1);
    expect(items[0].reason).toBe("Journey recommendation");
  });

  it("excludes broad stage rules after a journey is selected", () => {
    const selected = selectRoadmapRules([
      { id: "planning-study", checklistId: "prepare-entry", reason: "Planning stage", priority: 1, when: { journeyStageIds: ["planning"] } },
      { id: "professional-entry", checklistId: "prepare-entry", reason: "Professional journey", priority: 1, when: { journeyIds: ["professional-worker"] } },
    ], { journeyStageId: "planning", journeyId: "professional-worker", audienceIds: [] });

    expect(selected.map(({ id }) => id)).toEqual(["professional-entry"]);
  });
});
