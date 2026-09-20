import Planning, { metadata as planning } from "../../../../content/articles/planning-your-studies-in-japan.mdx";
import ChoosingASchoolAndUnderstandingAdmissionRequirements, { metadata as choosingASchoolAndUnderstandingAdmissionRequirementsMetadata } from "../../../../content/articles/choosing-a-school-and-understanding-admission-requirements.mdx";
import AcceptingInternationalStudentsAndSupportingCoeApplications, { metadata as acceptingInternationalStudentsAndSupportingCoeApplicationsMetadata } from "../../../../content/articles/accepting-international-students-and-supporting-coe-applications.mdx";
import AcceptingForeignWorkersAndSupportingCoeApplications, { metadata as acceptingForeignWorkersAndSupportingCoeApplicationsMetadata } from "../../../../content/articles/accepting-foreign-workers-and-supporting-coe-applications.mdx";
import ShortTermStudy, { metadata as shortTermStudy } from "../../../../content/articles/short-term-study-in-japan.mdx";
import Visa, { metadata as visa } from "../../../../content/articles/student-visa-and-certificate-of-eligibility.mdx";
import Preparing, { metadata as preparing } from "../../../../content/articles/preparing-to-enter-japan.mdx";
import Documents, { metadata as documents } from "../../../../content/articles/documents-received-when-entering-japan.mdx";
import Address, { metadata as address } from "../../../../content/articles/registering-your-address-after-arrival.mdx";
import MyNumber, { metadata as myNumber } from "../../../../content/articles/understanding-my-number.mdx";
import Insurance, { metadata as insurance } from "../../../../content/articles/joining-national-health-insurance.mdx";
import Pension, { metadata as pension } from "../../../../content/articles/national-pension-after-moving-to-japan.mdx";
import Housing, { metadata as housing } from "../../../../content/articles/finding-housing-and-moving-in.mdx";
import Phone, { metadata as phone } from "../../../../content/articles/getting-a-phone-number-in-japan.mdx";
import Banking, { metadata as banking } from "../../../../content/articles/opening-a-bank-account-after-moving-to-japan.mdx";
import School, { metadata as school } from "../../../../content/articles/completing-school-arrival-procedures.mdx";
import Work, { metadata as work } from "../../../../content/articles/working-part-time-on-student-status.mdx";
import type { ArticleRegistration } from "@/lib/content/article-registry/registration";

export const entryAndArrivalArticleRegistrations = [
  [planning, Planning],
  [choosingASchoolAndUnderstandingAdmissionRequirementsMetadata, ChoosingASchoolAndUnderstandingAdmissionRequirements],
  [acceptingInternationalStudentsAndSupportingCoeApplicationsMetadata, AcceptingInternationalStudentsAndSupportingCoeApplications],
  [acceptingForeignWorkersAndSupportingCoeApplicationsMetadata, AcceptingForeignWorkersAndSupportingCoeApplications],
  [shortTermStudy, ShortTermStudy],
  [visa, Visa],
  [preparing, Preparing],
  [documents, Documents],
  [address, Address],
  [myNumber, MyNumber],
  [insurance, Insurance],
  [pension, Pension],
  [housing, Housing],
  [phone, Phone],
  [banking, Banking],
  [school, School],
  [work, Work],
] as const satisfies readonly ArticleRegistration[];
