import IncomeAndResidentTaxAfterMovingToJapan, { metadata as incomeAndResidentTaxAfterMovingToJapanMetadata } from "../../../../content/articles/income-and-resident-tax-after-moving-to-japan.mdx";
import FilingAJapaneseIncomeTaxReturn, { metadata as filingAJapaneseIncomeTaxReturnMetadata } from "../../../../content/articles/filing-a-japanese-income-tax-return.mdx";
import TaxResidenceAndTaxableIncomeInJapan, { metadata as taxResidenceAndTaxableIncomeInJapanMetadata } from "../../../../content/articles/tax-residence-and-taxable-income-in-japan.mdx";
import PayrollWithholdingAndYearEndAdjustment, { metadata as payrollWithholdingAndYearEndAdjustmentMetadata } from "../../../../content/articles/payroll-withholding-and-year-end-adjustment.mdx";
import ForeignIncomeTaxTreatiesAndForeignTaxCredits, { metadata as foreignIncomeTaxTreatiesAndForeignTaxCreditsMetadata } from "../../../../content/articles/foreign-income-tax-treaties-and-foreign-tax-credits.mdx";
import TaxForSideWorkAndSoleProprietors, { metadata as taxForSideWorkAndSoleProprietorsMetadata } from "../../../../content/articles/tax-for-side-work-and-sole-proprietors.mdx";
import ConsumptionTaxAndTheInvoiceSystem, { metadata as consumptionTaxAndTheInvoiceSystemMetadata } from "../../../../content/articles/consumption-tax-and-the-invoice-system.mdx";
import TaxProceduresBeforeLeavingJapan, { metadata as taxProceduresBeforeLeavingJapanMetadata } from "../../../../content/articles/tax-procedures-before-leaving-japan.mdx";
import UnderstandingLanguageRequirementsAndCertificationsForJobsInJapan, { metadata as understandingLanguageRequirementsAndCertificationsForJobsInJapanMetadata } from "../../../../content/articles/understanding-language-requirements-and-certifications-for-jobs-in-japan.mdx";
import UnderstandingYourEmploymentContractAndWorkingConditions, { metadata as understandingYourEmploymentContractAndWorkingConditionsMetadata } from "../../../../content/articles/understanding-your-employment-contract-and-working-conditions.mdx";
import WagesWorkingHoursOvertimeAndPaidLeave, { metadata as wagesWorkingHoursOvertimeAndPaidLeaveMetadata } from "../../../../content/articles/wages-working-hours-overtime-and-paid-leave.mdx";
import ResigningDismissalAndFixedTermContractEndings, { metadata as resigningDismissalAndFixedTermContractEndingsMetadata } from "../../../../content/articles/resigning-dismissal-and-fixed-term-contract-endings.mdx";
import EmploymentInsuranceSocialInsuranceAndWorkInjury, { metadata as employmentInsuranceSocialInsuranceAndWorkInjuryMetadata } from "../../../../content/articles/employment-insurance-social-insurance-and-work-injury.mdx";
import WorkplaceHarassmentSafetyAndGettingHelp, { metadata as workplaceHarassmentSafetyAndGettingHelpMetadata } from "../../../../content/articles/workplace-harassment-safety-and-getting-help.mdx";
import SideJobsAndMultipleEmployersInJapan, { metadata as sideJobsAndMultipleEmployersInJapanMetadata } from "../../../../content/articles/side-jobs-and-multiple-employers-in-japan.mdx";
import FreelanceContractsAndClientObligationsInJapan, { metadata as freelanceContractsAndClientObligationsInJapanMetadata } from "../../../../content/articles/freelance-contracts-and-client-obligations-in-japan.mdx";
import RenewingOrChangingYourStatusOfResidence, { metadata as renewingOrChangingYourStatusOfResidenceMetadata } from "../../../../content/articles/renewing-or-changing-your-status-of-residence.mdx";
import ReentryPermissionAndTemporaryTravel, { metadata as reentryPermissionAndTemporaryTravelMetadata } from "../../../../content/articles/reentry-permission-and-temporary-travel.mdx";
import LeavingJapanAndClosingOutProcedures, { metadata as leavingJapanAndClosingOutProceduresMetadata } from "../../../../content/articles/leaving-japan-and-closing-out-procedures.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const taxWorkAndResidentLifecycleArticleRegistrations = [
  [incomeAndResidentTaxAfterMovingToJapanMetadata, IncomeAndResidentTaxAfterMovingToJapan],
  [filingAJapaneseIncomeTaxReturnMetadata, FilingAJapaneseIncomeTaxReturn],
  [taxResidenceAndTaxableIncomeInJapanMetadata, TaxResidenceAndTaxableIncomeInJapan],
  [payrollWithholdingAndYearEndAdjustmentMetadata, PayrollWithholdingAndYearEndAdjustment],
  [foreignIncomeTaxTreatiesAndForeignTaxCreditsMetadata, ForeignIncomeTaxTreatiesAndForeignTaxCredits],
  [taxForSideWorkAndSoleProprietorsMetadata, TaxForSideWorkAndSoleProprietors],
  [consumptionTaxAndTheInvoiceSystemMetadata, ConsumptionTaxAndTheInvoiceSystem],
  [taxProceduresBeforeLeavingJapanMetadata, TaxProceduresBeforeLeavingJapan],
  [understandingLanguageRequirementsAndCertificationsForJobsInJapanMetadata, UnderstandingLanguageRequirementsAndCertificationsForJobsInJapan],
  [understandingYourEmploymentContractAndWorkingConditionsMetadata, UnderstandingYourEmploymentContractAndWorkingConditions],
  [wagesWorkingHoursOvertimeAndPaidLeaveMetadata, WagesWorkingHoursOvertimeAndPaidLeave],
  [resigningDismissalAndFixedTermContractEndingsMetadata, ResigningDismissalAndFixedTermContractEndings],
  [employmentInsuranceSocialInsuranceAndWorkInjuryMetadata, EmploymentInsuranceSocialInsuranceAndWorkInjury],
  [workplaceHarassmentSafetyAndGettingHelpMetadata, WorkplaceHarassmentSafetyAndGettingHelp],
  [sideJobsAndMultipleEmployersInJapanMetadata, SideJobsAndMultipleEmployersInJapan],
  [freelanceContractsAndClientObligationsInJapanMetadata, FreelanceContractsAndClientObligationsInJapan],
  [renewingOrChangingYourStatusOfResidenceMetadata, RenewingOrChangingYourStatusOfResidence],
  [reentryPermissionAndTemporaryTravelMetadata, ReentryPermissionAndTemporaryTravel],
  [leavingJapanAndClosingOutProceduresMetadata, LeavingJapanAndClosingOutProcedures],
] as const satisfies readonly ArticleRegistration[];
