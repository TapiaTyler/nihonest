import ProfessorStatus, { metadata as professorStatusMetadata } from "../../../../content/articles/professor-status.mdx";
import ArtistStatus, { metadata as artistStatusMetadata } from "../../../../content/articles/artist-status.mdx";
import ReligiousActivitiesStatus, { metadata as religiousActivitiesStatusMetadata } from "../../../../content/articles/religious-activities-status.mdx";
import JournalistStatus, { metadata as journalistStatusMetadata } from "../../../../content/articles/journalist-status.mdx";
import LegalAccountingServicesStatus, { metadata as legalAccountingServicesStatusMetadata } from "../../../../content/articles/legal-accounting-services-status.mdx";
import MedicalServicesStatus, { metadata as medicalServicesStatusMetadata } from "../../../../content/articles/medical-services-status.mdx";
import ResearcherStatus, { metadata as researcherStatusMetadata } from "../../../../content/articles/researcher-status.mdx";
import InstructorStatus, { metadata as instructorStatusMetadata } from "../../../../content/articles/instructor-status.mdx";
import EngineerSpecialistHumanitiesInternationalServicesStatus, { metadata as engineerSpecialistHumanitiesInternationalServicesStatusMetadata } from "../../../../content/articles/engineer-specialist-humanities-international-services-status.mdx";
import IntraCompanyTransfereeStatus, { metadata as intraCompanyTransfereeStatusMetadata } from "../../../../content/articles/intra-company-transferee-status.mdx";
import NursingCareStatus, { metadata as nursingCareStatusMetadata } from "../../../../content/articles/nursing-care-status.mdx";
import HighlySkilledProfessionalStatus, { metadata as highlySkilledProfessionalStatusMetadata } from "../../../../content/articles/highly-skilled-professional-status.mdx";
import BusinessManagerStatus, { metadata as businessManagerStatusMetadata } from "../../../../content/articles/business-manager-status.mdx";
import EntertainerStatus, { metadata as entertainerStatusMetadata } from "../../../../content/articles/entertainer-status.mdx";
import SkilledLaborStatus, { metadata as skilledLaborStatusMetadata } from "../../../../content/articles/skilled-labor-status.mdx";
import SpecifiedSkilledWorkerStatus, { metadata as specifiedSkilledWorkerStatusMetadata } from "../../../../content/articles/specified-skilled-worker-status.mdx";
import TechnicalInternTrainingStatus, { metadata as technicalInternTrainingStatusMetadata } from "../../../../content/articles/technical-intern-training-status.mdx";
import EmploymentForSkillDevelopmentSystem, { metadata as employmentForSkillDevelopmentSystemMetadata } from "../../../../content/articles/employment-for-skill-development-system.mdx";
import ChoosingATrainingOrWorkforceDevelopmentRouteInJapan, { metadata as choosingATrainingOrWorkforceDevelopmentRouteInJapanMetadata } from "../../../../content/articles/choosing-a-training-or-workforce-development-route-in-japan.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const workStatusArticleRegistrations = [
  [professorStatusMetadata, ProfessorStatus],
  [artistStatusMetadata, ArtistStatus],
  [religiousActivitiesStatusMetadata, ReligiousActivitiesStatus],
  [journalistStatusMetadata, JournalistStatus],
  [legalAccountingServicesStatusMetadata, LegalAccountingServicesStatus],
  [medicalServicesStatusMetadata, MedicalServicesStatus],
  [researcherStatusMetadata, ResearcherStatus],
  [instructorStatusMetadata, InstructorStatus],
  [engineerSpecialistHumanitiesInternationalServicesStatusMetadata, EngineerSpecialistHumanitiesInternationalServicesStatus],
  [intraCompanyTransfereeStatusMetadata, IntraCompanyTransfereeStatus],
  [nursingCareStatusMetadata, NursingCareStatus],
  [highlySkilledProfessionalStatusMetadata, HighlySkilledProfessionalStatus],
  [businessManagerStatusMetadata, BusinessManagerStatus],
  [entertainerStatusMetadata, EntertainerStatus],
  [skilledLaborStatusMetadata, SkilledLaborStatus],
  [specifiedSkilledWorkerStatusMetadata, SpecifiedSkilledWorkerStatus],
  [technicalInternTrainingStatusMetadata, TechnicalInternTrainingStatus],
  [employmentForSkillDevelopmentSystemMetadata, EmploymentForSkillDevelopmentSystem],
  [choosingATrainingOrWorkforceDevelopmentRouteInJapanMetadata, ChoosingATrainingOrWorkforceDevelopmentRouteInJapan],
] as const satisfies readonly ArticleRegistration[];
