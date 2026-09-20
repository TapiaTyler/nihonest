import { checkedAt, defineStructuredGuidance } from "@/data/structured-residence-status-guidance/guidance-builder";

/** Structured guidance owned by the family residence-status category. */
export const familyStructuredGuidance = {
  dependent: defineStructuredGuidance({
    researchState: "draft-pilot",
    routeKind: "activity-based",
    routeKindLabel: "Dependent-family activity status",
    periodsOfStay: [{ label: "Available period", duration: "A period individually designated, not exceeding 5 years", kind: "individually-designated", sourceIds: ["isa-dependent-status"] }],
    workAuthorization: { mode: "not-authorized-by-default", summary: "Dependent status authorizes ordinary activity as a supported spouse or child; it does not itself authorize paid work.", outsideActivityNote: "Qualifying part-time work may be possible only within a granted permission for activity outside the status. Full-time or materially different activity can require a status change." },
    activityScope: { included: ["Ordinary daily activity as the supported spouse or child of a sponsor holding an eligible status"], boundaries: ["The current sponsor list includes Specified Skilled Worker (ii), not category (i)", "Parents, siblings, unmarried partners, and other relatives are not included by support alone", "Paid work is outside the default activity"] },
    qualificationPathways: [{ id: "qualifying-dependency", label: "Qualifying dependency", allOf: [{ type: "relationship", summary: "Be the qualifying spouse or child of a sponsor with a status on the current eligible list." }, { type: "relationship", summary: "Demonstrate the relationship, genuine support, and ability to maintain the household." }], anyOf: [], exceptions: ["Some Highly Skilled Professional and Designated Activities family routes use separate provisions."], sourceIds: ["isa-dependent-status"] }],
    organizationConditions: [],
    renewal: { mode: "renewable", summary: "The individually designated period may be extended while the qualifying relationship, support, and sponsor circumstances continue, subject to review." },
    transitions: [{ label: "Independent work", summary: "A person beginning full-time qualifying work should examine a work status rather than rely on outside-activity permission." }, { label: "Relationship or sponsor change", summary: "Divorce, bereavement, ended support, sponsor departure, or a sponsor-status change requires prompt notification and route review." }],
    evidenceCategories: ["Relationship", "Sponsor status", "Financial support", "Household circumstances", "Outside-activity permission where relevant"],
    searchTerms: ["family visa", "spouse dependent", "child dependent", "dependent work permission", "family stay"],
    sourceAssertions: [{ sourceId: "isa-dependent-status", supports: ["Eligible sponsor statuses", "Qualifying relationship", "Period of stay"], lastCheckedAt: checkedAt }, { sourceId: "isa-dependent-outside-activity", supports: ["Twenty-eight-hour blanket permission", "Work restrictions"], lastCheckedAt: checkedAt }, { sourceId: "isa-spouse-notification", supports: ["Spouse notification after divorce or bereavement"], lastCheckedAt: checkedAt }],
  }),
} as const;
