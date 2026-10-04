import type { ArticleComponentSource } from "@/domain/translation/translation-source-fields";

/**
 * The agreed English sources, copied from the components before extraction. Tests recompute artifact revisions from
 * these until Codex's English-only v2 data lands; then a parity test compares that data with this fixture.
 */
export const articleComponentEnglishFixture: readonly ArticleComponentSource[] = [
  {
    kind: "tax-residence-scope",
    caption: "Broad Japanese income-tax scope by tax-residence classification",
    headers: ["Tax-residence classification", "Broad taxable scope"],
    rows: [
      { id: "resident", cells: ["Resident other than a non-permanent resident", "Generally subject to Japanese income tax on worldwide income."] },
      { id: "non-permanent-resident", cells: ["Non-permanent resident", "Generally taxed on income other than foreign-source income, plus foreign-source income paid in Japan or treated as remitted to Japan."] },
      { id: "non-resident", cells: ["Non-resident", "Generally taxed on Japanese domestic-source income under the rules for that income."] },
    ],
  },
  {
    kind: "training-route-comparison",
    caption: "Activities and the training, study, or work routes to examine first",
    headers: ["Proposed activity", "Route to examine first"],
    rows: [
      { id: "cultural-activities", cells: ["Unpaid Japanese cultural study or research", "Cultural Activities", ""] },
      { id: "student", cells: ["Education at a qualifying school", "Student", ""] },
      { id: "training", cells: ["Structured non-employment training through a host", "Training", ""] },
      { id: "technical-intern-training", cells: ["A current approved legacy technical-intern plan", "Technical Intern Training", ", including transition provisions"] },
      { id: "employment-skill-development", cells: ["Three-year employment development beginning from April 2027", "Employment for Skill Development", " in a covered field"] },
      { id: "specified-skilled-worker", cells: ["Direct work after meeting field skill and language requirements", "Specified Skilled Worker", ""] },
      { id: "ordinary-work", cells: ["Ordinary specialized or other work", "Compare the activity-based work statuses", ""] },
    ],
  },
  {
    kind: "japan-practical-basics",
    paragraphs: [
      { id: "time", text: "**Time:** Japan uses Japan Standard Time (JST), UTC+9, without seasonal daylight-saving changes." },
      { id: "money", text: "**Money:** The national currency is the Japanese yen (JPY), written ¥ or 円." },
      { id: "measurements", text: "**Measurements:** Official and everyday measurements generally use metric units such as kilometres, metres, kilograms, litres, and Celsius." },
      { id: "emergencies", text: "**Emergencies:** Call 110 for urgent police response and 119 for fire, rescue, or ambulance. Read the [emergency-call guide](/articles/calling-police-fire-and-ambulance-services-in-japan) and prepare with the [disaster and evacuation guide](/articles/preparing-for-disasters-and-evacuation-in-japan)." },
    ],
  },
];
