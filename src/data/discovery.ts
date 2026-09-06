import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";

const sharedSettlementSteps = [
  { articleId: "finding-housing-and-moving-in", applicability: ["all-routes"], role: "core" },
  { articleId: "documents-received-when-entering-japan", applicability: ["all-routes"], role: "core" },
  { articleId: "registering-your-address-after-arrival", applicability: ["registered-resident"], role: "core" },
  { articleId: "understanding-my-number", applicability: ["registered-resident"], role: "core" },
  { articleId: "joining-national-health-insurance", applicability: ["registered-resident"], role: "conditional" },
  { articleId: "national-pension-after-moving-to-japan", applicability: ["registered-resident"], role: "conditional" },
  { articleId: "getting-a-phone-number-in-japan", applicability: ["all-routes"], role: "core" },
  { articleId: "opening-a-bank-account-after-moving-to-japan", applicability: ["registered-resident"], role: "core" },
] as const;

export const articleGroups = [
  articleGroupSchema.parse({
    id: "study-in-japan",
    title: "Study in Japan",
    description: "School planning, Student status, institutional onboarding, and rules specific to international students.",
    articleIds: ["planning-your-studies-in-japan", "short-term-study-in-japan", "student-visa-and-certificate-of-eligibility", "preparing-to-enter-japan", "completing-school-arrival-procedures", "working-part-time-on-student-status", "continued-job-hunting-after-study"],
  }),
  articleGroupSchema.parse({
    id: "arrival-essentials",
    title: "Arrival essentials",
    description: "Shared early-settlement guidance whose applicability depends on residence, registration, age, and coverage—not one visa label.",
    articleIds: ["documents-received-when-entering-japan", "registering-your-address-after-arrival", "understanding-my-number", "joining-national-health-insurance", "national-pension-after-moving-to-japan", "finding-housing-and-moving-in", "getting-a-phone-number-in-japan", "opening-a-bank-account-after-moving-to-japan"],
  }),
  articleGroupSchema.parse({
    id: "professional-work",
    title: "Professional work",
    description: "Individual work statuses for academic, creative, religious, media, regulated, research, teaching, technical, transfer, and care roles.",
    articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "preparing-for-long-term-entry-to-japan", "professor-status", "artist-status", "religious-activities-status", "journalist-status", "legal-accounting-services-status", "medical-services-status", "researcher-status", "instructor-status", "engineer-specialist-humanities-international-services-status", "intra-company-transferee-status", "nursing-care-status"],
  }),
  articleGroupSchema.parse({
    id: "business-and-high-skill",
    title: "Business and high-skill",
    description: "Highly Skilled Professional, Business Manager, and supported Start-up pathways for specialists, executives, and founders.",
    articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "preparing-for-long-term-entry-to-japan", "highly-skilled-professional-status", "business-manager-status", "startup-visa"],
  }),
  articleGroupSchema.parse({
    id: "skilled-and-sector-work",
    title: "Skilled and sector-based work",
    description: "Entertainment, specialized skilled occupations, Specified Skilled Worker, and Technical Intern Training routes.",
    articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "preparing-for-long-term-entry-to-japan", "entertainer-status", "skilled-labor-status", "specified-skilled-worker-status", "technical-intern-training-status"],
  }),
  articleGroupSchema.parse({
    id: "family-and-long-term-residence",
    title: "Family and long-term residence",
    description: "Dependent, spouse and child, Long-Term Resident, and Permanent Resident guidance organized by the relationship or position supporting residence.",
    articleIds: ["visa-and-status-of-residence-explained", "preparing-for-long-term-entry-to-japan", "dependent-family-stay-visa", "spouse-or-child-of-japanese-national", "spouse-or-child-of-permanent-resident", "long-term-resident-status", "permanent-residence-in-japan"],
  }),
  articleGroupSchema.parse({
    id: "culture-and-training",
    title: "Culture and training",
    description: "Non-remunerative Cultural Activities and Trainee routes, kept separate from Student and employment-based training.",
    articleIds: ["visa-and-status-of-residence-explained", "preparing-for-long-term-entry-to-japan", "cultural-activities-visa", "training-visa"],
  }),
  articleGroupSchema.parse({
    id: "designated-activities",
    title: "Designated Activities",
    description: "An umbrella status containing distinct programs such as working holiday, J-Find, long-stay tourism, digital nomad, and graduate job hunting.",
    articleIds: ["visa-and-status-of-residence-explained", "designated-activities-status", "working-holiday-in-japan", "long-stay-sightseeing-designated-activities", "future-creation-j-find", "digital-nomad-designated-activities", "continued-job-hunting-after-study", "startup-visa"],
  }),
  articleGroupSchema.parse({
    id: "short-stay-and-medical",
    title: "Short stay and medical visits",
    description: "Temporary Visitor, short-stay visa, and medical-stay guidance for people who are visiting rather than relocating under an ordinary residence route.",
    articleIds: ["visa-and-status-of-residence-explained", "temporary-visitor-and-short-stay", "medical-stay-visa", "short-term-study-in-japan"],
  }),
  articleGroupSchema.parse({
    id: "diplomatic-and-official",
    title: "Diplomatic and official",
    description: "Special-purpose routes for recognized diplomatic and official government or international-organization activity.",
    articleIds: ["visa-and-status-of-residence-explained", "diplomatic-visa", "official-visa"],
  }),
] as const;

export const guidedJourneys = [
  guidedJourneySchema.parse({
    id: "student-moving-to-japan", groupId: "study-in-japan", title: "Student journey",
    description: "An ordered path that distinguishes Temporary Visitor study from Student status and resident-only arrival procedures.",
    introduction: "First identify whether you will enter as a Temporary Visitor or under Student status. Route labels show which guidance applies.",
    steps: [
      { articleId: "planning-your-studies-in-japan", applicability: ["all-routes"] },
      { articleId: "short-term-study-in-japan", applicability: ["temporary-visitor"], role: "choose-one" },
      { articleId: "student-visa-and-certificate-of-eligibility", applicability: ["student-status"], role: "choose-one" },
      { articleId: "preparing-to-enter-japan", applicability: ["student-status"] },
      ...sharedSettlementSteps,
      { articleId: "completing-school-arrival-procedures", applicability: ["all-routes"] },
      { articleId: "working-part-time-on-student-status", applicability: ["student-status"], role: "conditional" },
      { articleId: "continued-job-hunting-after-study", applicability: ["designated-activities"], role: "conditional" },
    ],
  }),
  guidedJourneySchema.parse({
    id: "professional-worker-moving-to-japan", groupId: "professional-work", title: "Professional worker journey",
    description: "Compare professional work statuses, coordinate employer sponsorship, and continue through shared settlement steps.",
    introduction: "Choose the one status matching the real job and institution; the individual status cards are alternatives, not sequential applications.",
    steps: [
      { articleId: "visa-and-status-of-residence-explained", applicability: ["all-routes"] },
      { articleId: "choosing-a-work-status-and-coe", applicability: ["work-status"] },
      ...["professor-status", "artist-status", "religious-activities-status", "journalist-status", "legal-accounting-services-status", "medical-services-status", "researcher-status", "instructor-status", "engineer-specialist-humanities-international-services-status", "intra-company-transferee-status", "nursing-care-status"].map((articleId) => ({ articleId, applicability: [articleId === "intra-company-transferee-status" ? "intra-company-transferee" : "work-status"], role: "choose-one" })),
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
  guidedJourneySchema.parse({
    id: "founder-or-highly-skilled-moving-to-japan", groupId: "business-and-high-skill", title: "Founder and highly skilled journey",
    description: "Compare high-skill, supported start-up, and established business routes before following the long-term arrival sequence.",
    introduction: "These routes have different eligibility tests. Choose the route you can document now and treat later transitions as separate decisions.",
    steps: [
      { articleId: "visa-and-status-of-residence-explained", applicability: ["all-routes"] },
      { articleId: "highly-skilled-professional-status", applicability: ["highly-skilled-professional"], role: "choose-one" },
      { articleId: "startup-visa", applicability: ["startup-pathway"], role: "choose-one" },
      { articleId: "business-manager-status", applicability: ["business-manager"], role: "choose-one" },
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
  guidedJourneySchema.parse({
    id: "skilled-or-sector-worker-moving-to-japan", groupId: "skilled-and-sector-work", title: "Skilled and sector worker journey",
    description: "Separate four commonly confused work routes, then follow the relevant employment and settlement sequence.",
    introduction: "Entertainer, Skilled Labor, Specified Skilled Worker, and Technical Intern Training are alternatives with different rules and protections.",
    steps: [
      { articleId: "visa-and-status-of-residence-explained", applicability: ["all-routes"] },
      { articleId: "choosing-a-work-status-and-coe", applicability: ["work-status"] },
      { articleId: "entertainer-status", applicability: ["work-status"], role: "choose-one" },
      { articleId: "skilled-labor-status", applicability: ["work-status"], role: "choose-one" },
      { articleId: "specified-skilled-worker-status", applicability: ["specified-skilled-worker"], role: "choose-one" },
      { articleId: "technical-intern-training-status", applicability: ["technical-intern-training"], role: "choose-one" },
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
  guidedJourneySchema.parse({
    id: "joining-family-in-japan", groupId: "family-and-long-term-residence", title: "Joining family in Japan journey",
    description: "Identify the relationship-based route, prepare the family evidence, and continue through long-term arrival tasks.",
    introduction: "Dependent and status-based spouse or child routes are not interchangeable. Choose the relationship and sponsor status that actually apply.",
    steps: [
      { articleId: "visa-and-status-of-residence-explained", applicability: ["all-routes"] },
      { articleId: "dependent-family-stay-visa", applicability: ["dependent"], role: "choose-one" },
      { articleId: "spouse-or-child-of-japanese-national", applicability: ["spouse-or-child-status"], role: "choose-one" },
      { articleId: "spouse-or-child-of-permanent-resident", applicability: ["spouse-or-child-status"], role: "choose-one" },
      { articleId: "long-term-resident-status", applicability: ["spouse-or-child-status"], role: "conditional" },
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
  guidedJourneySchema.parse({
    id: "cultural-activities-or-training-in-japan", groupId: "culture-and-training", title: "Culture and training journey",
    description: "Distinguish unpaid cultural study from covered training and then prepare for a qualifying long-term stay.",
    introduction: "Choose Cultural Activities for a qualifying unpaid cultural or research program, or Trainee for a covered training arrangement.",
    steps: [
      { articleId: "visa-and-status-of-residence-explained", applicability: ["all-routes"] },
      { articleId: "cultural-activities-visa", applicability: ["cultural-activities"], role: "choose-one" },
      { articleId: "training-visa", applicability: ["trainee"], role: "choose-one" },
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
  guidedJourneySchema.parse({
    id: "working-holiday-in-japan", groupId: "designated-activities", title: "Working holiday journey",
    description: "Check bilateral eligibility, prepare the holiday-first application, and plan the parts of settlement that apply to the granted stay.",
    introduction: "Working holiday is one Designated Activities route. Country-specific conditions control eligibility and incidental work permission.",
    steps: [
      { articleId: "designated-activities-status", applicability: ["designated-activities"] },
      { articleId: "working-holiday-in-japan", applicability: ["designated-activities"] },
      { articleId: "preparing-for-long-term-entry-to-japan", applicability: ["all-routes"] },
      ...sharedSettlementSteps,
    ],
  }),
] as const;
