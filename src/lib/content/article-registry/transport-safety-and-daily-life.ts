import DrivingInJapanWithAForeignOrInternationalLicense, { metadata as drivingInJapanWithAForeignOrInternationalLicenseMetadata } from "../../../../content/articles/driving-in-japan-with-a-foreign-or-international-license.mdx";
import ConvertingAForeignDriversLicenseInJapan, { metadata as convertingAForeignDriversLicenseInJapanMetadata } from "../../../../content/articles/converting-a-foreign-drivers-license-in-japan.mdx";
import BuyingRegisteringAndInsuringAVehicleInJapan, { metadata as buyingRegisteringAndInsuringAVehicleInJapanMetadata } from "../../../../content/articles/buying-registering-and-insuring-a-vehicle-in-japan.mdx";
import DrivingRulesAndTrafficAccidentsInJapan, { metadata as drivingRulesAndTrafficAccidentsInJapanMetadata } from "../../../../content/articles/driving-rules-and-traffic-accidents-in-japan.mdx";
import BicycleRulesRegistrationAndAccidentsInJapan, { metadata as bicycleRulesRegistrationAndAccidentsInJapanMetadata } from "../../../../content/articles/bicycle-rules-registration-and-accidents-in-japan.mdx";
import CallingPoliceFireAndAmbulanceServicesInJapan, { metadata as callingPoliceFireAndAmbulanceServicesInJapanMetadata } from "../../../../content/articles/calling-police-fire-and-ambulance-services-in-japan.mdx";
import PreparingForDisastersAndEvacuationInJapan, { metadata as preparingForDisastersAndEvacuationInJapanMetadata } from "../../../../content/articles/preparing-for-disasters-and-evacuation-in-japan.mdx";
import SortingHouseholdWasteAndArrangingDisposal, { metadata as sortingHouseholdWasteAndArrangingDisposalMetadata } from "../../../../content/articles/sorting-household-waste-and-arranging-disposal.mdx";
import ConsumerContractsCancellationsAndGettingHelp, { metadata as consumerContractsCancellationsAndGettingHelpMetadata } from "../../../../content/articles/consumer-contracts-cancellations-and-getting-help.mdx";
import LivingInAJapaneseNeighborhoodAndSharedSpaces, { metadata as livingInAJapaneseNeighborhoodAndSharedSpacesMetadata } from "../../../../content/articles/living-in-a-japanese-neighborhood-and-shared-spaces.mdx";
import FindingJapaneseLanguageAndLocalSupport, { metadata as findingJapaneseLanguageAndLocalSupportMetadata } from "../../../../content/articles/finding-japanese-language-and-local-support.mdx";
import SettingUpElectricityGasWaterAndHomeInternet, { metadata as settingUpElectricityGasWaterAndHomeInternetMetadata } from "../../../../content/articles/setting-up-electricity-gas-water-and-home-internet.mdx";
import UnderstandingJapanGeographyGovernmentAndLanguage, { metadata as understandingJapanGeographyGovernmentAndLanguageMetadata } from "../../../../content/articles/understanding-japan-geography-government-and-language.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const transportSafetyAndDailyLifeArticleRegistrations = [
  [drivingInJapanWithAForeignOrInternationalLicenseMetadata, DrivingInJapanWithAForeignOrInternationalLicense],
  [convertingAForeignDriversLicenseInJapanMetadata, ConvertingAForeignDriversLicenseInJapan],
  [buyingRegisteringAndInsuringAVehicleInJapanMetadata, BuyingRegisteringAndInsuringAVehicleInJapan],
  [drivingRulesAndTrafficAccidentsInJapanMetadata, DrivingRulesAndTrafficAccidentsInJapan],
  [bicycleRulesRegistrationAndAccidentsInJapanMetadata, BicycleRulesRegistrationAndAccidentsInJapan],
  [callingPoliceFireAndAmbulanceServicesInJapanMetadata, CallingPoliceFireAndAmbulanceServicesInJapan],
  [preparingForDisastersAndEvacuationInJapanMetadata, PreparingForDisastersAndEvacuationInJapan],
  [sortingHouseholdWasteAndArrangingDisposalMetadata, SortingHouseholdWasteAndArrangingDisposal],
  [consumerContractsCancellationsAndGettingHelpMetadata, ConsumerContractsCancellationsAndGettingHelp],
  [livingInAJapaneseNeighborhoodAndSharedSpacesMetadata, LivingInAJapaneseNeighborhoodAndSharedSpaces],
  [findingJapaneseLanguageAndLocalSupportMetadata, FindingJapaneseLanguageAndLocalSupport],
  [settingUpElectricityGasWaterAndHomeInternetMetadata, SettingUpElectricityGasWaterAndHomeInternet],
  [understandingJapanGeographyGovernmentAndLanguageMetadata, UnderstandingJapanGeographyGovernmentAndLanguage],
] as const satisfies readonly ArticleRegistration[];
