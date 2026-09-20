import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, routeChoice, settlementSteps } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the family-and-long-term-residence family. */
export const joiningFamilyInJapanJourney = guidedJourneySchema.parse({
    id: "joining-family-in-japan", groupId: "family-and-long-term-residence", title: "Joining family in Japan journey",
    description: "Choose the relationship or personal-position route that actually applies, then follow one focused family-entry path.",
    introduction: "Dependent, spouse or child, and Long-Term Resident routes are not interchangeable. Select the documented basis for residence.",
    routes: [
      { id: "dependent", title: "Dependent", description: "Eligible dependent spouse or child of a qualifying foreign resident.", articleId: "dependent-family-stay-visa" },
      { id: "spouse-child-japanese", title: "Spouse or child of a Japanese national", description: "Route based on the covered relationship to a Japanese national.", articleId: "spouse-or-child-of-japanese-national" },
      { id: "spouse-child-permanent-resident", title: "Spouse or child of a Permanent Resident", description: "Route based on the covered relationship to a Permanent Resident.", articleId: "spouse-or-child-of-permanent-resident" },
      { id: "long-term-resident", title: "Long-Term Resident", description: "A separately designated personal-position route for qualifying circumstances.", articleId: "long-term-resident-status" },
    ],
    phases: [
      { id: "understand", title: "Understand and compare family routes", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-family-or-personal-status-in-japan")] },
      { id: "choose-route", title: "Choose the applicable family or personal route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain", title: "Maintain your residence", steps: [conditionalStep("renewing-or-changing-your-status-of-residence", "Before the family member's period expires or the relationship, support, or principal status changes"), conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay")] },
    ],
  });

export const preparingForPermanentResidenceJourney = guidedJourneySchema.parse({
    id: "preparing-for-permanent-residence", groupId: "family-and-long-term-residence", title: "Permanent residence preparation journey",
    description: "Organize the ongoing immigration and tax record supporting a future permanent-residence application.",
    introduction: "Eligibility depends on the applicable route and current criteria. This path supports preparation rather than predicting eligibility.",
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "maintain", title: "Maintain your record", steps: [articleStep("income-and-resident-tax-after-moving-to-japan"), articleStep("renewing-or-changing-your-status-of-residence")] },
      { id: "apply", title: "Prepare the application", steps: [articleStep("permanent-residence-in-japan")] },
    ],
  });
