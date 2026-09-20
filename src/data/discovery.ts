import { articleGroups } from "@/data/discovery/article-groups";
import { studentMovingToJapanJourney, acceptingInternationalStudentsJourney } from "@/data/discovery/journeys/study";
import { professionalWorkerMovingToJapanJourney, acceptingForeignWorkersJourney, sideWorkOrFreelancingWhileEmployedJourney } from "@/data/discovery/journeys/professional-work";
import { founderOrHighlySkilledMovingToJapanJourney, skilledOrSectorWorkerMovingToJapanJourney, workforceDevelopmentInJapanJourney } from "@/data/discovery/journeys/business-and-workforce";
import { joiningFamilyInJapanJourney, preparingForPermanentResidenceJourney } from "@/data/discovery/journeys/family-and-long-term-residence";
import { culturalActivitiesOrTrainingInJapanJourney } from "@/data/discovery/journeys/culture-and-training";
import { workingHolidayInJapanJourney, digitalNomadInJapanJourney, jFindFutureCreationJourney, longStaySightseeingInJapanJourney } from "@/data/discovery/journeys/designated-activities";
import { shortVisitToJapanJourney, medicalVisitToJapanJourney, diplomaticOrOfficialAssignmentJourney } from "@/data/discovery/journeys/short-stay-and-official";
import { ongoingResidentResponsibilitiesJourney, employmentLifecycleInJapanJourney } from "@/data/discovery/journeys/resident-and-employment";

export { articleGroups };

// Named exports preserve the established public journey order even when families are interleaved.
export const guidedJourneys = [
  studentMovingToJapanJourney,
  acceptingInternationalStudentsJourney,
  professionalWorkerMovingToJapanJourney,
  acceptingForeignWorkersJourney,
  founderOrHighlySkilledMovingToJapanJourney,
  skilledOrSectorWorkerMovingToJapanJourney,
  workforceDevelopmentInJapanJourney,
  joiningFamilyInJapanJourney,
  culturalActivitiesOrTrainingInJapanJourney,
  workingHolidayInJapanJourney,
  sideWorkOrFreelancingWhileEmployedJourney,
  ongoingResidentResponsibilitiesJourney,
  digitalNomadInJapanJourney,
  jFindFutureCreationJourney,
  longStaySightseeingInJapanJourney,
  shortVisitToJapanJourney,
  medicalVisitToJapanJourney,
  diplomaticOrOfficialAssignmentJourney,
  preparingForPermanentResidenceJourney,
  employmentLifecycleInJapanJourney,
] as const;
