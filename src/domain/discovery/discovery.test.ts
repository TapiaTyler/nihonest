import { describe, expect, it } from "vitest";
import { articleGroupSchema, guidedJourneySchema, resolveJourneySteps, validateDiscoveryModel } from "./discovery";

const groups = [
  articleGroupSchema.parse({ id: "work", title: "Work", description: "Work guidance", articleIds: ["foundation", "legal", "medical", "arrival"] }),
];

const journey = guidedJourneySchema.parse({
  id: "professional", groupId: "work", title: "Professional", description: "Professional journey", introduction: "Choose a route.",
  routes: [
    { id: "legal", title: "Legal", description: "Legal route", articleId: "legal" },
    { id: "medical", title: "Medical", description: "Medical route", articleId: "medical" },
  ],
  phases: [
    { id: "understand", title: "Understand", steps: [{ id: "foundation", type: "article", articleId: "foundation" }] },
    { id: "choose", title: "Choose", steps: [{ id: "select-route", type: "route-choice" }] },
    { id: "arrive", title: "Arrive", steps: [{ id: "arrival", type: "article", articleId: "arrival" }] },
  ],
});

describe("discovery model", () => {
  it("resolves exactly one selected branch into the shared journey", () => {
    expect(resolveJourneySteps(journey, "legal").map(({ articleId }) => articleId)).toEqual(["foundation", "legal", "arrival"]);
    expect(resolveJourneySteps(journey, "medical").map(({ articleId }) => articleId)).toEqual(["foundation", "medical", "arrival"]);
  });

  it("shows common steps without presenting route alternatives sequentially before selection", () => {
    expect(resolveJourneySteps(journey).map(({ articleId }) => articleId)).toEqual(["foundation", "arrival"]);
  });

  it("validates an explicit route and phase model", () => {
    expect(() => validateDiscoveryModel(groups, [journey], ["foundation", "legal", "medical", "arrival"])).not.toThrow();
  });

  it("rejects a routed journey without exactly one route choice", () => {
    const invalid = { ...journey, phases: journey.phases.filter(({ id }) => id !== "choose") };
    expect(() => validateDiscoveryModel(groups, [invalid], ["foundation", "legal", "medical", "arrival"])).toThrow("exactly one route choice");
  });

  it("rejects unknown route filters on article steps", () => {
    const invalid = {
      ...journey,
      phases: journey.phases.map((phase) => phase.id === "arrive" ? {
        ...phase,
        steps: [{ id: "arrival", type: "article" as const, articleId: "arrival", requiredness: "required" as const, routeIds: ["missing"] }],
      } : phase),
    };
    expect(() => validateDiscoveryModel(groups, [invalid], ["foundation", "legal", "medical", "arrival"])).toThrow('unknown route "missing"');
  });
});
