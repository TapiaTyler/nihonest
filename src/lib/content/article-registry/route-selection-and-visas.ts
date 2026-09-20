import CulturalActivities, { metadata as culturalActivities } from "../../../../content/articles/cultural-activities-visa.mdx";
import Training, { metadata as training } from "../../../../content/articles/training-visa.mdx";
import DependentVisa, { metadata as dependentVisa } from "../../../../content/articles/dependent-family-stay-visa.mdx";
import Startup, { metadata as startup } from "../../../../content/articles/startup-visa.mdx";
import Diplomatic, { metadata as diplomatic } from "../../../../content/articles/diplomatic-visa.mdx";
import Official, { metadata as official } from "../../../../content/articles/official-visa.mdx";
import VisaAndStatusOfResidenceExplained, { metadata as visaAndStatusOfResidenceExplainedMetadata } from "../../../../content/articles/visa-and-status-of-residence-explained.mdx";
import ChoosingAWorkStatusAndCoe, { metadata as choosingAWorkStatusAndCoeMetadata } from "../../../../content/articles/choosing-a-work-status-and-coe.mdx";
import ChoosingAResidenceStatusForTeachingInJapan, { metadata as choosingAResidenceStatusForTeachingInJapanMetadata } from "../../../../content/articles/choosing-a-residence-status-for-teaching-in-japan.mdx";
import ChoosingAResidenceStatusForCreativeAndMediaWork, { metadata as choosingAResidenceStatusForCreativeAndMediaWorkMetadata } from "../../../../content/articles/choosing-a-residence-status-for-creative-and-media-work.mdx";
import ChoosingAStatusForMedicalAndCareWorkInJapan, { metadata as choosingAStatusForMedicalAndCareWorkInJapanMetadata } from "../../../../content/articles/choosing-a-status-for-medical-and-care-work-in-japan.mdx";
import PreparingForLongTermEntryToJapan, { metadata as preparingForLongTermEntryToJapanMetadata } from "../../../../content/articles/preparing-for-long-term-entry-to-japan.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const routeSelectionAndVisaArticleRegistrations = [
  [culturalActivities, CulturalActivities],
  [training, Training],
  [dependentVisa, DependentVisa],
  [startup, Startup],
  [diplomatic, Diplomatic],
  [official, Official],
  [visaAndStatusOfResidenceExplainedMetadata, VisaAndStatusOfResidenceExplained],
  [choosingAWorkStatusAndCoeMetadata, ChoosingAWorkStatusAndCoe],
  [choosingAResidenceStatusForTeachingInJapanMetadata, ChoosingAResidenceStatusForTeachingInJapan],
  [choosingAResidenceStatusForCreativeAndMediaWorkMetadata, ChoosingAResidenceStatusForCreativeAndMediaWork],
  [choosingAStatusForMedicalAndCareWorkInJapanMetadata, ChoosingAStatusForMedicalAndCareWorkInJapan],
  [preparingForLongTermEntryToJapanMetadata, PreparingForLongTermEntryToJapan],
] as const satisfies readonly ArticleRegistration[];
