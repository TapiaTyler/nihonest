import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const nationalHealthInsuranceSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-national-health-insurance", articleId: "joining-national-health-insurance", geographyId: "shinjuku",
    title: "National Health Insurance in Shinjuku", summary: "Shinjuku receives enrollment and withdrawal notifications from eligible residents and households.",
    applicability: "Confirm first that you are not covered through an employer or another excluded insurance route.", responsibleBody: "Shinjuku City", receivingOffice: "The National Health Insurance counter listed by Shinjuku City",
    actions: [{ title: "Check eligibility and notify the city promptly", description: "Use Shinjuku's current enrollment or withdrawal instructions and bring the records for your triggering event. Household notification responsibility and retroactive coverage can affect the procedure." }],
    sourceIds: ["shinjuku-national-health-insurance"],
  },
  {
    id: "nagoya-national-health-insurance", articleId: "joining-national-health-insurance", geographyId: "nagoya",
    title: "National Health Insurance in Nagoya", summary: "Nagoya publishes eligibility and ward-office routes, with electronic notifications for specified events.",
    applicability: "The local filing route applies only after national and employment-based coverage rules place you in municipal National Health Insurance.", responsibleBody: "Nagoya City", receivingOffice: "Ward insurance and pension section or branch resident welfare section, or an eligible electronic route",
    actions: [{ title: "Match the event to Nagoya's procedure", description: "Check whether you are enrolling, withdrawing, or reporting another change. Electronic notification is available only for the events listed by the city; otherwise follow the current ward-office route and document instructions." }],
    sourceIds: ["nagoya-national-health-insurance", "nagoya-nhi-electronic"], sourceFormatNote: "The controlling city pages are in Japanese. This English summary is not an official translation.",
  },
]);
