import ChoosingAFamilyOrPersonalStatusInJapan, { metadata as choosingAFamilyOrPersonalStatusInJapanMetadata } from "../../../../content/articles/choosing-a-family-or-personal-status-in-japan.mdx";
import SpouseOrChildOfJapaneseNational, { metadata as spouseOrChildOfJapaneseNationalMetadata } from "../../../../content/articles/spouse-or-child-of-japanese-national.mdx";
import SpouseOrChildOfPermanentResident, { metadata as spouseOrChildOfPermanentResidentMetadata } from "../../../../content/articles/spouse-or-child-of-permanent-resident.mdx";
import LongTermResidentStatus, { metadata as longTermResidentStatusMetadata } from "../../../../content/articles/long-term-resident-status.mdx";
import PermanentResidenceInJapan, { metadata as permanentResidenceInJapanMetadata } from "../../../../content/articles/permanent-residence-in-japan.mdx";
import SpecialPermanentResidentsInJapan, { metadata as specialPermanentResidentsInJapanMetadata } from "../../../../content/articles/special-permanent-residents-in-japan.mdx";
import DesignatedActivitiesStatus, { metadata as designatedActivitiesStatusMetadata } from "../../../../content/articles/designated-activities-status.mdx";
import WorkingHolidayInJapan, { metadata as workingHolidayInJapanMetadata } from "../../../../content/articles/working-holiday-in-japan.mdx";
import LongStaySightseeingDesignatedActivities, { metadata as longStaySightseeingDesignatedActivitiesMetadata } from "../../../../content/articles/long-stay-sightseeing-designated-activities.mdx";
import FutureCreationJFind, { metadata as futureCreationJFindMetadata } from "../../../../content/articles/future-creation-j-find.mdx";
import DigitalNomadDesignatedActivities, { metadata as digitalNomadDesignatedActivitiesMetadata } from "../../../../content/articles/digital-nomad-designated-activities.mdx";
import ContinuedJobHuntingAfterStudy, { metadata as continuedJobHuntingAfterStudyMetadata } from "../../../../content/articles/continued-job-hunting-after-study.mdx";
import TemporaryVisitorAndShortStay, { metadata as temporaryVisitorAndShortStayMetadata } from "../../../../content/articles/temporary-visitor-and-short-stay.mdx";
import MedicalStayVisa, { metadata as medicalStayVisaMetadata } from "../../../../content/articles/medical-stay-visa.mdx";
import SideWorkAndFreelancingOnAWorkStatus, { metadata as sideWorkAndFreelancingOnAWorkStatusMetadata } from "../../../../content/articles/side-work-and-freelancing-on-a-work-status.mdx";
import NotifyingImmigrationAboutWorkContractChanges, { metadata as notifyingImmigrationAboutWorkContractChangesMetadata } from "../../../../content/articles/notifying-immigration-about-work-contract-changes.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const familyAndDesignatedActivityArticleRegistrations = [
  [choosingAFamilyOrPersonalStatusInJapanMetadata, ChoosingAFamilyOrPersonalStatusInJapan],
  [spouseOrChildOfJapaneseNationalMetadata, SpouseOrChildOfJapaneseNational],
  [spouseOrChildOfPermanentResidentMetadata, SpouseOrChildOfPermanentResident],
  [longTermResidentStatusMetadata, LongTermResidentStatus],
  [permanentResidenceInJapanMetadata, PermanentResidenceInJapan],
  [specialPermanentResidentsInJapanMetadata, SpecialPermanentResidentsInJapan],
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
] as const satisfies readonly ArticleRegistration[];
