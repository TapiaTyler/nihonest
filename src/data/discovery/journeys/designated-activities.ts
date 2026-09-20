import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, settlementSteps } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the designated-activities family. */
export const workingHolidayInJapanJourney = guidedJourneySchema.parse({
    id: "working-holiday-in-japan", groupId: "designated-activities", title: "Working holiday journey",
    description: "Check bilateral eligibility, prepare the holiday-first application, and complete the settlement and departure tasks that apply.",
    introduction: "Working Holiday is one Designated Activities program. Country-specific conditions control eligibility and incidental work.",
    phases: [
      { id: "understand", title: "Understand the program", steps: [articleStep("designated-activities-status"), articleStep("working-holiday-in-japan")] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain-and-leave", title: "Manage tax and departure", steps: [conditionalStep("income-and-resident-tax-after-moving-to-japan", "If you receive taxable income or need to establish your tax treatment"), articleStep("leaving-japan-and-closing-out-procedures")] },
    ],
  });

export const digitalNomadInJapanJourney = guidedJourneySchema.parse({
    id: "digital-nomad-in-japan", groupId: "designated-activities", title: "Digital nomad journey",
    description: "Assess Japan's limited Digital Nomad route, remote-work boundaries, tax questions, and departure planning.",
    introduction: "This time-limited Designated Activities route is not a general local-employment or relocation route.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("digital-nomad-designated-activities")] },
      { id: "tax", title: "Check tax treatment", steps: [conditionalStep("tax-residence-and-taxable-income-in-japan", "If your stay or work creates a Japanese tax-residence question"), conditionalStep("foreign-income-tax-treaties-and-foreign-tax-credits", "If income is paid abroad, connected to another country, or taxed outside Japan")] },
      { id: "departure", title: "Prepare for the fixed end date", steps: [articleStep("leaving-japan-and-closing-out-procedures")] },
    ],
  });

export const jFindFutureCreationJourney = guidedJourneySchema.parse({
    id: "j-find-future-creation", groupId: "designated-activities", title: "J-Find future-creation journey",
    description: "Check recent-graduate eligibility, prepare the permitted future-creation activity, and manage longer-stay responsibilities.",
    introduction: "Verify the current eligible institutions, graduation timing, finances, activity, and family conditions.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("future-creation-j-find")] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain", title: "Manage ongoing responsibilities", steps: [conditionalStep("income-and-resident-tax-after-moving-to-japan", "If income or activity creates a Japanese tax obligation"), conditionalStep("reentry-permission-and-temporary-travel", "If leaving Japan temporarily during the permitted period"), conditionalStep("renewing-or-changing-your-status-of-residence", "Before extending within the cumulative maximum or moving to another authorized activity") ] },
    ],
  });

export const longStaySightseeingInJapanJourney = guidedJourneySchema.parse({
    id: "long-stay-sightseeing-in-japan", groupId: "designated-activities", title: "Long-stay sightseeing journey",
    description: "Check the long-stay sightseeing route while keeping its financial, insurance, no-work, and departure boundaries visible.",
    introduction: "This route supports qualifying sightseeing and recreation, not employment or freelancing.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("long-stay-sightseeing-designated-activities")] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Complete applicable resident procedures", steps: settlementSteps() },
      { id: "maintain", title: "Manage the one-year maximum", steps: [conditionalStep("renewing-or-changing-your-status-of-residence", "Before the initial six-month period expires, if applying for the permitted extension")] },
      { id: "departure", title: "Prepare to leave", steps: [articleStep("leaving-japan-and-closing-out-procedures")] },
    ],
  });
