import type { ArticleComponentTable } from "@/domain/article/article-component-tables";
import type { ArticlePracticalBasics } from "@/domain/article/article-practical-basics";

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

/** Registration/display order is stable; translation field maps use the separately agreed field-key rules. */
export const articleComponents = {
  "tax-residence-scope": taxResidenceScopeComponent,
  "training-route-comparison": trainingRouteComparisonComponent,
  "japan-practical-basics": japanPracticalBasicsComponent,
};
