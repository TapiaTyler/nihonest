import type { ComponentType } from "react";
import Planning, { metadata as planning } from "../../../content/articles/planning-your-studies-in-japan.mdx";
import ShortTermStudy, { metadata as shortTermStudy } from "../../../content/articles/short-term-study-in-japan.mdx";
import Visa, { metadata as visa } from "../../../content/articles/student-visa-and-certificate-of-eligibility.mdx";
import Preparing, { metadata as preparing } from "../../../content/articles/preparing-to-enter-japan.mdx";
import Documents, { metadata as documents } from "../../../content/articles/documents-received-when-entering-japan.mdx";
import Address, { metadata as address } from "../../../content/articles/registering-your-address-after-arrival.mdx";
import MyNumber, { metadata as myNumber } from "../../../content/articles/understanding-my-number.mdx";
import Insurance, { metadata as insurance } from "../../../content/articles/joining-national-health-insurance.mdx";
import Pension, { metadata as pension } from "../../../content/articles/national-pension-after-moving-to-japan.mdx";
import Housing, { metadata as housing } from "../../../content/articles/finding-housing-and-moving-in.mdx";
import Phone, { metadata as phone } from "../../../content/articles/getting-a-phone-number-in-japan.mdx";
import Banking, { metadata as banking } from "../../../content/articles/opening-a-bank-account-after-moving-to-japan.mdx";
import School, { metadata as school } from "../../../content/articles/completing-school-arrival-procedures.mdx";
import Work, { metadata as work } from "../../../content/articles/working-part-time-on-student-status.mdx";
import CulturalActivities, { metadata as culturalActivities } from "../../../content/articles/cultural-activities-visa.mdx";
import Training, { metadata as training } from "../../../content/articles/training-visa.mdx";
import DependentVisa, { metadata as dependentVisa } from "../../../content/articles/dependent-family-stay-visa.mdx";
import Startup, { metadata as startup } from "../../../content/articles/startup-visa.mdx";
import Diplomatic, { metadata as diplomatic } from "../../../content/articles/diplomatic-visa.mdx";
import Official, { metadata as official } from "../../../content/articles/official-visa.mdx";
import VisaAndStatusOfResidenceExplained, { metadata as visaAndStatusOfResidenceExplainedMetadata } from "../../../content/articles/visa-and-status-of-residence-explained.mdx";
import ChoosingAWorkStatusAndCoe, { metadata as choosingAWorkStatusAndCoeMetadata } from "../../../content/articles/choosing-a-work-status-and-coe.mdx";
import PreparingForLongTermEntryToJapan, { metadata as preparingForLongTermEntryToJapanMetadata } from "../../../content/articles/preparing-for-long-term-entry-to-japan.mdx";
import ProfessorStatus, { metadata as professorStatusMetadata } from "../../../content/articles/professor-status.mdx";
import ArtistStatus, { metadata as artistStatusMetadata } from "../../../content/articles/artist-status.mdx";
import ReligiousActivitiesStatus, { metadata as religiousActivitiesStatusMetadata } from "../../../content/articles/religious-activities-status.mdx";
import JournalistStatus, { metadata as journalistStatusMetadata } from "../../../content/articles/journalist-status.mdx";
import LegalAccountingServicesStatus, { metadata as legalAccountingServicesStatusMetadata } from "../../../content/articles/legal-accounting-services-status.mdx";
import MedicalServicesStatus, { metadata as medicalServicesStatusMetadata } from "../../../content/articles/medical-services-status.mdx";
import ResearcherStatus, { metadata as researcherStatusMetadata } from "../../../content/articles/researcher-status.mdx";
import InstructorStatus, { metadata as instructorStatusMetadata } from "../../../content/articles/instructor-status.mdx";
import EngineerSpecialistHumanitiesInternationalServicesStatus, { metadata as engineerSpecialistHumanitiesInternationalServicesStatusMetadata } from "../../../content/articles/engineer-specialist-humanities-international-services-status.mdx";
import IntraCompanyTransfereeStatus, { metadata as intraCompanyTransfereeStatusMetadata } from "../../../content/articles/intra-company-transferee-status.mdx";
import NursingCareStatus, { metadata as nursingCareStatusMetadata } from "../../../content/articles/nursing-care-status.mdx";
import HighlySkilledProfessionalStatus, { metadata as highlySkilledProfessionalStatusMetadata } from "../../../content/articles/highly-skilled-professional-status.mdx";
import BusinessManagerStatus, { metadata as businessManagerStatusMetadata } from "../../../content/articles/business-manager-status.mdx";
import EntertainerStatus, { metadata as entertainerStatusMetadata } from "../../../content/articles/entertainer-status.mdx";
import SkilledLaborStatus, { metadata as skilledLaborStatusMetadata } from "../../../content/articles/skilled-labor-status.mdx";
import SpecifiedSkilledWorkerStatus, { metadata as specifiedSkilledWorkerStatusMetadata } from "../../../content/articles/specified-skilled-worker-status.mdx";
import TechnicalInternTrainingStatus, { metadata as technicalInternTrainingStatusMetadata } from "../../../content/articles/technical-intern-training-status.mdx";
import SpouseOrChildOfJapaneseNational, { metadata as spouseOrChildOfJapaneseNationalMetadata } from "../../../content/articles/spouse-or-child-of-japanese-national.mdx";
import SpouseOrChildOfPermanentResident, { metadata as spouseOrChildOfPermanentResidentMetadata } from "../../../content/articles/spouse-or-child-of-permanent-resident.mdx";
import LongTermResidentStatus, { metadata as longTermResidentStatusMetadata } from "../../../content/articles/long-term-resident-status.mdx";
import PermanentResidenceInJapan, { metadata as permanentResidenceInJapanMetadata } from "../../../content/articles/permanent-residence-in-japan.mdx";
import DesignatedActivitiesStatus, { metadata as designatedActivitiesStatusMetadata } from "../../../content/articles/designated-activities-status.mdx";
import WorkingHolidayInJapan, { metadata as workingHolidayInJapanMetadata } from "../../../content/articles/working-holiday-in-japan.mdx";
import LongStaySightseeingDesignatedActivities, { metadata as longStaySightseeingDesignatedActivitiesMetadata } from "../../../content/articles/long-stay-sightseeing-designated-activities.mdx";
import FutureCreationJFind, { metadata as futureCreationJFindMetadata } from "../../../content/articles/future-creation-j-find.mdx";
import DigitalNomadDesignatedActivities, { metadata as digitalNomadDesignatedActivitiesMetadata } from "../../../content/articles/digital-nomad-designated-activities.mdx";
import ContinuedJobHuntingAfterStudy, { metadata as continuedJobHuntingAfterStudyMetadata } from "../../../content/articles/continued-job-hunting-after-study.mdx";
import TemporaryVisitorAndShortStay, { metadata as temporaryVisitorAndShortStayMetadata } from "../../../content/articles/temporary-visitor-and-short-stay.mdx";
import MedicalStayVisa, { metadata as medicalStayVisaMetadata } from "../../../content/articles/medical-stay-visa.mdx";
import SideWorkAndFreelancingOnAWorkStatus, { metadata as sideWorkAndFreelancingOnAWorkStatusMetadata } from "../../../content/articles/side-work-and-freelancing-on-a-work-status.mdx";
import NotifyingImmigrationAboutWorkContractChanges, { metadata as notifyingImmigrationAboutWorkContractChangesMetadata } from "../../../content/articles/notifying-immigration-about-work-contract-changes.mdx";
import IncomeAndResidentTaxAfterMovingToJapan, { metadata as incomeAndResidentTaxAfterMovingToJapanMetadata } from "../../../content/articles/income-and-resident-tax-after-moving-to-japan.mdx";
import FilingAJapaneseIncomeTaxReturn, { metadata as filingAJapaneseIncomeTaxReturnMetadata } from "../../../content/articles/filing-a-japanese-income-tax-return.mdx";
import RenewingOrChangingYourStatusOfResidence, { metadata as renewingOrChangingYourStatusOfResidenceMetadata } from "../../../content/articles/renewing-or-changing-your-status-of-residence.mdx";
import LeavingJapanAndClosingOutProcedures, { metadata as leavingJapanAndClosingOutProceduresMetadata } from "../../../content/articles/leaving-japan-and-closing-out-procedures.mdx";
import {
  articleMetadataSchema,
  validateArticleCollection,
  type ArticleMetadata,
} from "@/domain/article/article";
import { sources } from "@/data/sources";
import { residenceStatuses } from "@/data/residence-statuses";
import { validateResidenceStatusCollection } from "@/domain/residence-status/residence-status";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { getJourneyArticleIds, getJourneyRouteById, resolveJourneySteps, validateDiscoveryModel } from "@/domain/discovery/discovery";
import { glossaryTerms } from "@/data/glossary";
import { validateGlossaryCollection } from "@/domain/glossary/glossary";

export type ArticleRecord = Readonly<{
  metadata: ArticleMetadata;
  Content: ComponentType;
}>;

const entries = [
  [planning, Planning], [shortTermStudy, ShortTermStudy], [visa, Visa], [preparing, Preparing], [documents, Documents],
  [address, Address], [myNumber, MyNumber], [insurance, Insurance], [pension, Pension],
  [housing, Housing], [phone, Phone], [banking, Banking], [school, School], [work, Work],
  [culturalActivities, CulturalActivities], [training, Training], [dependentVisa, DependentVisa],
  [startup, Startup], [diplomatic, Diplomatic], [official, Official],
  [visaAndStatusOfResidenceExplainedMetadata, VisaAndStatusOfResidenceExplained],
  [choosingAWorkStatusAndCoeMetadata, ChoosingAWorkStatusAndCoe],
  [preparingForLongTermEntryToJapanMetadata, PreparingForLongTermEntryToJapan],
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
  [spouseOrChildOfJapaneseNationalMetadata, SpouseOrChildOfJapaneseNational],
  [spouseOrChildOfPermanentResidentMetadata, SpouseOrChildOfPermanentResident],
  [longTermResidentStatusMetadata, LongTermResidentStatus],
  [permanentResidenceInJapanMetadata, PermanentResidenceInJapan],
  [designatedActivitiesStatusMetadata, DesignatedActivitiesStatus],
  [workingHolidayInJapanMetadata, WorkingHolidayInJapan],
  [longStaySightseeingDesignatedActivitiesMetadata, LongStaySightseeingDesignatedActivities],
  [futureCreationJFindMetadata, FutureCreationJFind],
  [digitalNomadDesignatedActivitiesMetadata, DigitalNomadDesignatedActivities],
  [continuedJobHuntingAfterStudyMetadata, ContinuedJobHuntingAfterStudy],
  [temporaryVisitorAndShortStayMetadata, TemporaryVisitorAndShortStay],
  [medicalStayVisaMetadata, MedicalStayVisa],
  [sideWorkAndFreelancingOnAWorkStatusMetadata, SideWorkAndFreelancingOnAWorkStatus],
  [notifyingImmigrationAboutWorkContractChangesMetadata, NotifyingImmigrationAboutWorkContractChanges],
  [incomeAndResidentTaxAfterMovingToJapanMetadata, IncomeAndResidentTaxAfterMovingToJapan],
  [filingAJapaneseIncomeTaxReturnMetadata, FilingAJapaneseIncomeTaxReturn],
  [renewingOrChangingYourStatusOfResidenceMetadata, RenewingOrChangingYourStatusOfResidence],
  [leavingJapanAndClosingOutProceduresMetadata, LeavingJapanAndClosingOutProcedures],
] as const;

const articles: readonly ArticleRecord[] = entries.map(([metadata, Content]) => ({
  metadata: articleMetadataSchema.parse(metadata),
  Content,
}));

validateResidenceStatusCollection(
  residenceStatuses,
  sources,
  articles.map(({ metadata }) => metadata.id),
  glossaryTerms.map(({ id }) => id),
);
validateArticleCollection(
  articles.map((article) => article.metadata),
  sources,
  residenceStatuses.map((status) => status.id),
  glossaryTerms.map((term) => term.id),
);
validateGlossaryCollection(
  glossaryTerms,
  sources,
  articles.map(({ metadata }) => metadata.id),
);
validateDiscoveryModel(
  articleGroups,
  guidedJourneys,
  articles.map(({ metadata }) => metadata.id),
);

export function getAllArticles(): readonly ArticleRecord[] {
  return articles;
}

function resolveArticleIds(articleIds: readonly string[]) {
  return articleIds.flatMap((articleId) => {
    const article = getArticleById(articleId);
    return article ? [article] : [];
  });
}

export function getArticlesByGroup(groupId: string) {
  const group = articleGroups.find(({ id }) => id === groupId);
  return group ? resolveArticleIds(group.articleIds) : [];
}

export function getAllArticleGroups() {
  return articleGroups;
}

export function getArticleGroupById(groupId: string) {
  return articleGroups.find(({ id }) => id === groupId);
}

export function getArticleGroupsByArticleIds(articleIds: readonly string[]) {
  const requestedIds = new Set(articleIds);
  return articleGroups.filter((group) => group.articleIds.some((articleId) => requestedIds.has(articleId)));
}

export function getArticlesByJourney(journeyId: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  return journey ? resolveArticleIds(getJourneyArticleIds(journey)) : [];
}

export function getGuidedJourneyById(journeyId: string) {
  return guidedJourneys.find(({ id }) => id === journeyId);
}

export function getAllGuidedJourneys() {
  return guidedJourneys;
}

export function getJourneysByGroup(groupId: string) {
  return guidedJourneys.filter((journey) => journey.groupId === groupId);
}

export function getGuidedJourneysByArticleIds(articleIds: readonly string[]) {
  const requestedIds = new Set(articleIds);
  return guidedJourneys.filter((journey) => getJourneyArticleIds(journey).some((articleId) => requestedIds.has(articleId)));
}

export function getJourneySteps(journeyId: string, routeId?: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  if (!journey) return [];

  return resolveJourneySteps(journey, routeId).flatMap((step) => {
    const article = getArticleById(step.articleId);
    return article ? [{ step, article }] : [];
  });
}

export function getJourneyRoute(journeyId: string, routeId?: string) {
  const journey = guidedJourneys.find(({ id }) => id === journeyId);
  return journey ? getJourneyRouteById(journey, routeId) : undefined;
}

export function getArticleBySlug(slug: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.slug === slug);
}

export function getArticleById(id: string): ArticleRecord | undefined {
  return articles.find((article) => article.metadata.id === id);
}
