export { supportedGeographies } from "@/data/local-guidance/geographies";
import { addressRegistrationSupplements } from "@/data/local-guidance/address-registration";
import { nationalHealthInsuranceSupplements } from "@/data/local-guidance/national-health-insurance";
import { householdWasteSupplements } from "@/data/local-guidance/household-waste";
import { residentTaxSupplements } from "@/data/local-guidance/resident-tax";
import { disasterPreparationSupplements } from "@/data/local-guidance/disaster-preparation";
import { languageAndConsultationSupplements } from "@/data/local-guidance/language-and-consultation";

// Subject order remains stable; each subject keeps Shinjuku before Nagoya.
export const localGuidanceSupplements = [
  ...addressRegistrationSupplements,
  ...nationalHealthInsuranceSupplements,
  ...householdWasteSupplements,
  ...residentTaxSupplements,
  ...disasterPreparationSupplements,
  ...languageAndConsultationSupplements,
] as const;
