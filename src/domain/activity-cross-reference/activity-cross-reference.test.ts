import { describe, expect, it } from "vitest";
import { activityCrossReferenceSchema, assertionIsApproved, getApplicableActivityRules } from "./activity-cross-reference";

const activity = activityCrossReferenceSchema.parse({
  id: "side-work",
  label: "Add side work",
  shortLabel: "Side work",
  description: "Check separate rules.",
  mode: "guided",
  searchTerms: ["freelance"],
  questions: [{ id: "relationship", label: "Relationship", prompt: "How will you work?", choices: [{ id: "employee", label: "Employee" }, { id: "freelance", label: "Freelance" }] }],
  rules: [
    { id: "always", layer: "immigration", title: "Always", orientation: "Check immigration.", verify: ["Status"], links: [{ kind: "article", id: "guide", label: "Guide", href: "/articles/guide" }] },
    { id: "freelance-only", layer: "tax", title: "Freelance", orientation: "Check tax.", verify: ["Income"], when: [{ questionId: "relationship", choiceIds: ["freelance"] }], links: [{ kind: "article", id: "tax-guide", label: "Tax guide", href: "/articles/tax-guide" }] },
  ],
});

describe("activity cross-reference", () => {
  it("reveals only rules whose controlled conditions match", () => {
    expect(getApplicableActivityRules(activity, { relationship: "employee" }).map(({ id }) => id)).toEqual(["always"]);
    expect(getApplicableActivityRules(activity, { relationship: "freelance" }).map(({ id }) => id)).toEqual(["always", "freelance-only"]);
  });

  it("does not treat researched assertions as approved public claims", () => {
    expect(assertionIsApproved({ statement: "Draft claim", editorialState: "researched", sourceIds: ["source"] })).toBe(false);
    expect(assertionIsApproved({ statement: "Approved claim", editorialState: "approved", approvedAt: "2026-09-13", sourceIds: ["source"] })).toBe(true);
  });
});
