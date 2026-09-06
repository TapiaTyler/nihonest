import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";

export const articleGroups = [
  articleGroupSchema.parse({
    id: "study-in-japan",
    title: "Study in Japan",
    description: "School planning, Student status, institutional onboarding, and rules specific to international students.",
    articleIds: [
      "planning-your-studies-in-japan",
      "short-term-study-in-japan",
      "student-visa-and-certificate-of-eligibility",
      "preparing-to-enter-japan",
      "completing-school-arrival-procedures",
      "working-part-time-on-student-status",
    ],
  }),
  articleGroupSchema.parse({
    id: "arrival-essentials",
    title: "Arrival essentials",
    description: "Shared early-settlement guidance whose applicability depends on residence, registration, age, and coverage—not one particular visa label.",
    articleIds: [
      "documents-received-when-entering-japan",
      "registering-your-address-after-arrival",
      "understanding-my-number",
      "joining-national-health-insurance",
      "national-pension-after-moving-to-japan",
      "finding-housing-and-moving-in",
      "getting-a-phone-number-in-japan",
      "opening-a-bank-account-after-moving-to-japan",
    ],
  }),
  articleGroupSchema.parse({
    id: "visas-and-residence",
    title: "Visas and residence",
    description: "Introductions to selected visa pathways, qualifying activities, and corresponding residence decisions.",
    articleIds: [
      "cultural-activities-visa",
      "training-visa",
      "dependent-family-stay-visa",
      "startup-visa",
      "diplomatic-visa",
      "official-visa",
    ],
  }),
] as const;

export const guidedJourneys = [
  guidedJourneySchema.parse({
    id: "student-moving-to-japan",
    title: "Student journey",
    description: "An ordered path that distinguishes Temporary Visitor study from Student status and resident-only arrival procedures.",
    steps: [
      { articleId: "planning-your-studies-in-japan", applicability: ["all-students"] },
      { articleId: "short-term-study-in-japan", applicability: ["all-students"] },
      { articleId: "student-visa-and-certificate-of-eligibility", applicability: ["student-status"] },
      { articleId: "preparing-to-enter-japan", applicability: ["student-status"] },
      { articleId: "finding-housing-and-moving-in", applicability: ["all-students"] },
      { articleId: "documents-received-when-entering-japan", applicability: ["student-status"] },
      { articleId: "registering-your-address-after-arrival", applicability: ["registered-resident"] },
      { articleId: "understanding-my-number", applicability: ["registered-resident"] },
      { articleId: "joining-national-health-insurance", applicability: ["registered-resident"] },
      { articleId: "national-pension-after-moving-to-japan", applicability: ["registered-resident"] },
      { articleId: "getting-a-phone-number-in-japan", applicability: ["all-students"] },
      { articleId: "opening-a-bank-account-after-moving-to-japan", applicability: ["registered-resident"] },
      { articleId: "completing-school-arrival-procedures", applicability: ["all-students"] },
      { articleId: "working-part-time-on-student-status", applicability: ["student-status"] },
    ],
  }),
] as const;
