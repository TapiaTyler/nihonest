import type { AnnotatedDocumentFamily } from "@/domain/document/annotated-document";
import { residenceCardDocumentFamily } from "@/data/annotated-documents/residence-card";
import { certificateOfEligibilityDocumentFamily } from "@/data/annotated-documents/certificate-of-eligibility";
import { salaryIncomeWithholdingTaxSlipDocumentFamily } from "@/data/annotated-documents/salary-income-withholding-tax-slip";
import { residentTaxNoticeDocumentFamily } from "@/data/annotated-documents/resident-tax-notice";
import { myNumberCardAndNoticeDocumentFamily } from "@/data/annotated-documents/my-number-card-and-notice";
import { notificationOfChangeInResidenceDocumentFamily } from "@/data/annotated-documents/notification-of-change-in-residence";

// Family order remains stable for article rendering and editorial review.
export const annotatedDocumentFamilies: readonly AnnotatedDocumentFamily[] = [
  residenceCardDocumentFamily,
  certificateOfEligibilityDocumentFamily,
  salaryIncomeWithholdingTaxSlipDocumentFamily,
  residentTaxNoticeDocumentFamily,
  myNumberCardAndNoticeDocumentFamily,
  notificationOfChangeInResidenceDocumentFamily,
];
