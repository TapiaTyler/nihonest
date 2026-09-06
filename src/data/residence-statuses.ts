import {
  residenceStatusSchema,
  validateResidenceStatusCollection,
} from "@/domain/residence-status/residence-status";
import { sources } from "@/data/sources";

export const residenceStatuses = [
  residenceStatusSchema.parse({
    id: "engineer-specialist-humanities-international-services",
    slug: "engineer-specialist-humanities-international-services",
    englishName: "Engineer/Specialist in Humanities/International Services",
    japaneseName: "技術・人文知識・国際業務",
    category: "work",
    summary:
      "A work-focused status covering qualifying professional activities that draw on technical, humanities, or international-services expertise.",
    purpose:
      "To permit qualifying work that uses specialized knowledge or experience within the activity categories defined by Japan's immigration framework.",
    typicalActivities: [
      "Engineering and other technical professional work",
      "Work drawing on specialist knowledge in the humanities",
      "International-services work such as interpretation or language instruction",
    ],
    examples: ["IT engineer", "Interpreter", "Designer", "Foreign-language teacher"],
    considerations: [
      "A job title alone does not establish whether an activity fits this status.",
      "The actual duties, the organization, and the applicant's background can matter.",
      "Confirm individual circumstances with the Immigration Services Agency or a qualified professional.",
    ],
    sourceIds: ["immigration-services-status-appendix", "mofa-work-long-term-stay"],
    relatedArticleIds: ["finding-official-information"],
    lastReviewedAt: "2026-09-05",
    status: "draft",
  }),
  residenceStatusSchema.parse({
    id: "student",
    slug: "student",
    englishName: "Student",
    japaneseName: "留学",
    category: "study",
    summary:
      "A study-focused status for qualifying education at universities, schools, and other eligible educational institutions in Japan.",
    purpose:
      "To permit education at an institution covered by the Student status under Japan's immigration framework.",
    typicalActivities: [
      "Studying at a university or junior college",
      "Studying at an eligible technical, vocational, or language institution",
      "Studying at an eligible primary or secondary school",
    ],
    examples: ["University student", "Vocational-school student", "Language-school student"],
    considerations: [
      "The institution and course must fit the applicable requirements.",
      "Activities outside the status's core purpose can be subject to separate rules or permission.",
      "Confirm current requirements with the school and the Immigration Services Agency.",
    ],
    sourceIds: ["immigration-services-status-appendix", "mofa-work-long-term-stay"],
    relatedArticleIds: ["finding-official-information"],
    lastReviewedAt: "2026-09-05",
    status: "draft",
  }),
  residenceStatusSchema.parse({
    id: "dependent",
    slug: "dependent",
    englishName: "Dependent",
    japaneseName: "家族滞在",
    category: "family",
    summary:
      "A family-focused status for a qualifying spouse or unmarried minor supported by a foreign resident with an eligible status.",
    purpose:
      "To permit qualifying family members to carry out ordinary daily activities while supported by an eligible foreign resident in Japan.",
    typicalActivities: [
      "Living in Japan as the supported spouse of an eligible resident",
      "Living in Japan as the supported unmarried minor child of an eligible resident",
    ],
    examples: ["Supported spouse", "Supported unmarried minor child"],
    considerations: [
      "Eligibility depends in part on the supporting resident's status and the family relationship.",
      "Activities outside the status's core purpose can be subject to separate rules or permission.",
      "Confirm individual circumstances with the Immigration Services Agency or a qualified professional.",
    ],
    sourceIds: ["immigration-services-status-appendix", "mofa-work-long-term-stay"],
    relatedArticleIds: ["finding-official-information"],
    lastReviewedAt: "2026-09-05",
    status: "draft",
  }),
] as const;

validateResidenceStatusCollection(residenceStatuses, sources, ["finding-official-information"]);

export function getResidenceStatusBySlug(slug: string) {
  return residenceStatuses.find((status) => status.slug === slug);
}

export function getResidenceStatusById(id: string) {
  return residenceStatuses.find((status) => status.id === id);
}
