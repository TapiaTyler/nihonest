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
    title: "National Health Insurance in Nagoya", summary: "Nagoya publishes current eligibility, exception, ward-office, and electronic routes.",
    applicability: "The local filing route applies only after national and employment-based coverage rules place you in municipal National Health Insurance.", responsibleBody: "Nagoya City", receivingOffice: "Insurance counter at the ward office for your address, or an eligible electronic route",
    actions: [{ title: "Match the event to Nagoya's procedure", description: "Check whether you are enrolling, withdrawing, or reporting another change, then use the city's current route and document instructions." }],
    sourceIds: ["nagoya-national-health-insurance"], sourceFormatNote: "The controlling city page is in Japanese. This English summary is not an official translation.",
  },
]);
