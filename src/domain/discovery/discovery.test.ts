import { describe, expect, it } from "vitest";
import { articleGroupSchema, guidedJourneySchema, validateDiscoveryModel } from "./discovery";

describe("discovery model", () => {
  it("allows a journey to reuse articles from different groups", () => {
    const groups = [
      articleGroupSchema.parse({ id: "study", title: "Study", description: "Study guidance", articleIds: ["school"] }),
      articleGroupSchema.parse({ id: "arrival", title: "Arrival", description: "Arrival guidance", articleIds: ["address"] }),
    ];
    const journeys = [
      guidedJourneySchema.parse({
        id: "student",
        groupId: "study",
        title: "Student",
        description: "Student journey",
        introduction: "Choose the relevant study route.",
        steps: [
          { articleId: "school", applicability: ["all-routes"] },
          { articleId: "address", applicability: ["registered-resident"] },
        ],
      }),
    ];

    expect(() => validateDiscoveryModel(groups, journeys, ["school", "address"])).not.toThrow();
  });

  it("rejects duplicate articles in a journey", () => {
    const journey = guidedJourneySchema.parse({
      id: "student",
      groupId: "study",
      title: "Student",
      description: "Student journey",
      introduction: "Choose the relevant study route.",
      steps: [
        { articleId: "school", applicability: ["all-routes"] },
        { articleId: "school", applicability: ["student-status"] },
      ],
    });

    const group = articleGroupSchema.parse({ id: "study", title: "Study", description: "Study guidance", articleIds: ["school"] });
    expect(() => validateDiscoveryModel([group], [journey], ["school"])).toThrow("contains duplicate articles");
  });

  it("rejects unknown article references", () => {
    const group = articleGroupSchema.parse({ id: "arrival", title: "Arrival", description: "Arrival guidance", articleIds: ["missing"] });
    expect(() => validateDiscoveryModel([group], [], [])).toThrow('references unknown article "missing"');
  });
});
