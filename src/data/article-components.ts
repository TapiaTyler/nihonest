import type { ArticleComponentTable } from "@/domain/article/article-component-tables";
import type { ArticlePracticalBasics } from "@/domain/article/article-practical-basics";
import type { ResidenceApplicationFeeCopy } from "@/domain/article/residence-application-fee-copy";

/** English-only component data for Stage C. Renderer adoption waits for reviewed Japanese artifact selectors. */
export const taxResidenceScopeComponent = {
  schemaVersion: 2, kind: "tax-residence-scope",
  caption: "Broad Japanese income-tax scope by tax-residence classification",
  headers: ["Tax-residence classification", "Broad taxable scope"],
  rows: [
    { id: "resident", cells: ["Resident other than a non-permanent resident", "Generally subject to Japanese income tax on worldwide income."] },
    { id: "non-permanent-resident", cells: ["Non-permanent resident", "Generally taxed on income other than foreign-source income, plus foreign-source income paid in Japan or treated as remitted to Japan."] },
    { id: "non-resident", cells: ["Non-resident", "Generally taxed on Japanese domestic-source income under the rules for that income."] },
  ],
} satisfies ArticleComponentTable;

export const trainingRouteComparisonComponent = {
  schemaVersion: 2, kind: "training-route-comparison",
  caption: "Activities and the training, study, or work routes to examine first",
  headers: ["Proposed activity", "Route to examine first"],
  rows: [
    { id: "cultural-activities", cells: ["Unpaid Japanese cultural study or research", "Cultural Activities", ""], href: "/articles/cultural-activities-visa" },
    { id: "student", cells: ["Education at a qualifying school", "Student", ""], href: "/articles/student-visa-and-certificate-of-eligibility" },
    { id: "training", cells: ["Structured non-employment training through a host", "Training", ""], href: "/articles/training-visa" },
    { id: "technical-intern-training", cells: ["A current approved legacy technical-intern plan", "Technical Intern Training", ", including transition provisions"], href: "/articles/technical-intern-training-status" },
    { id: "employment-skill-development", cells: ["Three-year employment development beginning from April 2027", "Employment for Skill Development", " in a covered field"], href: "/articles/employment-for-skill-development-system" },
    { id: "specified-skilled-worker", cells: ["Direct work after meeting field skill and language requirements", "Specified Skilled Worker", ""], href: "/articles/specified-skilled-worker-status" },
    { id: "ordinary-work", cells: ["Ordinary specialized or other work", "Compare the activity-based work statuses", ""], href: "/articles/choosing-a-work-status-and-coe" },
  ],
} satisfies ArticleComponentTable;

export const japanPracticalBasicsComponent = {
  schemaVersion: 2, kind: "japan-practical-basics",
  paragraphs: [
    { id: "time", text: "**Time:** Japan uses Japan Standard Time (JST), UTC+9, without seasonal daylight-saving changes." },
    { id: "money", text: "**Money:** The national currency is the Japanese yen (JPY), written ¥ or 円." },
    { id: "measurements", text: "**Measurements:** Official and everyday measurements generally use metric units such as kilometres, metres, kilograms, litres, and Celsius." },
    { id: "emergencies", text: "**Emergencies:** Call 110 for urgent police response and 119 for fire, rescue, or ambulance. Read the [emergency-call guide](/articles/calling-police-fire-and-ambulance-services-in-japan) and prepare with the [disaster and evacuation guide](/articles/preparing-for-disasters-and-evacuation-in-japan)." },
  ],
} satisfies ArticlePracticalBasics;

/**
 * English copy of the residence application fee section. Amounts and dates are `{placeholders}` filled from
 * `residenceApplicationFees`, so the copy never restates a number.
 */
export const residenceApplicationFeesComponent = {
  schemaVersion: 2, kind: "residence-application-fees",
  messages: [
    { id: "heading", text: "Fees depend on acceptance date, channel, and the period granted" },
    { id: "previous-schedule", text: "For applications accepted from {previousFrom} through {previousThrough}, an approved change or extension costs {previousCounter} at a counter or {previousOnline} online." },
    { id: "current-schedule", text: "For applications accepted on or after {currentFrom}, the fee is determined by the period ISA actually grants:" },
    { id: "caption", text: "Change-of-status and extension fees for applications accepted on or after {currentFrom}" },
    { id: "header-period", text: "Period granted" },
    { id: "header-counter", text: "Counter" },
    { id: "header-online-base", text: "Online base fee" },
    { id: "header-online-total", text: "Online total with processing" },
    { id: "period-up-to-three-months", text: "3 months or less" },
    { id: "period-over-three-through-six-months", text: "Over 3 through 6 months" },
    { id: "period-over-six-months-under-one-year", text: "Over 6 months but under 1 year" },
    { id: "period-one-year", text: "1 year" },
    { id: "period-over-one-under-three-years", text: "Over 1 but under 3 years" },
    { id: "period-three-under-five-years", text: "3 to under 5 years" },
    { id: "period-five-years-or-more", text: "5 years or more" },
    { id: "processing", text: "The online processing charge is {processingUnderThree} for a grant under three years and {processingThreeOrMore} for three years or more. ISA sends payment instructions after examination. Covered online applications use convenience-store or bank payment; credit cards and QR-code payment are not supported in the published process. Counter applications continue to use revenue stamps." },
    { id: "schedule-rule", text: "The application acceptance date controls the schedule. An application accepted by {previousThrough} retains the earlier fee and revenue-stamp process even if decided later. Published relief can reduce a qualifying change or extension fee to {reducedFee}, but reduction or exemption requests must be filed at a counter because the online system does not support them." },
    { id: "fraud-label", text: "Fraud warning:" },
    { id: "fraud-body", text: "ISA states that legitimate online-payment messages for the new process come only from an address ending in {emailDomain}. Recheck the official page before paying if the sender, channel, or instructions differ." },
  ],
} satisfies ResidenceApplicationFeeCopy;

/** Registration/display order is stable; translation field maps use the separately agreed field-key rules. */
export const articleComponents = {
  "tax-residence-scope": taxResidenceScopeComponent,
  "training-route-comparison": trainingRouteComparisonComponent,
  "japan-practical-basics": japanPracticalBasicsComponent,
  "residence-application-fees": residenceApplicationFeesComponent,
};
