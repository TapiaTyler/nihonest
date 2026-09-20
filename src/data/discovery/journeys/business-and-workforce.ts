import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, routeChoice, settlementSteps } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the business-and-workforce family. */
export const founderOrHighlySkilledMovingToJapanJourney = guidedJourneySchema.parse({
    id: "founder-or-highly-skilled-moving-to-japan", groupId: "business-and-high-skill", title: "Founder and highly skilled journey",
    description: "Choose a high-skill, supported start-up, or established business route before following shared entry and settlement steps.",
    introduction: "These alternatives have different eligibility tests. Select the route you can document now and treat later transitions separately.",
    routes: [
      { id: "highly-skilled-professional", title: "Highly Skilled Professional", description: "Points-based route for a qualifying highly skilled activity.", articleId: "highly-skilled-professional-status" },
      { id: "startup-pathway", title: "Start-up pathway", description: "Supported preparation route available through participating programs.", articleId: "startup-visa" },
      { id: "business-manager", title: "Business Manager", description: "Route for operating or managing a qualifying established business.", articleId: "business-manager-status" },
    ],
    phases: [
      { id: "understand", title: "Understand the alternatives", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-work-status-and-coe")] },
      { id: "choose-route", title: "Choose your business or high-skill route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  });

export const skilledOrSectorWorkerMovingToJapanJourney = guidedJourneySchema.parse({
    id: "skilled-or-sector-worker-moving-to-japan", groupId: "skilled-and-sector-work", title: "Skilled and sector worker journey",
    description: "Choose the relevant skilled or direct sector-work route, then follow its focused employment, entry, and settlement sequence.",
    introduction: "Entertainer, Skilled Labor, and Specified Skilled Worker are alternatives rather than consecutive steps. Development programs use a separate journey.",
    routes: [
      { id: "entertainer", title: "Entertainer", description: "Qualifying performance, entertainment, or professional-sports activity.", articleId: "entertainer-status" },
      { id: "skilled-labor", title: "Skilled Labor", description: "Specified occupations requiring specialized industrial skills.", articleId: "skilled-labor-status" },
      { id: "specified-skilled-worker", title: "Specified Skilled Worker", description: "Covered work in a designated industrial field.", articleId: "specified-skilled-worker-status" },
    ],
    phases: [
      { id: "understand", title: "Understand work-status residence", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-work-status-and-coe")] },
      { id: "choose-route", title: "Choose your skilled or sector route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  });

export const workforceDevelopmentInJapanJourney = guidedJourneySchema.parse({
    id: "workforce-development-in-japan", groupId: "workforce-development-programs", title: "Workforce development journey",
    description: "Distinguish a current legacy plan, the successor program beginning in April 2027, and direct Specified Skilled Worker employment.",
    introduction: "Program name, start date, approved plan, field, work category, skills and Japanese level, and prior participation determine the route. These options do not automatically convert into one another.",
    routes: [
      { id: "technical-intern-training", title: "Technical Intern Training", description: "A current or transition-protected legacy plan under the regulated technical-intern framework.", articleId: "technical-intern-training-status" },
      { id: "employment-for-skill-development", title: "Employment for Skill Development", description: "The employment-based successor program beginning April 1, 2027.", articleId: "employment-for-skill-development-system" },
      { id: "specified-skilled-worker", title: "Specified Skilled Worker", description: "Direct field-based employment for a person who can meet the applicable SSW requirements.", articleId: "specified-skilled-worker-status" },
    ],
    phases: [
      { id: "compare", title: "Compare training and workforce routes", steps: [articleStep("choosing-a-training-or-workforce-development-route-in-japan")] },
      { id: "choose-route", title: "Choose the program matching your dates and facts", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "travel", title: "Plan temporary travel", steps: [conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay")] },
    ],
  });
